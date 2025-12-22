<template>
  <div class="content-section">
    <h2>Change Password</h2>

    <form @submit.prevent="handleSubmit" class="profile-form">
      <div class="form-group">
        <label for="current_password">Current Password</label>
        <input
          id="current_password"
          v-model="form.current_password"
          type="password"
          placeholder="Enter current password"
          required
        />
      </div>

      <div class="form-group">
        <label for="new_password">New Password</label>
        <input
          id="new_password"
          v-model="form.new_password"
          type="password"
          placeholder="Enter new password (min 8 characters)"
          required
        />
      </div>

      <div class="form-group">
        <label for="confirm_password">Confirm New Password</label>
        <input
          id="confirm_password"
          v-model="form.confirm_password"
          type="password"
          placeholder="Confirm new password"
          required
        />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>

      <button type="submit" class="btn-primary" :disabled="loading">
        <span v-if="loading">Updating...</span>
        <span v-else>Change Password</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update'])

const form = ref({
  current_password: '',
  new_password: '',
  confirm_password: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleSubmit() {
  error.value = ''
  success.value = ''

  if (form.value.new_password.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  if (form.value.new_password !== form.value.confirm_password) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    await emit('update', form.value)
    success.value = 'Password changed successfully!'
    form.value = {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }

    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.message || 'Failed to change password'
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

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #000000;
  background: #f5f5f5;
  transition: all 0.2s;
}

.form-group input:focus {
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
