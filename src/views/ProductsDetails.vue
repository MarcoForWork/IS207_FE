<template>
  <div>
    <Header />
    <Navbar />
    <main class="product-detail">
      <button class="back" @click="$router.back()">← Quay lại</button>
      <section v-if="loading" class="loading">
        <p>Đang tải sản phẩm...</p>
      </section>
      <section v-else-if="product" class="product-content">
        <div class="product-images">
          <div class="main-image">
            <img :src="selectedImage" :alt="product.name" />
          </div>
          <div class="image-thumbnails" v-if="product.colors && product.colors.length > 0">
            <img
              v-for="color in product.colors"
              :key="color.id"
              :src="color.main_image"
              :alt="color.color_name"
              @click="selectedImage = color.main_image"
              :class="{ active: selectedImage === color.main_image }"
            />
          </div>
        </div>

        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="category">{{ product.category?.name }}</p>

          <div class="price-section">
            <p class="price">{{ displayPrice }}</p>
            <p v-if="product.discount_percent > 0" class="old-price">
              {{ formatPrice(product.base_price) }}
            </p>
            <span v-if="product.discount_percent > 0" class="discount-badge">
              -{{ product.discount_percent }}%
            </span>
          </div>

          <div class="meta-row" v-if="product.collection">
            <span class="meta-label">Bộ sưu tập:</span>
            <span class="meta-value">{{ product.collection.name }}</span>
          </div>

          <div class="color-selector" v-if="product.colors && product.colors.length > 0">
            <h3>Màu sắc</h3>
            <div class="color-options">
              <div
                v-for="color in product.colors"
                :key="color.id"
                class="color-option"
                :class="{ active: selectedColor?.id === color.id }"
                @click="selectColor(color)"
              >
                <span class="color-swatch" :style="{ backgroundColor: color.color_code }"></span>
                <span class="color-name">{{ color.color_name }}</span>
              </div>
            </div>
          </div>

          <div class="size-selector" v-if="availableSizes.length > 0">
            <h3>Kích thước</h3>
            <div class="size-options">
              <button
                v-for="size in availableSizes"
                :key="size.id"
                class="size-option"
                :class="{ active: selectedSize?.id === size.id }"
                @click="selectedSize = size"
              >
                {{ size.size_name }}
              </button>
            </div>
          </div>

          <div class="quantity-selector">
            <h3>Số lượng</h3>
            <div class="quantity-controls">
              <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" max="99" class="qty-input" />
              <button class="qty-btn" @click="increaseQuantity" :disabled="quantity >= 99">
                +
              </button>
            </div>
          </div>

          <div class="description">
            <h3>Mô tả sản phẩm</h3>
            <p>{{ product.description || 'Chưa có mô tả chi tiết.' }}</p>
          </div>

          <button class="add-to-cart-btn" @click="addToCart">Thêm vào giỏ hàng</button>

          <div class="detail-block">
            <button
              class="block-header"
              @click="openSections.highlights = !openSections.highlights"
            >
              <span>Điểm nổi bật</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :class="{ rotated: openSections.highlights }"
              >
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            <transition name="slide">
              <ul v-show="openSections.highlights" class="detail-list">
                <li v-for="item in highlights" :key="item.id">
                  <strong v-if="item.title">{{ item.title }}: </strong>{{ item.description }}
                </li>
              </ul>
            </transition>
          </div>

          <div class="detail-block">
            <button class="block-header" @click="openSections.care = !openSections.care">
              <span>Chất liệu & chăm sóc</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :class="{ rotated: openSections.care }"
              >
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            <transition name="slide">
              <ul v-show="openSections.care" class="detail-list">
                <li>Vải: Cotton pha poly, mềm, thoáng, hạn chế nhăn.</li>
                <li>Giặt máy nhẹ ở 30°C, lộn trái khi giặt và phơi.</li>
                <li>Không dùng chất tẩy mạnh; ủi ở nhiệt độ thấp.</li>
              </ul>
            </transition>
          </div>

          <div class="detail-block">
            <button class="block-header" @click="openSections.shipping = !openSections.shipping">
              <span>Giao hàng & đổi trả</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :class="{ rotated: openSections.shipping }"
              >
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            <transition name="slide">
              <ul v-show="openSections.shipping" class="detail-list">
                <li>Giao nhanh 2-4 ngày làm việc tại nội địa.</li>
                <li>Hỗ trợ đổi size trong 7 ngày nếu sản phẩm còn nguyên tem.</li>
                <li>Đóng gói chống sốc, kèm hướng dẫn chăm sóc.</li>
              </ul>
            </transition>
          </div>

          <div class="detail-block" v-if="faqs.length">
            <button class="block-header" @click="openSections.faqs = !openSections.faqs">
              <span>Hỏi đáp</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                :class="{ rotated: openSections.faqs }"
              >
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            </button>
            <transition name="slide">
              <ul v-show="openSections.faqs" class="detail-list">
                <li v-for="faq in faqs" :key="faq.id">
                  <strong>{{ faq.question }}</strong>
                  <div>{{ faq.answer }}</div>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </section>
      <section v-else class="not-found">
        <p>Sản phẩm không tìm thấy.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const loading = ref(false)
const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedImage = ref('')
const quantity = ref(1)
const highlights = ref([])
const faqs = ref([])
const openSections = ref({
  highlights: true,
  care: true,
  shipping: true,
  faqs: true,
})

// Sample sizes (would come from database in real app)
const availableSizes = ref([
  { id: 1, size_name: 'S', sort_order: 1 },
  { id: 2, size_name: 'M', sort_order: 2 },
  { id: 3, size_name: 'L', sort_order: 3 },
  { id: 4, size_name: 'XL', sort_order: 4 },
])

// Fetch product details from API
async function fetchProductDetails() {
  loading.value = true
  try {
    // TODO: Replace with actual API endpoint
    // const response = await fetch(`https://your-api.com/api/products/${productId}`)
    // const data = await response.json()
    // product.value = data

    // Sample data shaped to database schema (categories, collections, colors, variants, highlights, faqs)
    const sampleProducts = {
      1: {
        id: 1,
        name: 'Áo Thun Waffle Thoáng Mát',
        slug: 'ao-thun-waffle-thoang-mat',
        description:
          'Áo thun waffle cao cấp với chất liệu thoáng mát, co giãn 4 chiều. Phù hợp cho mọi hoạt động thể thao và đi chơi.',
        base_price: 127000,
        discount_percent: 5,
        final_price: 120650,
        gender: 'nam',
        status: 'active',
        category: { id: 1, name: 'Áo Thun', slug: 'ao-thun' },
        collection: { id: 2, name: 'Sport Collection', slug: 'sport-collection' },
        colors: [
          {
            id: 1,
            color_name: 'Xanh Navy',
            color_code: '#001f3f',
            main_image: 'https://picsum.photos/seed/p1/800/800',
          },
          {
            id: 2,
            color_name: 'Đen',
            color_code: '#111111',
            main_image: 'https://picsum.photos/seed/p1b/800/800',
          },
          {
            id: 3,
            color_name: 'Trắng',
            color_code: '#ffffff',
            main_image: 'https://picsum.photos/seed/p1c/800/800',
          },
        ],
        variants: [
          { id: 101, color_id: 1, size_id: 1, sku: 'P1-NAVY-S', price: 120650, stock: 12 },
          { id: 102, color_id: 1, size_id: 2, sku: 'P1-NAVY-M', price: 120650, stock: 8 },
          { id: 103, color_id: 2, size_id: 2, sku: 'P1-BLK-M', price: 120650, stock: 5 },
        ],
        highlights: [
          {
            id: 1,
            title: 'Chất liệu thoáng khí',
            description: 'Dệt waffle thoáng, hạn chế bám dính mồ hôi.',
            image_url: 'https://picsum.photos/seed/h1/120/120',
          },
          {
            id: 2,
            title: 'Form vừa vặn',
            description: 'Vai gọn, thân vừa; giữ form sau nhiều lần giặt.',
            image_url: 'https://picsum.photos/seed/h2/120/120',
          },
        ],
        faqs: [
          {
            id: 1,
            question: 'Giặt máy được không?',
            answer: 'Giặt máy chế độ nhẹ, nước 30°C, lộn trái áo.',
          },
          {
            id: 2,
            question: 'Có co rút không?',
            answer: 'Vải xử lý chống co; co rút <3% nếu giặt đúng cách.',
          },
        ],
      },
    }

    product.value = sampleProducts[productId] || null

    highlights.value = product.value?.highlights || []
    faqs.value = product.value?.faqs || []

    if (product.value && product.value.colors && product.value.colors.length > 0) {
      selectedColor.value = product.value.colors[0]
      selectedImage.value = product.value.colors[0].main_image
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

function selectColor(color) {
  selectedColor.value = color
  selectedImage.value = color.main_image
}

function increaseQuantity() {
  if (quantity.value < 99) {
    quantity.value++
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const displayPrice = computed(() => {
  if (!product.value) return ''
  return formatPrice(product.value.final_price ?? product.value.base_price)
})

function formatPrice(p) {
  if (p == null) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

function addToCart() {
  if (!product.value) return

  if (!selectedColor.value) {
    window.alert('Vui lòng chọn màu sắc')
    return
  }

  if (availableSizes.value.length > 0 && !selectedSize.value) {
    window.alert('Vui lòng chọn kích thước')
    return
  }

  const cartItem = {
    product_id: product.value.id,
    name: product.value.name,
    price: product.value.final_price,
    color: selectedColor.value,
    size: selectedSize.value,
    qty: quantity.value,
    image: selectedImage.value,
  }

  const stored = JSON.parse(localStorage.getItem('cart') || '[]')
  stored.push(cartItem)
  localStorage.setItem('cart', JSON.stringify(stored))

  window.alert(`${product.value.name} đã được thêm vào giỏ hàng`)
}

onMounted(() => {
  fetchProductDetails()
})
</script>

<style scoped>
.product-detail {
  padding: 28px 16px 40px 16px;
  max-width: 1180px;
  margin: 0 auto;
  background: #fbf1c7;
  color: #3c3836;
}

.back {
  background: transparent;
  border: 1px solid #ebdbb2;
  color: #3c3836;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.back:hover {
  border-color: #d79921;
  color: #d79921;
}

.loading,
.not-found {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 12px;
  padding: 24px;
  background: #f9f5d7;
  border: 1px solid #ebdbb2;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(29, 32, 33, 0.08);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  overflow: hidden;
  border-radius: 16px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.image-thumbnails {
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.image-thumbnails img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
  border-radius: 10px;
}

.image-thumbnails img:hover {
  border-color: #ccc;
}

.image-thumbnails img.active {
  border-color: #111;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-info h1 {
  font-size: 2.1rem;
  margin: 0;
  color: #3c3836;
  letter-spacing: -0.01em;
}

.category {
  color: #7c6f64;
  font-size: 1rem;
  margin: -10px 0 0 0;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.price {
  font-size: 1.6rem;
  font-weight: 700;
  color: #3c3836;
  margin: 0;
}

.old-price {
  font-size: 1.05rem;
  color: #7c6f64;
  text-decoration: line-through;
  margin: 0;
}

.discount-badge {
  background: #d79921;
  color: #1d2021;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.color-selector h3,
.size-selector h3,
.description h3 {
  font-size: 1.05rem;
  margin: 0 0 10px 0;
  color: #3c3836;
  letter-spacing: 0.01em;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #ebdbb2;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fbf1c7;
}

.color-option:hover {
  border-color: #d79921;
}

.color-option.active {
  border-color: #d79921;
  background: #f2e5bc;
}

.color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #d5c4a1;
}

.color-name {
  font-size: 0.95rem;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.size-option {
  padding: 10px 18px;
  border: 1px solid #ebdbb2;
  border-radius: 12px;
  background: #fbf1c7;
  cursor: pointer;
  font-size: 0.97rem;
  transition: all 0.2s ease;
  color: #3c3836;
}

.size-option:hover {
  border-color: #d79921;
}

.size-option.active {
  border-color: #d79921;
  background: #d79921;
  color: #1d2021;
}

.quantity-selector h3 {
  font-size: 1.05rem;
  margin: 0 0 10px 0;
  color: #3c3836;
  letter-spacing: 0.01em;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ebdbb2;
  border-radius: 12px;
  background: #fbf1c7;
  color: #3c3836;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:hover:not(:disabled) {
  border-color: #d79921;
  background: #f2e5bc;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-input {
  width: 70px;
  height: 40px;
  border: 1px solid #ebdbb2;
  border-radius: 12px;
  background: #fbf1c7;
  color: #3c3836;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.description p {
  line-height: 1.6;
  color: #3c3836;
}

.detail-block {
  padding: 14px 16px;
  border: 1px solid #ebdbb2;
  border-radius: 14px;
  background: #fbf1c7;
  box-shadow: 0 8px 18px rgba(29, 32, 33, 0.04);
}

.detail-block + .detail-block {
  margin-top: 12px;
}

.detail-block h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #3c3836;
}

.block-header {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0 0 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #3c3836;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.block-header svg {
  transition: transform 0.2s ease;
}

.block-header svg.rotated {
  transform: rotate(180deg);
}

.detail-list {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #3c3836;
  line-height: 1.5;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.add-to-cart-btn {
  background: #d79921;
  color: #1d2021;
  border: 1px solid #d79921;
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  align-self: flex-start;
  box-shadow: 0 8px 18px rgba(29, 32, 33, 0.12);
}

.add-to-cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(29, 32, 33, 0.16);
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .product-info h1 {
    font-size: 1.5rem;
  }
}
</style>
