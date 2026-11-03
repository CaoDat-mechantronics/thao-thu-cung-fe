# Thảo Thú Cưng — FastAPI JWT / Firestore / Cloudinary

Bản thay thế hoàn chỉnh cho kiến trúc **Firebase Authentication trên frontend**. Frontend không còn Firebase SDK/Web API Key; FastAPI nhận username+mật khẩu, xác thực với password hash Argon2id lưu trong Firestore rồi phát hành JWT HS256.

## A. Backend local

1. Giải nén `backend/` rồi mở thư mục backend trong VS Code.
2. Tạo và sử dụng virtualenv, cài `requirements.txt`.
3. Tạo `backend/.env` từ `backend/.env.example` và điền: `FIREBASE_PROJECT_ID=thao-thu-cung`, `GOOGLE_APPLICATION_CREDENTIALS` trỏ đến file private-key JSON nằm **ngoài repository**, Cloudinary keys, `JWT_SECRET_KEY` (sinh bằng `python -c "import secrets; print(secrets.token_hex(32))"`), CORS.
4. Chạy server:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
# Chỉnh .env rồi chạy:
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --env-file .env --host 127.0.0.1 --port 8000
```

5. Kiểm tra `http://127.0.0.1:8000/api/health` và `http://127.0.0.1:8000/api/products`.
6. Tạo tài khoản Admin đầu tiên (mở **terminal thứ 2** tại backend):

```powershell
.\.venv\Scripts\python.exe create_user.py --username admin_shop --role admin
```

CLI yêu cầu tự nhập mật khẩu tối thiểu 12 ký tự và nhập lại để xác nhận; không đặt mật khẩu trong source hoặc lệnh shell. Không cần bật Firebase Authentication.

## B. Frontend local

1. Giải nén `frontend/`, mở file `api-config.js`, giữ `THAO_API_BASE_URL = 'http://127.0.0.1:8000'`.
2. Từ terminal frontend chạy `python -m http.server 5500`.
3. Vào `http://localhost:5500/login.html` đăng nhập bằng username đã tạo.
4. Admin đăng ảnh thì FastAPI upload lên Cloudinary; thông tin sản phẩm được lưu Firestore.

## C. Deploy độc lập

- `frontend/` → Cloudflare Pages: upload trực tiếp hoặc GitHub, build command `exit 0`, output `.`; cập nhật `api-config.js` theo URL Render HTTPS thực tế.
- `backend/` → Render Web Service: install `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers`; thêm biến môi trường y hệt local. Lưu Service Account JSON trong Render Secret File, trỏ `GOOGLE_APPLICATION_CREDENTIALS` vào file đó.
- Trên Render, đặt `CORS_ORIGINS=https://ten-du-an.pages.dev` theo domain thực tế (cộng thêm domain tùy chỉnh nếu có).
- Nếu cần tạo user mới sau khi deploy, chạy `create_user.py` ở máy local trỏ đến cùng Firestore; hoặc dùng `POST /api/admin/users` với JWT Admin.

## D. Những thay đổi so với bản trước

- Bỏ Firebase Auth SDK / `firebase-config.js` ở frontend; thay bằng `api-config.js` (chỉ URL API).
- Thay Firebase ID token bằng JWT do backend tự ký, có hạn dùng, issuer, audience, phiên bản thu hồi.
- Backend lưu tài khoản Firestore `users`, Argon2id `passwordHash`, `role`, `active`; không lưu plaintext.
- Thêm các endpoint `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`, `/api/admin/users`.
- Giữ lại danh mục, ảnh, Cloudinary, quản lý sản phẩm và thiết kế HTML hiện tại.
- **Còn dùng Firestore lưu products/media theo hệ thống trước.** Nếu muốn chỉ dùng Firebase cho tài khoản mà sản phẩm lưu dịch vụ khác, cần chọn cơ sở dữ liệu sản phẩm thay thế.

## E. Giới hạn và lưu ý bảo mật

- Không phải hệ thống nhận diện người dùng production hoàn thiện: chưa có xác thực email, quên mật khẩu, MFA, rate-limit phân tán; hãy triển khai thêm trước khi phục vụ nhiều người dùng.
- JWT access 30 phút, frontend lưu trong `sessionStorage` (dễ truy cập nếu website mắc XSS). Không lưu token ở `localStorage`. Xem `backend/README_RENDER.md` để cân nhắc giải pháp cookie HttpOnly/BFF trong tương lai.
- Giữ `.env`, Private Key Firebase và Cloudinary API Secret chỉ ở backend. Tài khoản đã tạo từ Firebase Authentication cũ sẽ không tự được chuyển sang Firestore.
- Đã kiểm thử cú pháp Python/JS, liên kết HTML và 9 bài HTTP API mô phỏng; chưa kiểm thử thực tế với Cloudinary/Firebase của bạn hay giao diện bằng trình duyệt.


## Bản bổ sung hai loại tài khoản

Xem `HUONG_DAN_TAI_KHOAN_KHACH_HANG.md`. Cập nhật cả backend cho `/api/auth/register`, rồi dùng hai tab ở `login.html`. Tài khoản thường vào `tai-khoan.html`, không có quyền vào `admin.html`.
