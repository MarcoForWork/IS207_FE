<template>
  <div class="product-image-management">
    <h2>Product Image Management</h2>

    <div class="form-section">
      <h3>Add Product Image</h3>
      <form @submit.prevent="createProductImage()">
        <div class="form-group">
          <label>Product ID</label>
          <input
            v-model="imageForm.product_id"
            type="number"
            required
            placeholder="Enter product ID"
          />
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input v-model="imageForm.image_url" type="text" required placeholder="Enter image URL" />
        </div>
        <div class="form-group">
          <label>Is Primary</label>
          <select v-model="imageForm.is_primary">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Add Image</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const imageForm = ref({
  product_id: '',
  image_url: '',
  is_primary: false,
})

const createProductImage = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_IMAGES.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(imageForm.value),
    })

    if (response.ok) {
      alert('Product image added successfully')
      imageForm.value = { product_id: '', image_url: '', is_primary: false }
    } else {
      alert('Failed to add product image')
    }
  } catch (error) {
    console.error('Error adding product image:', error)
    alert('Error adding product image')
  }
}
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-image-management {
  padding: 20px;
}
</style>
