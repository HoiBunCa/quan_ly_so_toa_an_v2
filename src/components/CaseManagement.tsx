import React, { useState, useCallback, useEffect } from 'react';
import { CaseBook, CaseType } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';
import AdvancedSearchModal, { AdvancedSearchCriteria } from './case-management/AdvancedSearchModal';

// Import new modular components and hooks
import CaseManagementHeader from './case-management/CaseManagementHeader';
import CaseTable from './case-management/CaseTable';
import CaseInstructions from './case-management/CaseInstructions';
import PlaintiffInfoModal from './case-management/PlaintiffInfoModal';
import DefendantInfoModal from './case-management/DefendantInfoModal';
import RelatedPartyInfoModal from './case-management/RelatedPartyInfoModal';
import NumberDateInputModal from './common/NumberDateInputModal';

import { useCasesData } from '../hooks/useCasesData';
import { useMaxNumbersWebSocket } from '../hooks/useMaxNumbersWebSocket';
import { useCaseModals } from '../hooks/useCaseModals';
import { getHandsontableConfig } from '../utils/handsontableConfig';
import { parseNumberDateString, combineNumberAndDate } from '../utils/dateUtils';

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // New state for advanced search
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [advancedSearchInitialCriteria, setAdvancedSearchInitialCriteria] = useState<AdvancedSearchCriteria>({
    ngayNhanDon: '',
    nguoiKhoiKien: '',
    nguoiBiKien: '',
  });
  const [activeCaseIdsFilter, setActiveCaseIdsFilter] = useState<string[] | null>(null);

  const caseType = caseTypes.find(type => type.id === book.caseTypeId);
  if (!caseType) {
    return <div>Case type not found</div>;
  }

  const {
    cases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    setCases,
  } = useCasesData(book);

  const {
    maxNumbersByField,
    isMaxNumbersLoading,
    requestMaxNumbersUpdate,
    getNextNumberForField,
  } = useMaxNumbersWebSocket({
    bookYear: book.year,
    caseTypeCode: caseType.code,
    onNumbersUpdated: fetchCases, // Trigger case data refresh when max numbers are updated
  });

  const handleUpdateCase = useCallback(async (caseId: string, prop: string, newValue: any) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) {
      console.warn(`Case with ID ${caseId} not found for update.`);
      return;
    }

    let payload: { [key: string]: any } = { created_by: 1 };
    let updatedDisplayValue: any = newValue;

    if (prop === 'thong_tin_nguoi_khoi_kien') {
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_khoi_kien = lines[0] || '';
      payload.nam_sinh_nguoi_khoi_kien = lines[1] || '';
      payload.dia_chi_nguoi_khoi_kien = lines[2] || '';
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_bi_kien = lines[0] || '';
      payload.nam_sinh_nguoi_bi_kien = lines[1] || '';
      payload.dia_chi_nguoi_bi_kien = lines[2] || '';
    } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') {
      const lines = String(newValue || '').split('\n');
      payload.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[0] || '';
      payload.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[1] || '';
      payload.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[2] || '';
    } else if (prop.startsWith('thong_tin_')) {
      const { number, date } = parseNumberDateString(newValue);
      const originalPropName = prop.replace('thong_tin_', '');
      payload[`so_${originalPropName}`] = number;
      payload[`ngay_${originalPropName}`] = date;
      updatedDisplayValue = combineNumberAndDate(number, date);
    } else {
      payload[prop] = newValue;
    }

    setCases(prevCases => prevCases.map(c => {
      if (c.id === caseId) {
        const updatedC = { ...c, lastModified: new Date().toISOString().split('T')[0] };
        if (prop === 'thong_tin_nguoi_khoi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_khoi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_khoi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_khoi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_khoi_kien = updatedDisplayValue;
        } else if (prop === 'thong_tin_nguoi_bi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_bi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_bi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_bi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_bi_kien = updatedDisplayValue;
        } else if (prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[0] || '';
          updatedC.nam_sinh_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[1] || '';
          updatedC.dia_chi_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = lines[2] || '';
          updatedC.thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan = updatedDisplayValue;
        } else if (prop.startsWith('thong_tin_')) {
          const { number, date } = parseNumberDateString(newValue);
          const originalPropName = prop.replace('thong_tin_', '');
          updatedC[`so_${originalPropName}`] = number;
          updatedC[`ngay_${originalPropName}`] = date;
          updatedC[prop] = updatedDisplayValue;
        } else {
          updatedC[prop] = newValue;
        }
        return updatedC;
      }
      return c;
    }));

    try {
      let updateUrl = '';
      if (book.caseTypeId === 'HON_NHAN') {
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`;
      } else if (book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/${caseId}/`;
      } else {
        console.warn(`Update not supported for case type: ${book.caseTypeId}`);
        toast.error(`Cập nhật thất bại: Loại sổ án không được hỗ trợ.`);
        fetchCases();
        return;
      }

      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      toast.success(`Cập nhật '${caseType.attributes.find(a => a.id === prop)?.name || prop}' thành công!`);
    } catch (e: any) {
      console.error("Failed to update case:", e);
      toast.error(`Cập nhật thất bại: ${e.message}`);
      fetchCases();
    }
  }, [cases, fetchCases, setCases, caseType.attributes, book.caseTypeId]);

  const {
    showPlaintiffInfoModal, setShowPlaintiffInfoModal,
    currentPlaintiffInfo, isSavingPlaintiffInfo, handleSavePlaintiffInfo,
    showDefendantInfoModal, setShowDefendantInfoModal,
    currentDefendantInfo, isSavingDefendantInfo, handleSaveDefendantInfo,
    showRelatedPartyInfoModal, setShowRelatedPartyInfoModal,
    currentRelatedPartyInfo, isSavingRelatedPartyInfo, handleSaveRelatedPartyInfo,
    showNumberDateInfoModal, setShowNumberDateInfoModal,
    currentNumberDateInfo, currentNumberDateProp, currentNumberDateCaseId,
    isSavingNumberDateInfo, numberDateModalTitle, handleSaveNumberDateInfo,
    handleCellClick,
  } = useCaseModals({ cases, caseType, onUpdateCase });

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases();
    requestMaxNumbersUpdate();
  };

  const handleApplyAdvancedSearchSelection = useCallback((selectedCaseIds: string[]) => {
    setActiveCaseIdsFilter(selectedCaseIds);
    setShowAdvancedSearchModal(false);
    setSearchTerm(''); // Clear basic search term when advanced search is applied
    toast.success(`Đã áp dụng bộ lọc nâng cao với ${selectedCaseIds.length} vụ án được chọn.`);
  }, [setSearchTerm]);

  const handleRefreshData = useCallback(() => {
    setActiveCaseIdsFilter(null); // Clear advanced filter
    setSearchTerm(''); // Clear basic search
    setAdvancedSearchInitialCriteria({ ngayNhanDon: '', nguoiKhoiKien: '', nguoiBiKien: '' }); // Clear modal's initial criteria
    fetchCases(); // Re-fetch all cases
  }, [fetchCases, setSearchTerm]);

  const exportData = () => {
    const headers = caseType.attributes.map(attr => attr.name);
    const csv = [
      headers,
      ...cases.map(caseItem => 
        caseType.attributes.map(attr => (caseItem as any)[attr.id] || '')
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.caseTypeName}-${book.year}-cases.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Apply the activeCaseIdsFilter first, then the basic searchTerm
  const casesToDisplay = activeCaseIdsFilter 
    ? cases.filter(c => activeCaseIdsFilter.includes(c.id))
    : cases;

  const finalFilteredCases = casesToDisplay.filter(caseItem =>
    Object.values(caseItem).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const { columns, settings } = getHandsontableConfig({
    caseType,
    filteredCases: finalFilteredCases,
    refreshData: fetchCases,
    setSelectedRows,
    onUpdateCase: handleUpdateCase,
  });

  const primaryNumberFieldId = book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'so_chuyen_hoa_giai' : 'so_thu_ly';

  return (
    <div className="p-6 flex flex-col h-full">
      <CaseManagementHeader
        book={book}
        onBack={onBack}
        onRefresh={handleRefreshData}
        onExport={exportData}
        onAddCase={handleAddNewCaseClick}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filteredCount={finalFilteredCases.length}
        totalCount={cases.length}
        onAdvancedSearchClick={() => setShowAdvancedSearchModal(true)}
      />

      <CaseTable
        data={finalFilteredCases}
        columns={columns}
        settings={settings}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        filteredCount={finalFilteredCases.length}
        totalCount={cases.length}
        onAddCase={handleAddNewCaseClick}
        onCellClick={handleCellClick}
      />

      <CaseInstructions />

      {showAddCaseModal && (
        <AddCaseModal
          onClose={() => setShowAddCaseModal(false)}
          onCaseAdded={handleCaseAdded}
          bookId={book.id}
          bookYear={book.year}
          caseTypeCode={caseType.code}
          onGenerateCaseNumber={() => getNextNumberForField(primaryNumberFieldId)}
          isGeneratingCaseNumber={isMaxNumbersLoading}
          latestAutoNumber={maxNumbersByField[primaryNumberFieldId]}
        />
      )}

      {showPlaintiffInfoModal && (
        <PlaintiffInfoModal
          initialData={currentPlaintiffInfo}
          onSave={handleSavePlaintiffInfo}
          onClose={() => setShowPlaintiffInfoModal(false)}
          isSaving={isSavingPlaintiffInfo}
        />
      )}

      {showDefendantInfoModal && (
        <DefendantInfoModal
          initialData={currentDefendantInfo}
          onSave={handleSaveDefendantInfo}
          onClose={() => setShowDefendantInfoModal(false)}
          isSaving={isSavingDefendantInfo}
        />
      )}

      {showRelatedPartyInfoModal && (
        <RelatedPartyInfoModal
          initialData={currentRelatedPartyInfo}
          onSave={handleSaveRelatedPartyInfo}
          onClose={() => setShowRelatedPartyInfoModal(false)}
          isSaving={isSavingRelatedPartyInfo}
        />
      )}

      {showNumberDateInfoModal && (
        <NumberDateInputModal
          title={numberDateModalTitle}
          initialNumber={currentNumberDateInfo.number}
          initialDate={currentNumberDateInfo.date}
          onSave={handleSaveNumberDateInfo}
          onClose={() => setShowNumberDateInfoModal(false)}
          isSaving={isSavingNumberDateInfo}
          onGenerateNumber={() => getNextNumberForField(currentNumberDateProp!.replace('thong_tin_', 'so_'))} 
          isGeneratingNumber={isMaxNumbersLoading}
          latestAutoNumber={maxNumbersByField[currentNumberDateProp!.replace('thong_tin_', 'so_')] || null}
        />
      )}

      {showAdvancedSearchModal && (
        <AdvancedSearchModal
          onClose={() => setShowAdvancedSearchModal(false)}
          onApplySelection={handleApplyAdvancedSearchSelection}
          initialCriteria={advancedSearchInitialCriteria}
          book={book}
          caseType={caseType}
        />
      )}
    </div>
  );
}