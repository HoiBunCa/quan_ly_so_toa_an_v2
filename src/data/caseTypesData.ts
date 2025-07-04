import { CaseType } from '../types/caseTypes';

export const caseTypes: CaseType[] = [
  {
    id: 'HON_NHAN',
    name: 'Sổ thụ lý đơn khởi kiện',
    code: 'SO_THU_LY_DON_KHOI_KIEN',
    attributes: [
      { id: 'thong_tin_so_ngay_thu_ly', name: '🔢 Số/Ngày thụ lý', type: 'textarea', required: false, width: 180 }, // New combined field
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan', name: '📋 Thông tin người có quyền lợi và nghĩa vụ liên quan', type: 'textarea', required: false, width: 250 },
      { id: 'ngay_lam_don', name: '📅 Ngày làm đơn', type: 'date', required: false, width: 120 },
      { id: 'noi_dung_don', name: '📝 Nội dung đơn', type: 'textarea', required: false, width: 300 },
      { id: 'tai_lieu_kem_theo', name: '📎 Tài liệu kèm theo', type: 'textarea', required: false, width: 300 },
      { id: 'ngay_nhan_don', name: '📅 Ngày nhận đơn', type: 'date', required: false, width: 120 },

      // Combined fields
      { id: 'thong_tin_chuyen_hoa_giai', name: '🔄 Chuyển hoà giải', type: 'textarea', required: false, width: 250 },
      { id: 'ngay_chuyen_don_ve_giai_quyet_theo_thu_tuc_to_tung', name: 'Chuyển đơn về giải quyết theo thủ tục tố tụng', type: 'date', required: false, width: 300 },
      { id: 'thong_tin_tra_lai_don', name: '↩️ Thông tin trả lại đơn', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_yeu_cau_sua_doi_bo_sung', name: '✏️ Thông tin yêu cầu sửa đổi bổ sung', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_chuyen_don_khoi_kien', name: '📤 Thông tin chuyển đơn khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_thong_bao_nop_tam_ung_an_phi', name: '📢 Thông tin thông báo nộp tạm ứng án phí', type: 'textarea', required: false, width: 320 },
      { id: 'ngay_nop_tien_tam_ung_an_phi', name: '📅 Ngày nộp tiền tạm ứng án phí', type: 'date', required: false, width: 260 },
      { id: 'thong_tin_thu_ly_vu_an', name: '⚖️ Thông tin thụ lý vụ án', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_giu_nguyen_tra_lai_don', name: '🛑 Thông tin giữ nguyên trả lại đơn', type: 'textarea', required: false, width: 320 },
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
      { id: 'thong_tin_so_ngay_nhan_don', name: '🔢 Số/Ngày nhận đơn', type: 'textarea', required: false, width: 180 }, // NEW: Combined field for so_thu_ly and ngay_thu_ly
      { id: 'tom_tat_noi_dung_don', name: '📝 Tóm tắt nội dung đơn', type: 'textarea', required: false, width: 300 },
      { id: 'tai_lieu_kem_theo', name: '📎 Tài liệu kèm theo', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_tham_gia_hoa_giai', name: '👥 Thông tin người tham gia hoà giải', type: 'textarea', required: false, width: 250 }, // Combined field
      { id: 'tham_phan', name: '👩‍⚖️ Thẩm phán', type: 'text', required: false, width: 150 },
      { id: 'hoa_giai_vien_do_tham_phan_chi_dinh', name: '🤝 Hoà giải viên do thẩm phán chỉ định', type: 'text', required: false, width: 250 },
      { id: 'thong_tin_duong_su_lua_chon_va_toa_an_quan_ly', name: '🧑‍🤝‍🧑 Thông tin đương sự lựa chọn và Toà án quản lý', type: 'textarea', required: false, width: 300 }, // NEW combined field
      { id: 'thong_tin_thong_bao_ve_quyen_lua_chon_hoa_giai', name: '📢 Số/Ngày thông báo về quyền lựa chọn hoà giải', type: 'textarea', required: false, width: 320 },
      { id: 'ngay_nguoi_khoi_kien_dong_y', name: '✅ Ngày người khởi kiện đồng ý', type: 'date', required: false, width: 180 },
      { id: 'ngay_nguoi_khoi_kien_khong_tra_loi_thong_bao_lan2', name: '❌ Ngày người khởi kiện không trả lời thông báo lần 2', type: 'date', required: false, width: 280 },
      { id: 'ngay_nguoi_khoi_kien_khong_dong_y', name: '🚫 Ngày người khởi kiện không đồng ý', type: 'date', required: false, width: 200 },
      { id: 'ngay_nguoi_bi_kien_dong_y', name: '✅ Ngày người bị kiện đồng ý', type: 'date', required: false, width: 180 },
      { id: 'ngay_nguoi_bi_kien_khong_dong_y', name: '🚫 Ngày người bị kiện không đồng ý', type: 'date', required: false, width: 200 },
      { id: 'ngay_phien_hop_ghi_nhan_ket_qua_hoa_giai', name: '🗓️ Ngày phiên họp ghi nhận kết quả hoà giải', type: 'date', required: false, width: 280 },
      { id: 'noi_dung_hoa_giai_thanh', name: '✔️ Hoà giải thành', type: 'textarea', required: false, width: 300 },
      { id: 'noi_dung_hoa_giai_khong_thanh', name: '✖️ Hoà giải không thành', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_yeu_cau_cua_duong_su', name: '🗓️ Tóm tắt yêu cầu của đương sự', type: 'textarea', required: false, width: 300 }, // NEW combined field
      { id: 'thong_tin_quyet_dinh_cong_nhan_hoa_giai_thanh', name: '✅ Số/Ngày QĐ công nhận hoà giải thành', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_quyet_dinh_khong_cong_nhan_hoa_giai_thanh', name: '❌ Số/Ngày QĐ không công nhận hoà giải thành', type: 'textarea', required: false, width: 320 },
      { id: 'thong_tin_chuyen_don_giai_quyet_theo_thu_tuc_to_tung', name: '➡️ Số/Ngày chuyển đơn giải quyết theo thủ tục tố tụng', type: 'textarea', required: false, width: 350 },
      { id: 'ly_do_chuyen_don_giai_quyet_theo_thu_tuc_to_tung', name: '📝 Lý do chuyển đơn giải quyết theo thủ tục tố tụng', type: 'textarea', required: false, width: 350 },
      { id: 'thong_tin_nguoi_de_nghi_giai_quyet', name: '👤 Thông tin người đề nghị giải quyết', type: 'textarea', required: false, width: 280 }, // NEW combined field
      { id: 'thong_tin_vien_kiem_sat_kien_nghi', name: '⚖️ Số/Ngày Viện kiểm sát kiến nghị', type: 'textarea', required: false, width: 280 },
      { id: 'ngay_chuyen_ho_so_cho_toa_an_cap_tren_tru_tiep', name: '⬆️ Ngày chuyển hồ sơ cho toà án cấp trên trực tiếp', type: 'date', required: false, width: 300 },
      { id: 'thong_tin_quyet_dinh_va_tom_tat_toa_an_cap_tren_truc_tiep', name: '📜 Thông tin QĐ của toà án cấp trên trực tiếp', type: 'textarea', required: false, width: 350 }, // NEW combined field
      { id: 'ghi_chu', name: '📝 Ghi chú', type: 'textarea', required: false, width: 300 }
    ]
  },
  {
    id: 'TO_TUNG',
    name: 'Sổ thụ lý tố tụng',
    code: 'SO_THU_LY_TO_TUNG',
    attributes: [
      // Combined fields for display and editing via modal
      { id: 'thong_tin_so_ngay_don', name: '🔢 Số/Ngày đơn', type: 'textarea', required: false, width: 180 },
      { id: 'thong_tin_so_ngay_thu_ly_chinh', name: '🔢 Số/Ngày thụ lý chính', type: 'textarea', required: false, width: 200 },
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'don_khoi_kien_cua_co_quan_to_chuc', name: '🏢 Đơn khởi kiện của cơ quan, tổ chức', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 200 },
      { id: 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan', name: '📋 Thông tin người có quyền lợi và nghĩa vụ liên quan', type: 'textarea', required: false, width: 250 },
      { id: 'nguoi_bao_ve_quyen_loi', name: '🧑‍⚖️ Người bảo vệ quyền lợi', type: 'text', required: false, width: 200 },
      { id: 'noi_dung_don', name: '📝 Quan hệ pháp luật khi thụ lý', type: 'textarea', required: false, width: 300 },
      { id: 'ly_do_xin_ly_hon', name: '💔 Lý do xin ly hôn', type: 'text', required: false, width: 200 },
      { id: 'so_con_chua_thanh_nien', name: '👶 Số con chưa thành niên', type: 'number', required: false, width: 150 },
      { id: 'thong_tin_dung_bien_phap_khan_cap_tam_thoi', name: '⏳ Số/Ngày áp dụng BP khẩn cấp tạm thời', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan', name: '📤 Số/Ngày chuyển HS vụ việc & Nơi nhận', type: 'textarea', required: false, width: 350 },
      { id: 'thong_tin_tam_dinh_chi', name: '⏸️ Số/Ngày tạm đình chỉ', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_dinh_chi', name: '⏹️ Số/Ngày đình chỉ', type: 'textarea', required: false, width: 250 },
      { id: 'ly_do', name: '📝 Lý do', type: 'textarea', required: false, width: 300 },
      { id: 'hoa_giai_doan_tu', name: '🤝 Hoà giải đoàn tụ', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 150 },
      { id: 'thong_tin_cong_nhan_su_thoa_thuan_cua_duong_su', name: '✅ Số/Ngày công nhận sự thoả thuận', type: 'textarea', required: false, width: 300 },
      { id: 'hoi_dong_xet_xu', name: '👨‍⚖️ Hội đồng xét xử', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_ban_an_so_tham', name: '📜 Số/Ngày bản án sơ thẩm', type: 'textarea', required: false, width: 280 },
      { id: 'quan_he_phap_luat_da_giai_quyet', name: '⚖️ Quan hệ pháp luật đã giải quyết', type: 'textarea', required: false, width: 300 },
      { id: 'tom_tat_noi_dung_ban_an_quyet_dinh_so_tham', name: '📝 Tóm tắt nội dung bản án/QĐ sơ thẩm', type: 'textarea', required: false, width: 350 },
      { id: 'thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet', name: '📄 Số/Ngày KQ giải quyết yêu cầu hủy QĐ cá biệt & Cơ quan', type: 'textarea', required: false, width: 450 },
      { id: 'ap_dung_an_le', name: '📖 Áp dụng án lệ', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 150 },
      { id: 'thong_tin_giai_quyet_theo_thu_tuc_rut_gon', name: '⚡ Số/Ngày giải quyết theo thủ tục rút gọn', type: 'textarea', required: false, width: 320 },
      { id: 'co_uy_thac_tu_phap', name: '🤝 Có uỷ thác tư pháp', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 180 },
      { id: 'khong_uy_thac_tu_phap', name: '🚫 Không uỷ thác tư pháp', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 180 },
      { id: 'viec_hon_nhan_va_gia_dinh', name: '👨‍👩‍👧‍👦 Việc hôn nhân và gia đình', type: 'dropdown', options: ['Có', 'Không'], required: false, width: 200 },
      { id: 'thong_tin_khang_cao', name: '⬆️ Số/Ngày kháng cáo', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_khang_nghi', name: '❗ Số/Ngày kháng nghị', type: 'textarea', required: false, width: 250 },
      { id: 'chuyen_ho_so_cho_toa_an_cap_phuc_tham', name: '➡️ Chuyển hồ sơ cho toà án cấp phúc thẩm', type: 'textarea', required: false, width: 300 },
      { id: 'thong_tin_ban_an_quyet_dinh_phuc_tham', name: '📜 Thông tin bản án/QĐ của toà án cấp phúc thẩm', type: 'textarea', required: false, width: 350 }, // NEW combined field
      { id: 'ghi_chu', name: '📝 Ghi chú', type: 'textarea', required: false, width: 300 },
      { id: 'tham_phan', name: '👩‍⚖️ Thẩm phán giải quyết', type: 'text', required: false, width: 200 }
    ]
  }
];