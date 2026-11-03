# Frontend Cloudflare – dùng JWT của FastAPI

1. Mở `api-config.js`, chỉnh `window.THAO_API_BASE_URL` thành URL Render thật. Chạy local bằng `http://127.0.0.1:8000`.
2. Không cần Firebase Web App Config / Firebase Authentication SDK. Firebase chỉ được truy cập từ backend.
3. Cấu hình `CORS_ORIGINS` ở Render bao gồm origin frontend Cloudflare.
4. Deploy toàn bộ thư mục frontend lên Cloudflare Pages. Build command `exit 0`, output directory `.`.
5. Để chạy local: `python -m http.server 5500`; mở `http://localhost:5500/login.html` và đăng nhập bằng tài khoản được tạo qua `backend/create_user.py`.
6. JWT được giữ trong `sessionStorage` của tab, tự hết hạn sau khoảng 30 phút; đăng xuất sẽ thu hồi JWT tại backend.

`api-config.js` là file **công khai**; tuyệt đối không điền JWT_SECRET_KEY, khóa Cloudinary, hoặc Service Account JSON vào file này.
