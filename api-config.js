/* CHỈ LÀ CẤU HÌNH FRONTEND CÔNG KHAI; tuyệt đối không nhập Firebase private key / JWT secret / Cloudinary API secret. */
(function () {
  const host = window.location.hostname;
  const onLocal = host === 'localhost' || host === '127.0.0.1';
  // 1) Chạy local: FastAPI ở cổng 8000.
  // 2) Deploy Cloudflare: thay giá trị YOUR-RENDER-BACKEND bằng tên dịch vụ Render thật.
  window.THAO_API_BASE_URL = onLocal
    ? 'http://127.0.0.1:8000'
    : 'https://YOUR-RENDER-BACKEND.onrender.com';

  // Cho hiện 24 sản phẩm minh họa ngay cả khi Firestore đang trống.
  window.THAO_SHOW_STATIC_CATALOG = false;
})();
