<template>
  <div class="profile-sidebar">
    <div class="sidebar-header">
      <div class="avatar">{{ userInitial }}</div>
      <h3>{{ userName }}</h3>
      <p>{{ userEmail }}</p>
    </div>

    <nav class="sidebar-nav">
      <button
        class="nav-item"
        :class="{ active: activeTab === 'info' }"
        @click="$emit('change-tab', 'info')"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Personal Information</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: activeTab === 'addresses' }"
        @click="$emit('change-tab', 'addresses')"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Addresses</span>
      </button>
      <button
        class="nav-item"
        :class="{ active: activeTab === 'password' }"
        @click="$emit('change-tab', 'password')"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span>Change Password</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  activeTab: {
    type: String,
    default: 'info',
  },
})

defineEmits(['change-tab'])

const userName = computed(() => props.user.name || 'User')
const userEmail = computed(() => props.user.email || '')
const userInitial = computed(() => (userName.value[0] || 'U').toUpperCase())
</script>

<style scoped>
.profile-sidebar {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto 1rem;
}

.sidebar-header h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #000000;
}

.sidebar-header p {
  margin: 0;
  font-size: 0.9rem;
  color: #808080;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000000;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.nav-item.active {
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

.nav-item .icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 968px) {
  .profile-sidebar {
    position: static;
  }
}
</style>
