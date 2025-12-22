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
          <span class="nav-icon" v-html="getIcon(item.icon)"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>

        <div class="nav-divider"></div>

        <button class="nav-item danger" @click="handleLogout">
          <span class="nav-icon" v-html="getIcon('logout')"></span>
          <span class="nav-label">Logout</span>
        </button>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <!-- TOPBAR -->
      <header class="topbar">
        <button
          class="hamburger"
          @click="sidebarOpen = true"
          aria-label="Open sidebar"
          v-html="getIcon('menu')"
        ></button>

        <div class="topbar-title">
          <h1 class="page-title">Dashboard</h1>
          <div class="page-subtitle">{{ currentLabel }}</div>
        </div>

        <div class="topbar-right">
          <button class="icon-btn" title="Theme" v-html="getIcon('theme')"></button>
          <button class="icon-btn" title="Settings" v-html="getIcon('settings')"></button>

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
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'customers', label: 'Customers', icon: 'customers' },
  { id: 'categories', label: 'Categories', icon: 'categories' },
  { id: 'collections', label: 'Collections', icon: 'collections' },
  { id: 'products', label: 'Products', icon: 'products' },
  { id: 'product-images', label: 'Product Images', icon: 'images' },
  { id: 'discounts', label: 'Discounts', icon: 'discounts' },
  { id: 'colors', label: 'Colors', icon: 'colors' },
  { id: 'faqs', label: 'FAQs', icon: 'faqs' },
  { id: 'highlights', label: 'Highlights', icon: 'highlights' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
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

function getIcon(name) {
  const icons = {
    analytics:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    customers:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    categories:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H9V9H4V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 4H20V9H15V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15H9V20H4V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 15H20V20H15V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    collections:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7H21M3 12H21M3 17H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    products:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    images:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    discounts:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7H7.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    colors:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12.55 22 13 21.55 13 21V20.5C13 20.11 12.86 19.74 12.63 19.47C12.4 19.2 12.28 18.85 12.28 18.47C12.28 17.92 12.73 17.47 13.28 17.47H15C18.31 17.47 21 14.78 21 11.47C21 6.20001 16.52 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="10.5" r="1.5" fill="currentColor"/></svg>',
    faqs: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    highlights:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    orders:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 13H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 9H9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    logout:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    theme:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.8846 19.5345 5.67413 18.3241C4.46367 17.1136 3.62405 15.5872 3.25204 13.9187C2.88003 12.2502 2.99078 10.5103 3.57153 8.9025C4.15228 7.29473 5.17887 5.88564 6.53126 4.83999C7.88365 3.79434 9.50578 3.15539 11.208 2.99799C10.2846 4.38531 9.89509 6.06335 10.1153 7.71959C10.3355 9.37583 11.1532 10.8975 12.4139 11.9864C13.6747 13.0753 15.2884 13.6552 16.9501 13.6201C18.6117 13.585 20.2002 12.9372 21.416 11.7999L21 12.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    settings:
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  }
  return icons[name] || ''
}

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
  width: 20px;
  height: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  display: block;
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
  align-items: center;
  justify-content: center;
}

.hamburger svg {
  width: 20px;
  height: 20px;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn svg {
  width: 20px;
  height: 20px;
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
    display: flex;
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
