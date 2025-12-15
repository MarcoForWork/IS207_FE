<template>
  <div>
    <Header />
    <Navbar />
    <main class="products-page">
      <div class="content">
        <aside class="sidebar">
          <div class="filter-section">
            <button class="filter-header" @click="toggleFilter('category')">
              <span>Category</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                :class="{ rotated: openFilters.category }"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-show="openFilters.category" class="filter-content pill-grid">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  class="pill"
                  :class="{ selected: selectedCategories.includes(cat.id) }"
                  @click="toggleCategorySelection(cat.id)"
                >
                  {{ cat.name }}
                </button>
              </div>
            </transition>
          </div>

          <div class="filter-section">
            <button class="filter-header" @click="toggleFilter('size')">
              <span>Size</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                :class="{ rotated: openFilters.size }"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-show="openFilters.size" class="filter-content size-grid">
                <div
                  v-for="size in sizes"
                  :key="size.id"
                  class="size-button"
                  :class="{ selected: selectedSizes.includes(size.id) }"
                  @click="toggleSizeSelection(size.id)"
                >
                  {{ size.size_name }}
                </div>
              </div>
            </transition>
          </div>

          <div class="filter-section">
            <button class="filter-header" @click="toggleFilter('colour')">
              <span>Colour</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                :class="{ rotated: openFilters.colour }"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-show="openFilters.colour" class="filter-content color-grid">
                <div
                  v-for="color in availableColors"
                  :key="color.color_code"
                  class="color-item"
                  :class="{ selected: selectedColors.includes(color.color_code) }"
                  @click="toggleColorSelection(color.color_code)"
                >
                  <div
                    class="color-circle"
                    :class="{
                      'is-white': color.color_code === '#FFFFFF',
                      'is-multi': color.color_code === 'multi',
                    }"
                    :style="
                      color.color_code !== 'multi' ? { backgroundColor: color.color_code } : {}
                    "
                  ></div>
                  <span class="color-name">{{ color.color_name }}</span>
                </div>
              </div>
            </transition>
          </div>

          <div class="filter-section">
            <button class="filter-header" @click="toggleFilter('collection')">
              <span>Collection</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                :class="{ rotated: openFilters.collection }"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            <transition name="slide">
              <div v-show="openFilters.collection" class="filter-content pill-grid">
                <button
                  v-for="col in collections"
                  :key="col.id"
                  type="button"
                  class="pill"
                  :class="{ selected: selectedCollections.includes(col.id) }"
                  @click="toggleCollectionSelection(col.id)"
                >
                  {{ col.name }}
                </button>
              </div>
            </transition>
          </div>
        </aside>

        <div class="products-main">
          <section class="products-hero">
            <h1>
              Product <span class="count-inline">({{ displayedProducts.length }})</span>
            </h1>
            <div class="hero-actions">
              <div class="sort-inline">
                <button class="sort-btn" @click="showSortMenu = !showSortMenu">
                  Sort By
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
                <div v-if="showSortMenu" class="sort-dropdown">
                  <div
                    class="sort-option"
                    :class="{ active: sort === 'popular' }"
                    @click="selectSort('popular')"
                  >
                    Bán chạy nhất
                  </div>
                  <div
                    class="sort-option"
                    :class="{ active: sort === 'new' }"
                    @click="selectSort('new')"
                  >
                    Mới nhất
                  </div>
                  <div
                    class="sort-option"
                    :class="{ active: sort === 'price-low' }"
                    @click="selectSort('price-low')"
                  >
                    Giá: Thấp đến Cao
                  </div>
                  <div
                    class="sort-option"
                    :class="{ active: sort === 'price-high' }"
                    @click="selectSort('price-high')"
                  >
                    Giá: Cao đến Thấp
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="products-grid">
            <div v-if="loading" class="loading-state">Loading products...</div>
            <div v-else class="grid-list">
              <ProductCard v-for="p in displayedProducts" :key="p.id" :product="p" />
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import Header from '@/components/global/Header.vue'
import Navbar from '@/components/global/Navbar.vue'

const route = useRoute()
const products = ref([])
const sort = ref('popular')
const showSortMenu = ref(false)
const loading = ref(false)

const searchTerm = computed(() => (route.query.search || '').toString().trim().toLowerCase())

const displayedProducts = computed(() => {
  let list = [...products.value]

  // Apply search from query param
  if (searchTerm.value) {
    const term = searchTerm.value
    list = list.filter((p) => {
      const haystacks = [p.name, p.description, p.category?.name]
      return haystacks.some((h) => h?.toString().toLowerCase().includes(term))
    })
  }

  // Apply filters based on database schema
  if (selectedCategories.value.length > 0) {
    list = list.filter((p) => selectedCategories.value.includes(p.category_id))
  }

  if (selectedSizes.value.length > 0) {
    list = list.filter((p) =>
      p.variants?.some((variant) => selectedSizes.value.includes(variant.size_id)),
    )
  }

  if (selectedColors.value.length > 0) {
    list = list.filter((p) =>
      p.colors?.some((color) => selectedColors.value.includes(color.color_code)),
    )
  }

  if (selectedCollections.value.length > 0) {
    list = list.filter(
      (p) => p.collection_id && selectedCollections.value.includes(p.collection_id),
    )
  }

  // Apply sorting
  const priceOf = (p) => p.final_price ?? p.base_price ?? 0

  switch (sort.value) {
    case 'price-low':
      return list.sort((a, b) => priceOf(a) - priceOf(b))
    case 'price-high':
      return list.sort((a, b) => priceOf(b) - priceOf(a))
    case 'new':
      return list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    case 'popular':
    default:
      return list
  }
})

// Filter states
const openFilters = ref({
  category: true,
  size: false,
  colour: false,
  collection: false,
})

const selectedCategories = ref([])
const selectedSizes = ref([])
const selectedColors = ref([])
const selectedCollections = ref([])

// Filter data
const categories = ref([
  { id: 1, name: 'Áo Thun', slug: 'ao-thun' },
  { id: 2, name: 'Áo Polo', slug: 'ao-polo' },
  { id: 3, name: 'Quần', slug: 'quan' },
  { id: 4, name: 'Phụ Kiện', slug: 'phu-kien' },
])

const sizes = ref([
  { id: 1, size_name: 'S', sort_order: 1 },
  { id: 2, size_name: 'M', sort_order: 2 },
  { id: 3, size_name: 'L', sort_order: 3 },
  { id: 4, size_name: 'XL', sort_order: 4 },
  { id: 5, size_name: 'XXL', sort_order: 5 },
])

const availableColors = ref([
  { color_name: 'Black', color_code: '#000000' },
  { color_name: 'Blue', color_code: '#0EA5E9' },
  { color_name: 'Brown', color_code: '#92744C' },
  { color_name: 'Green', color_code: '#84CC16' },
  { color_name: 'Grey', color_code: '#6B7280' },
  { color_name: 'Multi-Colour', color_code: 'multi' },
  { color_name: 'Orange', color_code: '#F97316' },
  { color_name: 'Pink', color_code: '#EC4899' },
  { color_name: 'Purple', color_code: '#9333EA' },
  { color_name: 'Red', color_code: '#EF4444' },
  { color_name: 'White', color_code: '#FFFFFF' },
  { color_name: 'Yellow', color_code: '#EAB308' },
])

const collections = ref([
  { id: 1, name: 'Summer Collection', slug: 'summer-collection' },
  { id: 2, name: 'Sport Collection', slug: 'sport-collection' },
  { id: 3, name: 'Premium Line', slug: 'premium-line' },
])

function toggleFilter(filterName) {
  openFilters.value[filterName] = !openFilters.value[filterName]
}

function toggleCategorySelection(id) {
  const idx = selectedCategories.value.indexOf(id)
  if (idx > -1) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(id)
}

function toggleSizeSelection(id) {
  const idx = selectedSizes.value.indexOf(id)
  if (idx > -1) selectedSizes.value.splice(idx, 1)
  else selectedSizes.value.push(id)
}

function toggleColorSelection(code) {
  const idx = selectedColors.value.indexOf(code)
  if (idx > -1) selectedColors.value.splice(idx, 1)
  else selectedColors.value.push(code)
}

function toggleCollectionSelection(id) {
  const idx = selectedCollections.value.indexOf(id)
  if (idx > -1) selectedCollections.value.splice(idx, 1)
  else selectedCollections.value.push(id)
}

async function fetchProducts() {
  loading.value = true
  try {
    // TODO: Replace with actual API endpoint
    // const response = await fetch('https://your-api.com/api/products')
    // const data = await response.json()
    // products.value = data.map(p => ({
    //   id: p.id,
    //   name: p.name,
    //   slug: p.slug,
    //   description: p.description,
    //   base_price: p.base_price,
    //   discount_percent: p.discount_percent,
    //   final_price: calculateFinalPrice(p.base_price, p.discount_percent),
    //   gender: p.gender,
    //   category: p.category,
    //   colors: p.colors || [],
    //   main_image: p.colors?.[0]?.main_image || '',
    //   color_count: p.colors?.length || 0
    // }))

    // Sample product data matching database schema
    products.value = [
      {
        id: 1,
        category_id: 1,
        collection_id: 1,
        name: 'Áo Thun Waffle Thoáng Mát',
        slug: 'ao-thun-waffle-thoang-mat',
        description: 'Áo thun waffle cao cấp, thoáng mát',
        base_price: 127000,
        discount_percent: 5,
        final_price: 120650,
        gender: 'nam',
        colors: [
          {
            id: 1,
            color_name: 'Xanh Navy',
            color_code: '#001f3f',
            main_image: 'https://picsum.photos/seed/p1/800/800',
          },
          {
            id: 2,
            color_name: 'Đen',
            color_code: '#000000',
            main_image: 'https://picsum.photos/seed/p1b/800/800',
          },
        ],
        variants: [
          { id: 1, color_id: 1, size_id: 1, stock: 10 },
          { id: 2, color_id: 1, size_id: 2, stock: 15 },
          { id: 3, color_id: 1, size_id: 3, stock: 12 },
          { id: 4, color_id: 2, size_id: 2, stock: 8 },
          { id: 5, color_id: 2, size_id: 3, stock: 5 },
        ],
        main_image: 'https://picsum.photos/seed/p1/800/800',
        color_count: 2,
      },
      {
        id: 2,
        category_id: 1,
        collection_id: 1,
        name: 'Áo Thun Pique Thoáng Mát',
        slug: 'ao-thun-pique-thoang-mat',
        description: 'Áo thun pique cao cấp',
        base_price: 157000,
        discount_percent: 5,
        final_price: 149150,
        gender: 'nam',
        colors: [
          {
            id: 3,
            color_name: 'Trắng',
            color_code: '#FFFFFF',
            main_image: 'https://picsum.photos/seed/p2/800/800',
          },
        ],
        variants: [
          { id: 6, color_id: 3, size_id: 1, stock: 20 },
          { id: 7, color_id: 3, size_id: 2, stock: 25 },
          { id: 8, color_id: 3, size_id: 3, stock: 18 },
          { id: 9, color_id: 3, size_id: 4, stock: 10 },
        ],
        main_image: 'https://picsum.photos/seed/p2/800/800',
        color_count: 1,
      },
      {
        id: 3,
        category_id: 2,
        collection_id: 2,
        name: 'Áo Polo Pique Thoáng Mát',
        slug: 'ao-polo-pique-thoang-mat',
        description: 'Áo polo pique cao cấp',
        base_price: 177000,
        discount_percent: 5,
        final_price: 168150,
        gender: 'nam',
        colors: [
          {
            id: 4,
            color_name: 'Xanh',
            color_code: '#0EA5E9',
            main_image: 'https://picsum.photos/seed/p3/800/800',
          },
        ],
        variants: [
          { id: 10, color_id: 4, size_id: 2, stock: 15 },
          { id: 11, color_id: 4, size_id: 3, stock: 20 },
          { id: 12, color_id: 4, size_id: 4, stock: 12 },
        ],
        main_image: 'https://picsum.photos/seed/p3/800/800',
        color_count: 1,
      },
      {
        id: 4,
        category_id: 1,
        collection_id: 2,
        name: 'Áo Thun Pique Seventy Seven',
        slug: 'ao-thun-pique-seventy-seven',
        description: 'Áo thun pique phong cách thể thao',
        base_price: 157000,
        discount_percent: 5,
        final_price: 149150,
        gender: 'nam',
        colors: [
          {
            id: 5,
            color_name: 'Xám',
            color_code: '#6B7280',
            main_image: 'https://picsum.photos/seed/p4/800/800',
          },
        ],
        variants: [
          { id: 13, color_id: 5, size_id: 1, stock: 8 },
          { id: 14, color_id: 5, size_id: 2, stock: 12 },
          { id: 15, color_id: 5, size_id: 3, stock: 15 },
          { id: 16, color_id: 5, size_id: 4, stock: 7 },
          { id: 17, color_id: 5, size_id: 5, stock: 3 },
        ],
        main_image: 'https://picsum.photos/seed/p4/800/800',
        color_count: 1,
      },
      {
        id: 5,
        category_id: 3,
        collection_id: 3,
        name: 'Quần Jeans Slim',
        slug: 'quan-jeans-slim',
        description: 'Quần jeans dáng slim fit',
        base_price: 399000,
        discount_percent: 0,
        final_price: 399000,
        gender: 'nam',
        colors: [
          {
            id: 6,
            color_name: 'Blue Denim',
            color_code: '#0EA5E9',
            main_image: 'https://picsum.photos/seed/p5/800/800',
          },
        ],
        variants: [
          { id: 18, color_id: 6, size_id: 2, stock: 10 },
          { id: 19, color_id: 6, size_id: 3, stock: 14 },
          { id: 20, color_id: 6, size_id: 4, stock: 8 },
        ],
        main_image: 'https://picsum.photos/seed/p5/800/800',
        color_count: 1,
      },
      {
        id: 6,
        category_id: 4,
        collection_id: null,
        name: 'Nón Snapback',
        slug: 'non-snapback',
        description: 'Nón snapback thời trang',
        base_price: 99000,
        discount_percent: 0,
        final_price: 99000,
        gender: 'unisex',
        colors: [
          {
            id: 7,
            color_name: 'Đen',
            color_code: '#000000',
            main_image: 'https://picsum.photos/seed/p6/800/800',
          },
        ],
        variants: [{ id: 21, color_id: 7, size_id: 1, stock: 50 }],
        main_image: 'https://picsum.photos/seed/p6/800/800',
        color_count: 1,
      },
    ]
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

function calculateFinalPrice(basePrice, discountPercent) {
  return Math.round(basePrice * (1 - discountPercent / 100))
}

function selectSort(value) {
  sort.value = value
  showSortMenu.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const sortElement = event.target.closest('.sort-inline')
  if (!sortElement && showSortMenu.value) {
    showSortMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchProducts()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// products is used directly now; remove client-side search
</script>

<style scoped>
.products-page {
  padding: 12px 16px 24px 16px;
  width: 94vw;
  max-width: 1920px;
  margin: 0 auto;
  background: #fbf1c7;
  color: #3c3836;
}
.products-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.products-hero h1 {
  margin: 0;
  color: #3c3836;
}
.controls input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.products-grid {
  display: block;
}
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 1.1rem;
}

.grid-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.filters {
  display: flex;
  gap: 12px;
  align-items: center;
}
.filter-btn {
  background: transparent;
  border: 1px solid #eee;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.sort {
  display: flex;
  gap: 8px;
  align-items: center;
}
.count {
  color: #504945;
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
  justify-items: stretch;
  align-items: start;
}

/* Catalog layout styles */
.content {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}
.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.filter-section {
  border-bottom: 1px solid #ebdbb2;
}

.filter-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background: transparent;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #3c3836;
  cursor: pointer;
  text-align: left;
}

/* hover removed per request */

.filter-header svg {
  transition: transform 0.2s ease;
}

.filter-header svg.rotated {
  transform: rotate(180deg);
}

.filter-content {
  padding: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-content.pill-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 0 0 16px 0;
}

.filter-content.size-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 0 16px 0;
}

.filter-content.color-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 8px 0 20px 0;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #3c3836;
}

.filter-option input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #d79921;
}

.filter-option span {
  flex: 1;
}

.pill {
  border: 1px solid #ebdbb2;
  border-radius: 999px;
  padding: 10px 14px;
  background: #f9f5d7;
  font-size: 0.95rem;
  color: #3c3836;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

/* hover removed per request */

.pill.selected {
  background: #d79921;
  color: #1d2021;
  border-color: #d79921;
}

.size-button {
  padding: 10px;
  text-align: center;
  border: 1px solid #ebdbb2;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f9f5d7;
  color: #3c3836;
}

/* hover removed per request */

.size-button.selected {
  background: #d79921;
  color: #1d2021;
  border-color: #d65d0e;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

/* hover removed per request */

.color-item.selected .color-circle {
  box-shadow: 0 0 0 3px #d79921;
}

.color-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #ebdbb2;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background: #fbf1c7;
}

.color-circle.is-white {
  border: 2px solid #d5c4a1;
}

.color-circle.is-multi {
  background: conic-gradient(
    from 0deg,
    #000000 0deg 45deg,
    #ffffff 45deg 90deg,
    #0ea5e9 90deg 135deg,
    #ef4444 135deg 180deg,
    #84cc16 180deg 225deg,
    #ec4899 225deg 270deg,
    #eab308 270deg 315deg,
    #9333ea 315deg 360deg
  );
}

.color-name {
  font-size: 0.8125rem;
  color: #3c3836;
  text-align: center;
  line-height: 1.2;
}

/* slide transition for filter panels */
.slide-enter-active,
.slide-leave-active {
  transition:
    max-height 0.25s ease,
    opacity 0.25s ease,
    transform 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
}

.slide-enter-to,
.slide-leave-from {
  max-height: 600px;
  opacity: 1;
  transform: translateY(0);
}

.sidebar h3 {
  margin: 0 0 12px 0;
}
.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}
.sidebar li {
  padding: 6px 0;
  color: #222;
}
.side-list li {
  padding: 8px 0;
  color: #666;
}
.products-main {
  flex: 1;
}
.products-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.products-hero .count-inline {
  color: #504945;
  font-weight: 500;
  margin-left: 8px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}
.tiny {
  background: transparent;
  border: none;
  color: #7c6f64;
  cursor: pointer;
}
.sort-inline {
  position: relative;
  display: inline-block;
}
.sort-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 24px;
  font-size: 0.95rem;
  color: #3c3836;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sort-btn:hover {
  border-color: #d79921;
}
.sort-btn svg {
  width: 14px;
  height: 14px;
}
.sort-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #f9f5d7;
  border: 1px solid #ebdbb2;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(29, 32, 33, 0.15);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}
.sort-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.95rem;
  color: #3c3836;
}
.sort-option:hover {
  background-color: #f2e5bc;
}
.sort-option.active {
  background-color: #ebdbb2;
  font-weight: 600;
}
.sort-option.active::before {
  content: '✓ ';
  margin-right: 8px;
}

/* hide the add button in the grid view */
::v-deep .product-card .add-btn {
  display: none !important;
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}

@media (max-width: 480px) {
  .products-page {
    padding: 12px;
  }
}
</style>
