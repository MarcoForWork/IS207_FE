<template>
  <div class="product-image-management">
    <h2>Product Image Management</h2>

    <!-- Add Image Form -->
    <div class="form-section">
      <h3>Add Product Image</h3>

      <form @submit.prevent="createProductImage">
        <div class="form-grid">
          <!-- Select product by name -->
          <div class="form-group">
            <label>Product (by name)</label>
            <select v-model="selectedProductName" class="select" @change="onProductSelect">
              <option value="">-- Select product --</option>
              <option v-for="p in productsList" :key="p.id" :value="p.name">
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Product ID</label>
            <input v-model="imageForm.product_id" type="number" readonly placeholder="Auto fill" />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="imageForm.role" class="select">
              <option value="main">main</option>
              <!-- ✅ đúng theo backend bạn nói: secodary -->
              <option value="secondary">secondary</option>
            </select>
          </div>

          <div class="form-group">
            <label>Image (file)</label>
            <input class="file-input" type="file" accept="image/*" @change="onFileChange" />
            <div class="sub" v-if="imageForm.image_file">
              Selected: <b>{{ imageForm.image_file.name }}</b>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Uploading...' : 'Add Image' }}
          </button>

          <button type="button" class="btn btn-ghost" @click="resetForm" :disabled="submitting">
            Clear
          </button>
        </div>
      </form>
    </div>

    <!-- Existing Images -->
    <div class="list-section">
      <div class="list-head">
        <h3>Existing Product Images</h3>
        <button class="btn btn-ghost" @click="fetchImages" :disabled="loading">Refresh</button>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <div class="filter-item">
          <label class="filter-label">Filter by product</label>
          <select v-model="selectedFilterProductId" class="select">
            <option value="">All</option>
            <option v-for="p in productsList" :key="p.id" :value="String(p.id)">
              {{ p.name }}
            </option>
          </select>
        </div>

        <button
          v-if="selectedFilterProductId"
          class="btn btn-secondary"
          @click="selectedFilterProductId = ''"
        >
          Clear
        </button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="filteredImages.length === 0" class="empty">No images found</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-product">Product</th>
            <th class="col-role">Role</th>
            <th class="col-path">Path</th>
            <th class="col-open">Open</th>
            <th class="col-del">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="img in filteredImages" :key="img.id">
            <td class="col-id">{{ img.id }}</td>

            <td class="col-product">
              <div class="name-cell">
                <div class="name">{{ img.product_name || '—' }}</div>
                <div class="slug">#{{ img.product_id }}</div>
              </div>
            </td>

            <td class="col-role">
              <span :class="['role-badge', normalizeRole(img.role)]">
                {{ normalizeRole(img.role) }}
              </span>
            </td>

            <td class="col-path">
              <div class="path" :title="img.image_url">
                {{ img.image_url || '—' }}
              </div>
            </td>

            <td class="col-open">
              <a
                v-if="img.image_url"
                class="btn btn-small btn-secondary"
                :href="img.image_url"
                target="_blank"
                rel="noopener"
              >
                Open
              </a>
              <span v-else>—</span>
            </td>

            <td class="col-del">
              <button class="btn btn-small btn-danger" @click="deleteImage(img)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="hint">
        Lưu ý: role backend của bạn đang dùng <b>main / secodary</b> (đúng y chang). Nếu backend đổi sang
        <b>secondary</b> thì update lại dropdown.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuthHeaders } from '@/config/api'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const loading = ref(false)
const submitting = ref(false)

const productsList = ref([]) // [{id,name}]
const images = ref([]) // normalized images

// Form state
const selectedProductName = ref('')
const imageForm = ref({
  product_id: '',
  role: 'main', // main | secodary
  image_file: null, // File
})

// Filter state
const selectedFilterProductId = ref('')

const filteredImages = computed(() => {
  if (!selectedFilterProductId.value) return images.value
  return images.value.filter((x) => String(x.product_id) === String(selectedFilterProductId.value))
})

function normalizeRole(role) {
  const v = (role || '').toString().toLowerCase().trim()
  // backend bạn: main / secodary
  if (v === 'secondary') return 'secondary' // phòng hờ nếu API có lúc trả đúng chính tả
  return v || 'secondary'
}

/**
 * ✅ GET /api/products-names-ids
 * response: { status:"success", data:[{id,name},...] }
 */
async function fetchProductsList() {
  try {
    const res = await fetch(`${API_BASE}/api/products-names-ids`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Fetch products list failed (${res.status})`)
    productsList.value = Array.isArray(json?.data) ? json.data : []
  } catch (e) {
    console.error(e)
    productsList.value = []
  }
}

/**
 * ✅ GET /api/product-images
 * route: Route::get('/product-images', ... getAllProductsImages)
 * response có thể là:
 *  - {id, image, product_id, role, product_name}
 *  - hoặc {id, image_url, product_id, role, product_name}
 */
async function fetchImages() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/product-images`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Fetch product images failed (${res.status})`)

    const raw = Array.isArray(json?.data) ? json.data : []
    images.value = raw.map((x) => ({
      id: x.id,
      product_id: x.product_id,
      product_name: x.product_name || x.product?.name || x.name || '',
      role: normalizeRole(x.role),
      image_url: x.image_url || x.image || '',
    }))
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to fetch product images')
    images.value = []
  } finally {
    loading.value = false
  }
}

function onProductSelect() {
  const found = productsList.value.find((p) => String(p.name) === String(selectedProductName.value))
  imageForm.value.product_id = found?.id ?? ''
}

function onFileChange(e) {
  const file = e.target.files?.[0] || null
  imageForm.value.image_file = file
}

/**
 * ✅ POST /api/product-images (multipart/form-data)
 * - product_id
 * - image (file)
 * - role (main | secodary)
 */
async function createProductImage() {
  try {
    if (!imageForm.value.product_id) throw new Error('The product id field is required.')
    if (!imageForm.value.image_file) throw new Error('Please choose an image file.')
    if (!imageForm.value.role) throw new Error('Role is required.')

    submitting.value = true

    const fd = new FormData()
    fd.append('product_id', String(imageForm.value.product_id))
    fd.append('role', String(imageForm.value.role))
    fd.append('image', imageForm.value.image_file)

    // IMPORTANT: đừng set Content-Type khi dùng FormData
    const headers = { ...getAuthHeaders(), Accept: 'application/json' }
    if (headers['Content-Type']) delete headers['Content-Type']
    if (headers['content-type']) delete headers['content-type']

    const res = await fetch(`${API_BASE}/api/product-images`, {
      method: 'POST',
      headers,
      body: fd,
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Add image failed (${res.status})`)

    alert('Product image added successfully')
    resetForm()
    await fetchImages()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to add product image')
  } finally {
    submitting.value = false
  }
}

/**
 * ✅ DELETE /api/product-images/{image_id}
 */
async function deleteImage(img) {
  const ok = confirm(`Delete image #${img.id} of product "${img.product_name || img.product_id}"?`)
  if (!ok) return

  try {
    const res = await fetch(`${API_BASE}/api/product-images/${img.id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    })

    if (res.status === 204) {
      alert('Deleted successfully')
      await fetchImages()
      return
    }

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Delete failed (${res.status})`)

    alert('Deleted successfully')
    await fetchImages()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to delete product image')
  }
}

function resetForm() {
  selectedProductName.value = ''
  imageForm.value = {
    product_id: '',
    role: 'main',
    image_file: null,
  }
  // reset input file UI (optional trick)
  const inputs = document.querySelectorAll('.file-input')
  inputs.forEach((i) => (i.value = ''))
}

onMounted(async () => {
  await fetchProductsList()
  await fetchImages()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-image-management {
  padding: 20px;
}

/* ===== Form ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group label {
  display: block;
  font-weight: 900;
  margin-bottom: 6px;
}

.select,
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  background: #fff;
}

.form-group input[readonly] {
  background: rgba(0, 0, 0, 0.04);
  cursor: not-allowed;
}

.file-input {
  width: 100%;
}

.sub {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* ===== List Head ===== */
.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

/* ===== Filter ===== */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  justify-content: space-between;
  margin: 12px 0 10px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 280px;
}

.filter-label {
  font-size: 13px;
  opacity: 0.8;
}

/* ===== Table thẳng hàng ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  vertical-align: middle;
}

.data-table th {
  text-align: left;
  font-weight: 900;
  white-space: nowrap;
}

.col-id {
  width: 70px;
}
.col-product {
  width: 240px;
}
.col-role {
  width: 120px;
}
.col-open {
  width: 110px;
  text-align: center;
}
.col-del {
  width: 120px;
  text-align: center;
}
.col-path {
  width: auto;
}

.name-cell .name {
  font-weight: 900;
}
.name-cell .slug {
  font-size: 12px;
  opacity: 0.65;
  margin-top: 2px;
}

.path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
}

/* ===== Buttons ===== */
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 900;
}

.btn-small {
  padding: 8px 12px;
  border-radius: 10px;
}

.btn-primary {
  background: #ff6a00;
  color: #fff;
  box-shadow: 0 6px 18px rgba(255, 106, 0, 0.25);
}

.btn-secondary {
  background: #111827;
  color: #fff;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* ===== Role badge ===== */
.role-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  text-transform: lowercase;
}

.role-badge.main {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
}

/* secodary */
.role-badge.secondary {
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.hint {
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.75;
}

/* responsive */
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-item {
    min-width: 0;
  }
}
</style>
