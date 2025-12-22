<template>
  <div class="product-management">
    <h2>Product Management</h2>

    <!-- Create / Edit Product Form -->
    <div class="form-section">
      <h3>{{ editingProduct ? 'Edit Product' : 'Create New Product' }}</h3>

      <form @submit.prevent="editingProduct ? updateProduct() : createProduct()">
        <div class="form-grid">
          <div class="form-group">
            <label>Product Name</label>
            <input v-model="productForm.name" type="text" required placeholder="Enter product name" />
          </div>

          <div class="form-group">
            <label>Slug</label>
            <input v-model="productForm.slug" type="text" required placeholder="vd: ao-thun-basic-yame" />
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea v-model="productForm.description" rows="3" placeholder="Enter description"></textarea>
          </div>

          <div class="form-group">
            <label>Base Price (VND)</label>
            <input
              v-model.number="productForm.base_price"
              type="number"
              min="0"
              required
              placeholder="149000"
            />
          </div>

          <div class="form-group">
            <label>Discount Percent (%)</label>
            <input
              v-model.number="productForm.discount_percent"
              type="number"
              min="0"
              max="100"
              placeholder="0"
            />
          </div>

          <div class="form-group">
            <label>Gender</label>
            <select v-model="productForm.gender" class="select">
              <option value="unisex">unisex</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>

          <!-- Category select by name -->
          <div class="form-group">
            <label>Category (by name)</label>
            <select v-model="selectedCategoryName" class="select" @change="onCategorySelect">
              <option value="">-- Select category --</option>
              <option v-for="c in categoriesList" :key="c.id" :value="c.name">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Category ID</label>
            <input v-model="productForm.category_id" type="number" readonly placeholder="Auto fill" />
          </div>

          <!-- Collection select by name -->
          <div class="form-group">
            <label>Collection (by name)</label>
            <select v-model="selectedCollectionName" class="select" @change="onCollectionSelect">
              <option value="">-- Select collection --</option>
              <option v-for="c in collectionsList" :key="c.id" :value="c.name">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Collection ID</label>
            <input v-model="productForm.collection_id" type="number" readonly placeholder="Auto fill" />
          </div>

          <!-- ✅ Status + Update Status button (giữ nguyên field status) -->
          <div class="form-group status-box">
            <label>Status</label>

            <div class="status-row">
              <select v-model="productForm.status" class="select">
                <option value="active">active</option>
                <option value="deactive">deactive</option>
              </select>

              <!-- ✅ chỉ hiện khi đang Edit -->
              <button
                v-if="editingProduct"
                type="button"
                class="btn btn-secondary btn-status"
                :disabled="statusUpdating"
                @click="updateStatusFromForm"
                title="Update status only"
              >
                {{ statusUpdating ? 'Updating...' : 'Update Status' }}
              </button>
            </div>

            <div class="sub" v-if="editingProduct">
              *Nút này chỉ update status qua <b>PUT /api/products/{id}/status</b>, không đụng các field khác.
            </div>
            <div class="sub" v-else>
              *Khi tạo mới, status sẽ được gửi chung trong POST /products.
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingProduct ? 'Update Product' : 'Create Product' }}
          </button>

          <button v-if="editingProduct" type="button" class="btn btn-ghost" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div class="list-section">
      <div class="list-head">
        <h3>Existing Products</h3>
        <button class="btn btn-ghost" @click="fetchProducts" :disabled="loading">Refresh</button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="products.length === 0" class="empty">No products found</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-name">Name</th>
            <th class="col-price">Base Price</th>
            <th class="col-disc">Discount</th>
            <th class="col-gender">Gender</th>
            <th class="col-cat">Category</th>
            <th class="col-col">Collection</th>
            <th class="col-status">Status</th>
            <th class="col-edit">Edit</th>
            <th class="col-del">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="col-id">{{ p.id }}</td>

            <td class="col-name">
              <div class="name-cell">
                <div class="name">{{ p.name }}</div>
                <div class="slug" v-if="p.slug">{{ p.slug }}</div>
              </div>
            </td>

            <td class="col-price">{{ formatMoney(p.base_price) }}</td>
            <td class="col-disc">{{ Number(p.discount_percent || 0) }}%</td>
            <td class="col-gender">{{ p.gender || '—' }}</td>

            <td class="col-cat">{{ p.category_name || '—' }}</td>
            <td class="col-col">{{ p.collection_name || '—' }}</td>

            <td class="col-status">
              <span :class="['status-badge', normalizeStatus(p.status)]">
                {{ normalizeStatus(p.status) }}
              </span>
            </td>

            <td class="col-edit">
              <button class="btn btn-small btn-secondary" @click="editProduct(p)">Edit</button>
            </td>

            <td class="col-del">
              <button class="btn btn-small btn-danger" @click="deleteProduct(p)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="hint">
        Bảng không hiển thị category_id / collection_id. Khi sửa, hệ thống tự lấy ID theo name bằng API by-name.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuthHeaders } from '@/config/api'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const products = ref([])
const loading = ref(false)

const categoriesList = ref([])   // [{id,name}]
const collectionsList = ref([])  // [{id,name}]

const editingProduct = ref(null)

const selectedCategoryName = ref('')
const selectedCollectionName = ref('')

const statusUpdating = ref(false)

const productForm = ref({
  name: '',
  slug: '',
  description: '',
  base_price: 0,
  discount_percent: 0,
  gender: 'unisex',
  status: 'active',
  category_id: '',
  collection_id: '',
})

function normalizeStatus(s) {
  const v = (s || '').toString().toLowerCase().trim()
  // chuẩn của bạn: active / deactive
  if (v === 'inactive' || v === 'inactivate' || v === 'deactivate') return 'deactive'
  return v || 'deactive'
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0)
}

/**
 * ✅ GET /api/all-products
 * Response: {status:"success", data:[...]}
 */
const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/all-products`, {
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Fetch products failed (${res.status})`)

    const raw = Array.isArray(json?.data) ? json.data : []
    products.value = raw.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      base_price: Number(p.base_price ?? 0),
      discount_percent: Number(p.discount_percent ?? 0),
      gender: p.gender,
      status: normalizeStatus(p.status),

      category_id: p.category_id,
      collection_id: p.collection_id,
      category_name: p.category_name,
      collection_name: p.collection_name,
    }))
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to fetch products')
    products.value = []
  } finally {
    loading.value = false
  }
}

/**
 * ✅ GET /api/categories-list -> {status:"success", data:[{id,name}]}
 * ✅ GET /api/collections-list -> {status:"success", data:[{id,name}]}
 */
const fetchLookups = async () => {
  try {
    const [resCat, resCol] = await Promise.all([
      fetch(`${API_BASE}/api/categories-list`, { headers: { ...getAuthHeaders(), Accept: 'application/json' } }),
      fetch(`${API_BASE}/api/collections-list`, { headers: { ...getAuthHeaders(), Accept: 'application/json' } }),
    ])

    const catJson = await resCat.json().catch(() => ({}))
    const colJson = await resCol.json().catch(() => ({}))

    categoriesList.value = Array.isArray(catJson?.data) ? catJson.data : []
    collectionsList.value = Array.isArray(colJson?.data) ? colJson.data : []
  } catch (e) {
    console.error('lookup error:', e)
  }
}

function findIdByNameFallback(type, name) {
  const list = type === 'category' ? categoriesList.value : collectionsList.value
  const found = list.find((x) => (x?.name || '').toString() === (name || '').toString())
  return found?.id ?? null
}

/**
 * ✅ GET by name:
 * - /api/category-by-name?name=...
 * - /api/collection-by-name?name=...
 * Response: {status:"success", data: <id>}
 */
async function getIdByName(type, name) {
  if (!name) return null
  const url =
    type === 'category'
      ? `${API_BASE}/api/category-by-name?name=${encodeURIComponent(name)}`
      : `${API_BASE}/api/collection-by-name?name=${encodeURIComponent(name)}`

  try {
    const res = await fetch(url, { headers: { ...getAuthHeaders(), Accept: 'application/json' } })
    const json = await res.json().catch(() => ({}))
    if (res.ok && json?.status === 'success') return json?.data ?? null
  } catch (e) {
    // ignore
  }

  return findIdByNameFallback(type, name)
}

const onCategorySelect = async () => {
  const id = await getIdByName('category', selectedCategoryName.value)
  productForm.value.category_id = id ?? ''
}

const onCollectionSelect = async () => {
  const id = await getIdByName('collection', selectedCollectionName.value)
  productForm.value.collection_id = id ?? ''
}

/**
 * ✅ POST /api/products
 */
const createProduct = async () => {
  try {
    if (!productForm.value.category_id) throw new Error('Please select Category (to auto fill Category ID)')
    if (!productForm.value.collection_id) throw new Error('Please select Collection (to auto fill Collection ID)')

    const payload = {
      name: productForm.value.name,
      slug: productForm.value.slug,
      description: productForm.value.description,
      base_price: productForm.value.base_price,
      discount_percent: productForm.value.discount_percent,
      gender: productForm.value.gender,
      status: normalizeStatus(productForm.value.status),
      category_id: productForm.value.category_id,
      collection_id: productForm.value.collection_id,
    }

    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Create failed (${res.status})`)

    alert('Product created successfully')
    resetForm()
    fetchProducts()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to create product')
  }
}

/**
 * Edit: fill form + call by-name to get ids
 */
const editProduct = async (p) => {
  editingProduct.value = p

  productForm.value = {
    name: p.name || '',
    slug: p.slug || '',
    description: p.description || '',
    base_price: Number(p.base_price ?? 0),
    discount_percent: Number(p.discount_percent ?? 0),
    gender: p.gender || 'unisex',
    status: normalizeStatus(p.status),
    category_id: '',
    collection_id: '',
  }

  selectedCategoryName.value = p.category_name || ''
  selectedCollectionName.value = p.collection_name || ''

  productForm.value.category_id = (await getIdByName('category', selectedCategoryName.value)) ?? ''
  productForm.value.collection_id = (await getIdByName('collection', selectedCollectionName.value)) ?? ''
}

/**
 * ✅ PUT /api/products/{product_id}
 */
const updateProduct = async () => {
  try {
    if (!editingProduct.value?.id) throw new Error('Missing product id')
    if (!productForm.value.category_id) throw new Error('Category ID is missing')
    if (!productForm.value.collection_id) throw new Error('Collection ID is missing')

    const payload = {
      name: productForm.value.name,
      slug: productForm.value.slug,
      description: productForm.value.description,
      base_price: productForm.value.base_price,
      discount_percent: productForm.value.discount_percent,
      gender: productForm.value.gender,
      status: normalizeStatus(productForm.value.status),
      category_id: productForm.value.category_id,
      collection_id: productForm.value.collection_id,
    }

    const res = await fetch(`${API_BASE}/api/products/${editingProduct.value.id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Update failed (${res.status})`)

    alert('Product updated successfully')
    cancelEdit()
    fetchProducts()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to update product')
  }
}

/**
 * ✅ PUT /api/products/{product_id}/status
 * body: { status: "active" | "deactive" }
 * => bấm nút "Update Status" bên form edit
 */
const updateStatusFromForm = async () => {
  try {
    if (!editingProduct.value?.id) throw new Error('Missing product id')

    const newStatus = normalizeStatus(productForm.value.status)

    statusUpdating.value = true
    const res = await fetch(`${API_BASE}/api/products/${editingProduct.value.id}/status`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Update status failed (${res.status})`)

    // sync lại list nếu cần
    alert('Status updated successfully')
    fetchProducts()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to update status')
  } finally {
    statusUpdating.value = false
  }
}

const deleteProduct = async (p) => {
  const ok = confirm(`Delete product "${p.name}"?`)
  if (!ok) return

  try {
    const res = await fetch(`${API_BASE}/api/products/${p.id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders(), Accept: 'application/json' },
    })

    if (res.status === 204) {
      alert('Product deleted successfully')
      fetchProducts()
      return
    }

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Delete failed (${res.status})`)

    alert('Product deleted successfully')
    fetchProducts()
  } catch (e) {
    console.error(e)
    alert(e.message || 'Failed to delete product')
  }
}

const cancelEdit = () => {
  editingProduct.value = null
  resetForm()
}

function resetForm() {
  productForm.value = {
    name: '',
    slug: '',
    description: '',
    base_price: 0,
    discount_percent: 0,
    gender: 'unisex',
    status: 'active',
    category_id: '',
    collection_id: '',
  }
  selectedCategoryName.value = ''
  selectedCollectionName.value = ''
}

onMounted(async () => {
  await fetchLookups()
  await fetchProducts()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-management {
  padding: 20px;
}

/* ===== Form ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-weight: 900;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.select {
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

.sub {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}

/* actions */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* ✅ status row (dropdown + button) */
.status-box {
  grid-column: 1 / -1;
}
.status-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.btn-status {
  height: 42px;
  padding: 0 14px;
  white-space: nowrap;
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

/* widths */
.col-id { width: 70px; }
.col-price { width: 140px; }
.col-disc { width: 110px; }
.col-gender { width: 110px; }
.col-cat { width: 160px; }
.col-col { width: 170px; }
.col-status { width: 110px; }
.col-edit, .col-del { width: 110px; text-align: center; }
.col-name { width: 260px; }

.name-cell .name { font-weight: 900; }
.name-cell .slug { font-size: 12px; opacity: 0.65; margin-top: 2px; }

/* Buttons */
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 900;
}

.btn-small { padding: 8px 12px; }

.btn-primary {
  background: #ff6a00;
  color: #fff;
  box-shadow: 0 6px 18px rgba(255, 106, 0, 0.25);
}

.btn-secondary { background: #111827; color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  text-transform: lowercase;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.15);
  color: #16a34a;
}

.status-badge.deactive {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.hint {
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.75;
}

/* responsive */
@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; }
  .status-row { grid-template-columns: 1fr; }
  .btn-status { width: 100%; }
}
</style>
