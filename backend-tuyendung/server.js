// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import Routes
const apiRoutes = require("./routes/apiRoutes");

const app = express();

// --- CẤU HÌNH MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- KIỂM TRA HỆ THỐNG ---
app.get("/", (req, res) => {
    res.send("Backend Hệ thống Tuyển dụng Blockchain đang chạy (Mô hình MVC - Version 3)!");
});

// --- SỬ DỤNG ROUTES ---
// Tất cả API sẽ bắt đầu bằng /api
// Ví dụ: /api/vai-tro/:diaChi
app.use("/api", apiRoutes);

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Vĩnh đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔗 Đã kết nối Contract: ${process.env.DIA_CHI_CONTRACT}`); // (Dòng này đã chuyển vào utils)
});