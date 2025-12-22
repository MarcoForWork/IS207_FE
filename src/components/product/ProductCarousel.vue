<template>
  <section class="product-carousel-section">
    <div class="container">
      <div class="section-header">
        <h2>{{ title }}</h2>
        <div class="carousel-controls">
          <button class="control-btn" @click="scrollLeft" :disabled="!canScrollLeft">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="control-btn" @click="scrollRight" :disabled="!canScrollRight">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="carousel-wrapper">
        <div class="carousel-track" ref="carouselTrack" @scroll="handleScroll">
          <div
            v-for="product in products"
            :key="product.id"
            class="carousel-item"
            @click="goToProduct(product.id)"
          >
            <div class="product-image">
              <img
                :src="getImageUrl(product.images?.[0]?.image_url)"
                :alt="product.name"
                loading="lazy"
              />
              <div v-if="product.discount_percentage" class="discount-badge">
                -{{ product.discount_percentage }}%
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-category">{{ product.category?.name }}</p>
              <div class="product-price">
                <span v-if="product.discount_percentage" class="original-price">
                  ${{ product.price }}
                </span>
                <span class="current-price">
                  ${{ calculateDiscountedPrice(product.price, product.discount_percentage) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { buildUrl } from '@/config/api'

const props = defineProps({
  title: {
    type: String,
    default: 'Featured Products',
  },
  apiEndpoint: {
    type: String,
    default: '/api/products',
  },
  limit: {
    type: Number,
    default: 12,
  },
})

const router = useRouter()
const products = ref([])
const carouselTrack = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// Fetch products
async function fetchProducts() {
  try {
    const url = new URL(buildUrl(props.apiEndpoint))
    url.searchParams.append('limit', props.limit)

    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch products')

    const data = await response.json()
    products.value = data.products || data.data || data || []
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

// Get image URL
function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder-product.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return buildUrl(`/storage/${imagePath}`)
}

// Calculate discounted price
function calculateDiscountedPrice(price, discountPercentage) {
  if (!discountPercentage) return price
  const discounted = price - (price * discountPercentage) / 100
  return discounted.toFixed(2)
}

// Navigate to product details
function goToProduct(productId) {
  router.push(`/products/${productId}`)
}

// Scroll controls
function scrollLeft() {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }
}

function scrollRight() {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }
}

function handleScroll() {
  if (!carouselTrack.value) return

  const { scrollLeft, scrollWidth, clientWidth } = carouselTrack.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

onMounted(() => {
  fetchProducts()

  // Set initial scroll state
  if (carouselTrack.value) {
    handleScroll()
  }
})
</script>

<style scoped>
.product-carousel-section {
  padding: 4rem 0;
  background: #ffffff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn svg {
  width: 20px;
  height: 20px;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 0 1.5rem;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 280px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.carousel-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #000000;
}

.product-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.carousel-item:hover .product-image img {
  transform: scale(1.1);
}

.discount-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #000000;
  color: #ffffff;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.875rem;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-category {
  font-size: 0.875rem;
  color: #808080;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.original-price {
  font-size: 0.875rem;
  color: #808080;
  text-decoration: line-through;
}

.current-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #000000;
}

@media (max-width: 768px) {
  .product-carousel-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .carousel-item {
    flex: 0 0 240px;
  }

  .product-image {
    height: 240px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    flex: 0 0 200px;
  }

  .product-image {
    height: 200px;
  }

  .carousel-track {
    gap: 1rem;
  }
}
</style>
