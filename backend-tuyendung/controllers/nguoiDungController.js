// controllers/nguoiDungController.js
const { contractDoc } = require("../utils/blockchain");

// Lấy vai trò của một địa chỉ ví
exports.layVaiTro = async (req, res) => {
    try {
        const { diaChi } = req.params;
        const vaiTro = await contractDoc.layVaiTro(diaChi);
        res.json({ success: true, vaiTro: vaiTro.toString() });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};