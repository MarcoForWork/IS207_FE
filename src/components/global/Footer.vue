<template>
  <footer class="main-footer">
    <div class="policy-bar">
      <div class="policy-track">
        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <!-- Nhân đôi để chạy vô hạn -->
        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>

        <div class="policy-item">
          <span class="policy-text">MIỄN PHÍ SHIP</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">BẢO HÀNH 365 NGÀY</span>
          <span class="policy-separator">|</span>
          <span class="policy-text">ĐƯỢC ĐỔI SIZE KHI MUA HÀNG SALE</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} LoremIpsum.vn. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
}
</script>

<style>
/* ======================================= */
/* =========== FOOTER & GRUVBOX STYLE ==== */
/* ======================================= */

.main-footer {
  width: 100%;
  background-color: #32302f;
  color: #ebdbb2;
  font-family: Arial, sans-serif;
}

/* ===== POLICY BAR (CAROUSEL) ===== */
.policy-bar {
  background-color: #000000;
  color: #fbf1c7;
  overflow: hidden; /* QUAN TRỌNG */
  white-space: nowrap;
  padding: 12px 0;
  font-size: 0.85em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Track chạy ngang */
.policy-track {
  display: flex;
  width: max-content;
  animation: policy-scroll 20s linear infinite;
}

/* Item */
.policy-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-right: 60px; /* khoảng cách giữa 2 vòng lặp */
}

.policy-separator {
  color: #a89984;
}

/* Hover dừng (pro) */
.policy-bar:hover .policy-track {
  animation-play-state: paused;
}

/* Animation chạy vô hạn */
@keyframes policy-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* ===== FOOTER BOTTOM ===== */
.footer-bottom {
  padding: 15px 20px;
  text-align: center;
  font-size: 0.75em;
  border-top: 1px solid #45403e;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .policy-track {
    animation-duration: 30s; /* mobile chạy chậm hơn */
  }
}
</style>
