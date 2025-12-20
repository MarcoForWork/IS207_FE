<template>
  <div class="collection-management">
    <h2>Collection Management</h2>

    <!-- Create Collection Form -->
    <div class="form-section">
      <h3>{{ editingCollection ? 'Edit Collection' : 'Create New Collection' }}</h3>
      <form @submit.prevent="editingCollection ? updateCollection() : createCollection()">
        <div class="form-group">
          <label>Collection Name</label>
          <input
            v-model="collectionForm.name"
            type="text"
            required
            placeholder="Enter collection name"
          />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="collectionForm.description" placeholder="Enter description"></textarea>
        </div>
        <div class="form-group">
          <label>Category ID</label>
          <input
            v-model="collectionForm.category_id"
            type="number"
            required
            placeholder="Enter category ID"
          />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingCollection ? 'Update Collection' : 'Create Collection' }}
          </button>
          <button v-if="editingCollection" type="button" class="btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Collections List -->
    <div class="list-section">
      <h3>Existing Collections</h3>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="collections.length === 0" class="empty">No collections found</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="collection in collections" :key="collection.id">
            <td>{{ collection.id }}</td>
            <td>{{ collection.name }}</td>
            <td>{{ collection.description }}</td>
            <td>{{ collection.category_id }}</td>
            <td>
              <span :class="['status-badge', collection.status]">
                {{ collection.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editCollection(collection)" class="btn-edit">Edit</button>
              <button @click="toggleStatus(collection)" class="btn-toggle">
                {{ collection.status === 'active' ? 'Deactivate' : 'Activate' }}
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

const collections = ref([])
const loading = ref(false)
const editingCollection = ref(null)
const collectionForm = ref({
  name: '',
  description: '',
  category_id: '',
})

const fetchCollections = async () => {
  loading.value = true
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.COLLECTIONS.LIST), {
      headers: getAuthHeaders(),
    })
    if (response.ok) {
      collections.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching collections:', error)
    alert('Failed to fetch collections')
  } finally {
    loading.value = false
  }
}

const createCollection = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.COLLECTIONS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(collectionForm.value),
    })

    if (response.ok) {
      alert('Collection created successfully')
      collectionForm.value = { name: '', description: '', category_id: '' }
      fetchCollections()
    } else {
      alert('Failed to create collection')
    }
  } catch (error) {
    console.error('Error creating collection:', error)
    alert('Error creating collection')
  }
}

const editCollection = (collection) => {
  editingCollection.value = collection
  collectionForm.value = {
    name: collection.name,
    description: collection.description,
    category_id: collection.category_id,
  }
}

const updateCollection = async () => {
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.COLLECTIONS.UPDATE(editingCollection.value.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(collectionForm.value),
      },
    )

    if (response.ok) {
      alert('Collection updated successfully')
      cancelEdit()
      fetchCollections()
    } else {
      alert('Failed to update collection')
    }
  } catch (error) {
    console.error('Error updating collection:', error)
    alert('Error updating collection')
  }
}

const cancelEdit = () => {
  editingCollection.value = null
  collectionForm.value = { name: '', description: '', category_id: '' }
}

const toggleStatus = async (collection) => {
  const newStatus = collection.status === 'active' ? 'inactive' : 'active'
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.COLLECTIONS.UPDATE_STATUS(collection.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      },
    )

    if (response.ok) {
      alert(`Collection ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      fetchCollections()
    } else {
      alert('Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error updating status')
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
</style>
