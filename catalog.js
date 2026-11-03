'use strict';
// DỮ LIỆU MINH HỌA – sản phẩm, giá và ưu đãi đều là giả định để trình diễn giao diện.
// Để bán hàng thật, thay bằng dữ liệu hàng hóa và ảnh sản phẩm đã được xác minh.
window.SHOP_PRODUCTS = [
  {id:'cho-01', categoryId:'cho', name:'Hạt Gà & Bí Đỏ Vui Vẻ', short:'Hạt giòn vị gà, kết hợp bí đỏ cho bữa ăn mỗi ngày.', size:'Túi 2 kg', price:245000, oldPrice:279000, badge:'Bán chạy', form:'bag', color:'#FFB852', icon:'dog'},
  {id:'cho-02', categoryId:'cho', name:'Hạt Cá Hồi & Rau Củ', short:'Bữa ăn vị cá hồi cùng rau củ, thơm ngon dễ lựa chọn.', size:'Túi 1,5 kg', price:269000, oldPrice:0, badge:'Mới', form:'bag', color:'#8DD9C7', icon:'dog'},
  {id:'cho-03', categoryId:'cho', name:'Pate Gà Cà Rốt Mềm Mịn', short:'Pate mềm vị gà và cà rốt, tiện dùng trong bữa chính.', size:'Lon 100 g', price:32000, oldPrice:39000, badge:'Ưu đãi', form:'can', color:'#FFAC9B', icon:'dog'},
  {id:'cho-04', categoryId:'cho', name:'Bánh Xương Giòn Giòn', short:'Bánh thưởng hình xương cho những buổi vui chơi.', size:'Gói 150 g', price:79000, oldPrice:0, badge:'Đáng yêu', form:'treat', color:'#BDA4F0', icon:'dog'},

  {id:'meo-01', categoryId:'meo', name:'Hạt Cá Hồi Meo Meo', short:'Hạt thơm vị cá hồi dành cho những boss mê cá.', size:'Túi 1,5 kg', price:239000, oldPrice:269000, badge:'Bán chạy', form:'bag', color:'#F4A9BE', icon:'cat'},
  {id:'meo-02', categoryId:'meo', name:'Pate Cá Ngừ Sốt Mềm', short:'Thức ăn ướt vị cá ngừ, kết cấu mềm mịn.', size:'Gói 85 g', price:29000, oldPrice:0, badge:'Mới', form:'pouch', color:'#A4D5FA', icon:'cat'},
  {id:'meo-03', categoryId:'meo', name:'Súp Thưởng Cá Hồi Mịn', short:'Súp thưởng dạng kem, dùng như món ăn vặt.', size:'Hộp 4 × 15 g', price:59000, oldPrice:69000, badge:'Ưu đãi', form:'sticks', color:'#FFC77C', icon:'cat'},
  {id:'meo-04', categoryId:'meo', name:'Viên Snack Cá Nhỏ', short:'Miếng snack nhỏ xinh, thuận tiện để thưởng cho mèo.', size:'Gói 80 g', price:65000, oldPrice:0, badge:'Đáng yêu', form:'treat', color:'#B6DCA1', icon:'cat'},

  {id:'suc-khoe-01', categoryId:'suc-khoe', name:'Sữa Tắm Yến Mạch Dịu Nhẹ', short:'Dòng chăm sóc lông và da dùng khi tắm cho thú cưng.', size:'Chai 300 ml', price:135000, oldPrice:159000, badge:'Yêu thích', form:'bottle', color:'#B1D5B1', icon:'paw'},
  {id:'suc-khoe-02', categoryId:'suc-khoe', name:'Khăn Ướt Lau Chân & Lông', short:'Tiện vệ sinh nhẹ nhàng sau khi đi dạo.', size:'Gói 80 tờ', price:59000, oldPrice:0, badge:'Tiện lợi', form:'wipes', color:'#A5D6ED', icon:'paw'},
  {id:'suc-khoe-03', categoryId:'suc-khoe', name:'Dung Dịch Vệ Sinh Tai', short:'Sản phẩm vệ sinh thông thường; xem kỹ hướng dẫn sử dụng.', size:'Chai 120 ml', price:115000, oldPrice:129000, badge:'Chăm sóc', form:'spray', color:'#E6C7F7', icon:'paw'},
  {id:'suc-khoe-04', categoryId:'suc-khoe', name:'Bàn Chải Răng Silicon', short:'Dụng cụ vệ sinh răng miệng với đầu chải mềm.', size:'Bộ 2 chiếc', price:69000, oldPrice:0, badge:'Gọn nhẹ', form:'brush', color:'#FFBBA9', icon:'paw'},

  {id:'dinh-duong-01', categoryId:'dinh-duong', name:'Hạt Cho Cún Con Năng Động', short:'Dòng thức ăn được phân loại theo giai đoạn chó con.', size:'Túi 1,5 kg', price:219000, oldPrice:249000, badge:'Cho cún con', form:'bag', color:'#FFCB7F', icon:'dog'},
  {id:'dinh-duong-02', categoryId:'dinh-duong', name:'Hạt Cho Mèo Con Tinh Nghịch', short:'Dòng thức ăn được phân loại theo giai đoạn mèo con.', size:'Túi 1,2 kg', price:205000, oldPrice:0, badge:'Cho mèo con', form:'bag', color:'#FDB4D5', icon:'cat'},
  {id:'dinh-duong-03', categoryId:'dinh-duong', name:'Pate Mềm Cho Boss Lớn Tuổi', short:'Pate mềm, tiện chia thành các phần nhỏ.', size:'Lon 100 g', price:35000, oldPrice:42000, badge:'Mềm mịn', form:'can', color:'#BBA9EA', icon:'cat'},
  {id:'dinh-duong-04', categoryId:'dinh-duong', name:'Hạt Khẩu Phần Cân Bằng', short:'Lựa chọn khẩu phần theo nhu cầu và mức vận động.', size:'Túi 1,5 kg', price:259000, oldPrice:0, badge:'Lựa chọn', form:'bag', color:'#9ED6C0', icon:'dog'},

  {id:'phu-kien-01', categoryId:'phu-kien', name:'Bát Ăn Chống Trượt Paws', short:'Bát ăn màu cam sữa với chân đế chắc chắn.', size:'1 bát · 450 ml', price:89000, oldPrice:109000, badge:'Bán chạy', form:'bowl', color:'#FFD07D', icon:'paw'},
  {id:'phu-kien-02', categoryId:'phu-kien', name:'Dây Dắt Dệt Mềm Dạo Phố', short:'Dây dắt màu pastel, có móc gài tiện lợi.', size:'1 dây · 1,5 m', price:129000, oldPrice:0, badge:'Dạo phố', form:'leash', color:'#B7B1EB', icon:'paw'},
  {id:'phu-kien-03', categoryId:'phu-kien', name:'Lược Chải Lông Tự Làm Sạch', short:'Dụng cụ gỡ lông rụng, dễ thao tác khi chăm sóc.', size:'1 chiếc', price:109000, oldPrice:129000, badge:'Tiện ích', form:'comb', color:'#B5DED0', icon:'paw'},
  {id:'phu-kien-04', categoryId:'phu-kien', name:'Túi Vận Chuyển Thoáng Khí', short:'Thiết kế có ô lưới và quai xách cho thú cưng nhỏ.', size:'Size S', price:329000, oldPrice:0, badge:'Mới', form:'carrier', color:'#F6B6C3', icon:'paw'},

  {id:'bo-sung-01', categoryId:'bo-sung', name:'Bánh Quy Bí Đỏ Nhỏ Xinh', short:'Bánh thưởng giòn thơm vị bí đỏ, chia phần tiện lợi.', size:'Gói 120 g', price:69000, oldPrice:79000, badge:'Ưu đãi', form:'cookies', color:'#FFCB77', icon:'dog'},
  {id:'bo-sung-02', categoryId:'bo-sung', name:'Snack Cá Hồi Sấy Thơm', short:'Món thưởng vị cá hồi, dùng xen kẽ bữa chính.', size:'Gói 80 g', price:89000, oldPrice:0, badge:'Bán chạy', form:'treat', color:'#A6D2F3', icon:'cat'},
  {id:'bo-sung-03', categoryId:'bo-sung', name:'Viên Thưởng Mềm Vị Gà', short:'Viên thưởng kích thước nhỏ cho giờ huấn luyện.', size:'Gói 100 g', price:75000, oldPrice:85000, badge:'Yêu thích', form:'treat', color:'#DFB7EF', icon:'dog'},
  {id:'bo-sung-04', categoryId:'bo-sung', name:'Topping Thịt Xé Mềm Mềm', short:'Món thêm cho bữa ăn, giúp đổi vị thực đơn.', size:'Gói 80 g', price:55000, oldPrice:0, badge:'Đổi vị', form:'pouch', color:'#A5D8B0', icon:'cat'}
];
// Ảnh chụp THẬT lấy từ Wikimedia Commons; chỉ minh họa LOẠI hàng hóa.
// Không khẳng định ảnh là đúng SKU/nhãn hiệu của các mặt hàng demo ở trên.
window.PRODUCT_PHOTOS={
  "cho-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Dog_food_in_a_bowl.jpg/640px-Dog_food_in_a_bowl.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Dog_food_in_a_bowl.jpg",
    "author": "James Redekop",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "title": "Dog food in a bowl.jpg"
  },
  "cho-04": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Dog-biscuit.jpg/640px-Dog-biscuit.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Dog-biscuit.jpg",
    "author": "FiveRings",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
    "title": "Dog-biscuit.jpg"
  },
  "meo-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Cat_food_(pellets_and_water).jpg/640px-Cat_food_(pellets_and_water).jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Cat_food_(pellets_and_water).jpg",
    "author": "Deavmi",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "title": "Cat food (pellets and water).jpg"
  },
  "meo-02": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Wet_cat_food_01.jpg/640px-Wet_cat_food_01.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Wet_cat_food_01.jpg",
    "author": "Anne Jea",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "title": "Wet cat food 01.jpg"
  },
  "suc-khoe-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Shingoli_shampoo_Tick_n_flea_front.jpg/640px-Shingoli_shampoo_Tick_n_flea_front.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Shingoli_shampoo_Tick_n_flea_front.jpg",
    "author": "Shingoli",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "title": "Shingoli shampoo Tick n flea front.jpg"
  },
  "dinh-duong-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Pile_of_Kibble_Dog_Food_(51049786351).jpg/640px-Pile_of_Kibble_Dog_Food_(51049786351).jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Pile_of_Kibble_Dog_Food_(51049786351).jpg",
    "author": "Megan Marrs",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "title": "Pile of Kibble Dog Food (51049786351).jpg"
  },
  "dinh-duong-02": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Dry_cat_food_01.jpg/640px-Dry_cat_food_01.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Dry_cat_food_01.jpg",
    "author": "Anne Jea",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "title": "Dry cat food 01.jpg"
  },
  "phu-kien-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Large_Dog_food_bowl.jpg/640px-Large_Dog_food_bowl.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Large_Dog_food_bowl.jpg",
    "author": "Ohiopetwatch",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "title": "Large Dog food bowl.jpg"
  },
  "phu-kien-04": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cat_in_soft_side_cat_carrier.jpg/640px-Cat_in_soft_side_cat_carrier.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Cat_in_soft_side_cat_carrier.jpg",
    "author": "Tylervigen",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
    "title": "Cat in soft side cat carrier.jpg"
  },
  "bo-sung-01": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Dog_Treats_(51049057473).jpg/640px-Dog_Treats_(51049057473).jpg",
    "page": "https://commons.wikimedia.org/wiki/File:Dog_Treats_(51049057473).jpg",
    "author": "Megan Marrs",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
    "title": "Dog Treats (51049057473).jpg"
  },
  "bo-sung-03": {
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/A_Dog_biscuit.jpg/640px-A_Dog_biscuit.jpg",
    "page": "https://commons.wikimedia.org/wiki/File:A_Dog_biscuit.jpg",
    "author": "germanny",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
    "title": "A Dog biscuit.jpg"
  }
};
window.SHOP_PRODUCTS=window.SHOP_PRODUCTS.map(p=>{
  const photo=window.PRODUCT_PHOTOS[p.id];
  const fallbackImage=`assets/products/${p.id}.webp`;
  return {...p, image:photo?.image||fallbackImage, fallbackImage,
    photoSource:photo?.page||'', photoAuthor:photo?.author||'', photoLicense:photo?.license||'',
    photoIsReal:!!photo};
});
