<template>
  <div>
    <Header />
    <Navbar />
    <main>
      <HeroBanner />

      <ProductSection title="Sản Phẩm Đang Giảm Giá" :products="saleProducts" />
      <ProductSection title="Bộ Sưu Tập Mới" :products="newArrivals" />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/global/Header.vue'
import HeroBanner from '@/components/HeroBanner.vue'
import Footer from '@/components/global/Footer.vue'
import Navbar from '@/components/global/Navbar.vue'
export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    HeroBanner,
    Navbar,
  },
}
</script>

<style>
/* Gruvbox Light Color Palette (Soft variant) */
:root {
  /* Backgrounds */
  --bg-light: #fbf1c7; /* background soft */
  --fg-light: #3c3836; /* foreground */

  /* Primary Colors (Accents) */
  --yellow: #d79921; /* Gruvbox yellow (for button/highlight) */
  --green: #98971a; /* Gruvbox green (primary action) */
  --dark-bg: #ebdbb2; /* base background (used for form container) */
  --gray: #a89984; /* Gruvbox gray (for input borders/placeholders) */
}

/* Apply Gruvbox Light background and text color to the entire body/container */
body {
  background-color: var(--bg-light);
  color: var(--fg-light);
  font-family: sans-serif;
}

h1 {
  text-align: center;
  margin-top: 50px;
  color: var(--fg-light);
}

.register {
  padding: 20px;
  background-color: var(--dark-bg); /* Slightly darker, warmer background for the form area */
  width: fit-content;
  margin: 50px auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.register input {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-right: auto;
  margin-left: auto;

  /* Gruvbox input styling */
  background-color: var(--bg-light);
  color: var(--fg-light);
  border: 1px solid var(--gray);
  border-radius: 4px;
}

/* Change input placeholder color */
.register input::placeholder {
  color: var(--gray);
  opacity: 1;
}

.register button {
  width: 320px;
  height: 40px;
  display: block;
  margin-bottom: 30px;
  margin-right: auto;
  margin-left: auto;

  /* Gruvbox button styling */
  background-color: var(--green); /* Gruvbox green for action button */
  color: var(--bg-light); /* Light text on dark button */
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Hover effect */
.register button:hover {
  background-color: var(--yellow); /* Hover with Gruvbox yellow */
  color: var(--fg-light); /* Dark text on hover for contrast */
}
</style>
