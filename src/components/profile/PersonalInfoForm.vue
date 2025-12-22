<template>
  <div class="content-section">
    <h2>Personal Information</h2>

    <form @submit.prevent="handleSubmit" class="profile-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" v-model="form.name" type="text" placeholder="Your full name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="your@email.com" required />
      </div>

      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input id="phone" v-model="form.phone" type="tel" placeholder="0901234567" />
      </div>

      <div class="form-group">
        <label for="address">Address (Legacy)</label>
        <textarea
          id="address"
          v-model="form.address"
          placeholder="Your address"
          rows="3"
        ></textarea>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading">Updating...</span>
        <span v-else>Update Profile</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update'])

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Initialize form when user data changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = {
        name: newUser.name || '',
        email: newUser.email || '',
        phone: newUser.phone || '',
        address: newUser.address || '',
      }
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await emit('update', form.value)
    success.value = 'Profile updated successfully!'

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.content-section h2 {
  margin: 0 0 2rem;
  font-size: 1.75rem;
  color: #000000;
}

.profile-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #000000;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #000000;
  background: #f5f5f5;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #000000;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.btn-primary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #000000;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message,
.success-message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.error-message {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #000000;
}

.success-message {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}
</style>
