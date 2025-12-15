<template>
  <article class="product-card">
    <router-link :to="{ name: 'productDetails', params: { id: product.id } }" class="card-link">
      <div class="card-inner">
        <div class="thumb">
          <img v-if="product.main_image" :src="product.main_image" :alt="product.name" />
          <div v-else class="thumb-empty"></div>
        </div>

        <div class="meta">
          <h3 class="title">{{ product.name }}</h3>
          <p class="category">{{ product.category?.name || 'Sản phẩm' }}</p>
          <p class="colors">{{ product.color_count || 1 }} Màu</p>
          <p class="price">{{ formatPrice(product.final_price || product.base_price) }}</p>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  product: { type: Object, required: true },
})

defineEmits(['add-to-cart'])

function formatPrice(p) {
  if (p == null) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}
</script>

<style scoped>
.product-card {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
.card-link {
  color: inherit;
  text-decoration: none;
  display: block;
}
.card-inner {
  position: relative;
}
.badge {
  position: absolute;
  right: 12px;
  top: 12px;
  background: transparent;
  color: #d32f2f;
  border-radius: 0;
  padding: 4px 0;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 10;
}
.thumb {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}
.product-card:hover .thumb {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.thumb img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .thumb img {
  transform: scale(1.05);
}
.thumb-empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}
.meta {
  padding: 0;
}
.title {
  font-size: 1rem;
  color: #111;
  font-weight: 500;
  margin: 0 0 2px 0;
  line-height: 1.75;
}
.category {
  color: #757575;
  font-size: 1rem;
  margin: 0 0 0 0;
  line-height: 1.75;
}
.colors {
  color: #757575;
  font-size: 1rem;
  margin: 0 0 16px 0;
  line-height: 1.75;
}
.price {
  color: #111;
  font-weight: 500;
  font-size: 1rem;
  margin: 0;
  line-height: 1.75;
}

@media (max-width: 768px) {
  .thumb {
    margin-bottom: 8px;
  }
  .title,
  .category,
  .colors,
  .price {
    font-size: 0.9rem;
  }
}
</style>
