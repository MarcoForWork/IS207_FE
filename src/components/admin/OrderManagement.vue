<template>
  <div class="order-management">
    <h2>Order Management</h2>

    <!-- Orders List -->
    <div class="list-section">
      <h3>Manage Orders</h3>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="orders.length === 0" class="empty">No orders found</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.customer_name }}</td>
            <td>${{ order.total }}</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ order.status }}
              </span>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td class="actions">
              <select
                @change="updateOrderStatus(order, $event)"
                :value="order.status"
                class="status-select"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
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

const orders = ref([])
const loading = ref(false)

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ORDERS.LIST), {
      headers: getAuthHeaders(),
    })
    if (response.ok) {
      orders.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Failed to fetch orders')
  } finally {
    loading.value = false
  }
}

const updateOrderStatus = async (order, event) => {
  const newStatus = event.target.value
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.ORDERS.UPDATE_STATUS(order.id)), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    })

    if (response.ok) {
      alert('Order status updated successfully')
      order.status = newStatus
    } else {
      alert('Failed to update order status')
      event.target.value = order.status // Reset to previous value
    }
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Error updating order status')
    event.target.value = order.status // Reset to previous value
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.order-management {
  padding: 20px;
}
</style>
