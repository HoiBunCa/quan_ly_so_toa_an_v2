import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CaseBook, Case } from '../types/caseTypes';
import { mockCases } from '../data/mockCaseData'; // For non-HON_NHAN types
import { combineNumberAndDate, formatDateForDisplay } from '../utils/dateUtils'; // Import new utilities
import { AdvancedSearchCriteria } from '../components/case-management/AdvancedSearchModal'; // Import AdvancedSearchCriteria

interface UseCasesDataResult {
  cases: Case[];
  filteredCases: Case[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchCases: () => Promise<void>;
  deleteCases: (idsToDelete: string[]) => Promise<void>;
  setCases: React.Dispatch<React.SetStateAction<Case[]>>; // Expose setCases for local updates
}

export function useCasesData(book: CaseBook, advancedFilters: AdvancedSearchCriteria): UseCasesDataResult {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // Add advanced search filters
      if (advancedFilters.ngayNhanDon) {
        queryParams.append('ngay_nhan_don', advancedFilters.ngayNhanDon);
      }
      if (advancedFilters.nguoiKhoiKien) {
        queryParams.append('ho_ten_nguoi_khoi_kien', advancedFilters.nguoiKhoiKien);
      }
      if (advancedFilters.nguoiBiKien) {
        queryParams.append('ho_ten_nguoi_bi_kien', advancedFilters.nguoiBiKien);
      }

      if (book.caseTypeId === 'HON_NHAN') {
        apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/`;
      } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
        apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap/`;
      } else {
        setCases(mockCases[book.id] || []);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const fetchedCases: Case[] = data.results.map((item: any) => {
        const newCase: Case = {
          id: item.id.toString(),
          caseNumber: item.so_thu_ly || '', // Assuming 'so_thu_ly' is the main case number for both types
          bookId: book.id,
          createdDate: item.ngay_thu_ly || item.ngay_nhan_don || '',
          lastModified: new Date().toISOString().split('T')[0],
          ...item
        };

        // Common combined fields for both HON_NHAN and GIAI_QUYET_TRANH_CHAP_HOA_GIAI
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

        newCase.thong_tin_chuyen_hoa_giai = combineNumberAndDate(item.so_chuyen_hoa_giai, item.ngay_chuyen_hoa_giai);
        
        // Fields specific to HON_NHAN (already existing)
        if (book.caseTypeId === 'HON_NHAN') {
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
          newCase.thong_tin_thong_bao_ve_quyen_lua_chon_hoa_giai = combineNumberAndDate(item.so_thong_bao_ve_quyen_lua_chon_hoa_giai, item.ngay_thong_bao_ve_quyen_lua_chon_hoa_giai);
          newCase.thong_tin_quyet_dinh_cong_nhan_hoa_giai_thanh = combineNumberAndDate(item.so_quyet_dinh_cong_nhan_hoa_giai_thanh, item.ngay_quyet_dinh_cong_nhan_hoa_giai_thanh);
          newCase.thong_tin_quyet_dinh_khong_cong_nhan_hoa_giai_thanh = combineNumberAndDate(item.so_quyet_dinh_khong_cong_nhan_hoa_giai_thanh, item.ngay_quyet_dinh_khong_cong_nhan_hoa_giai_thanh);
          newCase.thong_tin_chuyen_don_giai_quyet_theo_thu_tuc_to_tung = combineNumberAndDate(item.so_chuyen_don_giai_quyet_theo_thu_tuc_to_tung, item.ngay_chuyen_don_giai_quyet_theo_thu_tuc_to_tung);
          newCase.thong_tin_vien_kiem_sat_kien_nghi = combineNumberAndDate(item.so_vien_kiem_sat_kien_nghi, item.ngay_vien_kiem_sat_kien_nghi);
          newCase.thong_tin_quyet_dinh_cua_toa_an_cap_tren_truc_tiep = combineNumberAndDate(item.so_quyet_dinh_cua_toa_an_cap_tren_truc_tiep, item.ngay_quyet_dinh_cua_toa_an_cap_tren_truc_tiep);
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
  }, [book, searchTerm, advancedFilters]); // Add advancedFilters to dependencies

  const deleteCases = useCallback(async (idsToDelete: string[]) => {
    if (idsToDelete.length === 0) {
      toast.info('Vui lòng chọn ít nhất một hàng để xóa.');
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
        } else if (book.caseTypeId === 'GIA_QUYET_TRANH_CHAP_HOA_GIAI') {
          deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap/${caseId}/`; // Corrected API for DELETE
        } else {
          // Fallback for other types if needed, though currently not handled by API
          console.warn(`Deletion not supported for case type: ${book.caseTypeId}`);
          failedDeletions.push(caseId);
          continue;
        }

        const response = await fetch(deleteUrl, {
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
  }, [cases, fetchCases, book.caseTypeId]); // Depend on cases to get correct failedCase info

  useEffect(() => {
    fetchCases();
  }, [book, fetchCases, searchTerm, advancedFilters]); // Re-fetch when advancedFilters change

  // The filtering logic here is now redundant if the backend handles filtering.
  // Keeping it as a fallback or for client-side only filtering if backend doesn't support it.
  // However, since we're passing filters to the API, `cases` should already be filtered.
  const filteredCases = cases.filter(caseItem => {
    // If advanced filters are active, the backend should handle it.
    // This client-side filter is primarily for the basic search term.
    if (searchTerm) {
      return Object.values(caseItem).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true; // If no basic search term, return all cases (which are already filtered by backend)
  });

  return {
    cases,
    filteredCases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    setCases,
  };
}