<template>
  <div class="product-management">
    <h2>Product Management</h2>

    <!-- Create/Edit Product Form -->
    <div class="form-section">
      <h3>{{ editingProduct ? 'Edit Product' : 'Create New Product' }}</h3>
      <form @submit.prevent="editingProduct ? updateProduct() : createProduct()">
        <div class="form-row">
          <div class="form-group">
            <label>Product Name</label>
            <input
              v-model="productForm.name"
              type="text"
              required
              placeholder="Enter product name"
            />
          </div>
          <div class="form-group">
            <label>Price</label>
            <input
              v-model="productForm.price"
              type="number"
              step="0.01"
              required
              placeholder="Enter price"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="productForm.description" placeholder="Enter description"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Collection ID</label>
            <input
              v-model="productForm.collection_id"
              type="number"
              required
              placeholder="Collection ID"
            />
          </div>
          <div class="form-group">
            <label>Stock Quantity</label>
            <input
              v-model="productForm.stock_quantity"
              type="number"
              required
              placeholder="Stock"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>SKU</label>
            <input v-model="productForm.sku" type="text" placeholder="SKU" />
          </div>
          <div class="form-group">
            <label>Brand</label>
            <input v-model="productForm.brand" type="text" placeholder="Brand" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ editingProduct ? 'Update Product' : 'Create Product' }}
          </button>
          <button v-if="editingProduct" type="button" class="btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Products List -->
    <div class="list-section">
      <h3>Existing Products</h3>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="products.length === 0" class="empty">No products found</div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>${{ product.price }}</td>
            <td>{{ product.stock_quantity }}</td>
            <td>
              <span :class="['status-badge', product.status]">
                {{ product.status }}
              </span>
            </td>
            <td class="actions">
              <button @click="editProduct(product)" class="btn-edit">Edit</button>
              <button @click="toggleStatus(product)" class="btn-toggle">
                {{ product.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
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

const products = ref([])
const loading = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  description: '',
  price: '',
  collection_id: '',
  stock_quantity: '',
  sku: '',
  brand: '',
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.PRODUCTS.LIST), {
      headers: getAuthHeaders(),
    })
    if (response.ok) {
      products.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    alert('Failed to fetch products')
  } finally {
    loading.value = false
  }
}

const createProduct = async () => {
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCTS.CREATE), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productForm.value),
    })

    if (response.ok) {
      alert('Product created successfully')
      resetForm()
      fetchProducts()
    } else {
      alert('Failed to create product')
    }
  } catch (error) {
    console.error('Error creating product:', error)
    alert('Error creating product')
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    collection_id: product.collection_id,
    stock_quantity: product.stock_quantity,
    sku: product.sku,
    brand: product.brand,
  }
}

const updateProduct = async () => {
  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(editingProduct.value.id)),
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productForm.value),
      },
    )

    if (response.ok) {
      alert('Product updated successfully')
      cancelEdit()
      fetchProducts()
    } else {
      alert('Failed to update product')
    }
  } catch (error) {
    console.error('Error updating product:', error)
    alert('Error updating product')
  }
}

const cancelEdit = () => {
  editingProduct.value = null
  resetForm()
}

const resetForm = () => {
  productForm.value = {
    name: '',
    description: '',
    price: '',
    collection_id: '',
    stock_quantity: '',
    sku: '',
    brand: '',
  }
}

const toggleStatus = async (product) => {
  const newStatus = product.status === 'active' ? 'inactive' : 'active'
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE_STATUS(product.id)), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    })

    if (response.ok) {
      alert(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
      fetchProducts()
    } else {
      alert('Failed to update status')
    }
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Error updating status')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
@import '@/assets/admin-styles.css';

.product-management {
  padding: 20px;
}
</style>
