<template>
  <div class="category-management">
    <h2>Category Management</h2>

    <!-- Create / Edit Category Form -->
    <div class="form-section">
      <h3>{{ editingCategory ? 'Edit Category' : 'Create New Category' }}</h3>

      <form @submit.prevent="editingCategory ? updateCategory() : createCategory()">
        <div class="form-grid">
          <div class="form-group">
            <label>Category Name</label>
            <input v-model="categoryForm.name" type="text" required placeholder="Enter category name" />
          </div>

          <div class="form-group">
            <label>Slug</label>
            <input v-model="categoryForm.slug" type="text" required placeholder="vd: ao-thun" />
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea v-model="categoryForm.description" rows="3" placeholder="Enter description" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingCategory ? 'Update Category' : 'Create Category' }}
          </button>

          <button v-if="editingCategory" type="button" class="btn btn-ghost" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Categories List -->
    <div class="list-section">
      <div class="list-head">
        <h3>Existing Categories</h3>
        <button class="btn btn-ghost" @click="fetchCategories" :disabled="loading">
          Refresh
        </button>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="categories.length === 0" class="empty">No categories found</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-name">Name</th>
            <th class="col-desc">Description</th>
            <th class="col-status">Status</th>
            <th class="col-update">Update Status</th>
            <th class="col-edit">Edit</th>
            <th class="col-del">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td class="col-id">{{ category.id }}</td>

            <td class="col-name">
              <div class="name-cell">
                <div class="name">{{ category.name }}</div>
                <div class="slug" v-if="category.slug">{{ category.slug }}</div>
              </div>
            </td>

            <td class="col-desc">
              <div class="desc">{{ category.description || '—' }}</div>
            </td>

            <td class="col-status">
              <span :class="['status-badge', normalizeStatus(category.status)]">
                {{ normalizeStatus(category.status) }}
              </span>
            </td>

            <!-- ✅ PUT /api/categories/{id}/status body {status:"active"|"deactive"} -->
            <td class="col-update">
              <select
                class="status-select"
                :value="normalizeStatus(category.status)"
                @change="updateCategoryStatus(category, $event)"
              >
                <option value="active">active</option>
                <option value="deactive">deactive</option>
              </select>
            </td>

            <td class="col-edit">
              <button class="btn btn-small btn-secondary" @click="editCategory(category)">
                Edit
              </button>
            </td>

            <td class="col-del">
              <button class="btn btn-small btn-danger" @click="deleteCategory(category)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="hint">
        Create/Update chỉ gửi 3 field: <b>name</b>, <b>description</b>, <b>slug</b>. Status update dùng API riêng.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuthHeaders } from '@/config/api'

const categories = ref([])
const loading = ref(false)

const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  description: '',
  slug: '',
})

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

function normalizeStatus(s) {
  const v = (s || '').toString().toLowerCase().trim()
  if (v === 'inactive') return 'deactive'
  return v || 'deactive'
}

/**
 * ✅ GET /api/categories
 * Backend trả: { status: "success", data: [...] }
 */
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/categories`, {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Fetch categories failed (${response.status})`)

    const raw = Array.isArray(json?.data) ? json.data : []

    categories.value = raw.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      status: normalizeStatus(c.status),
      created_at: c.created_at,
      updated_at: c.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    alert(error.message || 'Failed to fetch categories')
    categories.value = []
  } finally {
    loading.value = false
  }
}

/**
 * ✅ POST /api/categories
 * Route::post('/categories', ... postCategory)
 * Body: { name, description, slug }
 */
const createCategory = async () => {
  try {
    const payload = {
      name: categoryForm.value.name,
      description: categoryForm.value.description,
      slug: categoryForm.value.slug,
    }

    const response = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Create failed (${response.status})`)

    alert('Category created successfully')
    categoryForm.value = { name: '', description: '', slug: '' }
    fetchCategories()
  } catch (error) {
    console.error('Error creating category:', error)
    alert(error.message || 'Error creating category')
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name || '',
    description: category.description || '',
    slug: category.slug || '',
  }
}

/**
 * ✅ PUT /api/categories/{category_id}
 * Route::put('/categories/{category_id}', ... updateCategory)
 * Body: { name, description, slug }
 */
const updateCategory = async () => {
  try {
    if (!editingCategory.value?.id) throw new Error('Missing category id')

    const payload = {
      name: categoryForm.value.name,
      description: categoryForm.value.description,
      slug: categoryForm.value.slug,
    }

    const response = await fetch(`${API_BASE}/api/categories/${editingCategory.value.id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Update failed (${response.status})`)

    alert('Category updated successfully')
    cancelEdit()
    fetchCategories()
  } catch (error) {
    console.error('Error updating category:', error)
    alert(error.message || 'Error updating category')
  }
}

const cancelEdit = () => {
  editingCategory.value = null
  categoryForm.value = { name: '', description: '', slug: '' }
}

/**
 * ✅ PUT /api/categories/{category_id}/status
 * body: { status: "active" | "deactive" }
 */
const updateCategoryStatus = async (category, event) => {
  const newStatus = event.target.value
  const prev = category.status

  category.status = newStatus

  try {
    const response = await fetch(`${API_BASE}/api/categories/${category.id}/status`, {
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
    if (updated?.status) category.status = normalizeStatus(updated.status)
  } catch (error) {
    console.error('Error updating status:', error)
    category.status = prev
    event.target.value = prev
    alert(error.message || 'Failed to update status')
  }
}

/**
 * ✅ DELETE /api/categories/{id}
 */
const deleteCategory = async (category) => {
  const ok = confirm(`Delete category "${category.name}"?`)
  if (!ok) return

  try {
    const response = await fetch(`${API_BASE}/api/categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    const json = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(json?.message || `Delete failed (${response.status})`)

    alert('Category deleted successfully')
    fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert(error.message || 'Failed to delete category')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.category-management {
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
  font-weight: 700;
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
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

/* ===== Table Layout ===== */
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
.col-id { width: 70px; }
.col-status { width: 110px; }
.col-update { width: 170px; text-align: center; }
.col-edit, .col-del { width: 110px; text-align: center; }
.col-name { width: 220px; }
.col-desc .desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name-cell .name { font-weight: 800; }
.name-cell .slug { font-size: 12px; opacity: 0.65; margin-top: 2px; }

/* Select */
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
  font-weight: 800;
}
.btn-small { padding: 8px 12px; }
.btn-primary { background: #ff6a00; color: #fff; }
.btn-secondary { background: #111827; color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-ghost { background: transparent; border: 1px solid rgba(0, 0, 0, 0.12); }

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
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

@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
