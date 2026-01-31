//C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\blockchain-tuyendung\scripts\trienkhai.ts
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Đang triển khai Smart Contract Hệ thống Tuyển dụng...");

  const HeThongTuyenDung = await ethers.getContractFactory("HeThongTuyenDung");
  const contract = await HeThongTuyenDung.deploy();

  await contract.waitForDeployment();
  const diaChi = await contract.getAddress();

  console.log("✅ Đã triển khai thành công!");
  console.log("📝 Địa chỉ Contract:", diaChi);
  console.log("👉 Tuấn hãy gửi địa chỉ này và file ABI cho Vĩnh và Ngạn nhé!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});