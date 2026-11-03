/* THẢO THÚ CƯNG • Cấu hình CÔNG KHAI của frontend Cloudflare Pages.
 * 1) Điền Firebase Web App Config (Firebase Console > Project settings).
 * 2) Sau khi Render cấp địa chỉ API, thay địa chỉ ví dụ phía dưới.
 * 3) API Secret / service account JSON chỉ ở Render, TUYỆT ĐỐI không ở file này.
 * 4) Không dùng dấu / ở cuối URL API và không thêm /api ở cuối.
 */
window.THAO_FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: ''
};
window.THAO_API_BASE_URL = 'https://TEN-BACKEND-CUA-BAN.onrender.com';
// true: hiển thị 24 sản phẩm mẫu ngay cả trước khi import Firestore.
// false: chỉ hiển thị sản phẩm từ FastAPI / Firestore.
window.THAO_SHOW_STATIC_CATALOG = true;
