import { CaseType } from '../types/caseTypes';

export const caseTypes: CaseType[] = [
  {
    id: 'HON_NHAN',
    name: 'Sổ thụ lý đơn khởi kiện',
    code: 'SO_THU_LY_DON_KHOI_KIEN',
    attributes: [
      { id: 'so_thu_ly', name: '🔢 Số thụ lý', type: 'text', required: false, width: 120 },
      { id: 'ngay_thu_ly', name: '📅 Ngày thụ lý', type: 'date', required: false, width: 120 },
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan', name: '📋 Thông tin người có quyền lợi và nghĩa vụ liên quan', type: 'textarea', required: false, width: 250 },
      { id: 'ngay_lam_don', name: '📅 Ngày làm đơn', type: 'date', required: false, width: 120 },
      { id: 'noi_dung_don', name: '📝 Nội dung đơn', type: 'textarea', required: false, width: 300 },
      { id: 'tai_lieu_kem_theo', name: '📎 Tài liệu kèm theo', type: 'textarea', required: false, width: 300 },
      { id: 'ngay_nhan_don', name: '📅 Ngày nhận đơn', type: 'date', required: false, width: 120 },

      // Combined fields
      { id: 'thong_tin_chuyen_hoa_giai', name: '🔄 Chuyển hoà giải', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_tra_lai_don', name: '↩️ Thông tin trả lại đơn', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_yeu_cau_sua_doi_bo_sung', name: '✏️ Thông tin yêu cầu sửa đổi bổ sung', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_chuyen_don_khoi_kien', name: '📤 Thông tin chuyển đơn khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_thong_bao_nop_tam_ung_an_phi', name: '📢 Thông tin thông báo nộp tạm ứng án phí', type: 'textarea', required: false, width: 320 },
      { id: 'ngay_nop_tien_tam_ung_an_phi', name: '📅 Ngày nộp tiền tạm ứng án phí', type: 'date', required: false, width: 260 },
      { id: 'thong_tin_thu_ly_vu_an', name: '⚖️ Thông tin thụ lý vụ án', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_giu_nguyen_tra_lai_don', name: '🛑 Thông tin giữ nguyên trả lại đơn', type: 'textarea', required: false, width: 320 },

      // New combined fields for editing
      { id: 'thong_tin_nhan_lai_don_khoi_kien_va_tai_lieu', name: '🔄 Số/Ngày nhận lại đơn khởi kiện và tài liệu', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_yeu_cau_toa_an_nhan_lai_don_khoi_kien', name: '⚖️ Yêu cầu toà án nhận lại đơn khởi kiện', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_ap_dung_bien_phap_khan_cap_tam_thoi', name: '⏳ Áp dụng biện pháp khẩn cấp tạm thời', type: 'textarea', required: false, width: 280 },
      { id: 'tham_phan', name: '👩‍⚖️ Thẩm phán', type: 'text', required: false, width: 150 },
      { id: 'ghi_chu', name: '📝 Ghi chú', type: 'textarea', required: false, width: 300 }
    ]
  },
  {
    id: 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI',
    name: 'Sổ thụ lý giải quyết tranh chấp được hoà giải tại Toà án',
    code: 'SO_THU_LY_GIAI_QUYET_TRANH_CHAP_DUOC_HOA_GIAI_TAI_TOA_AN',
    attributes: [
      { id: 'thong_tin_chuyen_hoa_giai', name: '🔄 Số/Ngày chuyển hoà giải', type: 'textarea', required: false, width: 250 },
      { id: 'ngay_thu_ly', name: '📅 Ngày nhận đơn', type: 'date', required: false, width: 120 },
      { id: 'noi_dung_don', name: '📝 Tóm tắt nội dung đơn', type: 'textarea', required: false, width: 300 },
      { id: 'tai_lieu_kem_theo', name: '📎 Tài liệu kèm theo', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_tham_gia_hoa_giai', name: '📋 Thông tin người tham gia hoà giải', type: 'textarea', required: false, width: 250 },
      { id: 'tham_phan', name: '👩‍⚖️ Thẩm phán', type: 'text', required: false, width: 150 },
      { id: 'hoa_giai_vien_do_tham_phan_chi_dinh', name: '🤝 Hoà giải viên do thẩm phán chỉ định', type: 'text', required: false, width: 250 },
      { id: 'ho_ten_duong_su_lua_chon', name: '🧑‍🤝‍🧑 Họ tên đương sự lựa chọn', type: 'text', required: false, width: 200 },
      { id: 'toa_an_noi_quan_ly_hoa_giai_vien_lam_viec', name: '🏛️ TAND nơi quản lý hoà giải viên', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_thong_bao_ve_quyen_lua_chon_hoa_giai', name: '📢 Số/Ngày thông báo về quyền lựa chọn hoà giải', type: 'textarea', required: false, width: 320 },
      { id: 'ngay_nguoi_khoi_kien_dong_y', name: '✅ Ngày người khởi kiện đồng ý', type: 'date', required: false, width: 180 },
      { id: 'ngay_nguoi_khoi_kien_khong_tra_loi_thong_bao_lan2', name: '❌ Ngày người khởi kiện không trả lời thông báo lần 2', type: 'date', required: false, width: 280 },
      { id: 'ngay_nguoi_khoi_kien_khong_dong_y', name: '🚫 Ngày người khởi kiện không đồng ý', type: 'date', required: false, width: 200 },
      { id: 'ngay_nguoi_bi_kien_dong_y', name: '✅ Ngày người bị kiện đồng ý', type: 'date', required: false, width: 180 },
      { id: 'ngay_nguoi_bi_kien_khong_dong_y', name: '🚫 Ngày người bị kiện không đồng ý', type: 'date', required: false, width: 200 },
      { id: 'ngay_phien_hop_ghi_nhan_ket_qua_hoa_giai', name: '🗓️ Ngày phiên họp ghi nhận kết quả hoà giải', type: 'date', required: false, width: 280 },
      { id: 'noi_dung_hoa_giai_thanh', name: '✔️ Hoà giải thành', type: 'textarea', required: false, width: 300 },
      { id: 'noi_dung_hoa_giai_khong_thanh', name: '✖️ Hoà giải không thành', type: 'textarea', required: false, width: 300 },
      { id: 'ngay_yeu_cau_cua_duong_su', name: '🗓️ Ngày yêu cầu của đương sự', type: 'date', required: false, width: 200 },
      { id: 'tom_tat_noi_dung_yeu_cau_cua_duong_su', name: '📝 Tóm tắt nội dung yêu cầu của đương sự', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_quyet_dinh_cong_nhan_hoa_giai_thanh', name: '✅ Số/Ngày QĐ công nhận hoà giải thành', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_quyet_dinh_khong_cong_nhan_hoa_giai_thanh', name: '❌ Số/Ngày QĐ không công nhận hoà giải thành', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_chuyen_don_giai_quyet_theo_thu_tuc_to_tung', name: '➡️ Số/Ngày chuyển đơn giải quyết theo thủ tục tố tụng', type: 'textarea', required: false, width: 350 },
      { id: 'ly_do_chuyen_don_giai_quyet_theo_thu_tuc_to_tung', name: '📝 Lý do chuyển đơn giải quyết theo thủ tục tố tụng', type: 'textarea', required: false, width: 350 },
      { id: 'ho_ten_nguoi_de_nghi_giai_quyet', name: '👤 Họ tên người đề nghị giải quyết', type: 'text', required: false, width: 250 },
      { id: 'ngay_nguoi_de_nghi_giai_quyet', name: '📅 Ngày người đề nghị giải quyết', type: 'date', required: false, width: 250 },
      { id: 'thong_tin_vien_kiem_sat_kien_nghi', name: '⚖️ Số/Ngày Viện kiểm sát kiến nghị', type: 'textarea', required: false, width: 280 },
      { id: 'ngay_chuyen_ho_so_cho_toa_an_cap_tren_tru_tiep', name: '⬆️ Ngày chuyển hồ sơ cho toà án cấp trên trực tiếp', type: 'date', required: false, width: 300 },
      { id: 'thong_tin_quyet_dinh_cua_toa_an_cap_tren_truc_tiep', name: '📜 Số/Ngày QĐ của toà án cấp trên trực tiếp', type: 'textarea', required: false, width: 320 },
      { id: 'tom_tat_dinh_cua_toa_an_cap_tren_truc_tiep', name: '📝 Tóm tắt QĐ của toà án cấp trên trực tiếp', type: 'textarea', required: false, width: 350 },
      { id: 'ghi_chu', name: '📝 Ghi chú', type: 'textarea', required: false, width: 300 }
    ]
  }
];