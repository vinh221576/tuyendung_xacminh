// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\backend-tuyendung\server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { contractDoc, contractGhi } = require("./utils/blockchain");
const crypto = require('crypto'); // Thư viện tạo hash
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- KIỂM TRA HỆ THỐNG ---
app.get("/", (req, res) => {
    res.send("Backend Hệ thống Tuyển dụng Blockchain đang chạy (Version 3 - Final Pro)!");
});

// ==========================================
// 1. NHÓM API ĐỌC DỮ LIỆU (GET)
// ==========================================

// 1.1 Lấy vai trò của một địa chỉ ví
app.get("/api/vai-tro/:diaChi", async (req, res) => {
    try {
        const { diaChi } = req.params;
        const vaiTro = await contractDoc.layVaiTro(diaChi);
        res.json({ success: true, vaiTro: vaiTro.toString() });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1.2 Lấy danh sách chứng chỉ của một ứng viên (Người nhận)
app.get("/api/chung-chi/:ungVien", async (req, res) => {
    try {
        const { ungVien } = req.params;
        const danhSach = await contractDoc.layDanhSachChungChi(ungVien);
        
        const ketQua = danhSach.map(cc => ({
            maChungChi: cc.maChungChi,
            tenChungChi: cc.tenChungChi,
            hashDuLieu: cc.hashDuLieu,
            nguoiCap: cc.nguoiCap,
            ngayCap: new Date(Number(cc.ngayCap) * 1000).toLocaleString(),
            hopLe: cc.hopLe
        }));

        res.json({ success: true, data: ketQua });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1.3 [MỚI] Lấy danh sách chứng chỉ ĐÃ CẤP (Dành cho Nhà phát hành xem lịch sử)
app.get("/api/nph/chung-chi-da-cap/:nphAddress", async (req, res) => {
    try {
        const { nphAddress } = req.params;
        // Gọi hàm Smart Contract mới update (V3)
        const danhSach = await contractDoc.layDanhSachChungChiDaCap(nphAddress);
        
        const ketQua = danhSach.map(cc => ({
            maChungChi: cc.maChungChi,
            tenChungChi: cc.tenChungChi,
            hashDuLieu: cc.hashDuLieu,
            nguoiCap: cc.nguoiCap, // Chính là nphAddress
            ngayCap: new Date(Number(cc.ngayCap) * 1000).toLocaleString(),
            hopLe: cc.hopLe
        }));

        res.json({ success: true, data: ketQua });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1.4 Lấy danh sách công việc đang tuyển (Cập nhật: Thêm maChungChiYeuCau)
app.get("/api/cong-viec", async (req, res) => {
    try {
        const danhSach = await contractDoc.layDanhSachCongViec();
        
        const ketQua = danhSach.map(cv => ({
            id: cv.id.toString(),
            nhaTuyenDung: cv.nhaTuyenDung,
            tenCongViec: cv.tenCongViec,
            moTa: cv.moTa,
            yeuCau: cv.yeuCau,
            maChungChiYeuCau: cv.maChungChiYeuCau, // [MỚI] Quan trọng để so khớp
            ngayDang: new Date(Number(cv.ngayDang) * 1000).toLocaleString(),
            dangMo: cv.dangMo
        }));

        res.json({ success: true, data: ketQua });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1.5 Lấy danh sách Hồ sơ ứng tuyển theo ID Công việc (Cập nhật: Thêm maChungChiNop)
app.get("/api/ho-so/:idCongViec", async (req, res) => {
    try {
        const { idCongViec } = req.params;
        const danhSach = await contractDoc.layDanhSachHoSo(idCongViec);
        
        // Enum TrangThaiHoSo: 0: ChoDuyet, 1: DaTuyen, 2: TuChoi
        const trangThaiText = ["Chờ Duyệt", "Đã Tuyển", "Từ Chối"];

        const ketQua = danhSach.map((hs, index) => ({
            index: index, 
            ungVien: hs.ungVien,
            maChungChiNop: hs.maChungChiNop, // [MỚI] Mã ứng viên dùng để nộp
            hashChungChi: hs.hashChungChi,
            ngayNop: new Date(Number(hs.ngayNop) * 1000).toLocaleString(),
            trangThai: trangThaiText[Number(hs.trangThai)],
            trangThaiCode: Number(hs.trangThai),
            daXacMinh: hs.daXacMinh,
            ketQuaXacMinh: hs.ketQuaXacMinh
        }));
        res.json({ success: true, data: ketQua });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 2. NHÓM API TIỆN ÍCH & GHI DỮ LIỆU
// ==========================================

// API: Tạo Hash SHA-256 từ thông tin văn bản
app.post("/api/tien-ich/tao-hash", (req, res) => {
    try {
        const { duLieu } = req.body; 
        
        if (!duLieu) return res.status(400).json({ error: "Thieu du lieu" });

        // Tạo hash SHA-256
        const hash = crypto.createHash('sha256').update(duLieu).digest('hex');
        
        res.json({ 
            success: true, 
            hash: "0x" + hash // Format hex chuẩn Blockchain
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Demo API Backend tự gọi Smart Contract (Dùng cho Admin hoặc test)
app.post("/api/admin/cap-chung-chi-demo", async (req, res) => {
    try {
        const { ungVien, maChungChi, tenChungChi } = req.body;
        // Hash demo
        const hashDuLieu = "HASH_" + maChungChi + "_" + Date.now();
        
        console.log("⏳ Đang gửi transaction lên Blockchain...");
        const tx = await contractGhi.capChungChi(ungVien, maChungChi, tenChungChi, hashDuLieu);
        
        console.log("⏳ Đang chờ xác nhận...");
        await tx.wait();
        
        res.json({ success: true, message: "Đã cấp chứng chỉ thành công!", hashGiaoDich: tx.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Vĩnh đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔗 Đã kết nối Contract: ${process.env.DIA_CHI_CONTRACT}`);
});