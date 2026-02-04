// C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\frontend-tuyendung\src\pages\IssuerPage.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Shield, List, User, FileBadge, Code, Clock, CheckCircle, Hash } from "lucide-react";
import { capChungChi } from "../services/blockchain";

const API_URL = import.meta.env.VITE_API_URL;

// CSS Styles nội bộ
const styles = `
  .page-container {
    display: flex;
    width: 100%;
    min-height: calc(100vh - 70px);
    background-color: #f0f2f5;
    padding: 30px 40px;
    gap: 30px;
  }

  /* CỘT TRÁI: FORM CẤP BẰNG */
  .form-section {
    flex: 0 0 400px; /* Cố định chiều rộng 400px */
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    height: fit-content;
    position: sticky;
    top: 100px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #001529;
    font-size: 14px;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    color: #bfbfbf;
  }

  .form-input {
    width: 100%;
    padding: 10px 12px 10px 40px; /* Chừa chỗ cho icon */
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;
    outline: none;
  }

  .form-input:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .btn-submit {
    width: 100%;
    background: #1890ff;
    color: white;
    font-weight: 600;
    padding: 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }
  .btn-submit:hover { background: #096dd9; }
  .btn-submit:disabled { background: #d9d9d9; cursor: not-allowed; }

  /* CỘT PHẢI: LỊCH SỬ */
  .history-section {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    transition: all 0.2s;
    background: #fafafa;
  }
  .history-item:hover {
    background: #fff;
    border-color: #1890ff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .item-main {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .cert-icon-box {
    width: 48px;
    height: 48px;
    background: #e6f7ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1890ff;
  }

  .code-badge {
    background: #f0f0f0;
    color: #595959;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    margin-top: 4px;
    display: inline-block;
  }
`;

const IssuerPage = ({ vi }: any) => {
  const [form, setForm] = useState({ ungVien: "", maCC: "", tenCC: "" });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Load lịch sử cấp bằng từ Backend
  useEffect(() => {
    if(vi) axios.get(`${API_URL}/api/nph/chung-chi-da-cap/${vi}`).then(res => setHistory(res.data.data.reverse())); // Đảo ngược để tin mới lên đầu
  }, [vi, loading]);

  const xuLyCapBang = async () => {
    if(!form.ungVien || !form.maCC || !form.tenCC) return alert("Vui lòng nhập đủ thông tin!");
    setLoading(true);
    try {
      const dlGoc = `${form.ungVien}|${form.maCC}|${form.tenCC}`;
      // Gọi API tạo Hash tiện ích
      const res = await axios.post(`${API_URL}/api/tien-ich/tao-hash`, { duLieu: dlGoc });
      // Ghi lên Blockchain
      await capChungChi(form.ungVien, form.maCC, form.tenCC, res.data.hash);
      
      alert("✅ Cấp chứng chỉ thành công!");
      setForm({ ungVien: "", maCC: "", tenCC: "" });
    } catch (e) { 
        alert("❌ Lỗi cấp chứng chỉ! Vui lòng kiểm tra lại ví hoặc kết nối mạng."); 
    }
    setLoading(false);
  };

  return (
    <>
    <style>{styles}</style>
    <div className="page-container">
      
      {/* --- CỘT TRÁI: FORM --- */}
      <div className="form-section">
        <h2 style={{margin: "0 0 24px 0", color: "#001529", display: "flex", alignItems: "center", gap: "10px"}}>
          <Shield color="#1890ff" fill="#1890ff" fillOpacity={0.1}/> Cấp Chứng Chỉ
        </h2>

        {/* Input 1: Ví Ứng Viên */}
        <div className="form-group">
            <label className="form-label">Địa chỉ ví Ứng viên</label>
            <div className="input-wrapper">
                <User size={18} className="input-icon"/>
                <input 
                    className="form-input" 
                    value={form.ungVien} 
                    placeholder="0x..." 
                    onChange={e => setForm({...form, ungVien: e.target.value})}
                    style={{fontFamily: "monospace"}} 
                />
            </div>
        </div>

        {/* Input 2: Mã Chứng Chỉ */}
        <div className="form-group">
            <label className="form-label">Mã loại chứng chỉ</label>
            <div className="input-wrapper">
                <Code size={18} className="input-icon"/>
                <input 
                    className="form-input" 
                    value={form.maCC} 
                    placeholder="VD: TOEIC, B1, JAVA_CORE" 
                    onChange={e => setForm({...form, maCC: e.target.value})} 
                    style={{textTransform: "uppercase"}}
                />
            </div>
            <small style={{color: "#8c8c8c", fontSize: "12px"}}>Dùng để phân loại khi so khớp.</small>
        </div>

        {/* Input 3: Tên Chứng Chỉ */}
        <div className="form-group">
            <label className="form-label">Tên hiển thị</label>
            <div className="input-wrapper">
                <FileBadge size={18} className="input-icon"/>
                <input 
                    className="form-input" 
                    value={form.tenCC} 
                    placeholder="VD: Java Backend Developer" 
                    onChange={e => setForm({...form, tenCC: e.target.value})} 
                />
            </div>
        </div>

        <button disabled={loading} onClick={xuLyCapBang} className="btn-submit">
            {loading ? "⏳ Đang ghi Blockchain..." : "Cấp Ngay"}
        </button>
      </div>
      
      {/* --- CỘT PHẢI: LỊCH SỬ --- */}
      <div className="history-section">
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}}>
             <h2 style={{margin: 0, color: "#001529", display: "flex", alignItems: "center", gap: "10px"}}>
                <List color="#595959"/> Lịch sử đã cấp ({history.length})
             </h2>
             <span style={{fontSize: "13px", color: "#8c8c8c"}}>Sắp xếp: Mới nhất trước</span>
        </div>
        
        {history.length === 0 ? (
             <div style={{textAlign: "center", padding: "40px", color: "#bfbfbf"}}>
                 <FileBadge size={48} style={{marginBottom: "10px", opacity: 0.5}}/>
                 <p>Chưa có dữ liệu cấp bằng.</p>
             </div>
        ) : (
            <div className="history-list">
                {history.map((cc, idx) => (
                    <div key={idx} className="history-item">
                        <div className="item-main">
                            <div className="cert-icon-box">
                                <CheckCircle size={24}/>
                            </div>
                            <div>
                                <h4 style={{margin: "0 0 4px 0", fontSize: "16px", color: "#262626"}}>{cc.tenChungChi}</h4>
                                <span className="code-badge">{cc.maChungChi}</span>
                            </div>
                        </div>
                        
                        <div style={{textAlign: "right", fontSize: "13px"}}>
                            <div style={{color: "#8c8c8c", marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "5px"}}>
                                <Clock size={14}/> {cc.ngayCap}
                            </div>
                            <div style={{color: "#bfbfbf", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "5px"}}>
                                <Hash size={14}/> {cc.hashDuLieu.slice(0, 10)}...
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
    </>
  );
};

export default IssuerPage;