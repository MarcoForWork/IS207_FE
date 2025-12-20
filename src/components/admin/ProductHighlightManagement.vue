<template>
  <div class="product-highlight-management">
    <h2>Product Highlight Management</h2>

    <!-- Create/Edit Highlight Form -->
    <div class="form-section">
      <h3>{{ editingHighlight ? 'Edit Highlight' : 'Create New Highlight' }}</h3>
      <form @submit.prevent="editingHighlight ? updateHighlight() : createHighlight()">
        <div class="form-group">
          <label>Product ID</label>
          <input
            v-model="highlightForm.product_id"
            type="number"
            required
            placeholder="Enter product ID"
            :disabled="editingHighlight"
          />
        </div>
        <div class="form-group">
          <label>Highlight Text</label>
          <input
            v-model="highlightForm.highlight_text"
            type="text"
            required
            placeholder="Enter highlight"
          />
        </div>
        <div class="form-group">
          <label>Icon (optional)</label>
          <input v-model="highlightForm.icon" type="text" placeholder="Icon name or URL" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingHighlight ? 'Update Highlight' : 'Create Highlight' }}
          </button>
          <button v-if="editingHighlight" type="button" class="btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Highlights List -->
    <div class="list-section">
      <h3>Manage Highlights</h3>
      <div class="highlight-item" v-for="highlight in highlights" :key="highlight.id">
        <div class="highlight-content">
          <div class="highlight-icon" v-if="highlight.icon">{{ highlight.icon }}</div>
          <div>
            <strong>{{ highlight.highlight_text }}</strong>
            <small>Product ID: {{ highlight.product_id }}</small>
          </div>
        </div>
        <div class="highlight-actions">
          <button @click="editHighlight(highlight)" class="btn-edit">Edit</button>
          <button @click="deleteHighlight(highlight.id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const highlights = ref([])
const editingHighlight = ref(null)
const highlightForm = ref({
  product_id: '',
  highlight_text: '',
  icon: '',
})

const createHighlight = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_HIGHLIGHTS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(highlightForm.value),
    })

    if (response.ok) {
      const newHighlight = await response.json()
      highlights.value.push(newHighlight)
      alert('Highlight created successfully')
      highlightForm.value = { product_id: '', highlight_text: '', icon: '' }
    } else {
      alert('Failed to create highlight')
    }
  } catch (error) {
    console.error('Error creating highlight:', error)
    alert('Error creating highlight')
  }
}

const editHighlight = (highlight) => {
  editingHighlight.value = highlight
  highlightForm.value = {
    product_id: highlight.product_id,
    highlight_text: highlight.highlight_text,
    icon: highlight.icon,
  }
}

const updateHighlight = async () => {
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_HIGHLIGHTS.UPDATE(editingHighlight.value.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          highlight_text: highlightForm.value.highlight_text,
          icon: highlightForm.value.icon,
        }),
      },
    )

    if (response.ok) {
      alert('Highlight updated successfully')
      cancelEdit()
      // Refresh list
    } else {
      alert('Failed to update highlight')
    }
  } catch (error) {
    console.error('Error updating highlight:', error)
    alert('Error updating highlight')
  }
}

const deleteHighlight = async (highlightId) => {
  if (!confirm('Are you sure you want to delete this highlight?')) return

  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_HIGHLIGHTS.DELETE(highlightId)),
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      },
    )

    if (response.ok) {
      highlights.value = highlights.value.filter((h) => h.id !== highlightId)
      alert('Highlight deleted successfully')
    } else {
      alert('Failed to delete highlight')
    }
  } catch (error) {
    console.error('Error deleting highlight:', error)
    alert('Error deleting highlight')
  }
}

const cancelEdit = () => {
  editingHighlight.value = null
  highlightForm.value = { product_id: '', highlight_text: '', icon: '' }
}
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-highlight-management {
  padding: 20px;
}
</style>
