// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\components\Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { Shield, RefreshCw, LogOut, Wallet } from "lucide-react";

// CSS nội bộ để xử lý hiệu ứng Hover (vì Inline Style không hỗ trợ hover tốt)
const styles = `
  .nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  .nav-link:hover, .nav-link.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  .action-btn {
    border: none;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .action-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }
`;

const Navbar = ({ vi, vaiTro, handleDangXuat, handleDoiVi }: any) => {
  const location = useLocation();

  // Hàm kiểm tra link đang active
  const isActive = (path: string) => location.pathname === path ? "active" : "";

  // Map tên vai trò cho đẹp
  const getRoleName = (role: string) => {
    switch (role) {
      case "1": return "Nhà Phát Hành";
      case "2": return "Ứng Viên";
      case "3": return "Nhà Tuyển Dụng";
      default: return "Chưa ĐK";
    }
  };

  // Màu sắc badge vai trò
  const getRoleColor = (role: string) => {
    switch (role) {
      case "1": return "#722ed1"; // Tím
      case "2": return "#13c2c2"; // Cyan
      case "3": return "#fa8c16"; // Cam
      default: return "#8c8c8c"; // Xám
    }
  };

  return (
    <>
      <style>{styles}</style>
      <nav style={{
        background: "#001529",
        width: "100%",
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        boxSizing: "border-box", // Quan trọng để không bị vỡ layout
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        {/* --- LOGO --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ background: "#1890ff", padding: "8px", borderRadius: "8px", display: "flex" }}>
            <Shield color="white" size={24} fill="white" fillOpacity={0.2} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "white", letterSpacing: "0.5px" }}>
            Blockchain<span style={{ color: "#1890ff" }}>HR</span>
          </span>
        </div>

        {/* --- MENU ĐIỀU HƯỚNG --- */}
        {vi && (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/" className={`nav-link ${isActive("/")}`}>Trang Chủ</Link>
            {vaiTro === "1" && <Link to="/nha-phat-hanh" className={`nav-link ${isActive("/nha-phat-hanh")}`}>Cấp Chứng Chỉ</Link>}
            {vaiTro === "2" && <Link to="/ung-vien" className={`nav-link ${isActive("/ung-vien")}`}>Hồ Sơ & Việc Làm</Link>}
            {vaiTro === "3" && <Link to="/nha-tuyen-dung" className={`nav-link ${isActive("/nha-tuyen-dung")}`}>Quản Lý Tuyển Dụng</Link>}
          </div>
        )}

        {/* --- THÔNG TIN VÍ & ACTION --- */}
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {vi ? (
            <>
              {/* Badge thông tin ví */}
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "30px",
                padding: "6px 16px",
                gap: "10px"
              }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>ĐANG KẾT NỐI</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff", fontFamily: "monospace" }}>
                    {vi.slice(0, 6)}...{vi.slice(-4)}
                  </span>
                </div>
                
                {/* Badge Vai trò */}
                <div style={{
                  background: getRoleColor(vaiTro),
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  textTransform: "uppercase"
                }}>
                  {getRoleName(vaiTro)}
                </div>
              </div>

              {/* Nút Đổi ví */}
              <button onClick={handleDoiVi} title="Đổi ví khác" className="action-btn" style={{ background: "#faad14", color: "white", boxShadow: "0 2px 8px rgba(250, 173, 20, 0.4)" }}>
                <RefreshCw size={18} />
              </button>

              {/* Nút Đăng xuất */}
              <button onClick={handleDangXuat} title="Ngắt kết nối" className="action-btn" style={{ background: "#ff4d4f", color: "white", boxShadow: "0 2px 8px rgba(255, 77, 79, 0.4)" }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", fontStyle: "italic", display: "flex", alignItems: "center", gap: "5px" }}>
              <Wallet size={16}/> Chưa kết nối ví
            </span>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;