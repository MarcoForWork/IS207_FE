<template>
  <nav class="navbar">
    <!-- Left: Logo -->
    <div class="navbar-brand">
      <router-link to="/" class="logo">Lmaohihi</router-link>
    </div>

    <!-- Center: Menu Items -->
    <div class="navbar-center">
      <div
        class="nav-item dropdown-group"
        @mouseenter="openMenu = 'shirt'"
        @mouseleave="openMenu = null"
      >
        <button class="nav-link">
          ÁO
          <span class="dropdown-icon" v-show="openMenu === 'shirt'"></span>
        </button>
        <div class="dropdown-menu" v-show="openMenu === 'shirt'">
          <router-link to="/products?category=shirt&type=somsi" class="dropdown-item"
            >Áo Sơ Mi</router-link
          >
          <router-link to="/products?category=shirt&type=phong" class="dropdown-item"
            >Áo Phông</router-link
          >
          <router-link to="/products?category=shirt&type=dai" class="dropdown-item"
            >Áo Dài</router-link
          >
          <router-link to="/products?category=shirt&type=khoac" class="dropdown-item"
            >Áo Khoác</router-link
          >
        </div>
      </div>

      <div
        class="nav-item dropdown-group"
        @mouseenter="openMenu = 'pants'"
        @mouseleave="openMenu = null"
      >
        <button class="nav-link">
          QUẦN
          <span class="dropdown-icon" v-show="openMenu === 'pants'"></span>
        </button>
        <div class="dropdown-menu" v-show="openMenu === 'pants'">
          <router-link to="/products?category=pants&type=jeans" class="dropdown-item"
            >Quần Jeans</router-link
          >
          <router-link to="/products?category=pants&type=tay" class="dropdown-item"
            >Quần Tây</router-link
          >
          <router-link to="/products?category=pants&type=short" class="dropdown-item"
            >Quần Short</router-link
          >
          <router-link to="/products?category=pants&type=legging" class="dropdown-item"
            >Quần Legging</router-link
          >
        </div>
      </div>

      <div
        class="nav-item dropdown-group"
        @mouseenter="openMenu = 'accessories'"
        @mouseleave="openMenu = null"
      >
        <button class="nav-link">
          PHỤ KIỆN
          <span class="dropdown-icon" v-show="openMenu === 'accessories'"></span>
        </button>
        <div class="dropdown-menu" v-show="openMenu === 'accessories'">
          <router-link to="/products?category=accessories&type=tui" class="dropdown-item"
            >Túi xách</router-link
          >
          <router-link to="/products?category=accessories&type=giay" class="dropdown-item"
            >Giày dép</router-link
          >
          <router-link to="/products?category=accessories&type=mu" class="dropdown-item"
            >Mũ nón</router-link
          >
          <router-link to="/products?category=accessories&type=thatluong" class="dropdown-item"
            >Thắt lưng</router-link
          >
        </div>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="navbar-right">
      <!-- Desktop search box -->
      <div class="search-desktop">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm..."
          @keyup.enter="handleSearch"
          aria-label="Tìm kiếm"
        />
        <button class="search-submit" @click="handleSearch" aria-label="Tìm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
      <button class="icon-btn mobile-search-toggle" @click="toggleSearch" title="Tìm kiếm">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      <router-link to="/cart" class="icon-btn cart-link" title="Giỏ hàng">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
      </router-link>
    </div>

    <!-- Search Bar Mobile -->
    <div class="search-bar-mobile" v-show="showSearch">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Tìm</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      openMenu: null,
      searchQuery: '',
      cartCount: 0,
      showSearch: false,
      searchTimer: null,
    }
  },
  methods: {
    applySearchQuery(q) {
      // Navigate without stacking history for each keystroke
      this.$router.replace({ name: 'products', query: q ? { search: q } : {} })
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    handleSearch() {
      const q = this.searchQuery.trim()
      if (!q) {
        this.applySearchQuery('')
        return
      }
      this.applySearchQuery(q)
    },
    handleLogout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    updateCartCount() {
      this.cartCount = this.$store?.state?.cart?.length || 0
    },
  },
  watch: {
    // Reactive search when typing (light debounce)
    searchQuery(newVal) {
      const q = newVal.trim()
      if (this.searchTimer) clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.applySearchQuery(q)
        if (!q) this.showSearch = false
      }, 200)
    },
  },
  mounted() {
    this.updateCartCount()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeMenuOnClickOutside)
    if (this.searchTimer) clearTimeout(this.searchTimer)
  },
}
</script>

<style scoped>
.navbar {
  background-color: #32302f;
  padding: 0.35rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #504945;
  position: sticky;
  top: 0;
  z-index: 100;
  gap: 1.5rem;
  flex-wrap: wrap;
  height: 56px; /* slightly shorter navbar */
}

/* Brand/Logo */
.navbar-brand {
  flex-shrink: 0;
}

.logo {
  color: #b8bb26;
  font-size: 1.3rem;
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1;
  text-align: center;
}

.logo:hover {
  color: #8ec07c;
}

/* Center Menu */
.navbar-center {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: center;
  /* center visually within navbar regardless of left/right widths */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  z-index: 101; /* ensure center menu sits above other navbar items for interaction */
}

.nav-item {
  position: relative;
}

.dropdown-group {
  position: relative;
  padding-bottom: 0.5rem;
}

.nav-link {
  background: none;
  border: none;
  color: #ebdbb2;
  font-size: 0.85rem;
  font-weight: 400;
  cursor: pointer;
  padding: 0.5rem 0;
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  line-height: 1.2;
}

.nav-link:hover {
  color: #8ec07c;
}

.dropdown-icon {
  font-size: 0.6rem;
  transition: transform 0.3s;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2b2b2b;
  border: none;
  border-radius: 0;
  min-width: 220px;
  margin-top: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: slideDown 0.15s ease;
  z-index: 1000;
  padding: 0;
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #d4af37;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  cursor: pointer;
  line-height: 1.4;
  text-align: left;
  border-left: 3px solid transparent;
}

.dropdown-item:hover {
  background: rgba(142, 192, 124, 0.2);
  color: #8ec07c;
  border-left-color: #8ec07c;
  padding-left: 1.2rem;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #504945;
  margin: 0.5rem 0;
}

/* Right Section */
.navbar-right {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-shrink: 0;
}

.icon-btn {
  background: none;
  border: none;
  color: #ebdbb2;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  padding: 0.2rem 0.3rem;
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  line-height: 1;
}

.icon-btn:hover {
  color: #8ec07c;
}

.mobile-search-toggle {
  display: none;
}

.cart-link {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fb4934;
  color: #282828;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 600;
  line-height: 1;
}

/* Desktop search box */
.search-desktop {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #3c3836;
  border: 1px solid #504945;
  padding: 0.15rem 0.35rem;
  border-radius: 18px;
}

.search-desktop input {
  width: 120px;
  background: transparent;
  border: none;
  color: #ebdbb2;
  padding: 0.15rem 0.2rem;
  font-size: 0.9rem;
  outline: none;
  transition: width 0.18s ease;
}

.search-desktop input::placeholder {
  color: #a89984;
}

.search-desktop input:focus {
  width: 220px;
}

.search-submit {
  background: none;
  border: none;
  color: #ebdbb2;
  padding: 0.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.search-submit:hover {
  color: #8ec07c;
}

/* Search Bar Mobile */
.search-bar-mobile {
  width: 100%;
  display: none;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #504945;
}

.search-bar-mobile.active {
  display: flex;
}

.search-bar-mobile input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #504945;
  background: #3c3836;
  color: #ebdbb2;
  border-radius: 2px;
  font-size: 0.9rem;
}

.search-bar-mobile input::placeholder {
  color: #a89984;
}

.search-bar-mobile button {
  padding: 0.75rem 1.5rem;
  background: #b8bb26;
  color: #282828;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.search-bar-mobile button:hover {
  background: #8ec07c;
  color: #282828;
}

/* Responsive */
@media (max-width: 1024px) {
  .navbar {
    gap: 1rem;
    padding: 0.75rem 1rem;
  }

  .navbar-center {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 1rem;
  }

  .navbar-brand {
    text-align: center;
  }

  .logo {
    font-size: 1.5rem;
  }

  .navbar-center {
    /* restore normal flow on mobile */
    position: static;
    transform: none;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    display: none;
    pointer-events: auto;
  }

  .navbar-center.active {
    display: flex;
  }

  .nav-link {
    padding: 0.75rem;
    border-radius: 4px;
  }

  .navbar-right {
    justify-content: center;
    gap: 1rem;
    order: 3;
  }

  .search-bar-mobile.active {
    display: flex;
    order: 4;
  }
  .search-desktop {
    display: none;
  }
  .mobile-search-toggle {
    display: inline-flex;
  }
}

@media (max-width: 480px) {
  .navbar-right {
    width: 100%;
    justify-content: space-around;
  }

  .nav-link {
    font-size: 0.8rem;
  }
}
</style>
