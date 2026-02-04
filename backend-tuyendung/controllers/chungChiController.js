// controllers/chungChiController.js
const { contractDoc } = require("../utils/blockchain");
const crypto = require('crypto');

// Lấy danh sách chứng chỉ của một ứng viên (Người nhận)
exports.layDanhSachChungChi = async (req, res) => {
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
};

// Lấy danh sách chứng chỉ ĐÃ CẤP (Dành cho Nhà phát hành xem lịch sử)
exports.layLichSuCapChungChi = async (req, res) => {
    try {
        const { nphAddress } = req.params;
        const danhSach = await contractDoc.layDanhSachChungChiDaCap(nphAddress);
        
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
};

// Tiện ích: Tạo Hash SHA-256
exports.taoHashTienIch = (req, res) => {
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
};