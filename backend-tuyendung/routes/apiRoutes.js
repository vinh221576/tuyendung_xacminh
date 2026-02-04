// routes/apiRoutes.js
const express = require("express");
const router = express.Router();

// Import các Controllers
const nguoiDungController = require("../controllers/nguoiDungController");
const chungChiController = require("../controllers/chungChiController");
const tuyenDungController = require("../controllers/tuyenDungController");
const adminController = require("../controllers/adminController");

// --- 1. NHÓM API NGƯỜI DÙNG ---
router.get("/vai-tro/:diaChi", nguoiDungController.layVaiTro);

// --- 2. NHÓM API CHỨNG CHỈ ---
router.get("/chung-chi/:ungVien", chungChiController.layDanhSachChungChi);
router.get("/nph/chung-chi-da-cap/:nphAddress", chungChiController.layLichSuCapChungChi);
router.post("/tien-ich/tao-hash", chungChiController.taoHashTienIch);

// --- 3. NHÓM API TUYỂN DỤNG ---
router.get("/cong-viec", tuyenDungController.layDanhSachCongViec);
router.get("/ho-so/:idCongViec", tuyenDungController.layDanhSachHoSo);

// --- 4. NHÓM API ADMIN (DEMO) ---
router.post("/admin/cap-chung-chi-demo", adminController.capChungChiDemo);

module.exports = router;