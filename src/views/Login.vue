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
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'
import Footer from '@/components/global/Footer.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin.'
    return
  }

  loading.value = true
  try {
    // TODO: Replace with real API call
    // const response = await axios.post('https://your-api.com/api/login', {
    //   email: email.value,
    //   password: password.value,
    // })
    // const data = response.data
    // localStorage.setItem('user-info', JSON.stringify(data.user))
    // router.push('/')

    // Demo success flow
    await new Promise((res) => setTimeout(res, 600))
    localStorage.setItem('user-info', JSON.stringify({ email: email.value, token: 'demo-token' }))
    router.push('/')
  } catch (e) {
    console.error(e)
    error.value = 'Đăng nhập thất bại. Vui lòng thử lại.'
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
    radial-gradient(circle at 20% 20%, rgba(239, 212, 146, 0.35) 0%, transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(198, 160, 128, 0.25) 0%, transparent 30%),
    radial-gradient(circle at 50% 80%, rgba(104, 157, 106, 0.18) 0%, transparent 32%),
    linear-gradient(180deg, #fbf1c7 0%, #f4e8d0 100%);
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
  background: #fdfbf4;
  border-radius: 14px;
  box-shadow: 0 16px 48px rgba(60, 56, 54, 0.14);
  border: 1px solid #d5c4a1;
  padding: 2.5rem 2.25rem;
}

.card-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  color: #3c3836;
  letter-spacing: -0.01em;
}

.card-header p {
  margin: 0;
  color: #665c54;
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
  background: linear-gradient(90deg, #d79921 0%, #b47c1a 100%);
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
  color: #3c3836;
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid #d5c4a1;
  background: #f9f5d7;
  color: #3c3836;
  font-size: 0.95rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #d79921;
  box-shadow: 0 0 0 3px rgba(215, 153, 33, 0.15);
  background: #fef8ed;
}

.auth-button {
  width: 100%;
  padding: 0.95rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #d79921 0%, #b47c1a 100%);
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
  box-shadow: 0 10px 20px rgba(215, 153, 33, 0.35);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  color: #cc241d;
  background: #fff2f0;
  border: 1px solid #f5c2c7;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
}

.auth-footer {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #665c54;
  font-size: 0.95rem;
}

.link-button {
  background: none;
  border: none;
  color: #d79921;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: color 0.2s;
}

.link-button:hover {
  color: #b47c1a;
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
