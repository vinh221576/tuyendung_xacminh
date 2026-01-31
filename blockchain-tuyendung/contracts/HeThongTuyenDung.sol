// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HeThongTuyenDung {
    
    // --- 1. CẤU TRÚC DỮ LIỆU ---

    enum VaiTro { KhongCo, NhaPhatHanh, UngVien, NhaTuyenDung }
    enum TrangThaiHoSo { ChoDuyet, DaTuyen, TuChoi }

    struct ChungChi {
        string maChungChi; // Mã loại chứng chỉ (VD: TOEIC, B1). KHÔNG DUY NHẤT.
        string tenChungChi;
        string hashDuLieu; // Hash này mới là duy nhất cho từng lần cấp
        address nguoiCap;
        uint256 ngayCap;
        bool hopLe;
    }

    struct CongViec {
        uint256 id;
        address nhaTuyenDung;
        string tenCongViec;
        string moTa;
        string yeuCau;
        string maChungChiYeuCau; // NTD yêu cầu mã loại này (VD: B1)
        uint256 ngayDang;
        bool dangMo;
    }

    struct HoSoUngTuyen {
        uint256 idCongViec;
        address ungVien;
        string maChungChiNop;
        string hashChungChi;
        uint256 ngayNop;
        TrangThaiHoSo trangThai;
        bool daXacMinh;
        bool ketQuaXacMinh;
    }

    // --- 2. LƯU TRỮ ---

    mapping(address => VaiTro) public danhSachVaiTro;
    mapping(address => ChungChi[]) public danhSachChungChi;
    mapping(address => ChungChi[]) public danhSachChungChiDaCap;
    
    CongViec[] public danhSachCongViec;
    mapping(uint256 => HoSoUngTuyen[]) public hoSoTheoCongViec;
    
    // [ĐÃ XÓA] mapping maChungChiDaTonTai -> Cho phép trùng mã thoải mái
    mapping(uint256 => mapping(address => bool)) public daNopHoSo;

    // --- 3. SỰ KIỆN ---
    event DaDangKyVaiTro(address indexed viNguoiDung, VaiTro vaiTro);
    event DaCapChungChi(address indexed ungVien, string maChungChi, address indexed nguoiCap);
    event DaDangTinTuyenDung(uint256 indexed idCongViec, address indexed nhaTuyenDung);
    event DaNopHoSo(uint256 indexed idCongViec, address indexed ungVien);
    event DaXacMinhChungChi(uint256 indexed idCongViec, address indexed ungVien, bool ketQua);
    event DaRaQuyetDinh(uint256 indexed idCongViec, address indexed ungVien, TrangThaiHoSo trangThai);

    // --- 4. NGHIỆP VỤ ---

    function dangKyNhaPhatHanh() public { require(danhSachVaiTro[msg.sender] == VaiTro.KhongCo); danhSachVaiTro[msg.sender] = VaiTro.NhaPhatHanh; }
    function dangKyUngVien() public { require(danhSachVaiTro[msg.sender] == VaiTro.KhongCo); danhSachVaiTro[msg.sender] = VaiTro.UngVien; }
    function dangKyNhaTuyenDung() public { require(danhSachVaiTro[msg.sender] == VaiTro.KhongCo); danhSachVaiTro[msg.sender] = VaiTro.NhaTuyenDung; }
    function layVaiTro(address _vi) public view returns (VaiTro) { return danhSachVaiTro[_vi]; }

    // CẤP CHỨNG CHỈ (Đã gỡ bỏ giới hạn trùng mã)
    function capChungChi(address _ungVien, string memory _maChungChi, string memory _tenChungChi, string memory _hashDuLieu) public {
        require(danhSachVaiTro[msg.sender] == VaiTro.NhaPhatHanh, "Khong phai NPH");
        require(danhSachVaiTro[_ungVien] == VaiTro.UngVien, "Khong phai UV");
        
        // [ĐÃ XÓA] require(!maChungChiDaTonTai) -> Cho phép cấp cùng 1 loại bằng cho nhiều người

        ChungChi memory ccMoi = ChungChi({
            maChungChi: _maChungChi,
            tenChungChi: _tenChungChi,
            hashDuLieu: _hashDuLieu,
            nguoiCap: msg.sender,
            ngayCap: block.timestamp,
            hopLe: true
        });

        danhSachChungChi[_ungVien].push(ccMoi);
        danhSachChungChiDaCap[msg.sender].push(ccMoi);
        
        emit DaCapChungChi(_ungVien, _maChungChi, msg.sender);
    }

    // ĐĂNG TUYỂN
    function dangTuyenDung(string memory _ten, string memory _moTa, string memory _yeuCau, string memory _maChungChiYeuCau) public {
        require(danhSachVaiTro[msg.sender] == VaiTro.NhaTuyenDung, "Khong phai NTD");
        danhSachCongViec.push(CongViec({
            id: danhSachCongViec.length,
            nhaTuyenDung: msg.sender,
            tenCongViec: _ten,
            moTa: _moTa,
            yeuCau: _yeuCau,
            maChungChiYeuCau: _maChungChiYeuCau,
            ngayDang: block.timestamp,
            dangMo: true
        }));
    }

    // NỘP HỒ SƠ
    function nopHoSoUngTuyen(uint256 _idCongViec, string memory _maChungChiNop, string memory _hashChungChi) public {
        require(danhSachVaiTro[msg.sender] == VaiTro.UngVien, "Khong phai UV");
        require(!daNopHoSo[_idCongViec][msg.sender], "Da nop roi");

        hoSoTheoCongViec[_idCongViec].push(HoSoUngTuyen({
            idCongViec: _idCongViec,
            ungVien: msg.sender,
            maChungChiNop: _maChungChiNop,
            hashChungChi: _hashChungChi,
            ngayNop: block.timestamp,
            trangThai: TrangThaiHoSo.ChoDuyet,
            daXacMinh: false,
            ketQuaXacMinh: false
        }));

        daNopHoSo[_idCongViec][msg.sender] = true;
    }

    // XÁC MINH
    function xacMinhChungChi(uint256 _idCongViec, uint256 _indexHoSo, bool _ketQua) public {
        require(danhSachCongViec[_idCongViec].nhaTuyenDung == msg.sender, "Khong phai chu post");
        hoSoTheoCongViec[_idCongViec][_indexHoSo].daXacMinh = true;
        hoSoTheoCongViec[_idCongViec][_indexHoSo].ketQuaXacMinh = _ketQua;
        if (_ketQua == false) {
             hoSoTheoCongViec[_idCongViec][_indexHoSo].trangThai = TrangThaiHoSo.TuChoi;
        }
    }

    // QUYẾT ĐỊNH
    function quyetDinhTuyenDung(uint256 _idCongViec, uint256 _indexHoSo, bool _tuyenDung) public {
        require(danhSachCongViec[_idCongViec].nhaTuyenDung == msg.sender, "Khong phai chu post");
        require(hoSoTheoCongViec[_idCongViec][_indexHoSo].daXacMinh, "Chua xac minh");
        require(hoSoTheoCongViec[_idCongViec][_indexHoSo].trangThai == TrangThaiHoSo.ChoDuyet, "Da quyet dinh roi");

        if (_tuyenDung) hoSoTheoCongViec[_idCongViec][_indexHoSo].trangThai = TrangThaiHoSo.DaTuyen;
        else hoSoTheoCongViec[_idCongViec][_indexHoSo].trangThai = TrangThaiHoSo.TuChoi;
    }

    // GETTERS
    function layDanhSachChungChi(address _ungVien) public view returns (ChungChi[] memory) { return danhSachChungChi[_ungVien]; }
    function layDanhSachChungChiDaCap(address _nph) public view returns (ChungChi[] memory) { return danhSachChungChiDaCap[_nph]; }
    function layDanhSachCongViec() public view returns (CongViec[] memory) { return danhSachCongViec; }
    function layDanhSachHoSo(uint256 _idCongViec) public view returns (HoSoUngTuyen[] memory) { return hoSoTheoCongViec[_idCongViec]; }
}