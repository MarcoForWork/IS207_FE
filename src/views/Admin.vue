<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="brand">
        <div class="brand-logo">C</div>
        <div class="brand-text">
          <div class="brand-name">IS207</div>
          <div class="brand-sub">Admin</div>
        </div>

        <button class="sidebar-close" @click="sidebarOpen = false" aria-label="Close sidebar">
          ✕
        </button>
      </div>

      <nav class="nav">
        <button
          v-for="item in menu"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeTab === item.id }"
          @click="selectTab(item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>

        <div class="nav-divider"></div>

        <button class="nav-item danger" @click="handleLogout">
          <span class="nav-icon">↩</span>
          <span class="nav-label">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <!-- TOPBAR -->
      <header class="topbar">
        <button class="hamburger" @click="sidebarOpen = true" aria-label="Open sidebar">☰</button>

        <div class="topbar-title">
          <h1 class="page-title">Dashboard</h1>
          <div class="page-subtitle">{{ currentLabel }}</div>
        </div>

        <div class="topbar-right">
          <button class="icon-btn" title="Theme">☾</button>
          <button class="icon-btn" title="Settings">⚙</button>

          <div class="profile">
            <div class="profile-text">
              <div class="profile-name">{{ adminName }}</div>
              <div class="profile-role">Admin</div>
            </div>
            <div class="avatar">{{ adminInitial }}</div>
          </div>
        </div>
      </header>

      <!-- CONTENT -->
      <main class="content">
        <div class="content-card">
          <div class="content-card-header">
            <h2 class="content-title">{{ currentLabel }}</h2>
          </div>

          <div class="content-body">
            <component :is="componentMap[activeTab]" />
          </div>
        </div>
      </main>
    </div>

    <!-- Overlay when sidebar open on mobile -->
    <div v-if="sidebarOpen" class="overlay" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

/* Existing modules */
import CategoryManagement from '@/components/admin/CategoryManagement.vue'
import CollectionManagement from '@/components/admin/CollectionManagement.vue'
import ProductManagement from '@/components/admin/ProductManagement.vue'
import ProductImageManagement from '@/components/admin/ProductImageManagement.vue'
import ProductDiscountManagement from '@/components/admin/ProductDiscountManagement.vue'
import ProductColorManagement from '@/components/admin/ProductColorManagement.vue'
import ProductFaqManagement from '@/components/admin/ProductFaqManagement.vue'
import ProductHighlightManagement from '@/components/admin/ProductHighlightManagement.vue'
import OrderManagement from '@/components/admin/OrderManagement.vue'

/* NEW: bạn cần tạo 2 file này (hoặc đổi sang component bạn đang có) */
import CustomersManagement from '@/components/admin/CustomersManagement.vue'
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard.vue'

const router = useRouter()
const sidebarOpen = ref(false)

/* default tab */
const activeTab = ref('analytics') // NEW: Mặc định mở tab Analytics

/* map tab -> component */
const componentMap = {
  analytics: AnalyticsDashboard, // NEW
  customers: CustomersManagement, // NEW
  categories: CategoryManagement,
  collections: CollectionManagement,
  products: ProductManagement,
  'product-images': ProductImageManagement,
  discounts: ProductDiscountManagement,
  colors: ProductColorManagement,
  faqs: ProductFaqManagement,
  highlights: ProductHighlightManagement,
  orders: OrderManagement,
}

/* sidebar menu (giống bố cục dashboard trắng) */
const menu = [
  { id: 'analytics', label: 'Analytics', icon: '📈' }, // NEW
  { id: 'customers', label: 'Customers', icon: '👤' }, // NEW
  { id: 'categories', label: 'Categories', icon: '▦' },
  { id: 'collections', label: 'Collections', icon: '⧉' },
  { id: 'products', label: 'Products', icon: '▣' },
  { id: 'product-images', label: 'Product Images', icon: '🖼' },
  { id: 'discounts', label: 'Discounts', icon: '％' },
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'faqs', label: 'FAQs', icon: '?' },
  { id: 'highlights', label: 'Highlights', icon: '★' },
  { id: 'orders', label: 'Orders', icon: '🧾' },
]

const currentLabel = computed(() => {
  const found = menu.find((m) => m.id === activeTab.value)
  return found?.label || 'Dashboard'
})

const adminName = computed(() => {
  try {
    const u = JSON.parse(localStorage.getItem('user-info') || '{}')
    return u?.name || 'Admin'
  } catch {
    return 'Admin'
  }
})

const adminInitial = computed(() => (adminName.value?.trim()?.[0] || 'A').toUpperCase())

function selectTab(id) {
  activeTab.value = id
  sidebarOpen.value = false
}

function handleLogout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user-info')
  router.push('/login')
}
</script>

<style scoped>
/* ====== LAYOUT ====== */
.admin-layout {
  min-height: 100vh;
  display: flex;
  background: #ffffff;
  color: #000000;
  position: relative;
}

/* ====== SIDEBAR ====== */
.sidebar {
  width: 260px;
  background: #000000;
  border-right: 1px solid #000000;
  padding: 18px 14px;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px 14px;
  border-bottom: 1px solid #333333;
  margin-bottom: 12px;
  position: relative;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #ffffff;
  color: #000000;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #ffffff;
}

.brand-name {
  font-weight: 800;
  letter-spacing: 0.03em;
}

.brand-sub {
  font-size: 12px;
  color: #e0e0e0;
}

.sidebar-close {
  display: none;
  position: absolute;
  right: 8px;
  top: 8px;
  border: none;
  background: #333333;
  color: #ffffff;
  border-radius: 10px;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 6px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  color: #e0e0e0;
  font-weight: 600;
}

.nav-item:hover {
  background: #333333;
  border-color: #808080;
}

.nav-item.active {
  background: #ffffff;
  border-color: #ffffff;
  color: #000000;
}

.nav-item.danger {
  color: #e0e0e0;
}
.nav-item.danger:hover {
  background: #333333;
  border-color: #808080;
}

.nav-icon {
  width: 22px;
  display: inline-flex;
  justify-content: center;
  opacity: 0.9;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: #ffffff;
  color: #000000;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.nav-divider {
  height: 1px;
  background: #333333;
  margin: 10px 6px;
}

/* ====== MAIN ====== */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ====== TOPBAR ====== */
.topbar {
  height: 74px;
  background: #ffffff;
  border-bottom: 2px solid #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  gap: 14px;
}

.hamburger {
  display: none;
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  border-radius: 12px;
  width: 42px;
  height: 42px;
  cursor: pointer;
  font-size: 18px;
}

.topbar-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #000000;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 13px;
  color: #808080;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  border: 1px solid #000000;
  background: #ffffff;
  color: #000000;
  border-radius: 12px;
  width: 42px;
  height: 42px;
  cursor: pointer;
}

.icon-btn:hover {
  background: #000000;
  color: #ffffff;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 8px;
}

.profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  color: #000000;
}

.profile-name {
  font-weight: 800;
  font-size: 14px;
}

.profile-role {
  font-size: 12px;
  color: #808080;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #000000;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 800;
}

/* ====== CONTENT ====== */
.content {
  padding: 18px;
  background: #f5f5f5;
}

.content-card {
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-card-header {
  padding: 18px 18px 10px;
  border-bottom: 2px solid #000000;
}

.content-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.content-body {
  padding: 18px;
  min-height: 520px;
}

/* ====== MOBILE ====== */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 20;
}

@media (max-width: 980px) {
  .hamburger {
    display: inline-grid;
    place-items: center;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-110%);
    transition: transform 0.2s ease;
    height: 100vh;
    box-shadow: 0 18px 60px rgba(17, 24, 39, 0.18);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: inline-grid;
    place-items: center;
  }
}
</style>
