// controllers/tuyenDungController.js
const { contractDoc } = require("../utils/blockchain");

// Lấy danh sách công việc đang tuyển
exports.layDanhSachCongViec = async (req, res) => {
    try {
        const danhSach = await contractDoc.layDanhSachCongViec();
        
        const ketQua = danhSach.map(cv => ({
            id: cv.id.toString(),
            nhaTuyenDung: cv.nhaTuyenDung,
            tenCongViec: cv.tenCongViec,
            moTa: cv.moTa,
            yeuCau: cv.yeuCau,
            maChungChiYeuCau: cv.maChungChiYeuCau,
            ngayDang: new Date(Number(cv.ngayDang) * 1000).toLocaleString(),
            dangMo: cv.dangMo
        }));

        res.json({ success: true, data: ketQua });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Lấy danh sách Hồ sơ ứng tuyển theo ID Công việc
exports.layDanhSachHoSo = async (req, res) => {
    try {
        const { idCongViec } = req.params;
        const danhSach = await contractDoc.layDanhSachHoSo(idCongViec);
        
        const trangThaiText = ["Chờ Duyệt", "Đã Tuyển", "Từ Chối"];

        const ketQua = danhSach.map((hs, index) => ({
            index: index, 
            ungVien: hs.ungVien,
            maChungChiNop: hs.maChungChiNop,
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
};