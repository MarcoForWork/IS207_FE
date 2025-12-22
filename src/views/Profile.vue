<template>
  <div>
    <Header />
    <Navbar />

    <main class="profile-page">
      <div class="profile-container">
        <ProfileSidebar :user="user" :active-tab="activeTab" @change-tab="activeTab = $event" />

        <div class="profile-content">
          <!-- Personal Information Tab -->
          <PersonalInfoForm v-if="activeTab === 'info'" :user="user" @update="updateProfile" />

          <!-- Addresses Tab -->
          <AddressList
            v-if="activeTab === 'addresses'"
            :addresses="addresses"
            @add-address="showAddressForm = true"
            @edit-address="editAddress"
            @delete-address="deleteAddress"
            @set-default="setDefaultAddress"
          />

          <!-- Change Password Tab -->
          <ChangePasswordForm v-if="activeTab === 'password'" @update="changePassword" />
        </div>
      </div>
    </main>

    <!-- Address Form Modal -->
    <AddressFormModal
      :show="showAddressForm"
      :address="editingAddress"
      @close="closeAddressForm"
      @save="saveAddress"
    />

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'
import Footer from '@/components/global/Footer.vue'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import PersonalInfoForm from '@/components/profile/PersonalInfoForm.vue'
import AddressList from '@/components/profile/AddressList.vue'
import AddressFormModal from '@/components/profile/AddressFormModal.vue'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm.vue'
import { buildUrl, getHeaders } from '@/config/api'

const router = useRouter()
const activeTab = ref('info')

// User Info
const user = ref({})

// Addresses
const addresses = ref([])
const showAddressForm = ref(false)
const editingAddress = ref(null)

// Load user profile
async function loadProfile() {
  try {
    const response = await fetch(buildUrl('/api/user/profile'), {
      headers: getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login')
        return
      }
      throw new Error('Failed to load profile')
    }

    const data = await response.json()
    user.value = data.user || data
  } catch (error) {
    console.error('Error loading profile:', error)
  }
}

// Update profile
async function updateProfile(formData) {
  try {
    const response = await fetch(buildUrl('/api/user/profile'), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile')
    }

    user.value = { ...user.value, ...formData }

    // Update localStorage
    localStorage.setItem('user-info', JSON.stringify(user.value))
  } catch (error) {
    throw error
  }
}

// Load addresses
async function loadAddresses() {
  try {
    const response = await fetch(buildUrl('/api/user/addresses'), {
      headers: getHeaders(),
    })

    if (!response.ok) throw new Error('Failed to load addresses')

    const data = await response.json()
    addresses.value = data.addresses || data || []
  } catch (error) {
    console.error('Error loading addresses:', error)
  }
}

// Save address
async function saveAddress(addressData) {
  try {
    const url = addressData.address_id
      ? buildUrl(`/api/user/addresses/${addressData.address_id}`)
      : buildUrl('/api/user/addresses')

    const method = addressData.address_id ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(addressData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save address')
    }

    await loadAddresses()
    closeAddressForm()
  } catch (error) {
    throw error
  }
}

// Edit address
function editAddress(address) {
  editingAddress.value = address
  showAddressForm.value = true
}

// Delete address
async function deleteAddress(addressId) {
  try {
    const response = await fetch(buildUrl(`/api/user/addresses/${addressId}`), {
      method: 'DELETE',
      headers: getHeaders(),
    })

    if (!response.ok) throw new Error('Failed to delete address')

    await loadAddresses()
  } catch (error) {
    alert('Error deleting address: ' + error.message)
  }
}

// Set default address
async function setDefaultAddress(addressId) {
  try {
    const response = await fetch(buildUrl(`/api/user/addresses/${addressId}/default`), {
      method: 'PUT',
      headers: getHeaders(),
    })

    if (!response.ok) throw new Error('Failed to set default address')

    await loadAddresses()
  } catch (error) {
    alert('Error setting default address: ' + error.message)
  }
}

// Close address form
function closeAddressForm() {
  showAddressForm.value = false
  editingAddress.value = null
}

// Change password
async function changePassword(formData) {
  try {
    const response = await fetch(buildUrl('/api/user/change-password'), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        current_password: formData.current_password,
        new_password: formData.new_password,
        password_confirmation: formData.confirm_password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password')
    }
  } catch (error) {
    throw error
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 140px);
  background: #f5f5f5;
  padding: 2rem 1rem;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.profile-content {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 2.5rem;
}

@media (max-width: 968px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-page {
    padding: 1rem 0.5rem;
  }

  .profile-content {
    padding: 1.5rem;
  }
}
</style>
