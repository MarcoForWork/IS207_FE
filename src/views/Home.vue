<template>
  <div>
    <Header />
    <Navbar />
    <main>
      <HeroBanner />
      <ProductCarousel title="Featured Products" :limit="12" />
      <ProductCarousel title="New Arrivals" apiEndpoint="/api/products?sort=newest" :limit="12" />
      <ProductCarousel title="Best Sellers" apiEndpoint="/api/products?sort=popular" :limit="12" />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/global/Header.vue'
import HeroBanner from '@/components/HeroBanner.vue'
import Footer from '@/components/global/Footer.vue'
import Navbar from '@/components/global/Navbar.vue'
import ProductCarousel from '@/components/product/ProductCarousel.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    HeroBanner,
    Navbar,
    ProductCarousel,
  },
}
</script>
