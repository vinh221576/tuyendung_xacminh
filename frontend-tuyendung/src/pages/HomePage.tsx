// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\pages\HomePage.tsx
import { useState } from "react";
import { Wallet, Shield, GraduationCap, Briefcase, ArrowRight, CheckCircle } from "lucide-react";
import { dangKyVaiTro } from "../services/blockchain";
import { Link } from "react-router-dom";

// CSS nội bộ
const styles = `
  .hero-container {
    width: 100%;
    min-height: calc(100vh - 70px);
    background: linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .content-wrapper {
    max-width: 1200px;
    width: 100%;
    text-align: center;
  }

  /* Title Styles */
  .hero-title {
    font-size: 48px;
    font-weight: 800;
    color: #001529;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }
  .hero-subtitle {
    font-size: 18px;
    color: #595959;
    margin-bottom: 48px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  /* Role Cards Grid */
  .role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 32px;
  }

  .role-card {
    background: white;
    padding: 32px 24px;
    border-radius: 16px;
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .role-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
    border-color: #1890ff;
  }

  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 24px;
  }

  .btn-primary {
    background: #1890ff;
    color: white;
    padding: 14px 32px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
  .btn-primary:hover {
    background: #096dd9;
    transform: translateY(-2px);
  }

  .welcome-card {
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.05);
    display: inline-block;
  }
`;

const HomePage = ({ vi, vaiTro, handleKetNoi, handleReload }: any) => {
  const [loading, setLoading] = useState(false);
  
  const dangKyXong = async () => { 
      setLoading(false); 
      await handleReload(); 
  };

  // Helper để lấy link điều hướng dựa trên vai trò
  const getDashboardLink = () => {
      if (vaiTro === "1") return "/nha-phat-hanh";
      if (vaiTro === "2") return "/ung-vien";
      if (vaiTro === "3") return "/nha-tuyen-dung";
      return "/";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hero-container">
        <div className="content-wrapper">
          
          {/* --- TRẠNG THÁI 1: CHƯA KẾT NỐI VÍ --- */}
          {!vi ? (
            <div style={{animation: "fadeIn 0.5s ease"}}>
              <div style={{marginBottom: "30px", display:"inline-block", padding: "10px", background: "#e6f7ff", borderRadius: "50%", border: "1px solid #91d5ff"}}>
                <Shield size={48} color="#1890ff" fill="#1890ff" fillOpacity={0.1}/>
              </div>
              <h1 className="hero-title">Nền tảng Tuyển dụng Blockchain <br/> Minh bạch & Tin cậy</h1>
              <p className="hero-subtitle">
                Giải pháp xác thực văn bằng và tuyển dụng thế hệ mới. 
                Kết nối Nhà trường, Ứng viên và Doanh nghiệp trên một mạng lưới không thể giả mạo.
              </p>
              <button className="btn-primary" onClick={handleKetNoi}>
                <Wallet size={20}/> Kết nối MetaMask ngay
              </button>
            </div>
          ) : (
            
            /* --- TRẠNG THÁI 2: ĐÃ KẾT NỐI --- */
            <div style={{animation: "slideUp 0.5s ease"}}>
              
              {/* CASE 2.1: CHƯA CÓ VAI TRÒ -> CHỌN VAI TRÒ */}
              {vaiTro === "0" && (
                <>
                  <h2 style={{fontSize: "32px", color: "#001529", marginBottom: "10px"}}>Chào mừng thành viên mới! 👋</h2>
                  <p style={{color: "#595959", marginBottom: "40px"}}>Vui lòng chọn vai trò để bắt đầu tham gia hệ thống.</p>
                  
                  {loading ? (
                    <div style={{fontSize: "18px", color: "#1890ff", fontWeight: "bold"}}>
                        ⏳ Đang xử lý giao dịch Blockchain... Vui lòng đợi xác nhận ví.
                    </div>
                  ) : (
                    <div className="role-grid">
                        {/* Card Nhà Phát Hành */}
                        <div className="role-card" onClick={async () => { setLoading(true); await dangKyVaiTro("NhaPhatHanh"); dangKyXong(); }}>
                            <div className="icon-box" style={{background: "#f9f0ff", color: "#722ed1"}}>
                                <Shield size={32} />
                            </div>
                            <h3 style={{margin: "0 0 10px 0", fontSize: "20px"}}>Nhà Phát Hành</h3>
                            <p style={{fontSize: "14px", color: "#8c8c8c"}}>Dành cho Trường học, Trung tâm đào tạo.</p>
                            <button style={{marginTop: "auto", border: "1px solid #722ed1", background: "white", color: "#722ed1", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}>Đăng ký</button>
                        </div>

                        {/* Card Ứng Viên */}
                        <div className="role-card" onClick={async () => { setLoading(true); await dangKyVaiTro("UngVien"); dangKyXong(); }}>
                            <div className="icon-box" style={{background: "#e6fffb", color: "#13c2c2"}}>
                                <GraduationCap size={32} />
                            </div>
                            <h3 style={{margin: "0 0 10px 0", fontSize: "20px"}}>Ứng Viên</h3>
                            <p style={{fontSize: "14px", color: "#8c8c8c"}}>Sinh viên, Người tìm việc, Quản lý bằng cấp.</p>
                            <button style={{marginTop: "auto", border: "1px solid #13c2c2", background: "white", color: "#13c2c2", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}>Đăng ký</button>
                        </div>

                        {/* Card Nhà Tuyển Dụng */}
                        <div className="role-card" onClick={async () => { setLoading(true); await dangKyVaiTro("NhaTuyenDung"); dangKyXong(); }}>
                            <div className="icon-box" style={{background: "#fff7e6", color: "#fa8c16"}}>
                                <Briefcase size={32} />
                            </div>
                            <h3 style={{margin: "0 0 10px 0", fontSize: "20px"}}>Nhà Tuyển Dụng</h3>
                            <p style={{fontSize: "14px", color: "#8c8c8c"}}>Doanh nghiệp đăng tin và xác thực hồ sơ.</p>
                            <button style={{marginTop: "auto", border: "1px solid #fa8c16", background: "white", color: "#fa8c16", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", fontWeight: "bold"}}>Đăng ký</button>
                        </div>
                    </div>
                  )}
                </>
              )}

              {/* CASE 2.2: ĐÃ CÓ VAI TRÒ -> DASHBOARD */}
              {vaiTro !== "0" && (
                <div className="welcome-card">
                   <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}>
                        <CheckCircle size={64} color="#52c41a" />
                   </div>
                   <h2 style={{fontSize: "28px", color: "#001529"}}>Xin chào, {vi.slice(0,6)}...</h2>
                   <p style={{fontSize: "16px", color: "#595959", margin: "10px 0 30px 0"}}>
                       Bạn đang đăng nhập với vai trò: <br/>
                       <span style={{fontSize: "20px", fontWeight: "bold", color: "#1890ff", marginTop: "10px", display: "inline-block"}}>
                           {vaiTro === "1" ? "NHÀ PHÁT HÀNH" : vaiTro === "2" ? "ỨNG VIÊN" : "NHÀ TUYỂN DỤNG"}
                       </span>
                   </p>
                   
                   <Link to={getDashboardLink()}>
                       <button className="btn-primary">
                           Truy cập Hệ thống <ArrowRight size={18}/>
                       </button>
                   </Link>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;