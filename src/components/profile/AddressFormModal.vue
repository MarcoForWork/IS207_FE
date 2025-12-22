<template>
  <div v-if="show" class="address-form-modal" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Address' : 'Add New Address' }}</h3>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="address-form">
        <div class="form-group">
          <label for="address_line">Address Line</label>
          <input
            id="address_line"
            v-model="form.address_line"
            type="text"
            placeholder="Street address, building, apartment"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="ward">Ward/Commune</label>
            <input id="ward" v-model="form.ward" type="text" placeholder="Ward" required />
          </div>

          <div class="form-group">
            <label for="district">District</label>
            <input
              id="district"
              v-model="form.district"
              type="text"
              placeholder="District"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="city">City/Province</label>
            <input id="city" v-model="form.city" type="text" placeholder="City" required />
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <input id="country" v-model="form.country" type="text" placeholder="Vietnam" required />
          </div>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading">Saving...</span>
            <span v-else>Save Address</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  address: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  address_line: '',
  ward: '',
  district: '',
  city: '',
  country: 'Vietnam',
})

const loading = ref(false)
const error = ref('')

const isEditing = ref(false)

// Initialize form when address changes
watch(
  () => props.address,
  (newAddress) => {
    if (newAddress) {
      isEditing.value = true
      form.value = {
        address_line: newAddress.address_line || '',
        ward: newAddress.ward || '',
        district: newAddress.district || '',
        city: newAddress.city || '',
        country: newAddress.country || 'Vietnam',
      }
    } else {
      isEditing.value = false
      resetForm()
    }
  },
  { immediate: true },
)

// Reset form when modal is closed
watch(
  () => props.show,
  (newShow) => {
    if (!newShow) {
      error.value = ''
      if (!props.address) {
        resetForm()
      }
    }
  },
)

function resetForm() {
  form.value = {
    address_line: '',
    ward: '',
    district: '',
    city: '',
    country: 'Vietnam',
  }
}

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await emit('save', {
      ...form.value,
      address_id: props.address?.address_id,
    })
    emit('close')
  } catch (err) {
    error.value = err.message || 'Failed to save address'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.address-form-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #000000;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #808080;
  padding: 0.25rem 0.5rem;
}

.btn-close:hover {
  color: #000000;
}

.address-form {
  padding: 1.5rem;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
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

.btn-secondary {
  background: #f5f5f5;
  color: #000000;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.error-message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #000000;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
