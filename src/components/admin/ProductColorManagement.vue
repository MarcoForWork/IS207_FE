<template>
  <div class="product-color-management">
    <h2>Product Color Management</h2>

    <div class="form-section">
      <h3>Add Product Color</h3>
      <form @submit.prevent="createProductColor()">
        <div class="form-group">
          <label>Product ID</label>
          <input
            v-model="colorForm.product_id"
            type="number"
            required
            placeholder="Enter product ID"
          />
        </div>
        <div class="form-group">
          <label>Color Name</label>
          <input
            v-model="colorForm.color_name"
            type="text"
            required
            placeholder="Enter color name"
          />
        </div>
        <div class="form-group">
          <label>Color Code (Hex)</label>
          <input v-model="colorForm.color_code" type="text" placeholder="#FFFFFF" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Add Color</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const colorForm = ref({
  product_id: '',
  color_name: '',
  color_code: '',
})

const createProductColor = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_COLORS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(colorForm.value),
    })

    if (response.ok) {
      alert('Product color added successfully')
      colorForm.value = { product_id: '', color_name: '', color_code: '' }
    } else {
      alert('Failed to add product color')
    }
  } catch (error) {
    console.error('Error adding product color:', error)
    alert('Error adding product color')
  }
}
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-color-management {
  padding: 20px;
}
</style>
