CẤU TRÚC THƯ MỤC
backend-tuyendung/
├── abis/                   # Chứa file JSON ABI (Giữ nguyên)
├── controllers/            # [MỚI] Chứa logic xử lý (Tách từ server.js)
│   ├── chungChiController.js
│   ├── tuyenDungController.js
│   ├── nguoiDungController.js
│   └── adminController.js
├── routes/                 # [MỚI] Định nghĩa đường dẫn API
│   └── apiRoutes.js
├── utils/                  # Chứa file kết nối Blockchain (Giữ nguyên)
│   └── blockchain.js
├── .env                    # Cấu hình (Giữ nguyên)
├── package.json            # (Giữ nguyên)
└── server.js               # File chạy chính (Giờ sẽ rất gọn)