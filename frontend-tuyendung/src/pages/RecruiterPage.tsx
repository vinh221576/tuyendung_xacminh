// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\pages\RecruiterPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { 
  Eye, CheckCircle, XCircle, Briefcase, PlusCircle, 
  Users, Search, Calendar, MapPin, ClipboardList, Info 
} from "lucide-react";
import { dangTuyenDung, xacMinhChungChi, quyetDinhTuyenDung } from "../services/blockchain";

const API_URL = import.meta.env.VITE_API_URL;

// --- CSS NỘI BỘ ---
const styles = `
  .recruiter-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: calc(100vh - 70px);
    background-color: #f8f9fb;
  }

  /* THANH ĐĂNG TIN NHANH */
  .top-action-bar {
    background: white;
    padding: 24px 40px;
    border-bottom: 1px solid #eef0f2;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr auto;
    gap: 16px;
    align-items: flex-end;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-group label {
    font-size: 13px;
    font-weight: 600;
    color: #4b5563;
  }

  .styled-input {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
  }

  .styled-input:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    outline: none;
  }

  /* BỐ CỤC THÂN TRANG */
  .dashboard-body {
    display: flex;
    flex: 1;
    width: 100%;
  }

  /* CỘT DANH SÁCH TIN */
  .job-sidebar {
    width: 400px;
    border-right: 1px solid #eef0f2;
    padding: 24px 30px;
    background: white;
    height: calc(100vh - 200px);
    overflow-y: auto;
    position: sticky;
    top: 70px;
  }

  .job-item {
    padding: 16px;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fff;
  }

  .job-item:hover {
    border-color: #1890ff;
    transform: translateX(5px);
  }

  .job-item.active {
    background: #e6f7ff;
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  }

  /* VÙNG DANH SÁCH ỨNG VIÊN */
  .candidate-section {
    flex: 1;
    padding: 32px 40px;
  }

  .candidate-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    display: flex;
    justify-content: space-between;
    transition: all 0.3s;
  }

  .candidate-card:hover {
    box-shadow: 0 8px 15px rgba(0,0,0,0.05);
  }

  .badge-owner {
    background: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    margin-left: 8px;
  }

  .btn-action {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
`;

const RecruiterPage = ({ vi }: any) => {
  const [dsCongViec, setDsCongViec] = useState<any[]>([]);
  const [dsHoSo, setDsHoSo] = useState<any[]>([]);
  const [jobIdDangXem, setJobIdDangXem] = useState<any>(null); 
  const [formCV, setFormCV] = useState({ ten: "", moTa: "", yeuCau: "", maCC: "" });
  const [loading, setLoading] = useState(false);

  const loadJobs = () => axios.get(`${API_URL}/api/cong-viec`).then(res => setDsCongViec(res.data.data.reverse()));
  
  const xemHoSo = async (job: any) => {
    setJobIdDangXem(job);
    const res = await axios.get(`${API_URL}/api/ho-so/${job.id}`);
    setDsHoSo(res.data.data);
  };
  
  useEffect(() => { loadJobs(); }, []);

  const isOwner = jobIdDangXem && vi && jobIdDangXem.nhaTuyenDung.toLowerCase() === vi.toLowerCase();

  const xuLyXacMinh = async (hs: any) => {
     if(!jobIdDangXem) return;
     const requiredCode = jobIdDangXem.maChungChiYeuCau;
     const userCode = hs.maChungChiNop;
     let ketQua = userCode === requiredCode;

     let thongBao = ketQua 
        ? "✅ KẾT QUẢ KHỚP: Chứng chỉ của ứng viên hợp lệ với yêu cầu." 
        : `❌ KẾT QUẢ SAI: Chứng chỉ ứng viên nộp (${userCode}) không khớp với yêu cầu (${requiredCode}).`;

     if(!confirm(thongBao + "\n\nBạn xác nhận ghi kết quả thẩm định này lên Blockchain?")) return;

     setLoading(true);
     await xacMinhChungChi(Number(jobIdDangXem.id), hs.index, ketQua);
     setLoading(false);
     xemHoSo(jobIdDangXem);
  };

  return (
    <>
    <style>{styles}</style>
    <div className="recruiter-container">
      
      {/* --- THANH ĐĂNG TIN TRÊN CÙNG --- */}
      <div className="top-action-bar">
        <h3 style={{display:"flex", alignItems:"center", gap:"10px", margin:"0 0 20px 0", color:"#111827"}}>
          <PlusCircle size={22} color="#1890ff"/> Đăng Tin Tuyển Dụng Mới
        </h3>
        <div className="form-grid">
          <div className="input-group">
            <label>Tên công việc</label>
            <input className="styled-input" placeholder="VD: Senior Java Developer" onChange={e => setFormCV({...formCV, ten: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Mô tả chi tiết</label>
            <input className="styled-input" placeholder="Yêu cầu kinh nghiệm, kỹ năng..." onChange={e => setFormCV({...formCV, moTa: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Mã chứng chỉ yêu cầu</label>
            <input className="styled-input" style={{borderColor:"#fa8c16"}} placeholder="VD: JAVA_01, B1" onChange={e => setFormCV({...formCV, maCC: e.target.value})} />
          </div>
          <button 
            disabled={loading}
            onClick={async () => { 
                if(!formCV.maCC || !formCV.ten) return alert("Vui lòng điền đủ thông tin!");
                setLoading(true);
                await dangTuyenDung(formCV.ten, formCV.moTa, "Yêu cầu bằng cấp", formCV.maCC); 
                setLoading(false);
                loadJobs(); 
            }}
            className="btn-action" 
            style={{background: "#1890ff", color: "white", height: "42px"}}
          >
            {loading ? "Đang xử lý..." : "Đăng Tin Ngay"}
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        
        {/* --- CỘT TRÁI: DANH SÁCH JOB --- */}
        <div className="job-sidebar">
          <h3 style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", fontSize:"16px"}}>
            <ClipboardList size={20}/> Quản lý Tin Tuyển dụng
          </h3>
          {dsCongViec.map((cv) => {
             const isMyJob = cv.nhaTuyenDung.toLowerCase() === vi.toLowerCase();
             return (
              <div key={cv.id} className={`job-item ${jobIdDangXem?.id === cv.id ? "active" : ""}`} onClick={() => xemHoSo(cv)}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
                    <span style={{fontSize:"12px", color:"#888"}}>#{cv.id}</span>
                    {isMyJob && <span className="badge-owner">CỦA TÔI</span>}
                </div>
                <div style={{fontWeight:"bold", color:"#111827", marginBottom:"6px"}}>{cv.tenCongViec}</div>
                <div style={{fontSize:"13px", color:"#fa8c16", fontWeight:"600"}}>Yêu cầu: {cv.maChungChiYeuCau}</div>
              </div>
             )
          })}
        </div>

        {/* --- VÙNG CHÍNH: DANH SÁCH ỨNG VIÊN --- */}
        <div className="candidate-section">
           {jobIdDangXem ? (
             <>
               <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px"}}>
                  <div>
                    <h2 style={{margin:0, fontSize:"24px"}}>Ứng viên nộp hồ sơ</h2>
                    <p style={{color:"#6b7280", margin:"5px 0 0 0"}}>Tin tuyển dụng: <b>{jobIdDangXem.tenCongViec}</b></p>
                  </div>
                  {!isOwner && (
                    <div style={{background: "#fffbe6", padding: "10px 16px", borderRadius: "8px", border: "1px solid #ffe58f", color: "#d48806", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px"}}>
                        <Eye size={18}/> <b>Chế độ xem:</b> Bạn không thể duyệt tin này.
                    </div>
                  )}
               </div>

               {loading && <div style={{padding:"15px", background:"#e6f7ff", color:"#1890ff", borderRadius:"8px", marginBottom:"20px", textAlign:"center"}}>⏳ Đang thực hiện giao dịch trên Blockchain...</div>}
               
               {dsHoSo.length === 0 ? <div style={{textAlign:"center", padding:"50px", color:"#999"}}>Chưa có ứng viên nào nộp hồ sơ vào tin này.</div> : dsHoSo.map((hs) => (
                 <div key={hs.index} className="candidate-card">
                   <div style={{flex: 1}}>
                     <div style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"15px"}}>
                        <div style={{background:"#f3f4f6", padding:"10px", borderRadius:"50%"}}><Users size={20} color="#4b5563"/></div>
                        <div>
                            <div style={{fontSize:"14px", color:"#6b7280"}}>Địa chỉ ví ứng viên:</div>
                            <div style={{fontWeight:"bold", fontSize:"15px", fontFamily:"monospace"}}>{hs.ungVien}</div>
                        </div>
                     </div>
                     
                     <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", background:"#fafafa", padding:"15px", borderRadius:"12px"}}>
                        <div>
                            <span style={{fontSize:"13px", color:"#888"}}>Mã chứng chỉ nộp:</span>
                            <div style={{fontWeight:"bold", color:"#1890ff"}}>{hs.maChungChiNop}</div>
                        </div>
                        <div>
                            <span style={{fontSize:"13px", color:"#888"}}>Trạng thái hiện tại:</span>
                            <div style={{ fontWeight: "bold", color: hs.trangThaiCode === 1 ? "#52c41a" : hs.trangThaiCode === 2 ? "#ff4d4f" : "#faad14" }}>
                                {hs.trangThai.toUpperCase()}
                            </div>
                        </div>
                     </div>

                     <div style={{marginTop:"20px", display:"flex", gap:"12px"}}>
                        {isOwner && (
                            <>
                                {!hs.daXacMinh ? (
                                    <button onClick={() => xuLyXacMinh(hs)} className="btn-action" style={{background:"#faad14", color:"white"}}>
                                        <Search size={18}/> So khớp & Xác minh
                                    </button>
                                ) : (
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        <span style={{ color: hs.ketQuaXacMinh ? "#52c41a" : "#ff4d4f", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>
                                            {hs.ketQuaXacMinh ? <CheckCircle size={20}/> : <XCircle size={20}/>} 
                                            {hs.ketQuaXacMinh ? "THÔNG TIN HỢP LỆ" : "SAI MÃ CHỨNG CHỈ"}
                                        </span>
                                        
                                        {/* Nút Tuyển dụng chỉ hiện khi đã xác minh thành công và đang chờ duyệt */}
                                        {hs.ketQuaXacMinh && hs.trangThaiCode === 0 && (
                                            <button onClick={async () => {
                                                setLoading(true);
                                                await quyetDinhTuyenDung(Number(jobIdDangXem.id), hs.index, true);
                                                setLoading(false);
                                                xemHoSo(jobIdDangXem);
                                            }} className="btn-action" style={{background: "#52c41a", color: "white"}}>
                                                Chấp thuận & Tuyển dụng
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                     </div>
                   </div>

                   <div style={{textAlign:"center", paddingLeft:"30px", borderLeft:"1px dashed #ddd", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                      <div style={{background:"white", padding:"8px", border:"1px solid #eee", borderRadius:"8px", marginBottom:"8px"}}>
                        <QRCodeSVG value={JSON.stringify({ma: hs.maChungChiNop, hash: hs.hashChungChi})} size={80} />
                      </div>
                      <span style={{fontSize:"11px", color:"#999"}}>MÃ TRA CỨU NHANH</span>
                   </div>
                 </div>
               ))}
             </>
           ) : (
             <div style={{height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", color:"#999"}}>
                <Briefcase size={80} strokeWidth={1} style={{marginBottom:"20px", opacity:0.3}}/>
                <h2>Hệ thống Quản lý Tuyển dụng</h2>
                <p>Chọn một công việc từ danh sách bên trái để bắt đầu quản lý hồ sơ ứng viên.</p>
             </div>
           )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RecruiterPage;