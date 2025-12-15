<template>
  <div>
    <Header />
    <Navbar />
    <main>
      <HeroBanner />
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
