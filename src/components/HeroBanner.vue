<template>
  <div class="hero-banner">
    <div class="hero-image-container">
      <img
        src="../assets/images/hero-banner.jpg"
        alt="Hero Banner Image"
        class="main-product-display"
      />

      <div class="hero-content-overlay">
        <h1 class="main-title">
          Phong Cách Tạo Nên Bản Sắc
          <br />
          Chất liệu cao cấp • Form chuẩn • Dễ phối đồ
        </h1>

        <a href="/products" class="cta-button"> Khám phá ngay </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroBanner',
}
</script>

<style scoped>
/* ======================================= */
/* =========== HERO BANNER STYLE ========= */
/* ======================================= */

.hero-banner {
  width: 100%;
}

.hero-image-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-product-display {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-content-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.main-title {
  font-size: clamp(1.5em, 4vw, 2.2em);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 30px;

  background: linear-gradient(90deg, #000000, #333333, #808080, #000000, #333333);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-button {
  pointer-events: auto;
  padding: 12px 35px;
  font-weight: bold;
  background-color: #000000;
  color: #ffffff;
  border: 2px solid #000000;
  text-decoration: none;
  transition: all 0.3s;
}

.cta-button:hover {
  background-color: #333333;
  transform: translateY(-2px);
}
</style>
