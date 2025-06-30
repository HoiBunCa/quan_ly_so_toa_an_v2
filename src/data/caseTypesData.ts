import { CaseType } from '../types/caseTypes';

export const caseTypes: CaseType[] = [
  {
    id: 'HON_NHAN',
    name: 'Sổ thụ lý đơn khởi kiện',
    code: 'CIV',
    attributes: [
      { id: 'caseNumber', name: 'Số vụ án', type: 'text', required: true, width: 120 },
      { id: 'createdDate', name: 'Ngày tạo', type: 'date', required: true, width: 120 },
      { id: 'lastModified', name: 'Ngày sửa đổi cuối', type: 'date', required: true, width: 150 },
      { id: 'status', name: 'Trạng thái', type: 'dropdown', required: true, width: 120,
        options: ['Đã thụ lý', 'Đang giải quyết', 'Đã hòa giải', 'Đã trả lại đơn', 'Đã chuyển'] }, // Example statuses
      { id: 'so_thu_ly', name: 'Số thụ lý', type: 'text', required: false, width: 120 },
      { id: 'ngay_thu_ly', name: 'Ngày thụ lý', type: 'date', required: false, width: 120 },
      { id: 'ho_ten_nguoi_khoi_kien', name: 'Họ tên người khởi kiện', type: 'text', required: false, width: 180 },
      { id: 'nam_sinh_nguoi_khoi_kien', name: 'Năm sinh người khởi kiện', type: 'text', required: false, width: 150 },
      { id: 'dia_chi_nguoi_khoi_kien', name: 'Địa chỉ người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'ho_ten_nguoi_bi_kien', name: 'Họ tên người bị kiện', type: 'text', required: false, width: 180 },
      { id: 'nam_sinh_nguoi_bi_kien', name: 'Năm sinh người bị kiện', type: 'text', required: false, width: 150 },
      { id: 'dia_chi_nguoi_bi_kien', name: 'Địa chỉ người bị kiện', type: 'textarea', required: false, width: 250 },
      { id: 'ngay_lam_don', name: 'Ngày làm đơn', type: 'date', required: false, width: 120 },
      { id: 'noi_dung_don', name: 'Nội dung đơn', type: 'textarea', required: false, width: 300 },
      { id: 'tai_lieu_kem_theo', name: 'Tài liệu kèm theo', type: 'textarea', required: false, width: 300 },
      { id: 'ngay_nhan_don', name: 'Ngày nhận đơn', type: 'date', required: false, width: 120 },
      { id: 'so_chuyen_hoa_giai', name: 'Số chuyển hoà giải', type: 'text', required: false, width: 150 },
      { id: 'ngay_chuyen_hoa_giai', name: 'Ngày chuyển hoà giải', type: 'date', required: false, width: 150 },
      { id: 'ngay_chuyen_don_ve_giai_quyet_theo_thu_tuc_to_tung', name: 'Ngày chuyển đơn về giải quyết theo thủ tục tố tụng', type: 'date', required: false, width: 320 },
      { id: 'so_tra_lai_don', name: 'Số trả lại đơn', type: 'text', required: false, width: 120 },
      { id: 'ngay_tra_lai_don', name: 'Ngày trả lại đơn', type: 'date', required: false, width: 120 },
      { id: 'so_yeu_cau_sua_doi_bo_sung_don_khoi_kien', name: 'Số yêu cầu sửa đổi bổ sung đơn khởi kiện', type: 'text', required: false, width: 320 },
      { id: 'ngay_yeu_cau_sua_doi_bo_sung_don_khoi_kien', name: 'Ngày yêu cầu sửa đổi bổ sung đơn khởi kiện', type: 'date', required: false, width: 320 },
      { id: 'so_chuyen_don_khoi_kien', name: 'Số chuyển đơn khởi kiện', type: 'text', required: false, width: 180 },
      { id: 'ngay_chuyen_don_khoi_kien', name: 'Ngày chuyển đơn khởi kiện', type: 'date', required: false, width: 180 },
      { id: 'so_thong_bao_nop_tam_ung_an_phi', name: 'Số thông báo nộp tạm ứng án phí', type: 'text', required: false, width: 280 },
      { id: 'ngay_thong_bao_nop_tam_ung_an_phi', name: 'Ngày thông báo nộp tạm ứng án phí', type: 'date', required: false, width: 280 },
      { id: 'ngay_nop_tien_tam_ung_an_phi', name: 'Ngày nộp tiền tạm ứng án phí', type: 'date', required: false, width: 260 },
      { id: 'so_thu_ly_vu_an', name: 'Số thụ lý vụ án', type: 'text', required: false, width: 150 },
      { id: 'ngay_thu_ly_vu_an', name: 'Ngày thụ lý vụ án', type: 'date', required: false, width: 150 },
      { id: 'so_giu_nguyen_viec_tra_lai_don_khoi_kien', name: 'Số giữ nguyên việc trả lại đơn khởi kiện', type: 'text', required: false, width: 320 },
      { id: 'ngay_giu_nguyen_viec_tra_lai_don_khoi_kien', name: 'Ngày giữ nguyên việc trả lại đơn khởi kiện', type: 'date', required: false, width: 320 },
      { id: 'so_nhan_lai_don_khoi_kien_va_tai_lieu', name: 'Số nhận lại đơn khởi kiện và tài liệu', type: 'text', required: false, width: 320 },
      { id: 'ngay_nhan_lai_don_khoi_kien_va_tai_lieu', name: 'Ngày nhận lại đơn khởi kiện và tài liệu', type: 'date', required: false, width: 320 },
      { id: 'so_yeu_cau_toa_an_nhan_lai_don_khoi_kien', name: 'Số yêu cầu toà án nhận lại đơn khởi kiện', type: 'text', required: false, width: 320 },
      { id: 'ngay_yeu_cau_toa_an_nhan_lai_don_khoi_kien', name: 'Ngày yêu cầu toà án nhận lại đơn khởi kiện', type: 'date', required: false, width: 320 },
      { id: 'so_ap_dung_bien_phap_khan_cap_tam_thoi', name: 'Số áp dụng biện pháp khẩn cấp tạm thời', type: 'text', required: false, width: 280 },
      { id: 'ngay_ap_dung_bien_phap_khan_cap_tam_thoi', name: 'Ngày áp dụng biện pháp khẩn cấp tạm thời', type: 'date', required: false, width: 280 },
      { id: 'tham_phan', name: 'Thẩm phán', type: 'text', required: false, width: 150 },
      { id: 'ghi_chu', name: 'Ghi chú', type: 'textarea', required: false, width: 300 }
    ]
  },
  {
    id: 'criminal',
    name: 'Criminal Cases',
    code: 'CRIM',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'defendant', name: 'Defendant', type: 'text', required: true, width: 150 },
      { id: 'charges', name: 'Charges', type: 'textarea', required: true, width: 200 },
      { id: 'severity', name: 'Severity', type: 'dropdown', required: true, width: 120,
        options: ['Misdemeanor', 'Felony', 'Infraction'] },
      { id: 'arrestDate', name: 'Arrest Date', type: 'date', required: false, width: 120 },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Arraignment', 'Pre-trial', 'Trial', 'Sentencing', 'Closed'] },
      { id: 'prosecutor', name: 'Prosecutor', type: 'text', required: false, width: 140 },
      { id: 'defense', name: 'Defense Attorney', type: 'text', required: false, width: 140 },
      { id: 'judge', name: 'Assigned Judge', type: 'text', required: false, width: 140 },
      { id: 'nextHearing', name: 'Next Hearing', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  },
  {
    id: 'family',
    name: 'Family Cases',
    code: 'FAM',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'petitioner', name: 'Petitioner', type: 'text', required: true, width: 150 },
      { id: 'respondent', name: 'Respondent', type: 'text', required: true, width: 150 },
      { id: 'caseType', name: 'Case Type', type: 'dropdown', required: true, width: 130,
        options: ['Divorce', 'Child Custody', 'Child Support', 'Adoption', 'Domestic Violence'] },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Mediation', 'Trial', 'Settled', 'Dismissed', 'Final Order'] },
      { id: 'children', name: 'Children Involved', type: 'number', required: false, width: 120 },
      { id: 'mediator', name: 'Mediator', type: 'text', required: false, width: 140 },
      { id: 'judge', name: 'Assigned Judge', type: 'text', required: false, width: 140 },
      { id: 'nextHearing', name: 'Next Hearing', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic Cases',
    code: 'TRAF',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'defendant', name: 'Defendant', type: 'text', required: true, width: 150 },
      { id: 'violation', name: 'Violation', type: 'dropdown', required: true, width: 150,
        options: ['Speeding', 'DUI', 'Reckless Driving', 'Running Red Light', 'Parking Violation'] },
      { id: 'ticketNumber', name: 'Ticket Number', type: 'text', required: true, width: 120 },
      { id: 'violationDate', name: 'Violation Date', type: 'date', required: true, width: 120 },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Scheduled', 'Paid', 'Dismissed', 'Guilty', 'Not Guilty'] },
      { id: 'fineAmount', name: 'Fine Amount', type: 'number', required: false, width: 120 },
      { id: 'location', name: 'Violation Location', type: 'text', required: false, width: 180 },
      { id: 'officer', name: 'Issuing Officer', type: 'text', required: false, width: 140 },
      { id: 'courtDate', name: 'Court Date', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  }
];