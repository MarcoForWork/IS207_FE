<template>
  <div class="content-section">
    <div class="section-header">
      <h2>My Addresses</h2>
      <button class="btn-add" @click="$emit('add-address')">+ Add New Address</button>
    </div>

    <div v-if="addresses.length === 0" class="empty-state">
      <p>No addresses yet. Add your first address above.</p>
    </div>

    <div v-else class="addresses-list">
      <div
        v-for="address in addresses"
        :key="address.address_id"
        class="address-card"
        :class="{ default: address.is_default }"
      >
        <div class="address-content">
          <div class="address-header">
            <span v-if="address.is_default" class="default-badge">Default</span>
          </div>
          <p class="address-line">{{ address.address_line }}</p>
          <p class="address-details">
            {{ address.ward }}, {{ address.district }}, {{ address.city }}
          </p>
          <p class="address-country">{{ address.country }}</p>
        </div>

        <div class="address-actions">
          <button
            v-if="!address.is_default"
            class="btn-text"
            @click="$emit('set-default', address.address_id)"
          >
            Set as Default
          </button>
          <button class="btn-text" @click="$emit('edit-address', address)">Edit</button>
          <button
            class="btn-text danger"
            @click="handleDelete(address)"
            :disabled="address.is_default"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  addresses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['add-address', 'edit-address', 'delete-address', 'set-default'])

function handleDelete(address) {
  if (confirm('Are you sure you want to delete this address?')) {
    emit('delete-address', address.address_id)
  }
}
</script>

<style scoped>
.content-section h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #000000;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-add {
  background: #000000;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #333333;
}

.addresses-list {
  display: grid;
  gap: 1rem;
}

.address-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: start;
  transition: all 0.2s;
}

.address-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-card.default {
  border-color: #000000;
  border-width: 2px;
  background: #f5f5f5;
}

.address-content {
  flex: 1;
}

.address-header {
  margin-bottom: 0.75rem;
}

.default-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #000000;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 4px;
  text-transform: uppercase;
}

.address-line {
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem;
}

.address-details,
.address-country {
  color: #808080;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-text {
  background: none;
  border: none;
  color: #000000;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.btn-text:hover {
  color: #808080;
}

.btn-text.danger {
  color: #808080;
}

.btn-text.danger:hover {
  color: #000000;
}

.btn-text:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #808080;
}

@media (max-width: 640px) {
  .address-card {
    flex-direction: column;
    gap: 1rem;
  }

  .address-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
