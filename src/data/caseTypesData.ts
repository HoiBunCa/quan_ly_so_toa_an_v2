import { CaseType } from '../types/caseTypes';

export const caseTypes: CaseType[] = [
  {
    id: 'HON_NHAN',
    name: 'Sổ thụ lý đơn khởi kiện',
    code: 'CIV',
    attributes: [
      { id: 'so_thu_ly', name: '🔢 Số thụ lý', type: 'text', required: false, width: 120 },
      { id: 'ngay_thu_ly', name: '📅 Ngày thụ lý', type: 'date', required: false, width: 120 },
      { id: 'thong_tin_nguoi_khoi_kien', name: '📋 Thông tin người khởi kiện', type: 'textarea', required: false, width: 250 },
      { id: 'thong_tin_nguoi_bi_kien', name: '📋 Thông tin người bị kiện', type: 'textarea', required: false, width: 250 },
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
      { id: 'status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Scheduled', 'Paid', 'Dismissed', 'Guilty', 'Not Guilty'] },
      { id: 'fineAmount', name: 'Fine Amount', type: 'number', required: false, width: 120 },
      { id: 'location', name: 'Violation Location', type: 'text', required: false, width: 180 },
      { id: 'officer', name: 'Issuing Officer', type: 'text', required: false, width: 140 },
      { id: 'courtDate', name: 'Court Date', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  }
];