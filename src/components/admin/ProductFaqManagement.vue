<template>
  <div class="product-faq-management">
    <h2>Product FAQ Management</h2>

    <!-- Create/Edit FAQ Form -->
    <div class="form-section">
      <h3>{{ editingFaq ? 'Edit FAQ' : 'Create New FAQ' }}</h3>
      <form @submit.prevent="editingFaq ? updateFaq() : createFaq()">
        <div class="form-group">
          <label>Product ID</label>
          <input
            v-model="faqForm.product_id"
            type="number"
            required
            placeholder="Enter product ID"
            :disabled="editingFaq"
          />
        </div>
        <div class="form-group">
          <label>Question</label>
          <input v-model="faqForm.question" type="text" required placeholder="Enter question" />
        </div>
        <div class="form-group">
          <label>Answer</label>
          <textarea v-model="faqForm.answer" required placeholder="Enter answer"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingFaq ? 'Update FAQ' : 'Create FAQ' }}
          </button>
          <button v-if="editingFaq" type="button" class="btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- FAQ List -->
    <div class="list-section">
      <h3>Manage FAQs</h3>
      <div class="faq-item" v-for="faq in faqs" :key="faq.id">
        <div class="faq-content">
          <strong>Q: {{ faq.question }}</strong>
          <p>A: {{ faq.answer }}</p>
          <small>Product ID: {{ faq.product_id }}</small>
        </div>
        <div class="faq-actions">
          <button @click="editFaq(faq)" class="btn-edit">Edit</button>
          <button @click="deleteFaq(faq.id)" class="btn-delete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_ENDPOINTS, buildUrl, getAuthHeaders } from '@/config/api'

const faqs = ref([])
const editingFaq = ref(null)
const faqForm = ref({
  product_id: '',
  question: '',
  answer: '',
})

const createFaq = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_FAQS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(faqForm.value),
    })

    if (response.ok) {
      const newFaq = await response.json()
      faqs.value.push(newFaq)
      alert('FAQ created successfully')
      faqForm.value = { product_id: '', question: '', answer: '' }
    } else {
      alert('Failed to create FAQ')
    }
  } catch (error) {
    console.error('Error creating FAQ:', error)
    alert('Error creating FAQ')
  }
}

const editFaq = (faq) => {
  editingFaq.value = faq
  faqForm.value = {
    product_id: faq.product_id,
    question: faq.question,
    answer: faq.answer,
  }
}

const updateFaq = async () => {
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_FAQS.UPDATE(editingFaq.value.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          question: faqForm.value.question,
          answer: faqForm.value.answer,
        }),
      },
    )

    if (response.ok) {
      alert('FAQ updated successfully')
      cancelEdit()
      // Refresh list
    } else {
      alert('Failed to update FAQ')
    }
  } catch (error) {
    console.error('Error updating FAQ:', error)
    alert('Error updating FAQ')
  }
}

const deleteFaq = async (faqId) => {
  if (!confirm('Are you sure you want to delete this FAQ?')) return

  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCT_FAQS.DELETE(faqId)), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (response.ok) {
      faqs.value = faqs.value.filter((f) => f.id !== faqId)
      alert('FAQ deleted successfully')
    } else {
      alert('Failed to delete FAQ')
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    alert('Error deleting FAQ')
  }
}

const cancelEdit = () => {
  editingFaq.value = null
  faqForm.value = { product_id: '', question: '', answer: '' }
}
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-faq-management {
  padding: 20px;
}
</style>
