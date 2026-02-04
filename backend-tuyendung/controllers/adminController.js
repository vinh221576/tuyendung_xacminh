// controllers/adminController.js
const { contractGhi } = require("../utils/blockchain");

// Demo API Backend tự gọi Smart Contract
exports.capChungChiDemo = async (req, res) => {
    try {
        const { ungVien, maChungChi, tenChungChi } = req.body;
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
};