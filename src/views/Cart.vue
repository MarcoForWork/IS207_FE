<template>
  <div>
    <Header />
    <Navbar />

    <main class="cart-page">
      <div class="cart-container">
        <div class="cart-header">
          <h1 class="cart-title">Giỏ Hàng</h1>
          <span v-if="cartItems.length > 0" class="item-count">{{ cartItems.length }} sản phẩm</span>
        </div>

        <!-- Empty Cart State -->
        <div v-if="cartItems.length === 0" class="empty-cart">
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

        <!-- Cart Items -->
        <div v-else class="cart-content">
          <div class="cart-items">
            <div class="cart-items-header">
              <span class="header-product">Sản phẩm</span>
              <span class="header-price">Đơn giá</span>
              <span class="header-quantity">Số lượng</span>
              <span class="header-total">Thành tiền</span>
              <span class="header-action"></span>
            </div>

            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-product">
                <div class="item-image">
                  <!-- ✅ dùng main_image -->
                  <img :src="item.main_image || fallbackImage" :alt="item.name" />
                </div>

                <div class="item-info">
                  <h3 class="item-name">{{ item.name }}</h3>

                  <div class="item-meta">
                    <span class="meta-badge">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        :style="{ color: item.color_code || '#999' }"
                      >
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      {{ item.color_name }}
                    </span>

                    <span class="meta-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                      </svg>
                      {{ item.size_name }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="item-price">
                <p class="price-value">{{ formatPrice(item.price) }}</p>
              </div>

              <div class="item-quantity">
                <div class="quantity-control">
                  <button
                    class="qty-btn"
                    @click="decreaseQuantity(item.id)"
                    :disabled="item.quantity <= 1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13H5v-2h14v2z" />
                    </svg>
                  </button>

                  <input
                    type="number"
                    class="qty-input"
                    v-model.number="item.quantity"
                    @change="updateQuantity(item.id, item.quantity)"
                    min="1"
                  />

                  <button class="qty-btn" @click="increaseQuantity(item.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="item-total">
                <p class="total-value">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>

              <div class="item-remove">
                <button class="remove-btn" @click="removeItem(item.id)" title="Xóa sản phẩm">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="order-summary">
            <h2 class="summary-title">Tóm Tắt Đơn Hàng</h2>

            <div class="summary-row">
              <span>Tạm tính</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>

            <!-- Discount Code -->
            <div class="discount-section">
              <input
                v-model="discountCode"
                type="text"
                placeholder="Mã giảm giá"
                class="discount-input"
              />
              <button class="apply-discount-btn" @click="applyDiscount">Áp dụng</button>
            </div>

            <div v-if="discountAmount > 0" class="summary-row discount-row">
              <span>Giảm giá</span>
              <span class="discount-value">-{{ formatPrice(discountAmount) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span>Tổng cộng</span>
              <span class="total-amount">{{ formatPrice(total) }}</span>
            </div>

            <button class="checkout-btn" @click="goToCheckout">Thanh Toán</button>

            <router-link to="/products" class="continue-link"> ← Tiếp tục mua sắm </router-link>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'
import Footer from '@/components/global/Footer.vue'
import { getAuthHeaders } from '@/config/api'

const router = useRouter()

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

// Cart state
const cartItems = ref([])
const discountCode = ref('')
const discountAmount = ref(0)

// fallback ảnh
const fallbackImage = 'https://picsum.photos/seed/cart/800/800'

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

async function updateCartItemQuantityApi(itemId, quantity) {
  const res = await fetch(`${API_BASE}/api/orders/update-cart/${itemId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.message || `Update cart failed (${res.status})`
    throw new Error(msg)
  }
  return json
}


async function loadCart() {
  try {
    const userId = getLoggedInUserId()
    if (!userId) {
      cartItems.value = []
      alert('Bạn cần đăng nhập để xem giỏ hàng.')
      return
    }

    const res = await fetch(`${API_BASE}/api/cart/${userId}`, {
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      cartItems.value = []
      console.error('Load cart failed:', res.status)
      if (res.status === 401) alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
      return
    }

    const json = await res.json()
    const items = Array.isArray(json?.data) ? json.data : []

    cartItems.value = items.map((it) => ({
      id: it.id,
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

      // ✅ dùng đúng field từ API của bạn
      main_image: it.main_image || '',

      // nếu backend không trả stock thì set tạm lớn để không bị block nút +
      stock: Number(it.stock ?? 99),
    }))
  } catch (err) {
    console.error('Error loading cart:', err)
    cartItems.value = []
  }
}

// Computed
const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

const total = computed(() => subtotal.value - discountAmount.value)

// Methods
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    Number(price) || 0,
  )
}

async function increaseQuantity(itemId) {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (!item) return

  const prev = item.quantity
  const next = Math.min(prev + 1, Number(item.stock ?? 99))

  if (next === prev) return

  // Optimistic UI
  item.quantity = next

  try {
    await updateCartItemQuantityApi(itemId, next)
  } catch (e) {
    console.error(e)
    item.quantity = prev // rollback
    alert(e.message || 'Không thể cập nhật số lượng')
  }
}


async function decreaseQuantity(itemId) {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (!item) return

  const prev = item.quantity
  const next = Math.max(prev - 1, 1)

  if (next === prev) return

  item.quantity = next

  try {
    await updateCartItemQuantityApi(itemId, next)
  } catch (e) {
    console.error(e)
    item.quantity = prev
    alert(e.message || 'Không thể cập nhật số lượng')
  }
}

async function updateQuantity(itemId, newQuantity) {
  const item = cartItems.value.find((i) => i.id === itemId)
  if (!item) return

  const prev = item.quantity
  let q = Number(newQuantity)

  if (!Number.isFinite(q) || q < 1) q = 1
  const stock = Number(item.stock ?? 99)
  if (q > stock) q = stock

  if (q === prev) return

  item.quantity = q

  try {
    await updateCartItemQuantityApi(itemId, q)
  } catch (e) {
    console.error(e)
    item.quantity = prev
    alert(e.message || 'Không thể cập nhật số lượng')
  }
}

async function removeItem(orderItemId) {
  try {
    const res = await fetch(`${API_BASE}/api/orders/remove-from-cart/${orderItemId}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        Accept: 'application/json',
      },
    })

    const json = await res.json().catch(() => ({}))

    if (!res.ok) {
      console.error('Remove failed:', res.status, json)
      if (res.status === 401) alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
      else alert(json?.message || 'Xóa sản phẩm thất bại')
      return
    }

    // xóa trên UI luôn
    cartItems.value = cartItems.value.filter((i) => i.id !== orderItemId)
  } catch (e) {
    console.error('Remove error:', e)
    alert('Không thể kết nối server để xóa sản phẩm')
  }
}


async function applyDiscount() {
  if (!discountCode.value.trim()) return

  if (discountCode.value.toUpperCase() === 'SALE10') {
    discountAmount.value = Math.min(subtotal.value * 0.1, 50000)
    alert('Mã giảm giá đã được áp dụng!')
  } else {
    alert('Mã giảm giá không hợp lệ')
    discountAmount.value = 0
  }
}

async function saveCart() {
  // fallback lưu local (tuỳ bạn có muốn giữ)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

function goToCheckout() {
  if (cartItems.value.length === 0) return
  router.push('/checkout')
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.cart-page {
  background-color: #fbf1c7;
  min-height: calc(100vh - 200px);
  padding: 3rem 0;
}

.cart-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #d79921;
}

.cart-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #3c3836;
  margin: 0;
  letter-spacing: -0.025em;
}

.item-count {
  font-size: 1rem;
  font-weight: 500;
  color: #665c54;
  background-color: #f9f5d7;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ebdbb2;
}

/* Empty Cart */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(60, 56, 54, 0.1);
}

.empty-cart svg {
  color: #d79921;
  margin-bottom: 1.5rem;
}

.empty-message {
  font-size: 1.25rem;
  color: #3c3836;
  margin-bottom: 2rem;
}

.continue-shopping-btn {
  padding: 0.875rem 2rem;
  background-color: #d79921;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}

.continue-shopping-btn:hover {
  background-color: #b47c1a;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 2.5rem;
  align-items: start;
}

/* Cart Items */
.cart-items {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(60, 56, 54, 0.08);
  overflow: hidden;
  border: 1px solid #ebdbb2;
}

.cart-items-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 1fr 60px;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #3c3836 0%, #504945 100%);
  color: #fbf1c7;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  align-items: center;
}

.header-product {
  text-align: left;
}

.header-price,
.header-quantity,
.header-total {
  text-align: center;
}

.header-action {
  text-align: center;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr 1fr 60px;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f4e8d0;
  align-items: center;
  transition: background-color 0.2s ease;
}

.cart-item:hover {
  background-color: #fef8ed;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-product {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-image {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f5d7;
  border: 1px solid #ebdbb2;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-image:hover img {
  transform: scale(1.05);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #3c3836;
  margin: 0;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #665c54;
  background-color: #f9f5d7;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  border: 1px solid #ebdbb2;
  font-weight: 500;
}

.meta-badge svg {
  flex-shrink: 0;
}

.item-price {
  display: flex;
  justify-content: center;
  align-items: center;
}

.price-value {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #3c3836;
  margin: 0;
}

.item-quantity {
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-total {
  display: flex;
  justify-content: center;
  align-items: center;
}

.total-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #d79921;
  margin: 0;
}

.item-remove {
  display: flex;
  justify-content: center;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  gap: 0;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #d5c4a1;
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #3c3836;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background-color: #d79921;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 48px;
  height: 36px;
  text-align: center;
  border: none;
  border-left: 1px solid #ebdbb2;
  border-right: 1px solid #ebdbb2;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #3c3836;
  background-color: #fef8ed;
  appearance: textfield;
  -moz-appearance: textfield;
}

.qty-input:focus {
  outline: none;
  background-color: #f9f5d7;
}

.qty-input::-webkit-inner-spin-button,
.qty-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.remove-btn {
  background-color: transparent;
  border: 1px solid #ebdbb2;
  color: #928374;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #cc241d;
  color: white;
  border-color: #cc241d;
  transform: scale(1.05);
}

/* Order Summary */
.order-summary {
  position: sticky;
  top: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(60, 56, 54, 0.08);
  border: 1px solid #ebdbb2;
  padding: 2rem;
}

.summary-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #3c3836;
  margin: 0 0 1.75rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f4e8d0;
  letter-spacing: -0.025em;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 0;
  font-size: 0.9375rem;
  color: #3c3836;
}

.discount-section {
  display: flex;
  gap: 0.625rem;
  margin: 1.25rem 0;
  padding: 1.25rem;
  background-color: #fef8ed;
  border-radius: 8px;
  border: 1px dashed #d5c4a1;
}

.discount-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid #d5c4a1;
  border-radius: 6px;
  font-size: 0.9375rem;
  color: #3c3836;
  background-color: white;
  font-weight: 500;
  transition: all 0.2s ease;
}

.discount-input:focus {
  outline: none;
  border-color: #d79921;
  box-shadow: 0 0 0 3px rgba(215, 153, 33, 0.1);
}

.discount-input::placeholder {
  color: #928374;
}

.apply-discount-btn {
  padding: 0.875rem 1.25rem;
  background-color: #3c3836;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.apply-discount-btn:hover {
  background-color: #282828;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 56, 54, 0.2);
}

.discount-row {
  color: #98971a;
}

.discount-value {
  font-weight: 600;
}

.summary-divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #ebdbb2, transparent);
  margin: 1.25rem 0;
}

.total-row {
  padding: 1.25rem;
  margin: 0 -2rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fef8ed;
  font-size: 1.1875rem;
  font-weight: 700;
}

.total-amount {
  font-size: 1.75rem;
  color: #d79921;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.checkout-btn {
  width: 100%;
  padding: 1.125rem;
  margin-top: 1.75rem;
  background: linear-gradient(135deg, #d79921 0%, #b47c1a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(215, 153, 33, 0.3);
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(215, 153, 33, 0.4);
}

.checkout-btn:active {
  transform: translateY(0);
}

.continue-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: #665c54;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.continue-link:hover {
  color: #3c3836;
  gap: 0.75rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 2rem 0;
  }

  .cart-container {
    padding: 0 1rem;
  }

  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .cart-items-header {
    display: none;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.25rem;
  }

  .item-product {
    grid-column: 1;
  }

  .item-price,
  .item-quantity,
  .item-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-price::before {
    content: 'Đơn giá:';
    font-weight: 600;
    color: #665c54;
    font-size: 0.875rem;
  }

  .item-quantity::before {
    content: 'Số lượng:';
    font-weight: 600;
    color: #665c54;
    font-size: 0.875rem;
  }

  .item-total::before {
    content: 'Thành tiền:';
    font-weight: 600;
    color: #665c54;
    font-size: 0.875rem;
  }

  .item-price,
  .item-quantity,
  .item-total {
    text-align: left;
  }

  .quantity-control {
    margin: 0;
  }

  .item-remove {
    grid-column: 1;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #f4e8d0;
  }

  .order-summary {
    padding: 1.5rem;
  }

  .total-row {
    margin: 0 -1.5rem;
  }
}

@media (max-width: 480px) {
  .cart-title {
    font-size: 1.75rem;
  }

  .item-count {
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
  }

  .discount-section {
    flex-direction: column;
    padding: 1rem;
  }

  .apply-discount-btn {
    width: 100%;
  }

  .item-image {
    width: 70px;
    height: 70px;
  }
}
</style>
