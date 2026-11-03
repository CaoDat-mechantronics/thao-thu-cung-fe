# Hai tab đăng nhập + tài khoản khách hàng

Trang `login.html` có 2 tab: **Khách hàng** và **Quản trị viên**. Tài khoản được lưu ở collection `users` Firestore. FastAPI ký và xác thực JWT, không yêu cầu Firebase SDK ở frontend.

- `POST /api/auth/register` dùng riêng cho đăng ký khách hàng; backend gán cứng `role=customer`.
- `POST /api/auth/login` cho hai vai trò; frontend xác minh role bằng `/api/auth/me` trước khi điều hướng.
- `tai-khoan.html`: thông tin username, sản phẩm yêu thích, giỏ hàng lưu cục bộ, khung đơn hàng dự kiến (chưa có API đơn hàng).
- Admin chỉ được tạo bởi `create_user.py --username ... --role admin` hoặc API quản trị có JWT Admin.

**Phải cập nhật cả backend**: bản backend cũ chưa có `/api/auth/register`; khi đó đăng ký khách sẽ gặp HTTP 404. Bạn vẫn có thể tạo customer từ terminal bằng `python create_user.py --username ten_user --role customer`.

Local: chạy backend tại `http://127.0.0.1:8000`, frontend `python -m http.server 5500` và mở `http://localhost:5500/login.html`.

Frontend Cloudflare: sửa `api-config.js` trỏ Render, Render CORS_ORIGINS cho phép chính xác domain Pages. JWT sử dụng sessionStorage (từng tab), cart và wishlist còn ở localStorage (từng trình duyệt). Chưa có API đơn hàng / thanh toán / đồng bộ giỏ hàng.
