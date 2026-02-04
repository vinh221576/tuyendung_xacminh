// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\App.tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertOctagon } from "lucide-react";
import { ketNoiVi, yeuCauDoiVi } from "./services/blockchain";

// Import các Component và Pages đã tách
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import IssuerPage from "./pages/IssuerPage";
import CandidatePage from "./pages/CandidatePage";
import RecruiterPage from "./pages/RecruiterPage";

const API_URL = import.meta.env.VITE_API_URL;

// --- CSS GLOBAL ĐỂ TRÀN MÀN HÌNH ---
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: #f0f2f5;
  }
  #root {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
  }
  .access-denied {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    color: #ff4d4f;
    text-align: center;
  }
`;

// Component thông báo lỗi quyền truy cập chuyên nghiệp
const AccessDenied = () => (
  <div className="access-denied">
    <AlertOctagon size={64} style={{ marginBottom: "16px" }} />
    <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>TRUY CẬP BỊ TỪ CHỐI</h2>
    <p style={{ color: "#8c8c8c", marginTop: "8px" }}>
      Bạn không có quyền truy cập vào chức năng này với vai trò hiện tại.
    </p>
  </div>
);

function App() {
  const [vi, setVi] = useState<string>("");
  const [vaiTro, setVaiTro] = useState<string>("0");
  const navigate = useNavigate();

  // 1. Kết nối và lấy vai trò
  const handleKetNoi = async () => { 
      const addr = await ketNoiVi(); 
      if(addr) { 
          setVi(addr); 
          await fetchVaiTro(addr); 
      } 
  };
  
  // 2. Lấy vai trò từ API Backend
  const fetchVaiTro = async (addr: string) => { 
      try { 
          const res = await axios.get(`${API_URL}/api/vai-tro/${addr}`); 
          setVaiTro(res.data.vaiTro); 
      } catch(e) { 
          console.error("Lỗi lấy vai trò:", e); 
      } 
  };
  
  // 3. Tải lại dữ liệu khi có thay đổi trên Blockchain
  const handleReload = async () => { 
      if(vi) await fetchVaiTro(vi); 
  };
  
  // 4. Đăng xuất
  const handleDangXuat = () => { 
      setVi(""); 
      setVaiTro("0"); 
      navigate("/"); 
  };
  
  // 5. Đổi ví MetaMask
  const handleDoiVi = async () => { 
      const addrMoi = await yeuCauDoiVi(); 
      if (addrMoi) { 
          setVi(addrMoi); 
          await fetchVaiTro(addrMoi); 
          navigate("/"); 
      } 
  };

  // Tự động kết nối khi vừa mở app (nếu ví đã mở)
  useEffect(() => { handleKetNoi(); }, []);

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
        <style>{globalStyles}</style>

        {/* Navbar: Truyền đầy đủ props để quản lý trạng thái ví */}
        <Navbar 
          vi={vi} 
          vaiTro={vaiTro} 
          handleDangXuat={handleDangXuat} 
          handleDoiVi={handleDoiVi} 
        />
        
        {/* Vùng nội dung chính: Tự động lấp đầy chiều cao còn lại */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={
                <HomePage 
                  vi={vi} 
                  vaiTro={vaiTro} 
                  handleKetNoi={handleKetNoi} 
                  handleReload={handleReload} 
                />
              } />
              
              {/* Trang Nhà Phát Hành (Role: 1) */}
              <Route path="/nha-phat-hanh" element={
                vaiTro === "1" ? <IssuerPage vi={vi} /> : <AccessDenied />
              } />
              
              {/* Trang Ứng Viên (Role: 2) */}
              <Route path="/ung-vien" element={
                vaiTro === "2" ? <CandidatePage vi={vi} /> : <AccessDenied />
              } />
              
              {/* Trang Nhà Tuyển Dụng (Role: 3) */}
              <Route path="/nha-tuyen-dung" element={
                vaiTro === "3" ? <RecruiterPage vi={vi} /> : <AccessDenied />
              } />
            </Routes>
        </div>

        {/* Footer đơn giản cho chuyên nghiệp */}
        <footer style={{ 
          textAlign: "center", 
          padding: "20px", 
          color: "#bfbfbf", 
          fontSize: "12px",
          background: "#fff",
          borderTop: "1px solid #eef0f2"
        }}>
          © 2026 Blockchain Recruitment System - Đồ án Công nghệ Chuỗi khối
        </footer>
    </div>
  );
}

// Wrapper để sử dụng được hook useNavigate
export default function AppWrapper() { 
  return (
    <Router>
      <App />
    </Router>
  ); 
}