<template>
  <div class="header-container">
    <!-- Left: Empty -->
    <div class="header-left"></div>

    <!-- Notification Icon (only when logged in) -->
    <div class="header-notification" v-if="isLoggedIn">
      <div class="notification-dropdown">
        <button @click="toggleNotifications" class="notification-button" aria-label="Notifications">
          <svg
            class="notification-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
        </button>
        <!-- Notification Dropdown -->
        <Transition name="notification-fade">
          <div class="notifications-panel" v-show="showNotifications">
            <div class="notifications-header">
              <h3>Notifications</h3>
              <button v-if="notifications.length > 0" @click="markAllAsRead" class="mark-read-btn">
                Mark all as read
              </button>
            </div>
            <div class="notifications-list" v-if="notifications.length > 0">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item"
                :class="{ unread: !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <div class="notification-icon-wrapper">
                  <svg
                    v-if="notification.type === 'order'"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path
                      d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                    ></path>
                  </svg>
                  <svg
                    v-else-if="notification.type === 'promo'"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <svg
                    v-else
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div class="notification-content">
                  <p class="notification-title">{{ notification.title }}</p>
                  <p class="notification-message">{{ notification.message }}</p>
                  <span class="notification-time">{{ notification.time }}</span>
                </div>
                <div v-if="!notification.read" class="unread-dot"></div>
              </div>
            </div>
            <div class="notifications-empty" v-else>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <p>No notifications yet</p>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Right: Account (with dropdown on hover) -->
    <div class="header-account" v-if="isLoggedIn">
      <div class="account-dropdown">
        <div class="account-button">
          <span class="account-label">Hi, {{ userName }}</span>
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
        </div>
        <!-- Dropdown Menu -->
        <div class="dropdown-menu">
          <router-link to="/profile" class="dropdown-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </router-link>
          <button @click="handleLogout" class="dropdown-item logout-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
    <!-- Not logged in -->
    <div class="header-account" v-else>
      <router-link to="/login" class="account-button" aria-label="Sign in">
        <span class="account-label">Sign in</span>
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
      showNotifications: false,
      notifications: [
        {
          id: 1,
          type: 'order',
          title: 'Order Shipped',
          message: 'Your order #12345 has been shipped and will arrive in 2-3 days.',
          time: '2 hours ago',
          read: false,
        },
        {
          id: 2,
          type: 'promo',
          title: 'Special Offer',
          message: 'Get 20% off on all products this weekend!',
          time: '1 day ago',
          read: false,
        },
        {
          id: 3,
          type: 'general',
          title: 'Welcome!',
          message: 'Thanks for joining our store. Enjoy your shopping experience.',
          time: '3 days ago',
          read: true,
        },
      ],
    }
  },
  computed: {
    unreadCount() {
      return this.notifications.filter((n) => !n.read).length
    },
  },
  mounted() {
    this.checkLoginStatus()

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
      const notificationDropdown = this.$el.querySelector('.notification-dropdown')
      if (notificationDropdown && !notificationDropdown.contains(e.target)) {
        this.showNotifications = false
      }
    })
  },
  methods: {
    checkLoginStatus() {
      // Check if user data is stored in localStorage or sessionStorage
      const user = localStorage.getItem('user-info') || sessionStorage.getItem('user-info')
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
    handleLogout() {
      // Clear user data from storage
      localStorage.removeItem('user-info')
      sessionStorage.removeItem('user-info')

      // Update component state
      this.isLoggedIn = false
      this.userName = ''

      // Redirect to home page
      this.$router.push('/')
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    markAsRead(notificationId) {
      const notification = this.notifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead() {
      this.notifications.forEach((n) => {
        n.read = true
      })
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

.header-notification {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.notification-dropdown {
  position: relative;
  display: inline-block;
}

.notification-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ebdbb2;
  text-decoration: none;
  padding: 0.4rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.notification-button:hover {
  color: #8ec07c;
  background-color: rgba(142, 192, 124, 0.1);
}

.notification-icon {
  stroke: currentColor;
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: #fb4934;
  color: #fff;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 0.1rem 0.35rem;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 1;
}

.notifications-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: -60px;
  background-color: #282828;
  border: 1px solid #504945;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  width: 360px;
  max-height: 480px;
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

/* Notification panel transition animations */
.notification-fade-enter-active {
  animation: notificationSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-fade-leave-active {
  animation: notificationSlideOut 0.2s cubic-bezier(0.36, 0, 0.66, -0.56);
}

@keyframes notificationSlideIn {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes notificationSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.97);
  }
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #3c3836;
  background-color: #32302f;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #ebdbb2;
  font-weight: 600;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #8ec07c;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background-color: rgba(142, 192, 124, 0.15);
}

.notifications-list {
  overflow-y: auto;
  max-height: 400px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #3c3836;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.notification-item:hover {
  background-color: #32302f;
}

.notification-item.unread {
  background-color: rgba(142, 192, 124, 0.05);
}

.notification-icon-wrapper {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3c3836;
  border-radius: 50%;
}

.notification-icon-wrapper svg {
  stroke: #8ec07c;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ebdbb2;
}

.notification-message {
  margin: 0 0 0.35rem 0;
  font-size: 0.85rem;
  color: #bdae93;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #928374;
}

.unread-dot {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #8ec07c;
  border-radius: 50%;
}

.notifications-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.notifications-empty svg {
  stroke: #504945;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notifications-empty p {
  color: #928374;
  font-size: 0.95rem;
  margin: 0;
}

.header-account {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.account-dropdown {
  position: relative;
  display: inline-block;
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
  cursor: pointer;
  transition: all 0.2s ease;
}

.account-button:hover {
  color: #8ec07c;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: #282828;
  border: 1px solid #504945;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 1000;
}

.account-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  color: #ebdbb2;
  text-decoration: none;
  font-size: 0.9rem;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #3c3836;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #3c3836;
  color: #8ec07c;
}

.dropdown-item svg {
  stroke: currentColor;
  flex-shrink: 0;
}

.logout-item:hover {
  color: #fb4934;
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

  .header-notification {
    margin-right: 0.5rem;
  }

  .notifications-panel {
    right: -20px;
    width: 320px;
    max-height: 400px;
  }

  .account-label {
    display: none;
  }
}
</style>
