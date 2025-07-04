import React, { useState, useEffect, useCallback } from 'react';
import { X, Calendar, User, AlertCircle, Search as SearchIcon, Loader2, FileText } from 'lucide-react';
import { formatDateForDisplay, combineNumberAndDate } from '../../utils/dateUtils'; // Import combineNumberAndDate
import { HotTable } from '@handsontable/react';
import { getHandsontableConfig } from '../../utils/handsontableConfig';
import { Case, CaseBook, CaseType } from '../../types/caseTypes';
import toast from 'react-hot-toast';
import { caseTypes } from '../../data/caseTypesData';
import { authenticatedFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export interface AdvancedSearchCriteria {
  ngayNhanDon: string;
  nguoiKhoiKien: string;
  nguoiBiKien: string;
}

interface AdvancedSearchModalProps {
  onClose: () => void;
  onApplySelection: (selectedCaseIds: string[]) => void;
  initialCriteria: AdvancedSearchCriteria;
  book: CaseBook;
  caseType: CaseType;
  onGenerateNextNumber: (fieldKey: string) => string;
  isGeneratingNumber: boolean;
  onCasesCreated: () => void;
}

export default function AdvancedSearchModal({ 
  onClose, 
  onApplySelection, 
  initialCriteria, 
  book, 
  caseType,
  onGenerateNextNumber,
  isGeneratingNumber,
  onCasesCreated,
}: AdvancedSearchModalProps) {
  const [ngayNhanDon, setNgayNhanDon] = useState(initialCriteria.ngayNhanDon);
  const [nguoiKhoiKien, setNguoiKhoiKien] = useState(initialCriteria.nguoiKhoiKien);
  const [nguoiBiKien, setNguoiBiKien] = useState(initialCriteria.nguoiBiKien);
  const [error, setError] = useState('');

  const [currentSearchResults, setCurrentSearchResults] = useState<Case[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [errorResults, setErrorResults] = useState<string | null>(null);
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);
  const [isCopyingCases, setIsCopyingCases] = useState(false);

  const { accessToken, logout } = useAuth();

  const honNhanCaseType = caseTypes.find(type => type.id === 'HON_NHAN');

  if (!honNhanCaseType) {
    console.error("Lỗi: Không tìm thấy cấu hình loại án 'HON_NHAN' trong caseTypesData. Điều này rất quan trọng cho AdvancedSearchModal.");
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-3" />
          <p>Đã xảy ra lỗi nghiêm trọng: Không thể tải cấu hình loại án cần thiết cho tìm kiếm nâng cao.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Đóng</button>
        </div>
      </div>
    );
  }

  const fetchSearchResults = useCallback(async () => {
    setIsLoadingResults(true);
    setErrorResults(null);
    setCurrentSearchResults([]);
    setSelectedResultIds([]);

    try {
      let apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/`;
      let queryParams = new URLSearchParams({ year: book.year.toString() });

      if (ngayNhanDon) {
        queryParams.append('ngay_thu_ly', ngayNhanDon);
      }
      if (nguoiKhoiKien) {
        queryParams.append('nguoi_khoi_kien', nguoiKhoiKien);
      }
      if (nguoiBiKien) {
        queryParams.append('nguoi_bi_kien', nguoiBiKien);
      }

      const response = await authenticatedFetch(`${apiUrl}?${queryParams.toString()}`, accessToken, logout);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const fetchedCases: Case[] = data.results.map((item: any) => {
        const newCase: Case = {
          id: item.id.toString(),
          caseNumber: item.so_thu_ly || item.so_chuyen_hoa_giai || '',
          bookId: book.id,
          createdDate: item.ngay_thu_ly || item.ngay_nhan_don || '',
          lastModified: new Date().toISOString().split('T')[0],
          ...item
        };
        // Populate thong_tin_so_ngay_thu_ly for display in the modal table
        newCase.thong_tin_so_ngay_thu_ly = combineNumberAndDate(item.so_thu_ly, item.ngay_thu_ly);

        // Convert boolean-like string fields to actual booleans for Handsontable checkbox
        const booleanFields = [
          'don_khoi_kien_cua_co_quan_to_chuc',
          'hoa_giai_doan_tu',
          'ap_dung_an_le',
          'co_uy_thac_tu_phap',
          'khong_uy_thac_tu_phap',
          'viec_hon_nhan_va_gia_dinh'
        ];
        booleanFields.forEach(field => {
          if (typeof item[field] === 'string') {
            newCase[field] = item[field] === 'Có';
          } else if (typeof item[field] === 'boolean') {
            newCase[field] = item[field];
          }
        });

        newCase.thong_tin_nguoi_khoi_kien = [
          item.ho_ten_nguoi_khoi_kien,
          item.nam_sinh_nguoi_khoi_kien,
          item.dia_chi_nguoi_khoi_kien
        ].filter(Boolean).join('\n');

        newCase.thong_tin_nguoi_bi_kien = [
          item.ho_ten_nguoi_bi_kien,
          item.nam_sinh_nguoi_bi_kien,
          item.dia_chi_nguoi_bi_kien
        ].filter(Boolean).join('\n');

        newCase.thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = [
          item.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan,
          item.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan,
          item.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan
        ].filter(Boolean).join('\n');

        newCase.thong_tin_chuyen_hoa_giai = [
          item.so_chuyen_hoa_giai ? `Số: ${item.so_chuyen_hoa_giai}` : '',
          item.ngay_chuyen_hoa_giai ? `Ngày: ${formatDateForDisplay(item.ngay_chuyen_hoa_giai)}` : ''
        ].filter(Boolean).join('\n');

        if (book.caseTypeId === 'HON_NHAN') {
          newCase.thong_tin_tra_lai_don = [item.so_tra_lai_don ? `Số: ${item.so_tra_lai_don}` : '', item.ngay_tra_lai_don ? `Ngày: ${formatDateForDisplay(item.ngay_tra_lai_don)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_yeu_cau_sua_doi_bo_sung = [item.so_yeu_cau_sua_doi_bo_sung_don_khoi_kien ? `Số: ${item.so_yeu_cau_sua_doi_bo_sung_don_khoi_kien}` : '', item.ngay_yeu_cau_sua_doi_bo_sung_don_khoi_kien ? `Ngày: ${formatDateForDisplay(item.ngay_yeu_cau_sua_doi_bo_sung_don_khoi_kien)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_chuyen_don_khoi_kien = [item.so_chuyen_don_khoi_kien ? `Số: ${item.so_chuyen_don_khoi_kien}` : '', item.ngay_chuyen_don_khoi_kien ? `Ngày: ${formatDateForDisplay(item.ngay_chuyen_don_khoi_kien)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_thong_bao_nop_tam_ung_an_phi = [item.so_thong_bao_nop_tam_ung_an_phi ? `Số: ${item.so_thong_bao_nop_tam_ung_an_phi}` : '', item.ngay_thong_bao_nop_tam_ung_an_phi ? `Ngày: ${formatDateForDisplay(item.ngay_thong_bao_nop_tam_ung_an_phi)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_thu_ly_vu_an = [item.so_thu_ly_vu_an ? `Số: ${item.so_thu_ly_vu_an}` : '', item.ngay_thu_ly_vu_an ? `Ngày: ${formatDateForDisplay(item.ngay_thu_ly_vu_an)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_giu_nguyen_tra_lai_don = [item.so_giu_nguyen_viec_tra_lai_don_khoi_kien ? `Số: ${item.so_giu_nguyen_viec_tra_lai_don_khoi_kien}` : '', item.ngay_giu_nguyen_viec_tra_lai_don_khoi_kien ? `Ngày: ${formatDateForDisplay(item.ngay_giu_nguyen_viec_tra_lai_don_khoi_kien)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_nhan_lai_don_khoi_kien_va_tai_lieu = [item.so_nhan_lai_don_khoi_kien_va_tai_lieu ? `Số: ${item.so_nhan_lai_don_khoi_kien_va_tai_lieu}` : '', item.ngay_nhan_lai_don_khoi_kien_va_tai_lieu ? `Ngày: ${formatDateForDisplay(item.ngay_nhan_lai_don_khoi_kien_va_tai_lieu)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_yeu_cau_toa_an_nhan_lai_don_khoi_kien = [item.so_yeu_cau_toa_an_nhan_lai_don_khoi_kien ? `Số: ${item.so_yeu_cau_toa_an_nhan_lai_don_khoi_kien}` : '', item.ngay_yeu_cau_toa_an_nhan_lai_don_khoi_kien ? `Ngày: ${formatDateForDisplay(item.ngay_yeu_cau_toa_an_nhan_lai_don_khoi_kien)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_ap_dung_bien_phap_khan_cap_tam_thoi = [item.so_ap_dung_bien_phap_khan_cap_tam_thoi ? `Số: ${item.so_ap_dung_bien_phap_khan_cap_tam_thoi}` : '', item.ngay_ap_dung_bien_phap_khan_cap_tam_thoi ? `Ngày: ${formatDateForDisplay(item.ngay_ap_dung_bien_phap_khan_cap_tam_thoi)}` : ''].filter(Boolean).join('\n');
        } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
          newCase.thong_tin_thong_bao_ve_quyen_lua_chon_hoa_giai = [item.so_thong_bao_ve_quyen_lua_chon_hoa_giai ? `Số: ${item.so_thong_bao_ve_quyen_lua_chon_hoa_giai}` : '', item.ngay_thong_bao_ve_quyen_lua_chon_hoa_giai ? `Ngày: ${formatDateForDisplay(item.ngay_thong_bao_ve_quyen_lua_chon_hoa_giai)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_quyet_dinh_cong_nhan_hoa_giai_thanh = [item.so_quyet_dinh_cong_nhan_hoa_giai_thanh ? `Số: ${item.so_quyet_dinh_cong_nhan_hoa_giai_thanh}` : '', item.ngay_quyet_dinh_cong_nhan_hoa_giai_thanh ? `Ngày: ${formatDateForDisplay(item.ngay_quyet_dinh_cong_nhan_hoa_giai_thanh)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_quyet_dinh_khong_cong_nhan_hoa_giai_thanh = [item.so_quyet_dinh_khong_cong_nhan_hoa_giai_thanh ? `Số: ${item.so_quyet_dinh_khong_cong_nhan_hoa_giai_thanh}` : '', item.ngay_quyet_dinh_khong_cong_nhan_hoa_giai_thanh ? `Ngày: ${formatDateForDisplay(item.ngay_quyet_dinh_khong_cong_nhan_hoa_giai_thanh)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_chuyen_don_giai_quyet_theo_thu_tuc_to_tung = [item.so_chuyen_don_giai_quyet_theo_thu_tuc_to_tung ? `Số: ${item.so_chuyen_don_giai_quyet_theo_thu_tuc_to_tung}` : '', item.ngay_chuyen_don_giai_quyet_theo_thu_tuc_to_tung ? `Ngày: ${formatDateForDisplay(item.ngay_chuyen_don_giai_quyet_theo_thu_tuc_to_tung)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_vien_kiem_sat_kien_nghi = [item.so_vien_kiem_sat_kien_nghi ? `Số: ${item.so_vien_kiem_sat_kien_nghi}` : '', item.ngay_vien_kiem_sat_kien_nghi ? `Ngày: ${formatDateForDisplay(item.ngay_vien_kiem_sat_kien_nghi)}` : ''].filter(Boolean).join('\n');
          newCase.thong_tin_quyet_dinh_cua_toa_an_cap_tren_truc_tiep = [item.so_quyet_dinh_cua_toa_an_cap_tren_truc_tiep ? `Số: ${item.so_quyet_dinh_cua_toa_an_cap_tren_truc_tiep}` : '', item.ngay_quyet_dinh_cua_toa_an_cap_tren_truc_tiep ? `Ngày: ${formatDateForDisplay(item.ngay_quyet_dinh_cua_toa_an_cap_tren_truc_tiep)}` : ''].filter(Boolean).join('\n');
        }
        return newCase;
      });
      console.log(' ======== fetchedCases:', fetchedCases);
      setCurrentSearchResults(fetchedCases);
      if (fetchedCases.length === 0) {
        toast.success('Không tìm thấy kết quả nào phù hợp.');
      } else {
        toast.success(`Tìm thấy ${fetchedCases.length} kết quả.`);
      }
    } catch (e: any) {
      console.error("Failed to fetch search results:", e);
      setErrorResults(`Lỗi khi tìm kiếm: ${e.message}`);
      toast.error(`Lỗi khi tìm kiếm: ${e.message}`);
    } finally {
      setIsLoadingResults(false);
    }
  }, [ngayNhanDon, nguoiKhoiKien, nguoiBiKien, book, accessToken, logout]);

  useEffect(() => {
    if (initialCriteria.ngayNhanDon || initialCriteria.nguoiKhoiKien || initialCriteria.nguoiBiKien) {
      fetchSearchResults();
    }
  }, [initialCriteria, fetchSearchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ngayNhanDon && !nguoiKhoiKien && !nguoiBiKien) {
      setError('Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
      return;
    }
    fetchSearchResults();
  };

  const handleApplySelection = async () => {
    if (selectedResultIds.length === 0) {
      toast.success('Vui lòng chọn ít nhất một vụ án để áp dụng.');
      return;
    }

    setIsCopyingCases(true);
    let successfulCopies = 0;
    const failedCopies: string[] = [];
    const today = new Date().toISOString().split('T')[0];

    const casesToCopy = currentSearchResults.filter(c => selectedResultIds.includes(c.id));
 
    for (const caseItem of casesToCopy) {
      try {
        let payload: { [key: string]: any } = { created_by: 1 };
        let apiUrl = '';
        let successMessage = '';

        if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
          const nextSoChuyenHoaGiai = onGenerateNextNumber('so_chuyen_hoa_giai');
          apiUrl = 'http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/';
          successMessage = 'Đã tạo thành công vụ án mới trong sổ hoà giải.';
          payload = {
            ...payload,
            so_thu_ly: caseItem.so_thu_ly,
            ngay_thu_ly: caseItem.ngay_thu_ly,
            so_chuyen_hoa_giai: nextSoChuyenHoaGiai,
            ngay_chuyen_hoa_giai: today,
            ngay_nhan_don: caseItem.ngay_nhan_don || '',
            tom_tat_noi_dung_don: caseItem.noi_dung_don || '',
            tai_lieu_kem_theo: caseItem.tai_lieu_kem_theo || '',
            ho_ten_nguoi_khoi_kien: caseItem.ho_ten_nguoi_khoi_kien || '',
            nam_sinh_nguoi_khoi_kien: caseItem.nam_sinh_nguoi_khoi_kien || '',
            dia_chi_nguoi_khoi_kien: caseItem.dia_chi_nguoi_khoi_kien || '',
            ho_ten_nguoi_bi_kien: caseItem.ho_ten_nguoi_bi_kien || '',
            nam_sinh_nguoi_bi_kien: caseItem.nam_sinh_nguoi_bi_kien || '',
            dia_chi_nguoi_bi_kien: caseItem.dia_chi_nguoi_bi_kien || '',
            ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            tham_phan: caseItem.tham_phan || '',
            ghi_chu: caseItem.ghi_chu || '',
          };
        } else if (book.caseTypeId === 'TO_TUNG') {
          const nextSoThuLyChinh = onGenerateNextNumber('so_thu_ly_chinh');
          apiUrl = 'http://localhost:8003/home/api/v1/so-thu-ly-to-tung/';
          successMessage = 'Đã tạo thành công vụ án mới trong sổ tố tụng.';
          payload = {
            ...payload,
            so_thu_ly_chinh: nextSoThuLyChinh,
            ngay_thu_ly_chinh: today,
            so_thu_ly: caseItem.so_thu_ly || '',
            ngay_thu_ly: caseItem.ngay_thu_ly || '',
            ho_ten_nguoi_khoi_kien: caseItem.ho_ten_nguoi_khoi_kien || '',
            nam_sinh_nguoi_khoi_kien: caseItem.nam_sinh_nguoi_khoi_kien || '',
            dia_chi_nguoi_khoi_kien: caseItem.dia_chi_nguoi_khoi_kien || '',
            ho_ten_nguoi_bi_kien: caseItem.ho_ten_nguoi_bi_kien || '',
            nam_sinh_nguoi_bi_kien: caseItem.nam_sinh_nguoi_bi_kien || '',
            dia_chi_nguoi_bi_kien: caseItem.dia_chi_nguoi_bi_kien || '',
            don_khoi_kien_cua_co_quan_to_chuc: caseItem.don_khoi_kien_cua_co_quan_to_chuc || false,
            ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan: caseItem.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan || '',
            nguoi_bao_ve_quyen_loi: caseItem.nguoi_bao_ve_quyen_loi || '',
            noi_dung_don: caseItem.noi_dung_don || '',
            ly_do_xin_ly_hon: caseItem.ly_do_xin_ly_hon || '',
            so_con_chua_thanh_nien: caseItem.so_con_chua_thanh_nien || null,
            tham_phan: caseItem.tham_phan || '',
            ghi_chu: caseItem.ghi_chu || '',
          };
        } else {
          toast.error('Loại sổ hiện tại không hỗ trợ chức năng sao chép từ tìm kiếm nâng cao.');
          setIsCopyingCases(false);
          return;
        }

        const response = await authenticatedFetch(apiUrl, accessToken, logout, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        successfulCopies++;
      } catch (e: any) {
        console.error(`AdvancedSearchModal: Failed to copy case ${caseItem.caseNumber || caseItem.id}:`, e);
        failedCopies.push(caseItem.caseNumber || caseItem.id);
      }
    }

    setIsCopyingCases(false);
    if (successfulCopies > 0) {
      onCasesCreated();
    }
    if (failedCopies.length > 0) {
      toast.error(`Không thể tạo các vụ án: ${failedCopies.join(', ')}. Vui lòng kiểm tra console để biết thêm chi tiết.`);
    }
    onClose();
  };

  const { columns, settings } = getHandsontableConfig({
    caseType: honNhanCaseType,
    filteredCases: currentSearchResults,
    refreshData: fetchSearchResults,
    setSelectedRows: (ids) => {
      setSelectedResultIds(ids);
    },
    onUpdateCase: async () => {},
    accessToken,
    logout,
  });

  const modalTableSettings = {
    ...settings,
    readOnly: true,
    contextMenu: false,
    height: '100%',
    width: '100%',
    stretchH: 'all',
    manualColumnResize: true,
    manualRowResize: true,
    rowHeaders: false,
  };

  const relevantColumns = columns; 


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full mx-4 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <SearchIcon className="w-5 h-5 mr-2 text-blue-600" />
            Tìm kiếm nâng cao
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoadingResults || isCopyingCases}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-b border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="ngayNhanDon" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thụ lý
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="ngayNhanDon"
                  value={ngayNhanDon}
                  onChange={(e) => setNgayNhanDon(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoadingResults || isCopyingCases}
                />
              </div>
              {ngayNhanDon && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDateForDisplay(ngayNhanDon)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="nguoiKhoiKien" className="block text-sm font-medium text-gray-700 mb-2">
                Người khởi kiện
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="nguoiKhoiKien"
                  value={nguoiKhoiKien}
                  onChange={(e) => setNguoiKhoiKien(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người khởi kiện"
                  disabled={isLoadingResults || isCopyingCases}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nguoiBiKien" className="block text-sm font-medium text-gray-700 mb-2">
                Người bị kiện
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="nguoiBiKien"
                  value={nguoiBiKien}
                  onChange={(e) => setNguoiBiKien(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người bị kiện"
                  disabled={isLoadingResults || isCopyingCases}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoadingResults || isCopyingCases}
            >
              {isLoadingResults ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tìm...
                </span>
              ) : (
                'Tìm kiếm'
              )}
            </button>
          </div>
        </form>

        <div className="flex-1 overflow-hidden p-6 pt-0">
          <h3 className="text-md font-semibold text-gray-800 mb-3">Kết quả tìm kiếm ({currentSearchResults.length} vụ án)</h3>
          {isLoadingResults ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span>Đang tải kết quả...</span>
            </div>
          ) : errorResults ? (
            <div className="flex items-center justify-center h-full text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-6 h-6 mr-3" />
              <span>Lỗi: {errorResults}</span>
            </div>
          ) : currentSearchResults.length === 0 ? (
            <div className="text-center py-8 flex flex-col justify-center items-center h-full">
              <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Không có kết quả nào. Vui lòng nhập tiêu chí tìm kiếm và nhấn "Tìm kiếm".</p>
            </div>
          ) : (
            <div className="handsontable-container" style={{ height: '250px' }}>
              <HotTable
                key={currentSearchResults.length}
                data={currentSearchResults}
                columns={relevantColumns}
                settings={modalTableSettings}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoadingResults || isCopyingCases}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleApplySelection}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoadingResults || selectedResultIds.length === 0 || isCopyingCases || isGeneratingNumber}
          >
            {isCopyingCases ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tạo...
              </span>
            ) : (
              `Chọn (${selectedResultIds.length})`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}