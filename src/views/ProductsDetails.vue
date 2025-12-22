<template>
  <div>
    <Header />
    <Navbar />

    <main class="product-detail">
      <button class="back" @click="$router.back()">← Quay lại</button>

      <section v-if="loading" class="loading">
        <p>Đang tải sản phẩm...</p>
      </section>

      <template v-else>
        <section v-if="product" class="product-content">
          <!-- LEFT: Sticky images -->
          <div class="product-images">
            <div class="main-image">
              <img :src="selectedImage || fallbackImage" :alt="product.name" />
            </div>

            <div class="image-thumbnails" v-if="product.colors?.length">
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

          <!-- RIGHT: Info -->
          <div class="product-info">
            <h1>{{ product.name }}</h1>
            <p class="category">{{ product.category?.name }}</p>

            <div class="price-section">
              <p class="price">{{ formatPrice(finalPrice(product)) }}</p>

              <p v-if="Number(product.discount_percent) > 0" class="old-price">
                {{ formatPrice(product.base_price) }}
              </p>

              <span v-if="Number(product.discount_percent) > 0" class="discount-badge">
                -{{ product.discount_percent }}%
              </span>
            </div>

            <div class="meta-row" v-if="product.collection">
              <span class="meta-label">Bộ sưu tập:</span>
              <span class="meta-value">{{ product.collection.name }}</span>
            </div>

            <div class="color-selector" v-if="product.colors?.length">
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
                <button class="qty-btn" @click="decreaseQuantity" :disabled="quantity <= 1">
                  -
                </button>
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

            <!-- Accordions -->
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
                <div v-show="openSections.highlights" class="highlight-list">
                  <div v-for="item in highlights.slice(0, 4)" :key="item.id" class="highlight-item">
                    <img
                      class="highlight-img"
                      :src="toAbsoluteUrl(item.image_url)"
                      :alt="item.title"
                    />
                    <div class="highlight-text">
                      <div class="highlight-title">{{ item.title }}</div>
                      <div class="highlight-desc">{{ item.description }}</div>
                    </div>
                  </div>

                  <div v-if="!highlights.length" class="empty-text">Chưa có điểm nổi bật.</div>
                </div>
              </transition>
            </div>

            <div class="detail-block">
              <button class="block-header" @click="openSections.care = !openSections.care">
                <span>Câu hỏi thường gặp</span>
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
                <div v-show="openSections.care" class="faq-list">
                  <div v-for="faq in faqs.slice(0, 4)" :key="faq.id" class="faq-item">
                    <div class="faq-q">{{ faq.question }}</div>
                    <div class="faq-a">{{ faq.answer }}</div>
                  </div>

                  <div v-if="!faqs.length" class="empty-text">Chưa có câu hỏi thường gặp.</div>
                </div>
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

            <!-- <div class="detail-block" v-if="faqs.length">
              <button class="block-header" @click="openSections.faqs = !openSections.faqs">
                <span>Hỏi đáp</span>
                <svg width="16" height="16" viewBox="0 0 24 24" :class="{ rotated: openSections.faqs }">
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
            </div> -->
          </div>
        </section>

        <section v-else class="not-found">
          <p>Sản phẩm không tìm thấy.</p>
        </section>

        <!-- RELATED PRODUCTS (full width, nằm dưới product-content) -->
        <section v-if="product && relatedLoading" class="related-wrap">
          <h2 class="related-title">Sản phẩm liên quan</h2>
          <div class="related-loading">Đang tải sản phẩm liên quan...</div>
        </section>

        <section v-else-if="product && relatedProducts.length" class="related-wrap">
          <h2 class="related-title">Sản phẩm liên quan</h2>

          <div class="related-grid">
            <article v-for="rp in relatedProducts" :key="rp.id" class="related-card">
              <!-- chỉnh lại path route nếu dự án bạn khác -->
              <router-link class="related-link" :to="`/products/${rp.id}`">
                <div class="related-img">
                  <img :src="rp.image || fallbackImage" :alt="rp.name" />
                </div>

                <div class="related-info">
                  <div class="related-name">{{ rp.name }}</div>

                  <div class="related-price">
                    <span class="rp-new">{{ formatPrice(finalPrice(rp)) }}</span>
                    <span v-if="Number(rp.discount_percent) > 0" class="rp-old">
                      {{ formatPrice(rp.base_price) }}
                    </span>
                  </div>
                </div>
              </router-link>
            </article>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'

const route = useRoute()
const productId = computed(() => String(route.params.id || ''))

/** base URL backend
 *  - nếu bạn có VITE_API_BASE_URL thì set trong .env: VITE_API_BASE_URL=http://127.0.0.1:8000
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const product = ref(null)
const loading = ref(false)

const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedImage = ref('')
const quantity = ref(1)

const highlights = ref([])
const faqs = ref([])

const openSections = ref({
  highlights: false,
  care: false, // mục này sẽ đổi thành "Câu hỏi thường gặp"
  shipping: false,
  faqs: false,
})

const availableSizes = ref([
  { id: 1, size_name: 'S', sort_order: 1 },
  { id: 2, size_name: 'M', sort_order: 2 },
  { id: 3, size_name: 'L', sort_order: 3 },
  { id: 4, size_name: 'XL', sort_order: 4 },
])

// Related
const relatedProducts = ref([])
const relatedLoading = ref(false)

// fallback ảnh
const fallbackImage = 'https://picsum.photos/seed/fallback/800/800'

// ---------- helpers ----------
function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  const s = String(pathOrUrl)
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return `${API_BASE}${s.startsWith('/') ? '' : '/'}${s}`
}

function flattenData(maybeNested) {
  if (!Array.isArray(maybeNested)) return []
  // nếu data: [ [ ... ] ]
  if (maybeNested.length && Array.isArray(maybeNested[0])) return maybeNested.flat()
  return maybeNested
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  return await res.json().catch(() => null)
}

function finalPrice(p) {
  const base = Number(p?.base_price ?? 0)
  const disc = Number(p?.discount_percent ?? 0)
  if (!base) return 0
  if (disc > 0) return Math.round(base * (1 - disc / 100))
  return base
}

function formatPrice(p) {
  if (p == null) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)
}

function getLoggedInUserId() {
  // Cố gắng lấy từ localStorage (tuỳ dự án bạn lưu kiểu gì)
  const rawUser =
    localStorage.getItem('user') ||
    localStorage.getItem('auth_user') ||
    localStorage.getItem('current_user')

  if (rawUser) {
    try {
      const u = JSON.parse(rawUser)
      return Number(u?.id || u?.user?.id || u?.data?.id) || null
    } catch (_) {}
  }

  const rawId = localStorage.getItem('user_id')
  if (rawId) return Number(rawId) || null

  return null
}

// ---------- main fetch ----------
async function postJson(url, body) {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token') || ''
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = data?.message || data?.error || 'Thêm vào giỏ hàng thất bại'
    throw new Error(msg)
  }
  return data
}

async function fetchProductDetails(id) {
  loading.value = true
  try {
    // 1) product info
    const pj = await fetchJson(`${API_BASE}/api/products/${id}`)
    const p = pj?.data || null
    product.value = p

    // 1.1) highlights + faqs
    const [hj, fj] = await Promise.all([
      fetchJson(`${API_BASE}/api/products-highlights/${id}`),
      fetchJson(`${API_BASE}/api/products-faqs/${id}`),
    ])

    // ---- highlights: hỗ trợ nhiều kiểu response ----
    const hs =
      (Array.isArray(hj?.highlights) && hj.highlights) ||
      (Array.isArray(hj?.data?.highlights) && hj.data.highlights) ||
      (Array.isArray(hj?.data) && hj.data) ||
      []

    highlights.value = hs.map((h) => ({
      id: h.id,
      title: h.title,
      description: h.description,
      image_url: h.image_url, // giữ raw, render sẽ toAbsoluteUrl ở template
      sort_order: h.sort_order,
    }))

    if (!hj) console.warn('Highlights API failed:', `${API_BASE}/api/products-highlights/${id}`)

    // ---- faqs: hỗ trợ nhiều kiểu response ----
    const fq =
      (Array.isArray(fj?.faqs) && fj.faqs) ||
      (Array.isArray(fj?.data?.faqs) && fj.data.faqs) ||
      (Array.isArray(fj?.data) && fj.data) ||
      []

    faqs.value = fq.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      sort_order: f.sort_order,
    }))

    if (!fj) console.warn('Faqs API failed:', `${API_BASE}/api/products-faqs/${id}`)

    // 2) products-by-color (dùng để lấy ảnh cho product hiện tại + related)
    relatedLoading.value = true
    const cj = await fetchJson(`${API_BASE}/api/products-by-color/${id}`)
    const rows = flattenData(cj?.data || [])

    // colors của chính sản phẩm hiện tại
    const myColors = rows
      .filter((r) => String(r.product_id) === String(id))
      .map((r) => ({
        id: r.id,
        color_name: r.color_name,
        color_code: r.color_code,
        main_image: toAbsoluteUrl(r.main_image),
      }))

    if (product.value) {
      product.value.colors = myColors
    }

    // set ảnh mặc định
    selectedColor.value = myColors[0] || null
    selectedImage.value = myColors[0]?.main_image || ''

    // related product ids (khác id hiện tại)
    const idSet = new Set(
      rows.map((r) => String(r.product_id)).filter((pid) => pid && pid !== String(id)),
    )

    // map ảnh theo product_id (lấy cái đầu tiên)
    const imageByProductId = {}
    for (const r of rows) {
      const pid = String(r.product_id)
      if (!pid || pid === String(id)) continue
      if (!imageByProductId[pid] && r.main_image) {
        imageByProductId[pid] = toAbsoluteUrl(r.main_image)
      }
    }

    // fetch info từng product liên quan (name + price)
    const ids = Array.from(idSet)
    const infos = await Promise.all(
      ids.map(async (pid) => {
        const j = await fetchJson(`${API_BASE}/api/products/${pid}`)
        const rp = j?.data
        if (!rp) return null
        return {
          id: rp.id,
          name: rp.name,
          base_price: rp.base_price,
          discount_percent: rp.discount_percent ?? 0,
          image: imageByProductId[String(rp.id)] || '',
        }
      }),
    )

    relatedProducts.value = infos.filter(Boolean)
  } catch (e) {
    console.error(e)
    product.value = null
    relatedProducts.value = []
  } finally {
    loading.value = false
    relatedLoading.value = false
  }
}

function selectColor(color) {
  selectedColor.value = color
  selectedImage.value = color.main_image
}

function increaseQuantity() {
  if (quantity.value < 99) quantity.value++
}
function decreaseQuantity() {
  if (quantity.value > 1) quantity.value--
}

async function addToCart() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const userId = user?.id

  if (!token || !userId) {
    window.alert('Bạn cần đăng nhập để thêm vào giỏ hàng.')
    return
  }

  if (!selectedColor.value?.id) {
    window.alert('Vui lòng chọn màu sắc')
    return
  }
  if (!selectedSize.value?.id) {
    window.alert('Vui lòng chọn kích thước')
    return
  }

  const payload = {
    user_id: userId,
    color_id: selectedColor.value.id, // ID trong bảng color
    size_id: selectedSize.value.id, // 1-5 theo thứ tự bạn set
    product_id: product.value.id,
    quantity: quantity.value,
  }

  const res = await fetch(`${API_BASE}/api/orders/add-to-cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    console.log('add-to-cart error:', data)
    window.alert(data?.message || 'Thêm vào giỏ hàng thất bại')
    return
  }

  window.alert('Đã thêm vào giỏ hàng')
}

// auto refetch khi click related product (route param đổi)
watch(
  productId,
  (id) => {
    // reset nhẹ
    product.value = null
    relatedProducts.value = []
    selectedImage.value = ''
    selectedColor.value = null
    selectedSize.value = null
    quantity.value = 1
    fetchProductDetails(id)
  },
  { immediate: true },
)
</script>

<style scoped>
/* Highlights (thẻ trắng có hình) */
.highlight-list {
  display: grid;
  gap: 12px;
}

.highlight-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.highlight-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  flex: 0 0 56px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
}

.highlight-title {
  font-weight: 800;
  margin-bottom: 4px;
  color: #000000;
}

.highlight-desc {
  color: #808080;
  line-height: 1.45;
}

/* FAQs */
.faq-list {
  display: grid;
  gap: 12px;
}

.faq-item {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
}

.faq-q {
  font-weight: 800;
  margin-bottom: 6px;
  color: #000000;
}

.faq-a {
  color: #808080;
  line-height: 1.5;
}

.empty-text {
  color: #808080;
  padding: 6px 0;
}

.product-detail {
  --sticky-top: 120px;

  padding: 28px 16px 40px 16px;
  max-width: 1180px;
  margin: 0 auto;
  background: #ffffff;
  color: #000000;
}

.back {
  background: transparent;
  border: 1px solid #e0e0e0;
  color: #000000;
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
  border-color: #000000;
  background: #f5f5f5;
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
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

  align-items: start;
}

.product-images {
  position: sticky;
  top: var(--sticky-top);
  align-self: start;

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
  padding-bottom: 4px;
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

.image-thumbnails img.active {
  border-color: #000000;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-info h1 {
  font-size: 2.1rem;
  margin: 0;
  color: #000000;
  letter-spacing: -0.01em;
}

.category {
  color: #808080;
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
  color: #000000;
  margin: 0;
}

.old-price {
  font-size: 1.05rem;
  color: #808080;
  text-decoration: line-through;
  margin: 0;
}

.discount-badge {
  background: #000000;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.meta-row {
  display: flex;
  gap: 8px;
  color: #000000;
}

.meta-label {
  color: #808080;
  font-weight: 600;
}

.color-selector h3,
.size-selector h3,
.description h3 {
  font-size: 1.05rem;
  margin: 0 0 10px 0;
  color: #000000;
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
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.color-option:hover {
  border-color: #000000;
}

.color-option.active {
  border-color: #000000;
  background: #f5f5f5;
}

.color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.size-option {
  padding: 10px 18px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.97rem;
  transition: all 0.2s ease;
  color: #000000;
}

.size-option:hover {
  border-color: #000000;
}

.size-option.active {
  border-color: #000000;
  background: #000000;
  color: #ffffff;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  color: #000000;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-input {
  width: 70px;
  height: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #ffffff;
  color: #000000;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.description p {
  line-height: 1.6;
  color: #000000;
}

.add-to-cart-btn {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  align-self: flex-start;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.add-to-cart-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.16);
  background: #333333;
}

.detail-block {
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.04);
}

.detail-block + .detail-block {
  margin-top: 12px;
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
  color: #000000;
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
  color: #000000;
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

/* -------- related products ---------- */
.related-wrap {
  margin-top: 28px;
  padding: 0 6px;
}

.related-title {
  margin: 0 0 16px 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #000000;
}

.related-loading {
  padding: 18px 0;
  color: #808080;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.related-card {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  overflow: hidden;
}

.related-link {
  text-decoration: none;
  color: inherit;
  display: grid;
  grid-template-rows: auto 1fr;
}

.related-img {
  background: #eee;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.related-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  padding: 12px 12px 14px 12px;
  display: grid;
  gap: 8px;
}

.related-name {
  font-size: 0.95rem;
  line-height: 1.3;
  color: #000000;
  min-height: 2.4em;
}

.related-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.rp-new {
  font-weight: 700;
  color: #000000;
}

.rp-old {
  color: #808080;
  text-decoration: line-through;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .related-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .product-images {
    position: static;
    top: auto;
  }

  .product-info h1 {
    font-size: 1.5rem;
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
