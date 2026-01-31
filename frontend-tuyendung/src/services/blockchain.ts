// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\services\blockchain.ts
import { ethers } from "ethers";
import HeThongTuyenDungABI from "../abis/HeThongTuyenDung.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_DIA_CHI_CONTRACT;

// Khai báo kiểu dữ liệu cho Window để không bị lỗi TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}

// 1. Kết nối ví MetaMask (Tự động chuyển mạng Cronos Testnet)
export const ketNoiVi = async () => {
  if (window.ethereum) {
    try {
      // 1. Yêu cầu quyền truy cập ví
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // 2. Ép chuyển sang mạng Cronos Testnet (ChainID: 338 -> Hex: 0x152)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x152' }], // 338 in hex
        });
      } catch (switchError: any) {
        // Nếu ví chưa có mạng Cronos Testnet thì tự động thêm vào
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x152',
                  chainName: 'Cronos Testnet',
                  rpcUrls: ['https://evm-t3.cronos.org'],
                  nativeCurrency: {
                    name: 'Cronos',
                    symbol: 'TCRO', 
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://cronos.org/explorer/testnet3'],
                },
              ],
            });
          } catch (addError) {
            console.error("Lỗi thêm mạng:", addError);
          }
        } else {
          console.error("Lỗi chuyển mạng:", switchError);
        }
      }

      return accounts[0];
    } catch (error) {
      console.error("Lỗi kết nối ví:", error);
      return null;
    }
  } else {
    alert("Vui lòng cài đặt MetaMask!");
    return null;
  }
};

// 2. Lấy Contract (Có quyền ghi - Signer)
const layContract = async () => {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, HeThongTuyenDungABI.abi, signer);
};

// --- CÁC HÀM NGHIỆP VỤ (GỌI SMART CONTRACT) ---

// 3. Đăng ký vai trò
export const dangKyVaiTro = async (loaiVaiTro: "NhaPhatHanh" | "UngVien" | "NhaTuyenDung") => {
  const contract = await layContract();
  if (!contract) return;
  
  try {
    let tx;
    if (loaiVaiTro === "NhaPhatHanh") tx = await contract.dangKyNhaPhatHanh();
    else if (loaiVaiTro === "UngVien") tx = await contract.dangKyUngVien();
    else if (loaiVaiTro === "NhaTuyenDung") tx = await contract.dangKyNhaTuyenDung();
    
    await tx.wait(); // Chờ giao dịch xác nhận
    return true;
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return false;
  }
};

// 4. Cấp chứng chỉ (Nhà phát hành)
export const capChungChi = async (ungVien: string, maCC: string, tenCC: string, hash: string) => {
  const contract = await layContract();
  if (!contract) return;
  try {
    const tx = await contract.capChungChi(ungVien, maCC, tenCC, hash);
    await tx.wait();
    return true;
  } catch (error) {
    console.error(error); return false;
  }
};

// 5. Đăng tin tuyển dụng (Nhà tuyển dụng)
// [CẬP NHẬT] Thêm tham số maCC (Mã chứng chỉ yêu cầu)
export const dangTuyenDung = async (ten: string, moTa: string, yeuCau: string, maCC: string) => {
  const contract = await layContract();
  if (!contract) return false;
  try {
    const tx = await contract.dangTuyenDung(ten, moTa, yeuCau, maCC);
    await tx.wait();
    return true;
  } catch (error: any) {
    // IN LỖI RA CONSOLE ĐỂ ĐỌC
    console.error("Lỗi Đăng tuyển:", error); 
    
    // Nếu lỗi do sai số lượng tham số, nó sẽ báo "missing argument" hoặc "too many arguments"
    alert("Lỗi Blockchain: " + (error.reason || error.message));
    return false;
  }
};

// 6. Nộp hồ sơ (Ứng viên)
// [CẬP NHẬT] Thêm tham số maCCNop (Mã chứng chỉ ứng viên chọn để nộp)
export const nopHoSo = async (idCongViec: number, maCCNop: string, hashChungChi: string) => {
  const contract = await layContract();
  if (!contract) return;
  try {
    // Gọi hàm Smart Contract V3
    const tx = await contract.nopHoSoUngTuyen(idCongViec, maCCNop, hashChungChi);
    await tx.wait();
    return true;
  } catch (error) {
    console.error(error); return false;
  }
};

// 7. Xác minh (Nhà tuyển dụng)
export const xacMinhChungChi = async (idCongViec: number, indexHoSo: number, ketQua: boolean) => {
  const contract = await layContract();
  if (!contract) return;
  try {
    const tx = await contract.xacMinhChungChi(idCongViec, indexHoSo, ketQua);
    await tx.wait();
    return true;
  } catch (error) {
    console.error(error); return false;
  }
};

// 8. Quyết định Tuyển/Từ chối (Nhà tuyển dụng)
export const quyetDinhTuyenDung = async (idCongViec: number, indexHoSo: number, tuyen: boolean) => {
  const contract = await layContract();
  if (!contract) return;
  try {
    const tx = await contract.quyetDinhTuyenDung(idCongViec, indexHoSo, tuyen);
    await tx.wait();
    return true;
  } catch (error) {
    console.error(error); return false;
  }
};

// 9. Yêu cầu đổi ví (Buộc MetaMask hiện popup chọn tài khoản)
export const yeuCauDoiVi = async () => {
  if (window.ethereum) {
    try {
      // Lệnh này buộc MetaMask quên quyền truy cập cũ và hỏi lại từ đầu
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      });
      // Sau khi chọn xong, gọi lại hàm kết nối để lấy ví mới
      return await ketNoiVi();
    } catch (error) {
      console.error("Lỗi đổi ví:", error);
      return null;
    }
  }
  return null;
};