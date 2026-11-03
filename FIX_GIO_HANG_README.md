# Sửa lỗi hiển thị 0 và 2 cùng lúc ở giỏ hàng trang chủ

## Nguyên nhân
Ảnh banner `assets/home-desktop.webp` đã chứa sẵn huy hiệu đỏ với số 0.
`site.js` thêm một huy hiệu động mới nhưng huy hiệu đó bị lệch, dẫn đến nhìn thấy cả 0 và 2.

## Đã sửa
- `site.css`: căn huy hiệu động trùng chính xác vị trí huy hiệu trên ảnh gốc, phủ số cũ.
- `site.js`: giữ huy hiệu trang chủ hiện cả khi giỏ rỗng (số 0); các trang còn lại vẫn ẩn huy hiệu khi giỏ rỗng.
- 40 file HTML: cập nhật truy vấn phiên bản tài nguyên CSS/JS để tránh cache cũ.

## Cài đặt
**Cách 1:** Giải nén `Thao_Thu_Cung_Frontend_Gio_Hang_Chi_1_So.zip`, thay toàn bộ thư mục frontend cũ. `api-config.js` có thể cần giữ URL backend thực tế đang sử dụng của bạn.
**Cách 2:** Với frontend của đúng bản `Thao_Thu_Cung_Frontend_2_Tab_Khach_Admin`, chỉ thay `site.css`, `site.js` và `index.html` từ ZIP patch. Nếu Cloudflare vẫn cache, hard-refresh Ctrl+Shift+R.
Không cần sửa backend, Firestore, Cloudinary hay dữ liệu giỏ hàng.
