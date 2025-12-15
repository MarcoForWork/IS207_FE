<template>
  <div class="header-container">
    <!-- Left: Empty -->
    <div class="header-left"></div>

    <!-- Right: Account (single clickable element) -->
    <div class="header-account">
      <router-link
        :to="isLoggedIn ? '/profile' : '/login'"
        class="account-button"
        aria-label="Account"
      >
        <span class="account-label" v-if="isLoggedIn">Hi, {{ userName }}</span>
        <span class="account-label" v-else>Sign in</span>
        <svg
          class="account-svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: false,
      userName: '',
    }
  },
  mounted() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      // Check if user data is stored in localStorage or sessionStorage
      const user = localStorage.getItem('user') || sessionStorage.getItem('user')
      if (user) {
        try {
          const userData = JSON.parse(user)
          this.isLoggedIn = true
          this.userName = userData.name || userData.username || 'User'
        } catch (e) {
          this.isLoggedIn = false
        }
      } else {
        this.isLoggedIn = false
      }
    },
  },
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.12rem 1rem;
  background-color: #32302f;
  border-bottom: 1px solid #504945;
  height: 32px;
}

.header-left {
  flex: 1;
}

.header-account {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.account-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #ebdbb2;
  text-decoration: none;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.account-button:hover {
  color: #8ec07c;
}

.account-label {
  line-height: 1;
}

.account-svg {
  stroke: #ebdbb2;
}

.account-button:hover .account-svg {
  stroke: #8ec07c;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0.4rem 0.75rem;
    gap: 0.5rem;
  }

  .header-left {
    display: none;
  }

  .account-label {
    display: none;
  }
}
</style>
