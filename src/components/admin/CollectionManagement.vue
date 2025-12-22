<template>
  <div class="collection-management">
    <h2>Collection Management</h2>

    <!-- Create / Edit Collection Form -->
    <div class="form-section">
      <h3>{{ editingCollection ? 'Edit Collection' : 'Create New Collection' }}</h3>

      <form @submit.prevent="editingCollection ? updateCollection() : createCollection()">
        <div class="form-grid">
          <div class="form-group">
            <label>Collection Name</label>
            <input v-model="collectionForm.name" type="text" required placeholder="Enter collection name" />
          </div>

          <div class="form-group">
            <label>Slug</label>
            <input v-model="collectionForm.slug" type="text" required placeholder="vd: streetwear-2025" />
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea v-model="collectionForm.description" rows="3" placeholder="Enter description"></textarea>
          </div>

          <div class="form-group">
            <label>Banner Image (Upload)</label>
            <input ref="fileInput" type="file" accept="image/*" @change="onPickBanner" />
            <div class="sub">Optional. Nếu không chọn, sẽ giữ banner cũ (khi edit).</div>
          </div>

          <div class="form-group">
            <label>Current Banner</label>
            <div class="banner-preview">
              <img
                v-if="bannerPreview || collectionForm.banner"
                class="preview-img"
                :src="bannerPreview || resolveImageUrl(collectionForm.banner)"
                alt="banner"
              />
              <div v-else class="preview-empty">No banner</div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingCollection ? 'Update Collection' : 'Create Collection' }}
          </button>

          <button v-if="editingCollection" type="button" class="btn btn-ghost" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Collections List -->
    <div class="list-section">
      <div class="list-head">
        <h3>Existing Collections</h3>
        <button class="btn btn-ghost" @click="fetchCollections" :disabled="loading">
          Refresh
        </button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="collections.length === 0" class="empty">No collections found</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-banner">Banner</th>
            <th class="col-name">Name</th>
            <th class="col-desc">Description</th>
            <th class="col-status">Status</th>
            <th class="col-update">Update Status</th>
            <th class="col-edit">Edit</th>
            <th class="col-del">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in collections" :key="c.id">
            <td class="col-id">{{ c.id }}</td>

            <td class="col-banner">
              <img v-if="c.banner" class="thumb" :src="resolveImageUrl(c.banner)" alt="banner" />
              <div v-else class="thumb thumb-empty">—</div>
            </td>

            <td class="col-name">
              <div class="name-cell">
                <div class="name">{{ c.name }}</div>
                <div class="slug" v-if="c.slug">{{ c.slug }}</div>
              </div>
            </td>

            <td class="col-desc">
              <div class="desc">{{ c.description || '—' }}</div>
            </td>

            <td class="col-status">
              <span :class="['status-badge', normalizeStatus(c.status)]">
                {{ normalizeStatus(c.status) }}
              </span>
            </td>

            <!-- ✅ PUT /api/collections/{id}/status {status:"active"|"deactive"} -->
            <td class="col-update">
              <select class="status-select" :value="normalizeStatus(c.status)" @change="updateCollectionStatus(c, $event)">
                <option value="active">active</option>
                <option value="deactive">deactive</option>
              </select>
            </td>

            <td class="col-edit">
              <button class="btn btn-small btn-secondary" @click="editCollection(c)">Edit</button>
            </td>

            <td class="col-del">
              <button class="btn btn-small btn-danger" @click="deleteCollection(c)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="hint">
        Create/Update dùng FormData: <b>name</b>, <b>slug</b>, <b>description</b> (optional), <b>banner_image</b> (optional).
        Status update dùng API riêng: <b>active/deactive</b>.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuthHeaders } from '@/config/api'

const collections = ref([])
const loading = ref(false)

const editingCollection = ref(null)
const fileInput = ref(null)

const bannerFile = ref(null)
const bannerPreview = ref('')

const collectionForm = ref({
  name: '',
  slug: '',
  description: '',
  banner: '', // banner hiện tại từ backend (path)
})

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

function normalizeStatus(s) {
  const v = (s || '').toString().toLowerCase().trim()
  if (v === 'inactive') return 'deactive'
  return v || 'deactive'
}

function resolveImageUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${API_BASE}${p}`
}

function onPickBanner(e) {
  const file = e.target.files?.[0]
  bannerFile.value = file || null
  if (file) bannerPreview.value = URL.createObjectURL(file)
  else bannerPreview.value = ''
}

function resetBannerInputs() {
  bannerFile.value = null
  bannerPreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function authHeadersNoContentType() {
  // FormData: không set Content-Type
  const h = { ...getAuthHeaders(), Accept: 'application/json' }
  delete h['Content-Type']
  delete h['content-type']
  return h
}

/**
 * ✅ GET /api/collections
 * Response: { status:"success", data:[{id,name,slug,description,banner,status,...}] }
 */
const fetchCollections = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/collections`, {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Fetch collections failed (${response.status})`)

    const raw = Array.isArray(json?.data) ? json.data : []

    collections.value = raw.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      banner: c.banner, // đúng theo ảnh response
      status: normalizeStatus(c.status),
      created_at: c.created_at,
      updated_at: c.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching collections:', error)
    alert(error.message || 'Failed to fetch collections')
    collections.value = []
  } finally {
    loading.value = false
  }
}

/**
 * ✅ POST /api/collections (postCollection)
 * fields: name, slug, description?, banner_image?
 */
const createCollection = async () => {
  try {
    const fd = new FormData()
    fd.append('name', collectionForm.value.name)
    fd.append('slug', collectionForm.value.slug)
    fd.append('description', collectionForm.value.description || '')

    if (bannerFile.value) fd.append('image', bannerFile.value) // ✅ đúng field validate

    const response = await fetch(`${API_BASE}/api/collections`, {
      method: 'POST',
      headers: authHeadersNoContentType(),
      body: fd,
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Create failed (${response.status})`)

    alert('Collection created successfully')
    collectionForm.value = { name: '', slug: '', description: '', banner: '' }
    resetBannerInputs()
    fetchCollections()
  } catch (error) {
    console.error('Error creating collection:', error)
    alert(error.message || 'Error creating collection')
  }
}

const editCollection = (c) => {
  editingCollection.value = c
  collectionForm.value = {
    name: c.name || '',
    slug: c.slug || '',
    description: c.description || '',
    banner: c.banner || '',
  }
  resetBannerInputs()
}

/**
 * ✅ PUT /api/collections/{id} (updateCollection)
 * fields: name, slug, description?, banner_image?
 * NOTE: để chắc ăn với Laravel + FormData, dùng POST + _method=PUT
 */
const updateCollection = async () => {
  try {
    if (!editingCollection.value?.id) throw new Error('Missing collection id')

    const fd = new FormData()
    fd.append('_method', 'PUT') // ✅ safe for Laravel
    fd.append('name', collectionForm.value.name)
    fd.append('slug', collectionForm.value.slug)
    fd.append('description', collectionForm.value.description || '')

    if (bannerFile.value) fd.append('banner_image', bannerFile.value)

    const response = await fetch(`${API_BASE}/api/collections/${editingCollection.value.id}`, {
      method: 'POST', // ✅ method spoofing
      headers: authHeadersNoContentType(),
      body: fd,
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Update failed (${response.status})`)

    alert('Collection updated successfully')
    cancelEdit()
    fetchCollections()
  } catch (error) {
    console.error('Error updating collection:', error)
    alert(error.message || 'Error updating collection')
  }
}

const cancelEdit = () => {
  editingCollection.value = null
  collectionForm.value = { name: '', slug: '', description: '', banner: '' }
  resetBannerInputs()
}

/**
 * ✅ PUT /api/collections/{id}/status
 * body: { status:"active"|"deactive" }
 */
const updateCollectionStatus = async (c, event) => {
  const newStatus = event.target.value
  const prev = c.status

  c.status = newStatus

  try {
    const response = await fetch(`${API_BASE}/api/collections/${c.id}/status`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Update status failed (${response.status})`)

    const updated = json?.data
    if (updated?.status) c.status = normalizeStatus(updated.status)
  } catch (error) {
    console.error('Error updating status:', error)
    c.status = prev
    event.target.value = prev
    alert(error.message || 'Failed to update status')
  }
}

/**
 * ✅ DELETE /api/collections/{id}
 */
const deleteCollection = async (c) => {
  const ok = confirm(`Delete collection "${c.name}"?`)
  if (!ok) return

  try {
    const response = await fetch(`${API_BASE}/api/collections/${c.id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    // backend có thể trả 204 hoặc json
    if (response.status === 204) {
      alert('Collection deleted successfully')
      fetchCollections()
      return
    }

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Delete failed (${response.status})`)

    alert('Collection deleted successfully')
    fetchCollections()
  } catch (error) {
    console.error('Error deleting collection:', error)
    alert(error.message || 'Failed to delete collection')
  }
}

onMounted(() => {
  fetchCollections()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.collection-management {
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
  font-weight: 800;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
}

.sub {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.7;
}

.banner-preview {
  display: flex;
  align-items: center;
  min-height: 64px;
}

.preview-img {
  width: 120px;
  height: 64px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.preview-empty {
  width: 120px;
  height: 64px;
  border-radius: 12px;
  border: 1px dashed rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

/* actions */
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
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
  font-weight: 800;
  white-space: nowrap;
}

/* widths */
.col-id { width: 70px; }
.col-banner { width: 100px; }
.col-status { width: 110px; }
.col-update { width: 170px; text-align: center; }
.col-edit, .col-del { width: 110px; text-align: center; }
.col-name { width: 240px; }

.col-desc .desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* thumb */
.thumb {
  width: 72px;
  height: 42px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.thumb-empty {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(0, 0, 0, 0.22);
  opacity: 0.7;
  width: 72px;
  height: 42px;
  border-radius: 10px;
}

/* Name cell */
.name-cell .name { font-weight: 900; }
.name-cell .slug { font-size: 12px; opacity: 0.65; margin-top: 2px; }

/* Status select */
.status-select {
  width: 140px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
}

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
}
</style>
