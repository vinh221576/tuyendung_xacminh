// File: src/App.tsx
// (Copy đè toàn bộ file này)

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { Wallet, Shield, Briefcase, QrCode, Home as HomeIcon, CheckCircle, XCircle, LogOut, RefreshCw, List } from "lucide-react";
import { ketNoiVi, yeuCauDoiVi, dangKyVaiTro, capChungChi, dangTuyenDung, nopHoSo, xacMinhChungChi, quyetDinhTuyenDung } from "./services/blockchain";

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = ({ vi, vaiTro, handleDangXuat, handleDoiVi }: any) => {
  return (
    <nav style={{ background: "#001529", padding: "15px 20px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", fontWeight: "bold" }}>
        <Shield color="#1890ff" /> Blockchain Tuyển Dụng
      </div>
      {vi && (
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>Trang Chủ</Link>
          {vaiTro === "1" && <Link to="/nha-phat-hanh" style={{ color: "white", textDecoration: "none" }}>Cấp Chứng Chỉ</Link>}
          {vaiTro === "2" && <Link to="/ung-vien" style={{ color: "white", textDecoration: "none" }}>Hồ Sơ Của Tôi</Link>}
          {vaiTro === "3" && <Link to="/nha-tuyen-dung" style={{ color: "white", textDecoration: "none" }}>Tuyển Dụng</Link>}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {vi ? (
          <>
            <div style={{ fontSize: "12px", background: "#333", padding: "5px 10px", borderRadius: "4px" }}>
              {vi.slice(0, 6)}...{vi.slice(-4)} ({vaiTro === "0" ? "Chưa ĐK" : vaiTro === "1" ? "NPH" : vaiTro === "2" ? "UV" : "NTD"})
            </div>
            <button onClick={handleDoiVi} title="Đổi ví" style={{ background: "#faad14", border: "none", borderRadius: "4px", padding: "5px", cursor: "pointer", color: "white" }}><RefreshCw size={16} /></button>
            <button onClick={handleDangXuat} title="Thoát" style={{ background: "#ff4d4f", border: "none", borderRadius: "4px", padding: "5px", cursor: "pointer", color: "white" }}><LogOut size={16} /></button>
          </>
        ) : <span>Chưa kết nối</span>}
      </div>
    </nav>
  );
};

const Home = ({ vi, vaiTro, handleKetNoi, handleReload }: any) => {
  const [loading, setLoading] = useState(false);
  const dangKyXong = async () => { setLoading(false); await handleReload(); };
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Hệ thống Tuyển dụng Blockchain Minh bạch</h1>
      {!vi ? (
        <button onClick={handleKetNoi} style={{ marginTop: "20px", padding: "12px 24px", background: "#1890ff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}><Wallet size={20} style={{marginRight: "8px"}}/> Kết nối MetaMask</button>
      ) : (
        <div style={{ marginTop: "30px" }}>
          <h3>Vai trò: <span style={{ color: "#1890ff", fontWeight: "bold" }}>{vaiTro === "0" ? "Chưa đăng ký" : vaiTro === "1" ? "Nhà Phát Hành" : vaiTro === "2" ? "Ứng Viên" : "Nhà Tuyển Dụng"}</span></h3>
          {vaiTro === "0" && (
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
              <button disabled={loading} onClick={async () => { setLoading(true); await dangKyVaiTro("NhaPhatHanh"); dangKyXong(); }} style={{ padding: "15px", cursor: "pointer" }}>Đăng ký Nhà Phát Hành</button>
              <button disabled={loading} onClick={async () => { setLoading(true); await dangKyVaiTro("UngVien"); dangKyXong(); }} style={{ padding: "15px", cursor: "pointer" }}>Đăng ký Ứng Viên</button>
              <button disabled={loading} onClick={async () => { setLoading(true); await dangKyVaiTro("NhaTuyenDung"); dangKyXong(); }} style={{ padding: "15px", cursor: "pointer" }}>Đăng ký Nhà Tuyển Dụng</button>
            </div>
          )}
          {loading && <p style={{color: "blue"}}>⏳ Đang xử lý...</p>}
        </div>
      )}
    </div>
  );
};

// --- TRANG NHÀ PHÁT HÀNH ---
const IssuerPage = ({ vi }: any) => {
  const [form, setForm] = useState({ ungVien: "", maCC: "", tenCC: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load lịch sử cấp bằng
  useEffect(() => {
    if(vi) axios.get(`${API_URL}/api/nph/chung-chi-da-cap/${vi}`).then(res => setHistory(res.data.data));
  }, [vi, loading]); // Reload khi loading xong (cấp mới xong)

  const xuLyCapBang = async () => {
    if(!form.ungVien || !form.maCC || !form.tenCC) return alert("Thiếu thông tin!");
    setLoading(true);
    try {
      const dlGoc = `${form.ungVien}|${form.maCC}|${form.tenCC}`;
      const res = await axios.post(`${API_URL}/api/tien-ich/tao-hash`, { duLieu: dlGoc });
      await capChungChi(form.ungVien, form.maCC, form.tenCC, res.data.hash);
      alert("✅ Cấp chứng chỉ thành công!");
      setForm({ ungVien: "", maCC: "", tenCC: "" });
    } catch (e) { alert("❌ Lỗi cấp chứng chỉ (Mã trùng hoặc ví sai)!"); }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <div style={{ flex: 1, padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3><Shield /> Cấp Chứng Chỉ Mới</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input value={form.ungVien} placeholder="Ví Ứng viên (0x...)" onChange={e => setForm({...form, ungVien: e.target.value})} style={{ padding: "10px" }} />
          <input value={form.maCC} placeholder="Mã loại chứng chỉ (VD: TOEIC, B1, JAVA01)" onChange={e => setForm({...form, maCC: e.target.value})} style={{ padding: "10px" }} />
          <input value={form.tenCC} placeholder="Tên chứng chỉ" onChange={e => setForm({...form, tenCC: e.target.value})} style={{ padding: "10px" }} />
          <button disabled={loading} onClick={xuLyCapBang} style={{ padding: "10px", background: "#52c41a", color: "white", border: "none", cursor: "pointer" }}>{loading ? "Đang xử lý..." : "Cấp Ngay"}</button>
        </div>
      </div>
      
      <div style={{ flex: 1, padding: "20px", background: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3><List /> Lịch sử đã cấp</h3>
        {history.length === 0 ? <p>Chưa cấp chứng chỉ nào.</p> : (
          <ul style={{paddingLeft: "20px"}}>
            {history.map((cc, idx) => (
              <li key={idx} style={{marginBottom: "5px"}}>
                <b>{cc.tenChungChi}</b> ({cc.maChungChi}) <br/>
                <span style={{fontSize: "12px", color: "gray"}}>Cấp: {cc.ngayCap}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// --- TRANG ỨNG VIÊN ---
const CandidatePage = ({ vi }: any) => {
  const [dsCongViec, setDsCongViec] = useState<any[]>([]);
  const [dsChungChi, setDsChungChi] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]); // Danh sách job đã nộp
  const [selectedCC, setSelectedCC] = useState<any>(null); // Object chứng chỉ, không chỉ hash
  const [loading, setLoading] = useState(false);
  
  const loadData = async () => {
    const resJobs = await axios.get(`${API_URL}/api/cong-viec`);
    setDsCongViec(resJobs.data.data);
    if(vi) {
      const resCC = await axios.get(`${API_URL}/api/chung-chi/${vi}`);
      setDsChungChi(resCC.data.data);
      
      // Kiểm tra xem đã nộp những job nào (Logic Frontend giả lập vì Backend chưa có API riêng, 
      // nhưng có thể check bằng cách quét tất cả job -> getHoSo -> tìm mình)
      // Để đơn giản và nhanh, ta check trong dsCongViec khi user bấm nút. 
      // Nhưng để hiện trạng thái "Đã nộp", ta cần quét.
      // Giải pháp nhanh: Load danh sách hồ sơ của từng job (hơi nặng nhưng chính xác)
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

  // Helper check status
  const getAppStatus = (jobId: string) => myApplications.find(a => a.jobId === jobId);

  return (
    <div style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <div style={{ flex: 1, padding: "20px", background: "white", borderRadius: "8px" }}>
        <h3><QrCode /> Kho Chứng Chỉ Của Tôi</h3>
        {dsChungChi.map((cc, idx) => (
            <div key={idx} 
                 style={{ border: selectedCC?.hashDuLieu === cc.hashDuLieu ? "2px solid #1890ff" : "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "8px", cursor: "pointer", background: selectedCC?.hashDuLieu === cc.hashDuLieu ? "#e6f7ff" : "white" }}
                 onClick={() => setSelectedCC(cc)}>
              <h4>{cc.tenChungChi}</h4>
              <p style={{fontSize: "12px"}}>Mã: {cc.maChungChi}</p>
              {selectedCC?.hashDuLieu === cc.hashDuLieu && <span style={{color: "#1890ff", fontWeight: "bold"}}>✅ Đã chọn</span>}
            </div>
        ))}
      </div>

      <div style={{ flex: 2 }}>
        <h3><Briefcase /> Việc Làm Đang Tuyển</h3>
        {dsCongViec.map((cv) => {
          const status = getAppStatus(cv.id);
          return (
            <div key={cv.id} style={{ padding: "20px", marginBottom: "15px", borderRadius: "8px", background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
              <h3>#{cv.id} {cv.tenCongViec}</h3>
              <p>{cv.moTa}</p>
              <p style={{color: "red", fontWeight: "bold"}}>Yêu cầu Mã CC: {cv.maChungChiYeuCau}</p>
              
              {/* LOGIC HIỂN THỊ TRẠNG THÁI */}
              {status ? (
                <div style={{marginTop: "10px", padding: "10px", background: "#f0f2f5", borderRadius: "5px"}}>
                   <strong>Trạng thái: </strong> 
                   <span style={{ color: status.status === 1 ? "green" : status.status === 2 ? "red" : "orange", fontWeight: "bold" }}>
                      {status.statusText.toUpperCase()}
                   </span>
                   {status.status === 1 && <p>🎉 Chúc mừng! Bạn không cần ứng tuyển nữa.</p>}
                   {status.status === 2 && <p>⛔ Hồ sơ đã bị từ chối. Vui lòng đợi đợt tuyển khác (Job ID mới).</p>}
                </div>
              ) : (
                <button disabled={loading} onClick={async () => {
                   if(!selectedCC) return alert("⚠️ Vui lòng CHỌN chứng chỉ bên trái!");
                   // Check sơ bộ mã
                   if(selectedCC.maChungChi !== cv.maChungChiYeuCau) {
                      if(!confirm(`⚠️ CẢNH BÁO: Mã chứng chỉ của bạn (${selectedCC.maChungChi}) KHÁC với yêu cầu (${cv.maChungChiYeuCau}). Bạn vẫn muốn nộp? (Khả năng cao sẽ rớt)`)) return;
                   }
                   setLoading(true);
                   const kq = await nopHoSo(Number(cv.id), selectedCC.maChungChi, selectedCC.hashDuLieu); // Gửi cả Mã CC lên chain
                   setLoading(false);
                   if(kq) { alert("✅ Đã nộp!"); loadData(); }
                   else alert("❌ Lỗi nộp hồ sơ!");
                }} style={{ background: "#1890ff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                  {loading ? "Đang gửi..." : "Nộp Hồ Sơ"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- TRANG NHÀ TUYỂN DỤNG ---
const RecruiterPage = () => {
  const [dsCongViec, setDsCongViec] = useState<any[]>([]);
  const [dsHoSo, setDsHoSo] = useState<any[]>([]);
  const [jobIdDangXem, setJobIdDangXem] = useState<any>(null); // Lưu cả object job
  const [formCV, setFormCV] = useState({ ten: "", moTa: "", yeuCau: "", maCC: "" });
  const [loading, setLoading] = useState(false);

  const loadJobs = () => axios.get(`${API_URL}/api/cong-viec`).then(res => setDsCongViec(res.data.data));
  const xemHoSo = async (job: any) => {
    setJobIdDangXem(job);
    const res = await axios.get(`${API_URL}/api/ho-so/${job.id}`);
    setDsHoSo(res.data.data);
  };
  useEffect(() => { loadJobs(); }, []);

  // HÀM XÁC MINH TỰ ĐỘNG
  const xuLyXacMinh = async (hs: any) => {
     if(!jobIdDangXem) return;
     const requiredCode = jobIdDangXem.maChungChiYeuCau;
     const userCode = hs.maChungChiNop;
     
     let ketQua = false;
     let thongBao = "";

     if(userCode === requiredCode) {
        ketQua = true;
        thongBao = "✅ Mã chứng chỉ KHỚP! Hệ thống đánh giá: Hợp lệ.";
     } else {
        ketQua = false;
        thongBao = `❌ Mã chứng chỉ KHÔNG KHỚP! \nYêu cầu: ${requiredCode}\nỨng viên nộp: ${userCode}\nHệ thống sẽ đánh dấu KHÔNG ĐẠT và TỰ ĐỘNG TỪ CHỐI.`;
     }

     if(!confirm(thongBao + "\n\nBạn có muốn ghi kết quả này lên Blockchain?")) return;

     setLoading(true);
     await xacMinhChungChi(Number(jobIdDangXem.id), hs.index, ketQua);
     // Smart Contract đã được update: Nếu ketQua == false -> Tự động set TrangThai = TuChoi
     setLoading(false);
     xemHoSo(jobIdDangXem);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "30px", padding: "20px", background: "#f0f2f5", borderRadius: "8px" }}>
        <h3>✏️ Đăng Tin Tuyển Dụng</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input placeholder="Tên công việc" onChange={e => setFormCV({...formCV, ten: e.target.value})} style={{padding: "8px", flex: 1}} />
          <input placeholder="Mô tả" onChange={e => setFormCV({...formCV, moTa: e.target.value})} style={{padding: "8px", flex: 2}} />
          <input placeholder="MÃ CHỨNG CHỈ YÊU CẦU (VD: CERT01)" onChange={e => setFormCV({...formCV, maCC: e.target.value})} style={{padding: "8px", flex: 1, border: "2px solid orange"}} />
          <button onClick={async () => { 
              if(!formCV.maCC) return alert("Phải nhập mã chứng chỉ yêu cầu!");
              setLoading(true);
              await dangTuyenDung(formCV.ten, formCV.moTa, "Yêu cầu bằng cấp", formCV.maCC); 
              setLoading(false);
              loadJobs(); 
          }} style={{padding: "8px 20px", background: "#1890ff", color: "white", border: "none", cursor: "pointer"}}>Đăng Tin</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <h3>Tin Đã Đăng</h3>
          {dsCongViec.map((cv) => (
            <div key={cv.id} style={{ border: jobIdDangXem?.id === cv.id ? "2px solid #1890ff" : "1px solid #ddd", padding: "15px", margin: "10px 0", cursor: "pointer", borderRadius: "8px", background: jobIdDangXem?.id === cv.id ? "#e6f7ff" : "white" }}
                 onClick={() => xemHoSo(cv)}>
              <b>#{cv.id} {cv.tenCongViec}</b> <br/>
              <span style={{color: "red", fontSize: "12px"}}>Yêu cầu: {cv.maChungChiYeuCau}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 2, borderLeft: "1px solid #ddd", paddingLeft: "30px" }}>
           <h3>Ứng viên cho Job #{jobIdDangXem?.id} (Yêu cầu: {jobIdDangXem?.maChungChiYeuCau})</h3>
           {loading && <p>⏳ Đang xử lý blockchain...</p>}
           
           {dsHoSo.map((hs) => (
             <div key={hs.index} style={{ background: "#fff", border: "1px solid #eee", padding: "15px", marginBottom: "15px", borderRadius: "8px" }}>
               <div style={{display: "flex", justifyContent: "space-between"}}>
                  <div>
                    <p><b>Ứng viên:</b> {hs.ungVien}</p>
                    <p><b>Mã CC nộp:</b> <span style={{fontWeight: "bold", color: "blue"}}>{hs.maChungChiNop}</span></p>
                    <p><b>Trạng thái:</b> <span style={{ fontWeight: "bold", color: hs.trangThaiCode === 1 ? "green" : hs.trangThaiCode === 2 ? "red" : "orange" }}>{hs.trangThai}</span></p>
                  </div>
                  <QRCodeSVG value={JSON.stringify({ma: hs.maChungChiNop, hash: hs.hashChungChi})} size={60} />
               </div>
               
               <hr style={{borderTop: "1px solid #eee"}}/>

               <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                 {!hs.daXacMinh ? (
                   <button onClick={() => xuLyXacMinh(hs)} style={{ background: "#faad14", color: "white", border: "none", padding: "8px 15px", cursor: "pointer", borderRadius: "4px" }}>
                     🔍 So khớp & Xác minh
                   </button>
                 ) : (
                    <span style={{ color: hs.ketQuaXacMinh ? "green" : "red", display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold" }}>
                      {hs.ketQuaXacMinh ? <CheckCircle size={18}/> : <XCircle size={18}/>} 
                      {hs.ketQuaXacMinh ? "Hợp lệ (Khớp Mã)" : "Không Hợp lệ (Sai Mã)"}
                    </span>
                 )}

                 {/* Nút Tuyển chỉ hiện khi Hợp lệ và chưa quyết định. Nếu Không hợp lệ, Contract tự từ chối rồi nên không hiện nút nữa */}
                 {hs.daXacMinh && hs.ketQuaXacMinh && hs.trangThaiCode === 0 && (
                   <button onClick={async () => {
                        await quyetDinhTuyenDung(Number(jobIdDangXem.id), hs.index, true);
                        xemHoSo(jobIdDangXem);
                     }} style={{ background: "#52c41a", color: "white", border: "none", padding: "8px 15px", cursor: "pointer", borderRadius: "4px", marginLeft: "auto" }}>🤝 Tuyển dụng</button>
                 )}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [vi, setVi] = useState<string>("");
  const [vaiTro, setVaiTro] = useState<string>("0");
  const navigate = useNavigate();

  const handleKetNoi = async () => { const addr = await ketNoiVi(); if(addr) { setVi(addr); await fetchVaiTro(addr); } };
  const fetchVaiTro = async (addr: string) => { try { const res = await axios.get(`${API_URL}/api/vai-tro/${addr}`); setVaiTro(res.data.vaiTro); } catch(e) { console.error(e); } };
  const handleReload = async () => { if(vi) await fetchVaiTro(vi); };
  const handleDangXuat = () => { setVi(""); setVaiTro("0"); navigate("/"); };
  const handleDoiVi = async () => { const addrMoi = await yeuCauDoiVi(); if (addrMoi) { setVi(addrMoi); await fetchVaiTro(addrMoi); navigate("/"); } };

  useEffect(() => { handleKetNoi(); }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
        <Navbar vi={vi} vaiTro={vaiTro} handleDangXuat={handleDangXuat} handleDoiVi={handleDoiVi} />
        <Routes>
          <Route path="/" element={<Home vi={vi} vaiTro={vaiTro} handleKetNoi={handleKetNoi} handleReload={handleReload} />} />
          <Route path="/nha-phat-hanh" element={vaiTro === "1" ? <IssuerPage vi={vi} /> : <p style={{padding:"20px"}}>⛔ Không có quyền!</p>} />
          <Route path="/ung-vien" element={vaiTro === "2" ? <CandidatePage vi={vi} /> : <p style={{padding:"20px"}}>⛔ Không có quyền!</p>} />
          <Route path="/nha-tuyen-dung" element={vaiTro === "3" ? <RecruiterPage /> : <p style={{padding:"20px"}}>⛔ Không có quyền!</p>} />
        </Routes>
    </div>
  );
}

export default function AppWrapper() { return (<Router><App /></Router>) }