<template>
  <div class="admin-dashboard">
    <Header />

    <div class="admin-container">
      <div class="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="admin-content">
        <!-- Categories Management -->
        <CategoryManagement v-if="activeTab === 'categories'" />

        <!-- Collections Management -->
        <CollectionManagement v-if="activeTab === 'collections'" />

        <!-- Products Management -->
        <ProductManagement v-if="activeTab === 'products'" />

        <!-- Product Images Management -->
        <ProductImageManagement v-if="activeTab === 'product-images'" />

        <!-- Product Discounts Management -->
        <ProductDiscountManagement v-if="activeTab === 'product-discounts'" />

        <!-- Product Colors Management -->
        <ProductColorManagement v-if="activeTab === 'product-colors'" />

        <!-- Product FAQs Management -->
        <ProductFaqManagement v-if="activeTab === 'product-faqs'" />

        <!-- Product Highlights Management -->
        <ProductHighlightManagement v-if="activeTab === 'product-highlights'" />

        <!-- Orders Management -->
        <OrderManagement v-if="activeTab === 'orders'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/global/Header.vue'
import CategoryManagement from '@/components/admin/CategoryManagement.vue'
import CollectionManagement from '@/components/admin/CollectionManagement.vue'
import ProductManagement from '@/components/admin/ProductManagement.vue'
import ProductImageManagement from '@/components/admin/ProductImageManagement.vue'
import ProductDiscountManagement from '@/components/admin/ProductDiscountManagement.vue'
import ProductColorManagement from '@/components/admin/ProductColorManagement.vue'
import ProductFaqManagement from '@/components/admin/ProductFaqManagement.vue'
import ProductHighlightManagement from '@/components/admin/ProductHighlightManagement.vue'
import OrderManagement from '@/components/admin/OrderManagement.vue'

const activeTab = ref('categories')

const tabs = [
  { id: 'categories', label: 'Categories' },
  { id: 'collections', label: 'Collections' },
  { id: 'products', label: 'Products' },
  { id: 'product-images', label: 'Product Images' },
  { id: 'product-discounts', label: 'Discounts' },
  { id: 'product-colors', label: 'Colors' },
  { id: 'product-faqs', label: 'FAQs' },
  { id: 'product-highlights', label: 'Highlights' },
  { id: 'orders', label: 'Orders' },
]
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9f5d7;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  background: #fbf1c7;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #d5c4a1;
}

.admin-header h1 {
  margin: 0;
  font-size: 32px;
  color: #282828;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 24px;
  background: white;
  border: 2px solid #d5c4a1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #504945;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: #689d6a;
  color: #689d6a;
  background: #f2e5bc;
}

.tab-button.active {
  background: #689d6a;
  border-color: #689d6a;
  color: white;
}

.admin-content {
  background: #fbf1c7;
  padding: 30px;
  border-radius: 8px;
  border: 2px solid #d5c4a1;
  min-height: 500px;
}
</style>
