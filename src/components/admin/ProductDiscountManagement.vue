<template>
  <div class="product-discount-management">
    <h2>Product Discount Management</h2>

    <div class="form-section">
      <h3>Create Discount</h3>
      <form @submit.prevent="createDiscount()">
        <div class="form-group">
          <label>Product ID</label>
          <input
            v-model="discountForm.product_id"
            type="number"
            required
            placeholder="Enter product ID"
          />
        </div>
        <div class="form-group">
          <label>Discount Percentage</label>
          <input
            v-model="discountForm.discount_percentage"
            type="number"
            step="0.01"
            required
            placeholder="Enter discount %"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input v-model="discountForm.start_date" type="datetime-local" required />
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input v-model="discountForm.end_date" type="datetime-local" required />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Create Discount</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const discountForm = ref({
  product_id: '',
  discount_percentage: '',
  start_date: '',
  end_date: '',
})

const createDiscount = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_DISCOUNTS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(discountForm.value),
    })

    if (response.ok) {
      alert('Discount created successfully')
      discountForm.value = { product_id: '', discount_percentage: '', start_date: '', end_date: '' }
    } else {
      alert('Failed to create discount')
    }
  } catch (error) {
    console.error('Error creating discount:', error)
    alert('Error creating discount')
  }
}
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-discount-management {
  padding: 20px;
}
</style>
