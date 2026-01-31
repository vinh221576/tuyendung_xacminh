//C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\backend-tuyendung\utils\blockchain.js
//file xử lý kết nối Ethers
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// 1. Cấu hình kết nối
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.KHOA_BI_MAT;
const CONTRACT_ADDRESS = process.env.DIA_CHI_CONTRACT;

// 2. Đọc file ABI
const duongDanABI = path.join(__dirname, "../abis/HeThongTuyenDung.json");
const abiFile = JSON.parse(fs.readFileSync(duongDanABI, "utf8"));
const ABI = abiFile.abi;

// 3. Khởi tạo Provider (Để đọc dữ liệu)
const provider = new ethers.JsonRpcProvider(RPC_URL);

// 4. Khởi tạo Wallet (Để ghi dữ liệu - nếu Backend cần quyền Admin)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 5. Khởi tạo Contract
// Contract chỉ đọc (dùng provider)
const contractDoc = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
// Contract ghi (dùng wallet)
const contractGhi = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

module.exports = {
    contractDoc,
    contractGhi,
    provider,
    wallet
};