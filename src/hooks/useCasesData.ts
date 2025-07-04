import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CaseBook, Case } from '../types/caseTypes';
import { mockCases } from '../data/mockCaseData'; // For non-HON_NHAN types
import { combineNumberAndDate, formatDateForDisplay, combineNumberDateAndText, combineDateAndText, parseDateAndTextString, combineNumberDateSummaryAndText, parseNumberDateSummaryAndTextString } from '../utils/dateUtils'; // Import new utilities
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface UseCasesDataResult {
  cases: Case[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchCases: () => Promise<void>;
  deleteCases: (idsToDelete: string[]) => Promise<void>;
  setCases: React.Dispatch<React.SetStateAction<Case[]>>; // Expose setCases for local updates
}

export function useCasesData(book: CaseBook): UseCasesDataResult {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken, logout } = useAuth(); // Use hook to get accessToken and logout

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let apiUrl = '';
      let queryParams = new URLSearchParams({ year: book.year.toString() });

      // Add basic search term
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      console.log(book.caseTypeId);
      if (book.caseTypeId === 'HON_NHAN') {
        apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/`;
      } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
        apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/`;
      } else if (book.caseTypeId === 'TO_TUNG') { // New case type
        apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-to-tung/`;
      }
      else {
        setCases(mockCases[book.id] || []);
        setIsLoading(false);
        return;
      }

      const fullUrl = `${apiUrl}?${queryParams.toString()}`;
      
      console.log(`Fetching cases for ${book.caseTypeName} (${book.year}): ${fullUrl}`); // Add this log

      const response = await authenticatedFetch(fullUrl, accessToken, logout);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const fetchedCases: Case[] = data.results.map((item: any) => {
        const newCase: Case = {
          id: item.id.toString(),
          caseNumber: item.so_thu_ly || item.so_chuyen_hoa_giai || item.so_thu_ly_chinh || '', // Use so_thu_ly_chinh for TO_TUNG
          bookId: book.id,
          createdDate: item.ngay_thu_ly || item.ngay_nhan_don || item.ngay_thu_ly_chinh || '',
          lastModified: new Date().toISOString().split('T')[0],
          ...item
        };

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

        // Common combined fields for all types
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

        // Combined field for 'chuyen_hoa_giai' (used in HON_NHAN and GIA_QUYET_TRANH_CHAP_HOA_GIAI)
        newCase.thong_tin_chuyen_hoa_giai = combineNumberAndDate(item.so_chuyen_hoa_giai, item.ngay_chuyen_hoa_giai);
        
        // Fields specific to HON_NHAN (already existing)
        if (book.caseTypeId === 'HON_NHAN') {
          newCase.thong_tin_so_ngay_thu_ly = combineNumberAndDate(item.so_thu_ly, item.ngay_thu_ly); // NEW: Combined field for HON_NHAN
          newCase.thong_tin_tra_lai_don = combineNumberAndDate(item.so_tra_lai_don, item.ngay_tra_lai_don);
          newCase.thong_tin_yeu_cau_sua_doi_bo_sung = combineNumberAndDate(item.so_yeu_cau_sua_doi_bo_sung_don_khoi_kien, item.ngay_yeu_cau_sua_doi_bo_sung_don_khoi_kien);
          newCase.thong_tin_chuyen_don_khoi_kien = combineNumberAndDate(item.so_chuyen_don_khoi_kien, item.ngay_chuyen_don_khoi_kien);
          newCase.thong_tin_thong_bao_nop_tam_ung_an_phi = combineNumberAndDate(item.so_thong_bao_nop_tam_ung_an_phi, item.ngay_thong_bao_nop_tam_ung_an_phi);
          newCase.thong_tin_thu_ly_vu_an = combineNumberAndDate(item.so_thu_ly_vu_an, item.ngay_thu_ly_vu_an);
          newCase.thong_tin_giu_nguyen_tra_lai_don = combineNumberAndDate(item.so_giu_nguyen_viec_tra_lai_don_khoi_kien, item.ngay_giu_nguyen_viec_tra_lai_don_khoi_kien);
          newCase.thong_tin_nhan_lai_don_khoi_kien_va_tai_lieu = combineNumberAndDate(item.so_nhan_lai_don_khoi_kien_va_tai_lieu, item.ngay_nhan_lai_don_khoi_kien_va_tai_lieu);
          newCase.thong_tin_yeu_cau_toa_an_nhan_lai_don_khoi_kien = combineNumberAndDate(item.so_yeu_cau_toa_an_nhan_lai_don_khoi_kien, item.ngay_yeu_cau_toa_an_nhan_lai_don_khoi_kien);
          newCase.thong_tin_ap_dung_bien_phap_khan_cap_tam_thoi = combineNumberAndDate(item.so_ap_dung_bien_phap_khan_cap_tam_thoi, item.ngay_ap_dung_bien_phap_khan_cap_tam_thoi);
        }

        // Fields specific to GIAI_QUYET_TRANH_CHAP_HOA_GIAI (newly added)
        if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
          newCase.thong_tin_so_ngay_nhan_don = combineNumberAndDate(item.so_thu_ly, item.ngay_thu_ly); // NEW: Combined field for so_thu_ly and ngay_thu_ly
          newCase.thong_tin_nguoi_tham_gia_hoa_giai = [ // NEW: Combined field for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
            item.ho_ten_nguoi_tham_gia_hoa_giai,
            item.dia_chi_nguoi_tham_gia_hoa_giai
          ].filter(Boolean).join('\n');
          newCase.thong_tin_duong_su_lua_chon_va_toa_an_quan_ly = [ // NEW: Combined field for GIAI_QUYET_TRANH_CHAP_HOA_GIAI
            item.ho_ten_duong_su_lua_chon,
            item.toa_an_noi_quan_ly_hoa_giai_vien_lam_viec
          ].filter(Boolean).join('\n');
          newCase.thong_tin_thong_bao_ve_quyen_lua_chon_hoa_giai = combineNumberAndDate(item.so_thong_bao_ve_quyen_lua_chon_hoa_giai, item.ngay_thong_bao_ve_quyen_lua_chon_hoa_giai);
          newCase.thong_tin_quyet_dinh_cong_nhan_hoa_giai_thanh = combineNumberAndDate(item.so_quyet_dinh_cong_nhan_hoa_giai_thanh, item.ngay_quyet_dinh_cong_nhan_hoa_giai_thanh);
          newCase.thong_tin_quyet_dinh_khong_cong_nhan_hoa_giai_thanh = combineNumberAndDate(item.so_quyet_dinh_khong_cong_nhan_hoa_giai_thanh, item.ngay_quyet_dinh_khong_cong_nhan_hoa_giai_thanh);
          newCase.thong_tin_chuyen_don_giai_quyet_theo_thu_tuc_to_tung = combineNumberAndDate(item.so_chuyen_don_giai_quyet_theo_thu_tuc_to_tung, item.ngay_chuyen_don_giai_quyet_theo_thu_tuc_to_tung);
          newCase.thong_tin_vien_kiem_sat_kien_nghi = combineNumberAndDate(item.so_vien_kiem_sat_kien_nghi, item.ngay_vien_kiem_sat_kien_nghi);
          newCase.thong_tin_quyet_dinh_cua_toa_an_cap_tren_truc_tiep = combineNumberAndDate(item.so_quyet_dinh_cua_toa_an_cap_tren_truc_tiep, item.ngay_quyet_dinh_cua_toa_an_cap_tren_truc_tiep);
          newCase.thong_tin_yeu_cau_cua_duong_su = combineDateAndText(item.ngay_yeu_cau_cua_duong_su, item.tom_tat_noi_dung_yeu_cau_cua_duong_su); // NEW: Combined field
          newCase.thong_tin_nguoi_de_nghi_giai_quyet = [ // NEW: Combined field
            item.ho_ten_nguoi_de_nghi_giai_quyet,
            item.ngay_nguoi_de_nghi_giai_quyet
          ].filter(Boolean).join('\n');
          newCase.thong_tin_quyet_dinh_va_tom_tat_toa_an_cap_tren_truc_tiep = combineNumberDateSummaryAndText(
            item.so_quyet_dinh_cua_toa_an_cap_tren_truc_tiep,
            item.ngay_quyet_dinh_cua_toa_an_cap_tren_truc_tiep,
            item.tom_tat_dinh_cua_toa_an_cap_tren_truc_tiep
          ); // NEW: Combined field
        }

        // Fields specific to TO_TUNG (newly added)
        if (book.caseTypeId === 'TO_TUNG') {
          newCase.thong_tin_so_ngay_don = combineNumberAndDate(item.so_thu_ly, item.ngay_thu_ly);
          newCase.thong_tin_so_ngay_thu_ly_chinh = combineNumberAndDate(item.so_thu_ly_chinh, item.ngay_thu_ly_chinh);
          newCase.thong_tin_dung_bien_phap_khan_cap_tam_thoi = combineNumberAndDate(item.so_dung_bien_phap_khan_cap_tam_thoi, item.ngay_dung_bien_phap_khan_cap_tam_thoi);
          newCase.thong_tin_chuyen_ho_so_vu_viec_va_noi_nhan = combineNumberDateAndText(item.so_chuyen_ho_so_vu_viec, item.ngay_chuyen_ho_so_vu_viec, item.noi_nhan_chuyen_ho_so_vu_viec);
          newCase.thong_tin_tam_dinh_chi = combineNumberAndDate(item.so_tam_dinh_chi, item.ngay_tam_dinh_chi);
          newCase.thong_tin_dinh_chi = combineNumberAndDate(item.so_dinh_chi, item.ngay_dinh_chi);
          newCase.thong_tin_cong_nhan_su_thoa_thuan_cua_duong_su = combineNumberAndDate(item.so_cong_nhan_su_thoa_thuan_cua_duong_su, item.ngay_cong_nhan_su_thoa_thuan_cua_duong_su);
          newCase.thong_tin_ban_an_so_tham = combineNumberAndDate(item.so_ban_an_so_tham, item.ngay_ban_an_so_tham);
          newCase.thong_tin_ket_qua_giai_quyet_huy_qd_ca_biet = combineNumberDateAndText(item.so_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet, item.ngay_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet, item.co_quan_ket_qua_giai_quyet_yeu_cau_huy_quyet_dinh_ca_biet);
          newCase.thong_tin_giai_quyet_theo_thu_tuc_rut_gon = combineNumberAndDate(item.so_giai_quyet_theo_thu_tuc_rut_gon, item.ngay_giai_quyet_theo_thu_tuc_rut_gon);
          newCase.thong_tin_khang_cao = combineNumberAndDate(item.so_khang_cao, item.ngay_khang_cao);
          newCase.thong_tin_khang_nghi = combineNumberAndDate(item.so_khang_nghi, item.ngay_khang_nghi);
          newCase.thong_tin_ban_an_quyet_dinh_phuc_tham = combineNumberDateSummaryAndText(
            item.so_ban_an_quyet_dinh_cua_toa_an_cap_phuc_tham,
            item.ngay_ban_an_quyet_dinh_cua_toa_an_cap_phuc_tham,
            item.noi_dung_ban_an_quyet_dinh_cua_toa_an_cap_phuc_tham
          ); // NEW: Combined field
        }

        return newCase;
      });
      setCases(fetchedCases);
    } catch (e: any) {
      console.error("Failed to fetch cases:", e);
      setError(`Failed to load cases: ${e.message}`);
      toast.error(`Failed to load cases: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [book, searchTerm, accessToken, logout]); // Add accessToken and logout to dependencies

  const deleteCases = useCallback(async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hàng để xóa.');
      return;
    }

    const confirmation = confirm(`Bạn có chắc chắn muốn xóa ${idsToDelete.length} vụ án đã chọn? Hành động này không thể hoàn tác.`);
    if (!confirmation) {
      return;
    }

    setIsLoading(true);
    let successfulDeletions = 0;
    const failedDeletions: string[] = [];

    for (const caseId of idsToDelete) {
      try {
        let deleteUrl = '';
        if (book.caseTypeId === 'HON_NHAN') {
          deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`;
        } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
          deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/${caseId}/`; 
        } else if (book.caseTypeId === 'TO_TUNG') { // New case type
          deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-to-tung/${caseId}/`;
        }
        else {
          // Fallback for other types if needed, though currently not handled by API
          console.warn(`Deletion not supported for case type: ${book.caseTypeId}`);
          failedDeletions.push(caseId);
          continue;
        }

        const response = await authenticatedFetch(deleteUrl, accessToken, logout, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        successfulDeletions++;
      } catch (e: any) {
        console.error(`Failed to delete case ${caseId}:`, e);
        const failedCase = cases.find(c => c.id === caseId);
        failedDeletions.push(failedCase?.caseNumber || caseId);
      }
    }

    setIsLoading(false);
    if (successfulDeletions > 0) {
      toast.success(`Đã xóa thành công ${successfulDeletions} vụ án.`);
      fetchCases(); // Re-fetch data to ensure UI is in sync with backend
    }
    if (failedDeletions.length > 0) {
      toast.error(`Không thể xóa các vụ án: ${failedDeletions.join(', ')}. Vui lòng kiểm tra console để biết thêm chi tiết.`);
    }
  }, [cases, fetchCases, book.caseTypeId, accessToken, logout]); // Add accessToken and logout to dependencies

  useEffect(() => {
    fetchCases();
  }, [book, fetchCases, searchTerm]); // Removed advancedFilters from dependencies

  return {
    cases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    setCases,
  };
}