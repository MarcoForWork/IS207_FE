// API Configuration and Constants
// Update BASE_URL with your actual backend API URL
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  TIMEOUT: 10000, // Request timeout in milliseconds
}

export function getHeaders() {
  const token = localStorage.getItem('auth_token')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}


// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/login',
    SIGNUP: '/api/register',
    LOGOUT: '/api/logout',
    REFRESH_TOKEN: '/api/refresh-token',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password',
  },

  // User/Customers
  CUSTOMER: {
    PROFILE: '/customer/profile',
    UPDATE_PROFILE: '/customer/profile/update',
    CHANGE_PASSWORD: '/customer/password/change',
    ORDERS: '/customer/orders',
    ORDER_DETAIL: (orderId) => `/customer/orders/${orderId}`,
  },

  // Products
  PRODUCTS: {
    LIST: '/api/products',
    IMAGES: '/api/products-images',
    DETAIL: (id) => `/api/products/${id}`,
    BY_COLOR: (id) => `/api/products-by-color/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
    BY_COLLECTION: (collectionId) => `/products/collection/${collectionId}`,
    HIGHLIGHTS: (id) => `/api/products-highlights/${id}`,
    FAQS: (id) => `/api/products-faqs/${id}`,
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    BEST_SELLERS: '/products/best-sellers',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (categoryId) => `/categories/${categoryId}`,
  },

  // Collections
  COLLECTIONS: {
    LIST: '/collections',
    DETAIL: (collectionId) => `/collections/${collectionId}`,
  },

  // Reviews
  REVIEWS: {
    GET_MY_REVIEWS: (userId) => `/reviews/${userId}`,
    CREATE: (productId) => `/products/${productId}/reviews`,
    UPDATE: (reviewId) => `/reviews/${reviewId}`,
    DELETE: (reviewId) => `/reviews/${reviewId}`,
    GET_PRODUCT_REVIEWS: (productId) => `/products/${productId}/reviews`,
    MARK_HELPFUL: (reviewId) => `/reviews/${reviewId}/helpful`,
  },

  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/add',
    UPDATE_ITEM: (itemId) => `/cart/${itemId}`,
    REMOVE_ITEM: (itemId) => `/cart/${itemId}`,
    CLEAR: '/cart/clear',
  },

  // Checkout & Orders
  CHECKOUT: {
    PROCESS: '/checkout',
    VALIDATE: '/checkout/validate',
    APPLY_COUPON: '/checkout/coupon',
  },

  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (orderId) => `/orders/${orderId}`,
    CANCEL: (orderId) => `/orders/${orderId}/cancel`,
    TRACK: (orderId) => `/orders/${orderId}/track`,
  },

  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (itemId) => `/wishlist/${itemId}`,
  },

  // Addresses
  ADDRESSES: {
    LIST: '/addresses',
    CREATE: '/addresses',
    UPDATE: (addressId) => `/addresses/${addressId}`,
    DELETE: (addressId) => `/addresses/${addressId}`,
    SET_DEFAULT: (addressId) => `/addresses/${addressId}/default`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (notificationId) => `/notifications/${notificationId}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (notificationId) => `/notifications/${notificationId}`,
  },

  // Payment
  PAYMENT: {
    METHODS: '/payment/methods',
    PROCESS: '/payment/process',
    VERIFY: '/payment/verify',
  },

  // Coupons
  COUPONS: {
    VALIDATE: '/coupons/validate',
    APPLY: '/coupons/apply',
  },

  // Contact & Support
  SUPPORT: {
    CONTACT: '/contact',
    FAQ: '/faq',
    SUBMIT_TICKET: '/support/tickets',
  },

  // Admin Dashboard APIs
  ADMIN: {
    // Categories Management
    CATEGORIES: {
      CREATE: '/categories',
      UPDATE: (categoryId) => `/categories/${categoryId}`,
      UPDATE_STATUS: (categoryId) => `/categories/${categoryId}/status`,
    },

    // Collections Management
    COLLECTIONS: {
      CREATE: '/collections',
      UPDATE: (collectionId) => `/collections/${collectionId}`,
      UPDATE_STATUS: (collectionId) => `/collections/${collectionId}/status`,
    },

    // Products Management
    PRODUCTS: {
      CREATE: '/products',
      UPDATE: (productId) => `/products/${productId}`,
      UPDATE_STATUS: (productId) => `/products/${productId}/status`,
    },

    // Product Images Management
    PRODUCT_IMAGES: {
      CREATE: '/product-images',
    },

    // Product Discounts Management
    PRODUCT_DISCOUNTS: {
      CREATE: '/product-discounts',
    },

    // Product Colors Management
    PRODUCT_COLORS: {
      CREATE: '/product-colors',
    },

    // Product FAQs Management
    PRODUCT_FAQS: {
      CREATE: '/product-faqs',
      UPDATE: (faqId) => `/product-faqs/${faqId}`,
      DELETE: (faqId) => `/product-faqs/${faqId}`,
    },

    // Product Highlights Management
    PRODUCT_HIGHLIGHTS: {
      CREATE: '/product-highlights',
      UPDATE: (highlightId) => `/product-highlights/${highlightId}`,
      DELETE: (highlightId) => `/product-highlights/${highlightId}`,
    },

    // Orders Management
    ORDERS: {
      UPDATE_STATUS: (orderId) => `/orders/${orderId}/status`,
    },
  },
}

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

// API Response Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  SERVER_ERROR: 500,
}

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const userInfo = localStorage.getItem('user-info')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token || ''}`,
      }
    } catch (e) {
      console.error('Error parsing user info:', e)
    }
  }
  return {
    'Content-Type': 'application/json',
  }
}

// // Helper function to get common headers
// export const getHeaders = (includeAuth = false) => {
//   if (includeAuth) {
//     return getAuthHeaders()
//   }
//   return {
//     'Content-Type': 'application/json',
//   }
// }
