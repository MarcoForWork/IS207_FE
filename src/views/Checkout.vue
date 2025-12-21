<template>
  <div>
    <Header />
    <Navbar />

    <main class="checkout-page">
      <div class="checkout-container">
        <div class="checkout-header">
          <h1 class="checkout-title">Thanh Toán</h1>
        </div>

        <div v-if="loading" class="empty-cart">
          <p class="empty-message">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="cartItems.length === 0" class="empty-cart">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p class="empty-message">Giỏ hàng của bạn đang trống</p>
          <router-link to="/products" class="continue-shopping-btn">Tiếp Tục Mua Sắm</router-link>
        </div>

        <div v-else class="checkout-content">
          <!-- Left -->
          <div class="checkout-main">
            <!-- Shipping Info -->
            <section class="checkout-section">
              <h2 class="section-title">
                <span class="section-number">1</span>
                Thông Tin Giao Hàng
              </h2>

              <div class="section-content">
                <div class="form-group">
                  <label for="address">Địa Chỉ</label>
                  <input
                    id="address"
                    v-model="form.shippingAddress"
                    type="text"
                    placeholder="Nhập địa chỉ"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="ward">Phường/Xã</label>
                  <input
                    id="ward"
                    v-model="form.shippingWard"
                    type="text"
                    placeholder="Nhập phường/xã"
                    class="form-input"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="district">Quận/Huyện</label>
                    <input
                      id="district"
                      v-model="form.shippingDistrict"
                      type="text"
                      placeholder="Nhập quận/huyện"
                      class="form-input"
                    />
                  </div>

                  <div class="form-group">
                    <label for="city">Thành Phố/Tỉnh</label>
                    <input
                      id="city"
                      v-model="form.shippingCity"
                      type="text"
                      placeholder="Nhập thành phố/tỉnh"
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="country">Quốc Gia</label>
                  <input
                    id="country"
                    v-model="form.shippingCountry"
                    type="text"
                    placeholder="Vietnam"
                    class="form-input"
                  />
                </div>

                <p v-if="addressSaving" style="margin: 6px 0 0; color: #7c6f64; font-size: 0.9rem">
                  Đang lưu địa chỉ...
                </p>
              </div>
            </section>

            <!-- Shipping Method -->
            <section class="checkout-section">
              <h2 class="section-title">
                <span class="section-number">2</span>
                Phương Thức Giao Hàng
              </h2>

              <div class="section-content">
                <div class="shipping-options">
                  <label class="shipping-option" v-for="option in shippingMethods" :key="option.id">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="form.shippingMethod"
                      name="shipping"
                    />
                    <div class="option-content">
                      <span class="option-title">{{ option.name }}</span>
                      <span class="option-desc">{{ option.description }}</span>
                      <span class="option-price">{{ formatPrice(option.price) }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <!-- Payment Method -->
            <section class="checkout-section">
              <h2 class="section-title">
                <span class="section-number">3</span>
                Phương Thức Thanh Toán
              </h2>

              <div class="section-content">
                <div class="payment-options">
                  <label class="payment-option" v-for="option in paymentMethods" :key="option.id">
                    <input
                      type="radio"
                      :value="option.id"
                      v-model="form.paymentMethod"
                      name="payment"
                    />
                    <div class="option-content">
                      <span class="option-title">{{ option.name }}</span>
                      <span class="option-desc">{{ option.description }}</span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <!-- Notes -->
            <section class="checkout-section">
              <h2 class="section-title">
                <span class="section-number">4</span>
                Ghi Chú Đơn Hàng
              </h2>

              <div class="section-content">
                <textarea
                  v-model="form.notes"
                  placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)"
                  class="form-textarea"
                ></textarea>
              </div>
            </section>
          </div>

          <!-- Right -->
          <aside class="checkout-summary">
            <div class="summary-card">
              <h3 class="summary-title">Tóm Tắt Đơn Hàng</h3>

              <div class="summary-items">
                <div v-for="item in cartItems" :key="item.id" class="summary-item">
                  <div class="summary-item-info">
                    <p class="summary-item-name">{{ item.name }}</p>
                    <p class="summary-item-qty">
                      x{{ item.quantity }}
                      <span v-if="item.color_name || item.size_name" style="opacity: 0.85">
                        • {{ item.color_name }} {{ item.size_name ? '• ' + item.size_name : '' }}
                      </span>
                    </p>
                  </div>
                  <p class="summary-item-price">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-row">
                <span>Tạm Tính:</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>

              <div class="summary-row">
                <span>Phí Giao Hàng:</span>
                <span>{{ formatPrice(shippingCost) }}</span>
              </div>

              <div class="summary-row total">
                <span>Tổng Cộng:</span>
                <span>{{ formatPrice(total) }}</span>
              </div>

              <button class="checkout-btn" @click="placeOrder" :disabled="placing">
                <span>{{ placing ? 'Đang xử lý...' : 'Đặt Hàng' }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none" />
                </svg>
              </button>

              <router-link to="/cart" class="back-to-cart">Quay Lại Giỏ Hàng</router-link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'
import { getAuthHeaders } from '@/config/api'

const router = useRouter()

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

const loading = ref(true)
const placing = ref(false)
const addressSaving = ref(false)

const cartItems = ref([])
const orderId = ref(null)

const form = ref({
  shippingAddress: '',
  shippingWard: '',
  shippingDistrict: '',
  shippingCity: '',
  shippingCountry: 'Vietnam',

  shippingMethod: 1, // default
  paymentMethod: 'cod',
  notes: '',
})

const shippingMethods = ref([
  { id: 1, name: 'Giao Hàng Tiêu Chuẩn', description: 'Giao trong 3-5 ngày', price: 30000 },
  { id: 2, name: 'Giao Hàng Nhanh', description: 'Giao trong 1-2 ngày', price: 60000 },
  { id: 3, name: 'Giao Hàng Hoả Tốc', description: 'Giao cùng ngày', price: 100000 },
])

const paymentMethods = ref([
  { id: 'cod', name: 'Thanh Toán Khi Nhận Hàng', description: 'COD - Thanh toán trực tiếp' },
  { id: 'bank', name: 'Chuyển Khoản Ngân Hàng', description: 'Chuyển tiền trước khi nhận hàng' },
  { id: 'card', name: 'Thẻ Tín Dụng/Ghi Nợ', description: 'Visa, Mastercard, v.v.' },
])

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

const shippingCost = computed(() => {
  const method = shippingMethods.value.find((m) => m.id === form.value.shippingMethod)
  return method ? method.price : 0
})

const total = computed(() => subtotal.value + shippingCost.value)

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) || 0)
}

function getLoggedInUserId() {
  const tryKeys = ['user', 'auth_user', 'currentUser', 'me']
  for (const k of tryKeys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const obj = JSON.parse(raw)
      if (obj?.id) return Number(obj.id)
      if (obj?.user?.id) return Number(obj.user.id)
    } catch (_) {}
  }
  const uid = localStorage.getItem('user_id')
  if (uid) return Number(uid)
  return null
}

function pickOrderFromResponse(json) {
  return json?.data || json?.order || json || null
}

async function fetchCart(userId) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}`, {
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
    },
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.message || `Load cart failed (${res.status})`
    throw new Error(msg)
  }
  return json
}

async function applyAddressToOrder(oid) {
  const res = await fetch(`${API_BASE}/api/orders/apply-address/${oid}`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.message || `Apply address failed (${res.status})`
    throw new Error(msg)
  }
  return json
}

async function getOrderById(oid) {
  const res = await fetch(`${API_BASE}/api/orders/${oid}`, {
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.message || `Get order failed (${res.status})`
    throw new Error(msg)
  }
  return json
}

async function postAddressOrder(oid) {
  addressSaving.value = true
  try {
    const payload = {
      shipping_address_line: form.value.shippingAddress,
      shipping_ward: form.value.shippingWard,
      shipping_district: form.value.shippingDistrict,
      shipping_city: form.value.shippingCity,
      shipping_country: form.value.shippingCountry,

      payment_method: form.value.paymentMethod,
      notes: form.value.notes,
    }

    const res = await fetch(`${API_BASE}/api/orders/checkout/${oid}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = json?.message || `Save address failed (${res.status})`
      throw new Error(msg)
    }
    return json
  } finally {
    addressSaving.value = false
  }
}

function hydrateFormFromOrder(order) {
  // chặn watcher bắn API lúc đang đổ dữ liệu
  isHydrating.value = true

  form.value.shippingAddress = order?.shipping_address_line || ''
  form.value.shippingWard = order?.shipping_ward || ''
  form.value.shippingDistrict = order?.shipping_district || ''
  form.value.shippingCity = order?.shipping_city || ''
  form.value.shippingCountry = order?.shipping_country || 'Vietnam'

  form.value.paymentMethod = order?.payment_method || form.value.paymentMethod
  form.value.notes = order?.notes || form.value.notes

  isHydrating.value = false
}

async function loadCheckout() {
  loading.value = true
  try {
    const userId = getLoggedInUserId()
    if (!userId) {
      cartItems.value = []
      alert('Bạn cần đăng nhập để thanh toán.')
      return
    }

    const cartJson = await fetchCart(userId)
    const items = Array.isArray(cartJson?.data) ? cartJson.data : []

    cartItems.value = items.map((it) => ({
      id: it.id, // order_item_id
      order_id: it.order_id,
      variant_id: it.variant_id,
      product_id: it.product_id,
      name: it.name,

      color_id: it.color_id,
      color_name: it.color_name,
      color_code: it.color_code,

      size_id: it.size_id,
      size_name: it.size_name,

      price: Number(it.price) || 0,
      quantity: Number(it.quantity) || 1,

      // ✅ dùng main_image bạn đã trả
      image: it.main_image || it.image || it.image_url || '',
    }))

    if (cartItems.value.length === 0) return

    // lấy order_id từ item đầu tiên
    orderId.value = cartItems.value[0].order_id

    // 1) apply default address vào order
    await applyAddressToOrder(orderId.value)

    // 2) fetch order để đổ địa chỉ lên form
    const orderJson = await getOrderById(orderId.value)
    const order = pickOrderFromResponse(orderJson)
    if (order) hydrateFormFromOrder(order)
  } catch (e) {
    console.error(e)
    cartItems.value = []
    alert(e.message || 'Không thể tải trang thanh toán')
  } finally {
    loading.value = false
  }
}

/** ===== Auto save address when user changes fields (debounce) ===== */
const isHydrating = ref(false)
let saveTimer = null

function scheduleSaveAddress() {
  if (!orderId.value) return
  if (isHydrating.value) return

  clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    try {
      await postAddressOrder(orderId.value)

      // nếu bạn muốn luôn refresh lại order sau khi lưu:
      // const orderJson = await getOrderById(orderId.value)
      // const order = pickOrderFromResponse(orderJson)
      // if (order) hydrateFormFromOrder(order)
    } catch (e) {
      console.error(e)
      alert(e.message || 'Không thể lưu địa chỉ')
    }
  }, 600)
}

watch(
  () => [
    form.value.shippingAddress,
    form.value.shippingWard,
    form.value.shippingDistrict,
    form.value.shippingCity,
    form.value.shippingCountry,
  ],
  () => scheduleSaveAddress()
)

async function placeOrder() {
  if (!orderId.value) return

  // validate tối thiểu
  if (!form.value.shippingAddress || !form.value.shippingCity) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng (ít nhất: Địa chỉ, Thành phố/Tỉnh).')
    return
  }

  placing.value = true
  try {
    // đảm bảo lưu địa chỉ mới nhất trước khi đặt
    await postAddressOrder(orderId.value)

    // TODO: nếu bạn có endpoint “finalize/pay/confirm order” thì gọi ở đây.
    // Ví dụ: await fetch(`${API_BASE}/api/orders/confirm/${orderId.value}`, ...)

    alert('Đã lưu thông tin đơn hàng. (Bạn có thể nối thêm API xác nhận/ thanh toán ở bước này)')
    router.push('/') // hoặc push sang trang success
  } catch (e) {
    console.error(e)
    alert(e.message || 'Không thể đặt hàng')
  } finally {
    placing.value = false
  }
}

onMounted(() => {
  loadCheckout()
})
</script>

<style scoped>
.checkout-page {
  padding: 24px 16px;
  width: 94vw;
  max-width: 1400px;
  margin: 0 auto;
  background: #fbf1c7;
  color: #3c3836;
}

.checkout-container {
  margin: 0 auto;
}

.checkout-header {
  margin-bottom: 32px;
}

.checkout-title {
  font-size: 2rem;
  font-weight: 600;
  color: #3c3836;
  margin: 0;
}

.empty-cart {
  text-align: center;
  padding: 80px 24px;
  background: white;
  border-radius: 12px;
}

.empty-cart svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message {
  font-size: 1.1rem;
  color: #7c6f64;
  margin-bottom: 24px;
}

.continue-shopping-btn {
  display: inline-block;
  padding: 12px 28px;
  background: #d79921;
  color: #1d2021;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}

.continue-shopping-btn:hover {
  background: #d65d0e;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 28px;
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.checkout-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #ebdbb2;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #3c3836;
  margin: 0 0 20px 0;
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #d79921;
  color: #1d2021;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.9rem;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  font-size: 0.95rem;
  color: #3c3836;
}

.form-input,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ebdbb2;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  color: #3c3836;
  background: #f9f5d7;
  transition: border 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #d79921;
  background: #fbf1c7;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.shipping-options,
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shipping-option,
.payment-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 2px solid #ebdbb2;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9f5d7;
}

.shipping-option:hover,
.payment-option:hover {
  border-color: #d79921;
}

.shipping-option input[type='radio'],
.payment-option input[type='radio'] {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d79921;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #3c3836;
}

.option-desc {
  font-size: 0.85rem;
  color: #7c6f64;
}

.option-price {
  font-weight: 600;
  color: #d79921;
  font-size: 0.95rem;
}

.checkout-summary {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #ebdbb2;
}

.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #3c3836;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #ebdbb2;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebdbb2;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-info {
  flex: 1;
}

.summary-item-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #3c3836;
  margin: 0;
  line-height: 1.2;
}

.summary-item-qty {
  font-size: 0.8rem;
  color: #7c6f64;
  margin: 2px 0 0 0;
}

.summary-item-price {
  font-weight: 600;
  color: #d79921;
  font-size: 0.9rem;
  white-space: nowrap;
}

.summary-divider {
  height: 2px;
  background: #ebdbb2;
  margin: 16px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #3c3836;
  margin-bottom: 8px;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #d79921;
  padding-top: 8px;
  border-top: 2px solid #ebdbb2;
  margin-top: 8px;
}

.checkout-btn {
  width: 100%;
  padding: 12px 16px;
  margin-top: 20px;
  background: #d79921;
  color: #1d2021;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.checkout-btn:hover {
  background: #d65d0e;
}

.checkout-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.back-to-cart {
  display: block;
  text-align: center;
  margin-top: 12px;
  padding: 10px;
  color: #7c6f64;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-to-cart:hover {
  color: #3c3836;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .checkout-page {
    padding: 16px 12px;
  }

  .checkout-title {
    font-size: 1.5rem;
  }

  .checkout-section {
    padding: 16px;
  }

  .summary-card {
    padding: 16px;
  }
}
</style>
