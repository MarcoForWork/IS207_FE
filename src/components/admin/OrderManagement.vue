<template>
  <div class="order-management">
    <h2>Order Management</h2>

    <div class="list-section">
      <div class="list-head">
        <h3>Manage Orders</h3>

        <!-- ✅ Filter bar -->
        <div class="filter-bar">
          <div class="filter-item">
            <label class="filter-label">Filter by status</label>
            <select v-model="selectedStatus" class="status-select">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <button v-if="selectedStatus" class="btn btn-ghost" @click="selectedStatus = ''">
            Clear
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="filteredOrders.length === 0" class="empty">No orders found</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th class="col-id">Order ID</th>
            <th class="col-customer">Customer</th>
            <th class="col-total">Total</th>
            <th class="col-status">Status</th>
            <th class="col-date">Date</th>
            <th class="col-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="col-id">#{{ order.id }}</td>

            <td class="col-customer">
              <div class="customer-cell">
                <div class="customer-name">{{ order.customer_name }}</div>
              </div>
            </td>

            <td class="col-total">{{ formatMoney(order.total_price) }}</td>

            <td class="col-status">
              <span :class="['status-badge', order.status]">
                {{ order.status }}
              </span>
            </td>

            <td class="col-date">{{ formatDate(order.created_at) }}</td>

            <td class="col-actions">
              <select
                class="status-select"
                :value="order.status"
                @change="updateOrderStatus(order, $event)"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="hint">
        Tip: dùng filter để lọc nhanh theo trạng thái (pending/processing/...).
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAuthHeaders } from '@/config/api'

const orders = ref([])
const loading = ref(false)

// filter
const selectedStatus = ref('')

const filteredOrders = computed(() => {
  if (!selectedStatus.value) return orders.value
  return orders.value.filter((o) => (o.status || '').toLowerCase() === selectedStatus.value)
})

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

async function fetchOrders() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Fetch orders failed (${res.status})`)

    const raw = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : []

    orders.value = raw.map((o) => ({
      id: o.id,
      status: (o.status || 'pending').toLowerCase(),
      created_at: o.created_at,
      total_price: Number(o.total_price ?? o.total ?? 0),
      customer_name:
        o.customer_name ||
        o.user?.name ||
        o.user_name ||
        o.customer?.name ||
        o.name ||
        'N/A',
    }))
  } catch (err) {
    console.error('Error fetching orders:', err)
    alert(err.message || 'Failed to fetch orders')
    orders.value = []
  } finally {
    loading.value = false
  }
}

async function updateOrderStatus(order, event) {
  const newStatus = event.target.value
  const prev = order.status

  order.status = newStatus

  try {
    const res = await fetch(`${API_BASE}/api/orders/${order.id}/status`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json?.message || `Update status failed (${res.status})`)

    // optional sync
    // const updated = json?.data ?? json
    // order.status = (updated?.status || newStatus).toLowerCase()
  } catch (err) {
    console.error('Error updating order status:', err)
    order.status = prev
    event.target.value = prev
    alert(err.message || 'Failed to update order status')
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatMoney(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v) || 0)
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

/* ===== header + filter ===== */
.list-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.filter-bar {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  opacity: 0.8;
}

/* ===== Table thẳng hàng ===== */
.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* ✅ quan trọng */
}

.data-table th,
.data-table td {
  padding: 12px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  vertical-align: middle;
}

.data-table th {
  font-weight: 700;
  white-space: nowrap;
  text-align: left;
}

/* cột width */
.col-id { width: 110px; }
.col-customer { width: 260px; }
.col-total { width: 150px; }
.col-status { width: 140px; }
.col-date { width: 170px; }
.col-actions { width: 220px; text-align: center; }

/* customer cell */
.customer-cell .customer-name {
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* select */
.status-select {
  width: 180px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
}

/* button clear */
.btn {
  border: none;
  border-radius: 10px;
  padding: 9px 12px;
  cursor: pointer;
  font-weight: 700;
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* status badge đẹp */
.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  text-transform: lowercase;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
}

.status-badge.processing {
  background: rgba(59, 130, 246, 0.14);
  color: #1d4ed8;
}

.status-badge.shipped {
  background: rgba(168, 85, 247, 0.14);
  color: #7c3aed;
}

.status-badge.paid {
  background: rgba(16, 185, 129, 0.14);
  color: #047857;
}

.status-badge.completed {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.status-badge.cancelled {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.hint {
  margin-top: 10px;
  font-size: 13px;
  opacity: 0.75;
}
</style>
