<template>
  <div class="category-management">
    <h2>Category Management</h2>

    <!-- Create Category Form -->
    <div class="form-section">
      <h3>{{ editingCategory ? 'Edit Category' : 'Create New Category' }}</h3>
      <form @submit.prevent="editingCategory ? updateCategory() : createCategory()">
        <div class="form-group">
          <label>Category Name</label>
          <input
            v-model="categoryForm.name"
            type="text"
            required
            placeholder="Enter category name"
          />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="categoryForm.description" placeholder="Enter description"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingCategory ? 'Update Category' : 'Create Category' }}
          </button>
          <button v-if="editingCategory" type="button" class="btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Categories List -->
    <div class="list-section">
      <h3>Existing Categories</h3>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="categories.length === 0" class="empty">No categories found</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td>
              <span :class="['status-badge', category.status]">
                {{ category.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editCategory(category)" class="btn-edit">Edit</button>
              <button @click="toggleStatus(category)" class="btn-toggle">
                {{ category.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const categories = ref([])
const loading = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  description: '',
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.CATEGORIES.LIST), {
      headers: getAuthHeaders(),
    })
    if (response.ok) {
      categories.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    alert('Failed to fetch categories')
  } finally {
    loading.value = false
  }
}

const createCategory = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryForm.value),
    })

    if (response.ok) {
      alert('Category created successfully')
      categoryForm.value = { name: '', description: '' }
      fetchCategories()
    } else {
      alert('Failed to create category')
    }
  } catch (error) {
    console.error('Error creating category:', error)
    alert('Error creating category')
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description,
  }
}

const updateCategory = async () => {
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(editingCategory.value.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryForm.value),
      },
    )

    if (response.ok) {
      alert('Category updated successfully')
      cancelEdit()
      fetchCategories()
    } else {
      alert('Failed to update category')
    }
  } catch (error) {
    console.error('Error updating category:', error)
    alert('Error updating category')
  }
}

const cancelEdit = () => {
  editingCategory.value = null
  categoryForm.value = { name: '', description: '' }
}

const toggleStatus = async (category) => {
  const newStatus = category.status === 'active' ? 'inactive' : 'active'
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE_STATUS(category.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      },
    )

    if (response.ok) {
      alert(`Category ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      fetchCategories()
    } else {
      alert('Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error updating status')
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
</style>
