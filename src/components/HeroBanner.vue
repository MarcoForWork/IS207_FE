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
          Lorem Ipsum
          <br />
          Lorem Ipsum
        </h1>

        <a href="/products" class="cta-button"> Lorem Ipsum </a>
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

  background: linear-gradient(90deg, #ffc800, #ff7f00, #e73d4a, #0090ff, #00c0b9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cta-button {
  pointer-events: auto;
  padding: 12px 35px;
  font-weight: bold;
  background-color: #fbf1c7;
  color: #3c3836;
  border: 2px solid #3c3836;
  text-decoration: none;
  transition: all 0.3s;
}

.cta-button:hover {
  background-color: #ebdbb2;
  transform: translateY(-2px);
}
</style>
