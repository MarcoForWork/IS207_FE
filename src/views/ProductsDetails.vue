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

          <!-- Reviews Section -->
          <div class="reviews-section">
            <div class="reviews-header">
              <h2>Đánh giá sản phẩm</h2>
              <div class="rating-summary">
                <div class="average-rating">
                  <span class="rating-number">{{ averageRating }}</span>
                  <div class="stars">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="star"
                      :class="{ filled: star <= Math.round(averageRating) }"
                      >★</span
                    >
                  </div>
                  <span class="review-count">({{ reviews.length }} đánh giá)</span>
                </div>
              </div>
            </div>

            <!-- Write Review Form -->
            <div class="write-review" v-if="!showReviewForm">
              <button @click="showReviewForm = true" class="write-review-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Viết đánh giá
              </button>
            </div>

            <!-- Review Form -->
            <transition name="slide">
              <div v-if="showReviewForm" class="review-form">
                <h3>Viết đánh giá của bạn</h3>
                <div class="form-group">
                  <label>Đánh giá của bạn *</label>
                  <div class="star-rating">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="star-input"
                      :class="{ filled: star <= newReview.rating, hover: star <= hoverRating }"
                      @click="newReview.rating = star"
                      @mouseenter="hoverRating = star"
                      @mouseleave="hoverRating = 0"
                      >★</span
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="review-name">Tên của bạn *</label>
                  <input
                    type="text"
                    id="review-name"
                    v-model="newReview.name"
                    placeholder="Nhập tên của bạn"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="review-comment">Nhận xét *</label>
                  <textarea
                    id="review-comment"
                    v-model="newReview.comment"
                    rows="4"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    required
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button
                    @click="submitReview"
                    class="submit-review-btn"
                    :disabled="!canSubmitReview"
                  >
                    Gửi đánh giá
                  </button>
                  <button @click="cancelReview" class="cancel-btn">Hủy</button>
                </div>
              </div>
            </transition>

            <!-- Reviews List -->
            <div class="reviews-list">
              <div class="reviews-filter">
                <button
                  @click="filterRating = null"
                  :class="{ active: filterRating === null }"
                  class="filter-btn"
                >
                  Tất cả ({{ reviews.length }})
                </button>
                <button
                  v-for="rating in [5, 4, 3, 2, 1]"
                  :key="rating"
                  @click="filterRating = rating"
                  :class="{ active: filterRating === rating }"
                  class="filter-btn"
                >
                  {{ rating }} ★ ({{ reviewsByRating(rating) }})
                </button>
              </div>

              <div class="review-items">
                <div v-for="review in filteredReviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">{{ review.name.charAt(0).toUpperCase() }}</div>
                      <div>
                        <h4 class="reviewer-name">{{ review.name }}</h4>
                        <div class="review-stars">
                          <span
                            v-for="star in 5"
                            :key="star"
                            class="star"
                            :class="{ filled: star <= review.rating }"
                            >★</span
                          >
                        </div>
                      </div>
                    </div>
                    <span class="review-date">{{ review.date }}</span>
                  </div>
                  <p class="review-comment">{{ review.comment }}</p>
                  <div class="review-actions">
                    <button class="helpful-btn" @click="markHelpful(review.id)">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                        ></path>
                      </svg>
                      Hữu ích ({{ review.helpful || 0 }})
                    </button>
                    <button
                      v-if="isMyReview(review)"
                      class="delete-btn"
                      @click="deleteReview(review.id)"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        ></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>

                <div v-if="filteredReviews.length === 0" class="no-reviews">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <p>Chưa có đánh giá nào{{ filterRating ? ` ${filterRating} sao` : '' }}.</p>
                </div>
              </div>
            </div>
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
import { buildUrl, API_ENDPOINTS, getAuthHeaders } from '@/config/api'

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const loading = ref(false)
const currentUser = ref(null)
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

// Review-related state
const reviews = ref([
  {
    id: 1,
    user_id: 1, // This would match the logged-in user for testing
    name: 'Minh Anh',
    rating: 5,
    comment:
      'Sản phẩm chất lượng tuyệt vời! Vải mềm mại, thoáng mát. Đóng gói cẩn thận, giao hàng nhanh.',
    date: '15/12/2025',
    helpful: 12,
  },
  {
    id: 2,
    user_id: 2,
    name: 'Thu Hà',
    rating: 4,
    comment: 'Áo đẹp, form chuẩn. Mình mặc size M vừa vặn. Màu sắc giống hình. Giá hợp lý.',
    date: '12/12/2025',
    helpful: 8,
  },
  {
    id: 3,
    user_id: 3,
    name: 'Quang Dũng',
    rating: 5,
    comment:
      'Rất hài lòng với sản phẩm này. Chất liệu cotton thoáng, không bị xù lông sau vài lần giặt.',
    date: '10/12/2025',
    helpful: 5,
  },
  {
    id: 4,
    user_id: 4,
    name: 'Lan Phương',
    rating: 3,
    comment: 'Sản phẩm tạm ổn, nhưng màu sắc không được sống động như mình mong đợi.',
    date: '08/12/2025',
    helpful: 2,
  },
  {
    id: 5,
    user_id: 5,
    name: 'Hoàng Nam',
    rating: 5,
    comment: 'Mua lần 2 rồi, chất lượng ổn định. Giá cả hợp lý. Sẽ tiếp tục ủng hộ shop!',
    date: '05/12/2025',
    helpful: 15,
  },
])
const showReviewForm = ref(false)
const newReview = ref({
  rating: 0,
  name: '',
  comment: '',
})
const hoverRating = ref(0)
const filterRating = ref(null)

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

// Review computed properties and methods
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return (sum / reviews.value.length).toFixed(1)
})

const filteredReviews = computed(() => {
  if (filterRating.value === null) {
    return reviews.value
  }
  return reviews.value.filter((review) => review.rating === filterRating.value)
})

const canSubmitReview = computed(() => {
  return (
    newReview.value.rating > 0 &&
    newReview.value.name.trim() !== '' &&
    newReview.value.comment.trim() !== ''
  )
})

function isMyReview(review) {
  if (!currentUser.value || !review.user_id) return false
  return currentUser.value.id === review.user_id
}

function reviewsByRating(rating) {
  return reviews.value.filter((review) => review.rating === rating).length
}

function submitReview() {
  if (!canSubmitReview.value) return

  const review = {
    id: reviews.value.length + 1,
    name: newReview.value.name,
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    date: new Date().toLocaleDateString('vi-VN'),
    helpful: 0,
  }

  reviews.value.unshift(review)

  // Reset form
  newReview.value = {
    rating: 0,
    name: '',
    comment: '',
  }
  showReviewForm.value = false

  // TODO: Send to API
  // await fetch(`/api/products/${productId}/reviews`, {
  //   method: 'POST',
  //   body: JSON.stringify(review)
  // })
}

function cancelReview() {
  newReview.value = {
    rating: 0,
    name: '',
    comment: '',
  }
  showReviewForm.value = false
}

function markHelpful(reviewId) {
  const review = reviews.value.find((r) => r.id === reviewId)
  if (review) {
    review.helpful = (review.helpful || 0) + 1
    // TODO: Send to API
  }
}

async function deleteReview(reviewId) {
  if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
    return
  }

  try {
    // Call API to delete review
    const response = await fetch(buildUrl(API_ENDPOINTS.REVIEWS.DELETE(reviewId)), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (response.ok) {
      // Remove review from local state
      reviews.value = reviews.value.filter((r) => r.id !== reviewId)
      alert('Đã xóa đánh giá thành công!')
    } else {
      throw new Error('Không thể xóa đánh giá')
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    alert('Có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại.')
  }
}

async function fetchMyReviews() {
  if (!currentUser.value) return

  try {
    const response = await fetch(
      buildUrl(API_ENDPOINTS.REVIEWS.GET_MY_REVIEWS(currentUser.value.id)),
      {
        headers: getAuthHeaders(),
      },
    )

    if (response.ok) {
      const myReviews = await response.json()
      // You can use this to highlight or filter user's reviews
      console.log('My reviews:', myReviews)
    }
  } catch (error) {
    console.error('Error fetching my reviews:', error)
  }
}

function checkCurrentUser() {
  const userInfo = localStorage.getItem('user-info')
  if (userInfo) {
    try {
      currentUser.value = JSON.parse(userInfo)
    } catch (e) {
      currentUser.value = null
    }
  }
}

onMounted(() => {
  checkCurrentUser()
  fetchProductDetails()
  fetchMyReviews() // Uncomment if you want to fetch user's reviews on load
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

/* Reviews Section Styles */
.reviews-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #ebdbb2;
}

.reviews-header {
  margin-bottom: 1.5rem;
}

.reviews-header h2 {
  font-size: 1.5rem;
  color: #3c3836;
  margin: 0 0 1rem 0;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rating-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d79921;
  line-height: 1;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.star {
  color: #d5c4a1;
  font-size: 1.25rem;
}

.star.filled {
  color: #d79921;
}

.review-count {
  color: #665c54;
  font-size: 0.95rem;
}

.write-review {
  margin: 1.5rem 0;
}

.write-review-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 2px solid #d79921;
  color: #d79921;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.write-review-btn:hover {
  background: #d79921;
  color: #1d2021;
}

.write-review-btn svg {
  stroke: currentColor;
}

.review-form {
  background: #fbf1c7;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #ebdbb2;
  margin-bottom: 2rem;
}

.review-form h3 {
  margin: 0 0 1rem 0;
  color: #3c3836;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3c3836;
  font-weight: 600;
  font-size: 0.95rem;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-input {
  color: #d5c4a1;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.star-input.filled,
.star-input.hover {
  color: #d79921;
  transform: scale(1.1);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d5c4a1;
  border-radius: 8px;
  background: #f9f5d7;
  color: #3c3836;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d79921;
  box-shadow: 0 0 0 3px rgba(215, 153, 33, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.submit-review-btn {
  background: #d79921;
  color: #1d2021;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-review-btn:hover:not(:disabled) {
  background: #b8860b;
  transform: translateY(-1px);
}

.submit-review-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #928374;
  color: #665c54;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #ebdbb2;
}

.reviews-filter {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  background: #f9f5d7;
  border: 1px solid #d5c4a1;
  color: #665c54;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  background: #ebdbb2;
}

.filter-btn.active {
  background: #d79921;
  color: #1d2021;
  border-color: #d79921;
  font-weight: 600;
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.review-item {
  background: #fbf1c7;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #ebdbb2;
  transition: all 0.2s ease;
}

.review-item:hover {
  box-shadow: 0 4px 12px rgba(60, 56, 54, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.reviewer-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #d79921;
  color: #1d2021;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.reviewer-name {
  margin: 0;
  color: #3c3836;
  font-size: 1rem;
  font-weight: 600;
}

.review-stars {
  display: flex;
  gap: 0.2rem;
  margin-top: 0.25rem;
}

.review-stars .star {
  font-size: 0.95rem;
}

.review-date {
  color: #928374;
  font-size: 0.85rem;
}

.review-comment {
  color: #504945;
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.review-actions {
  display: flex;
  gap: 1rem;
}

.helpful-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid #d5c4a1;
  color: #665c54;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.helpful-btn:hover {
  background: #ebdbb2;
  border-color: #d79921;
  color: #d79921;
}

.helpful-btn svg {
  stroke: currentColor;
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid #fb4934;
  color: #fb4934;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #fb4934;
  color: #fbf1c7;
}

.delete-btn svg {
  stroke: currentColor;
}

.no-reviews {
  text-align: center;
  padding: 3rem 2rem;
  color: #928374;
}

.no-reviews svg {
  stroke: #d5c4a1;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-reviews p {
  margin: 0;
  font-size: 1rem;
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

  .reviews-filter {
    gap: 0.5rem;
  }

  .filter-btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.75rem;
  }

  .rating-number {
    font-size: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .submit-review-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>
