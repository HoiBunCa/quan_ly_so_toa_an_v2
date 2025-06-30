import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CaseBook, Case } from '../types/caseTypes';
import { mockCases } from '../data/mockCaseData'; // For non-HON_NHAN types

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

export function useCasesData(book: CaseBook): UseCasesDataResult {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (book.caseTypeId === 'HON_NHAN') {
        const apiUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/?year=${book.year}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedCases: Case[] = data.results.map((item: any) => {
          const newCase: Case = {
            id: item.id.toString(),
            caseNumber: item.so_thu_ly || '',
            bookId: book.id,
            createdDate: item.ngay_thu_ly || item.ngay_nhan_don || '',
            lastModified: new Date().toISOString().split('T')[0],
            ...item
          };
          // Combine plaintiff info for display
          newCase.thong_tin_nguoi_khoi_kien = [
            item.ho_ten_nguoi_khoi_kien,
            item.nam_sinh_nguoi_khoi_kien,
            item.dia_chi_nguoi_khoi_kien
          ].filter(Boolean).join('\n');

          // Combine defendant info for display
          newCase.thong_tin_nguoi_bi_kien = [
            item.ho_ten_nguoi_bi_kien,
            item.nam_sinh_nguoi_bi_kien,
            item.dia_chi_nguoi_bi_kien
          ].filter(Boolean).join('\n');

          return newCase;
        });
        setCases(fetchedCases);
      } else {
        setCases(mockCases[book.id] || []);
      }
    } catch (e: any) {
      console.error("Failed to fetch cases:", e);
      setError(`Failed to load cases: ${e.message}`);
      toast.error(`Failed to load cases: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [book]);

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
        const response = await fetch(`http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`, {
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
  }, [cases, fetchCases]); // Depend on cases to get correct failedCase info

  useEffect(() => {
    fetchCases();
  }, [book, fetchCases]);

  const filteredCases = cases.filter(caseItem =>
    Object.values(caseItem).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return {
    cases,
    filteredCases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    deleteCases,
    setCases,
  };
}