<template>
  <div>
    <Header />
    <Navbar />

    <main class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="card-header">
            <h1>Đăng nhập</h1>
            <p>Truy cập tài khoản để theo dõi đơn hàng và nhận ưu đãi.</p>
          </div>

          <form class="auth-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="you@example.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>

            <button class="auth-button" type="submit" :disabled="loading">
              <span v-if="loading">Đang đăng nhập...</span>
              <span v-else>Đăng nhập</span>
            </button>
          </form>

          <div class="auth-footer">
            <span>Bạn chưa có tài khoản?</span>
            <button class="link-button" @click="goToSignup">Đăng ký ngay</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'
import { buildUrl, API_ENDPOINTS, getHeaders } from '@/config/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function extractErrorMessage(data) {
  if (!data) return null
  if (data.message) return data.message
  if (data.error) return data.error
  if (data.errors && typeof data.errors === 'object') {
    return Object.values(data.errors).flat().join(' ')
  }
  return null
}

async function handleSubmit() {
  error.value = ''

  const emailVal = email.value.trim()
  const passVal = password.value

  if (!emailVal || !passVal) {
    error.value = 'Vui lòng nhập đầy đủ thông tin.'
    return
  }

  loading.value = true
  try {
    const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: emailVal,
        password: passVal,
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      error.value = extractErrorMessage(data) || 'Đăng nhập thất bại. Vui lòng thử lại.'
      return
    }

    // Lưu token + user
    if (data?.token) localStorage.setItem('auth_token', data.token)
    if (data?.user) localStorage.setItem('user-info', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Điều hướng theo role
    const role = data?.user?.role
    if (role === 'admin') {
      // Điều hướng sang trang admin (route bạn cấu hình trỏ tới Admin.vue)
      router.push('/admin')
    } else {
      // Customer / role khác
      router.push('/')
    }
  } catch (e) {
    console.error(e)
    error.value = 'Không thể kết nối máy chủ. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

function goToSignup() {
  router.push('/signup')
}
</script>

<style scoped>
.auth-page {
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.05) 0%, transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(0, 0, 0, 0.03) 0%, transparent 30%),
    radial-gradient(circle at 50% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 32%),
    linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  padding: 2.5rem 2.25rem;
}

.card-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #000000;
  letter-spacing: -0.01em;
}

.card-header p {
  margin: 0;
  color: #808080;
  line-height: 1.6;
  font-size: 0.95rem;
}

.card-header {
  position: relative;
  padding-bottom: 0.75rem;
}

.card-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 64px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #000000 0%, #333333 100%);
}

.auth-form {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-weight: 600;
  color: #000000;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background: #f5f5f5;
  color: #000000;
  font-size: 0.95rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.auth-button {
  width: 100%;
  padding: 0.95rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    opacity 0.2s;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  color: #000000;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.auth-footer {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #808080;
  font-size: 0.95rem;
}

.link-button {
  background: none;
  border: none;
  color: #000000;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}

.link-button:hover {
  color: #333333;
}

@media (max-width: 540px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  .card-header h1 {
    font-size: 1.5rem;
  }
}
</style>
