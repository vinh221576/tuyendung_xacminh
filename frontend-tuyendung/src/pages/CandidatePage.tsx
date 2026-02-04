// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\pages\CandidatePage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, QrCode, CheckCircle, AlertCircle, Search, Calendar, Award } from "lucide-react";
import { nopHoSo } from "../services/blockchain";

const API_URL = import.meta.env.VITE_API_URL;

// CSS nội bộ cho trang này
const styles = `
  .page-container {
    display: flex;
    width: 100%;
    min-height: calc(100vh - 70px); /* Trừ đi chiều cao Navbar */
    background-color: #f0f2f5;
  }
  
  /* CỘT TRÁI - KHO CHỨNG CHỈ */
  .sidebar {
    width: 380px;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    padding: 24px;
    height: calc(100vh - 70px);
    position: sticky;
    top: 70px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 4px 0 24px rgba(0,0,0,0.02);
  }

  .cert-card {
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    background: #fafafa;
  }

  .cert-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .cert-card.selected {
    border-color: #1890ff;
    background: #e6f7ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  }

  /* CỘT PHẢI - DANH SÁCH VIỆC LÀM */
  .main-content {
    flex: 1;
    padding: 32px 40px;
    overflow-y: auto;
  }

  .job-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .job-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #d9d9d9;
    transform: translateY(-2px);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    gap: 6px;
  }

  .btn-apply {
    background: #1890ff;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    align-self: flex-start;
  }
  .btn-apply:hover { background: #096dd9; }
  .btn-apply:disabled { background: #d9d9d9; cursor: not-allowed; }
`;

const CandidatePage = ({ vi }: any) => {
  const [dsCongViec, setDsCongViec] = useState<any[]>([]);
  const [dsChungChi, setDsChungChi] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]); 
  const [selectedCC, setSelectedCC] = useState<any>(null); 
  const [loading, setLoading] = useState(false);
  
  const loadData = async () => {
    const resJobs = await axios.get(`${API_URL}/api/cong-viec`);
    // Đảo ngược để tin mới nhất lên đầu
    setDsCongViec(resJobs.data.data.reverse());
    
    if(vi) {
      const resCC = await axios.get(`${API_URL}/api/chung-chi/${vi}`);
      setDsChungChi(resCC.data.data);
      
      const apps = [];
      for(let job of resJobs.data.data) {
         const resHS = await axios.get(`${API_URL}/api/ho-so/${job.id}`);
         const myApp = resHS.data.data.find((hs: any) => hs.ungVien.toLowerCase() === vi.toLowerCase());
         if(myApp) apps.push({ jobId: job.id, status: myApp.trangThaiCode, statusText: myApp.trangThai });
      }
      setMyApplications(apps);
    }
  };

  useEffect(() => { loadData(); }, [vi]);

  const getAppStatus = (jobId: string) => myApplications.find(a => a.jobId === jobId);

  // Helper function để định dạng ngày
  const formatDate = (dateString: string) => {
     if(!dateString) return "";
     return dateString.split(" ")[1] + " " + dateString.split(" ")[2]; // Lấy ngày tháng năm
  }

  return (
    <>
    <style>{styles}</style>
    <div className="page-container">
      
      {/* --- SIDEBAR: KHO CHỨNG CHỈ --- */}
      <div className="sidebar">
        <div style={{marginBottom: "10px"}}>
          <h2 style={{margin: "0 0 5px 0", display: "flex", alignItems: "center", gap: "10px", color: "#001529"}}>
            <QrCode size={24} color="#1890ff"/> Ví Chứng Chỉ
          </h2>
          <p style={{margin: 0, color: "#8c8c8c", fontSize: "14px"}}>Chọn 1 chứng chỉ để nộp hồ sơ</p>
        </div>

        {dsChungChi.length === 0 && <div style={{textAlign:"center", color:"#999", marginTop:"20px"}}>Chưa có chứng chỉ nào</div>}

        {dsChungChi.map((cc, idx) => (
            <div key={idx} 
                 className={`cert-card ${selectedCC?.hashDuLieu === cc.hashDuLieu ? "selected" : ""}`}
                 onClick={() => setSelectedCC(cc)}>
              
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                <div>
                  <h4 style={{margin: "0 0 5px 0", fontSize: "16px", color: "#262626"}}>{cc.tenChungChi}</h4>
                  <div style={{display: "flex", alignItems: "center", gap: "5px", color: "#595959", fontSize: "13px"}}>
                     <Award size={14}/> Mã: <b>{cc.maChungChi}</b>
                  </div>
                </div>
                {selectedCC?.hashDuLieu === cc.hashDuLieu && <CheckCircle size={20} color="#1890ff" fill="#e6f7ff"/>}
              </div>

              <div style={{marginTop: "12px", borderTop: "1px solid #eee", paddingTop: "8px", fontSize: "12px", color: "#8c8c8c", display: "flex", justifyContent: "space-between"}}>
                 <span>Người cấp: {cc.nguoiCap.slice(0,6)}...</span>
                 <span>{formatDate(cc.ngayCap)}</span>
              </div>
            </div>
        ))}
      </div>

      {/* --- MAIN CONTENT: SÀN VIỆC LÀM --- */}
      <div className="main-content">
        <div style={{marginBottom: "30px"}}>
          <h1 style={{fontSize: "28px", color: "#001529", margin: "0 0 10px 0"}}>Việc Làm Đang Tuyển</h1>
          <p style={{color: "#595959"}}>Tìm kiếm cơ hội phù hợp với chứng chỉ blockchain của bạn.</p>
        </div>

        {dsCongViec.map((cv) => {
          const status = getAppStatus(cv.id);
          // Logic kiểm tra khớp mã chứng chỉ đang chọn
          const isMatching = selectedCC && selectedCC.maChungChi === cv.maChungChiYeuCau;

          return (
            <div key={cv.id} className="job-card">
              {/* Header Job */}
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                <div>
                    <h2 style={{margin: "0 0 8px 0", color: "#1f1f1f"}}>
                        <span style={{color:"#8c8c8c", fontWeight:"normal", marginRight:"10px"}}>#{cv.id}</span>
                        {cv.tenCongViec}
                    </h2>
                    <div style={{display: "flex", gap: "20px", color: "#8c8c8c", fontSize: "14px"}}>
                        <span style={{display:"flex", alignItems:"center", gap:"5px"}}><Briefcase size={16}/> {cv.nhaTuyenDung.slice(0,8)}...</span>
                        <span style={{display:"flex", alignItems:"center", gap:"5px"}}><Calendar size={16}/> {formatDate(cv.ngayDang)}</span>
                    </div>
                </div>
                {/* Visual Feedback: Nếu chọn đúng bằng -> Hiện nhãn phù hợp */}
                {isMatching && !status && (
                    <span style={{background: "#f6ffed", color: "#52c41a", border: "1px solid #b7eb8f", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px"}}>
                        <CheckCircle size={14}/> Phù hợp với chứng chỉ đang chọn
                    </span>
                )}
              </div>
              
              {/* Body Job */}
              <p style={{color: "#595959", lineHeight: "1.6", margin: "10px 0"}}>{cv.moTa}</p>

              {/* Requirements */}
              <div style={{background: "#fff7e6", padding: "12px", borderRadius: "8px", border: "1px solid #ffd591", display: "inline-block", alignSelf: "flex-start"}}>
                 <span style={{fontSize: "13px", color: "#d46b08", fontWeight: "bold"}}>Yêu cầu Bằng cấp: </span>
                 <span style={{fontSize: "14px", color: "#fa8c16", fontWeight: "bold", marginLeft: "5px"}}>{cv.maChungChiYeuCau}</span>
              </div>

              <hr style={{border: "0", borderTop: "1px solid #f0f0f0", width: "100%", margin: "10px 0"}}/>

              {/* Footer / Action */}
              <div>
                {status ? (
                    <div className="status-badge" style={{
                        background: status.status === 1 ? "#f6ffed" : status.status === 2 ? "#fff1f0" : "#fffbe6",
                        color: status.status === 1 ? "#52c41a" : status.status === 2 ? "#cf1322" : "#faad14",
                        border: `1px solid ${status.status === 1 ? "#b7eb8f" : status.status === 2 ? "#ffa39e" : "#ffe58f"}`
                    }}>
                        {status.status === 1 ? <CheckCircle size={16}/> : status.status === 2 ? <AlertCircle size={16}/> : <Search size={16}/>}
                        {status.statusText.toUpperCase()}
                    </div>
                ) : (
                    <button 
                        className="btn-apply"
                        disabled={loading} 
                        onClick={async () => {
                            if(!selectedCC) return alert("⚠️ Vui lòng CHỌN chứng chỉ ở cột bên trái trước!");
                            if(!isMatching) {
                                if(!confirm(`⚠️ Mã chứng chỉ của bạn (${selectedCC.maChungChi}) KHÔNG KHỚP với yêu cầu (${cv.maChungChiYeuCau}). Tỷ lệ bị từ chối rất cao.\n\nBạn vẫn muốn nộp?`)) return;
                            }
                            setLoading(true);
                            const kq = await nopHoSo(Number(cv.id), selectedCC.maChungChi, selectedCC.hashDuLieu); 
                            setLoading(false);
                            if(kq) { alert("✅ Đã nộp hồ sơ thành công!"); loadData(); } else alert("❌ Lỗi nộp hồ sơ!");
                        }}
                    >
                        {loading ? "Đang xử lý..." : "Ứng Tuyển Ngay"}
                    </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default CandidatePage;