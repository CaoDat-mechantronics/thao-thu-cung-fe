# Thảo Thú Cưng – Frontend JWT Username đã sửa

## 1. Điều kiện để đăng nhập thành công

- Backend tương ứng là `Thao_Thu_Cung_Backend_JWT_Username.zip`, KHÔNG phải bản Firebase Authentication hay bản JWT Email cũ.
- Đã tạo Firestore Database `(default)` cho dự án Firebase.
- Backend `.env` phải có `FIREBASE_PROJECT_ID`, đường dẫn `GOOGLE_APPLICATION_CREDENTIALS`, `JWT_SECRET_KEY` dài tối thiểu 32 byte và các biến Cloudinary.
- Đã tạo tài khoản bằng `python create_user.py --username admin_shop --role admin`. Mật khẩu >=12 ký tự.
- Chạy backend cổng 8000, frontend cổng 5500; không mở `login.html` bằng `file://`.

## 2. Khởi động Windows (2 Terminal)

### Terminal 1 – backend

```powershell
cd C:\Users\admin\Downloads\Thao_page\backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --env-file .env --host 127.0.0.1 --port 8000
```

### Terminal 2 – frontend

```powershell
cd C:\Users\admin\Downloads\Thao_page\frontend
python -m http.server 5500
```

Mở `http://localhost:5500/login.html` → dùng **username + password**, không dùng email.

`api-config.js` đã cấu hình tự động: nếu chạy từ `localhost`/`127.0.0.1` thì gọi `http://127.0.0.1:8000`. Khi deploy Cloudflare, **thay `YOUR-RENDER-BACKEND` bằng hostname Render thật** trước khi upload.

## 3. Chẩn đoán khi không đăng nhập được

1. Mở `http://127.0.0.1:8000/api/health`, kiểm tra `jwtConfigured: true` và `firebaseConfigured: true`.
2. Mở `http://127.0.0.1:8000/api/docs`, dùng `POST /api/auth/login` với JSON:

```json
{"username":"admin_shop","password":"MAT_KHAU_DA_TAO"}
```

3. Nếu Swagger đăng nhập thành công mà web lỗi, nhấn **Kiểm tra kết nối API** trên trang login hoặc xem DevTools → Network → `/api/auth/login`.
4. HTTP 401: username/password không đúng (hoặc token hết hạn). HTTP 403: tài khoản không có role admin. HTTP 404: backend chưa phải bản JWT Username. HTTP 503: Firestore hoặc JWT cấu hình sai. CORS/`Failed to fetch`: chỉnh `CORS_ORIGINS` ở backend `.env` thành `http://localhost:5500,http://127.0.0.1:5500`, sau đó restart FastAPI.
5. Nếu frontend chạy qua Cloudflare Pages, `api-config.js` phải dùng URL `https://...onrender.com` chứ không dùng `127.0.0.1`.
6. Nếu bạn đã chạy frontend cũ, nhấn Ctrl+Shift+R hoặc mở cửa sổ ẩn danh để tránh cache `admin.js` cũ. Bản mới có version trên link JS.

## 4. Ghi chú bảo mật

- Không đặt JWT secret, Cloudinary API Secret hay Firebase Service Account JSON trong frontend.
- Session JWT được lưu tạm trong sessionStorage của tab (giải pháp phiên thử nghiệm), không phải cookie HttpOnly; trước khi thương mại hóa nên bổ sung bảo vệ chống XSS/rate limiting/MFA nếu cần.
- Frontend không tạo tài khoản Admin công khai. Chỉ dùng `create_user.py` ở backend hoặc API Admin có JWT hợp lệ.
