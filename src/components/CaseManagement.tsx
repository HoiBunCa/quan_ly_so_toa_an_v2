import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CaseBook } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';
import PlaintiffInfoModal from './case-management/PlaintiffInfoModal';
import DefendantInfoModal from './case-management/DefendantInfoModal';
import NumberDateInputModal from './common/NumberDateInputModal';
import AdvancedSearchModal, { AdvancedSearchCriteria } from './case-management/AdvancedSearchModal'; // Import new modal and interface

// Import new modular components and hook
import CaseManagementHeader from './case-management/CaseManagementHeader';
import CaseTable from './case-management/CaseTable';
import CaseInstructions from './case-management/CaseInstructions';
import { useCasesData } from '../hooks/useCasesData';
import { getHandsontableConfig } from '../utils/handsontableConfig';
import { parseNumberDateString, combineNumberAndDate } from '../utils/dateUtils';

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [maxNumbersByField, setMaxNumbersByField] = useState<Record<string, string | null>>({});
  const [isMaxNumbersLoading, setIsMaxNumbersLoading] = useState(true);

  const [showPlaintiffInfoModal, setShowPlaintiffInfoModal] = useState(false);
  const [currentCaseIdForPlaintiffEdit, setCurrentCaseIdForPlaintiffEdit] = useState<string | null>(null);
  const [currentPlaintiffInfo, setCurrentPlaintiffInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingPlaintiffInfo, setIsSavingPlaintiffInfo] = useState(false);

  const [showDefendantInfoModal, setShowDefendantInfoModal] = useState(false);
  const [currentCaseIdForDefendantEdit, setCurrentCaseIdForDefendantEdit] = useState<string | null>(null);
  const [currentDefendantInfo, setCurrentDefendantInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingDefendantInfo, setIsSavingDefendantInfo] = useState(false);

  const [showNumberDateInfoModal, setShowNumberDateInfoModal] = useState(false);
  const [currentNumberDateInfo, setCurrentNumberDateInfo] = useState({ number: '', date: '' });
  const [currentNumberDateProp, setCurrentNumberDateProp] = useState<string | null>(null);
  const [currentNumberDateCaseId, setCurrentNumberDateCaseId] = useState<string | null>(null);
  const [isSavingNumberDateInfo, setIsSavingNumberDateInfo] = useState(false);
  const [numberDateModalTitle, setNumberDateModalTitle] = useState('');

  // New state for advanced search
  const [showAdvancedSearchModal, setShowAdvancedSearchModal] = useState(false);
  const [advancedSearchInitialCriteria, setAdvancedSearchInitialCriteria] = useState<AdvancedSearchCriteria>({
    ngayNhanDon: '',
    nguoiKhoiKien: '',
    nguoiBiKien: '',
  });
  // New state to hold the IDs of cases selected from the advanced search modal
  const [activeCaseIdsFilter, setActiveCaseIdsFilter] = useState<string[] | null>(null);


  const caseType = caseTypes.find(type => type.id === book.caseTypeId);
  
  const wsRef = useRef<WebSocket | null>(null);

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
  } = useCasesData(book); // Removed advancedSearchCriteria from hook call

  const requestMaxNumbersUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Requesting all max numbers update...');
      wsRef.current.send(JSON.stringify({ action: 'get_all_max_numbers', year: book.year }));
    } else {
      console.warn('WebSocket not open. Cannot request max numbers update.');
    }
  }, [book.year]);

  useEffect(() => {
    if (book.caseTypeId === 'HON_NHAN' || book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
      setIsMaxNumbersLoading(true);
      const ws = new WebSocket('ws://localhost:8003/ws/get-max-so/');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected for max numbers');
        requestMaxNumbersUpdate(); 
      };

      ws.onmessage = (event) => {
        console.log('WebSocket: Raw message received:', event.data);
        const message = JSON.parse(event.data);
        
        const rawMaxNumbers = message;
        const formattedData: Record<string, string | null> = {};
        for (const key in rawMaxNumbers) {
          if (Object.prototype.hasOwnProperty.call(rawMaxNumbers, key)) {
            formattedData[key] = String(rawMaxNumbers[key]);
          }
        }
        setMaxNumbersByField(formattedData); 
        console.log('WebSocket: Received max numbers map and setting state:', formattedData);
        
        setIsMaxNumbersLoading(false);
        console.log('WebSocket: Setting isMaxNumbersLoading to false.');
        
        fetchCases();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected for max numbers');
        setIsMaxNumbersLoading(false);
        wsRef.current = null;
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Lỗi kết nối WebSocket để lấy số tối đa.');
        setIsMaxNumbersLoading(false);
      };

      return () => {
        ws.close();
      };
    } else {
      setIsMaxNumbersLoading(false);
      setMaxNumbersByField({});
    }
  }, [book.caseTypeId, book.year, requestMaxNumbersUpdate, fetchCases]);

  const getNextNumberForField = useCallback((fieldKey: string) => {
    console.log(`getNextNumberForField called for: ${fieldKey}`);
    console.log('Current maxNumbersByField state:', maxNumbersByField);
    const currentMax = maxNumbersByField[fieldKey];
    console.log(`Current max for ${fieldKey}:`, currentMax, '(Type:', typeof currentMax, ')');

    if (currentMax !== null && currentMax !== undefined && String(currentMax).trim() !== '') {
      const parsedMax = parseInt(String(currentMax), 10);
      console.log('Parsed currentMax:', parsedMax);

      if (!isNaN(parsedMax)) {
        const nextNumber = parsedMax.toString(); 
        console.log(`Generated next number for ${fieldKey}:`, nextNumber);
        return nextNumber;
      }
    }
    console.warn(`Max number for ${fieldKey} is not a valid number or is empty. Falling back to '1'.`);
    return '1';
  }, [maxNumbersByField]);

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases();
    requestMaxNumbersUpdate();
  };

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
    } else if (prop.startsWith('thong_tin_')) {
      const { number, date } = parseNumberDateString(newValue);
      const originalPropName = prop.replace('thong_tin_', '');
      payload[`so_${originalPropName}`] = number;
      payload[`ngay_${originalPropName}`] = date;

      updatedDisplayValue = combineNumberAndDate(number, date);
    }
    else {
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
        } else if (prop.startsWith('thong_tin_')) {
          const { number, date } = parseNumberDateString(newValue);
          const originalPropName = prop.replace('thong_tin_', '');
          updatedC[`so_${originalPropName}`] = number;
          updatedC[`ngay_${originalPropName}`] = date;
          updatedC[prop] = updatedDisplayValue;
        }
        else {
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
        updateUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/${caseId}/`; // Corrected API for PUT
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

  const handleSavePlaintiffInfo = async (data: { name: string; year: string; address: string }) => {
    if (!currentCaseIdForPlaintiffEdit) return;

    setIsSavingPlaintiffInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForPlaintiffEdit, 'thong_tin_nguoi_khoi_kien', combinedValue);
      setShowPlaintiffInfoModal(false);
    } finally {
      setIsSavingPlaintiffInfo(false);
    }
  };

  const handleSaveDefendantInfo = async (data: { name: string; year: string; address: string }) => {
    if (!currentCaseIdForDefendantEdit) return;

    setIsSavingDefendantInfo(true);
    const combinedValue = [data.name, data.year, data.address].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentCaseIdForDefendantEdit, 'thong_tin_nguoi_bi_kien', combinedValue);
      setShowDefendantInfoModal(false);
    } finally {
      setIsSavingDefendantInfo(false);
    }
  };

  const handleSaveNumberDateInfo = async (data: { number: string, date: string }) => {
    if (!currentNumberDateCaseId || !currentNumberDateProp) return;

    setIsSavingNumberDateInfo(true);
    const rawCombinedString = [
      data.number ? `Số: ${data.number}` : '',
      data.date ? `Ngày: ${data.date}` : ''
    ].filter(Boolean).join('\n');

    try {
      await handleUpdateCase(currentNumberDateCaseId, currentNumberDateProp, rawCombinedString);
      setShowNumberDateInfoModal(false);
    } finally {
      setIsSavingNumberDateInfo(false);
    }
  };

  const handleCellClick = useCallback((caseId: string, prop: string, value: any) => {
    const attribute = caseType.attributes.find(attr => attr.id === prop);
    const title = attribute?.name || prop;

    if (prop === 'thong_tin_nguoi_khoi_kien') {
      setCurrentCaseIdForPlaintiffEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_khoi_kien || '';
      const year = caseItem?.nam_sinh_nguoi_khoi_kien || '';
      const address = caseItem?.dia_chi_nguoi_khoi_kien || '';
      setCurrentPlaintiffInfo({ name, year, address });
      setShowPlaintiffInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      setCurrentCaseIdForDefendantEdit(caseId);
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_bi_kien || '';
      const year = caseItem?.nam_sinh_nguoi_bi_kien || '';
      const address = caseItem?.dia_chi_nguoi_bi_kien || '';
      setCurrentDefendantInfo({ name, year, address });
      setShowDefendantInfoModal(true);
    } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
      setCurrentNumberDateCaseId(caseId);
      setCurrentNumberDateProp(prop);
      setNumberDateModalTitle(`Chỉnh sửa ${title}`);
      
      const caseItem = cases.find(c => c.id === caseId);
      const originalPropName = prop.replace('thong_tin_', '');
      const number = caseItem?.[`so_${originalPropName}`] || '';
      const date = caseItem?.[`ngay_${originalPropName}`] || '';
      
      setCurrentNumberDateInfo({ number, date });
      setShowNumberDateInfoModal(true);
    }
  }, [caseType.attributes, cases]);

  const handleApplyAdvancedSearchSelection = useCallback((selectedCaseIds: string[]) => {
    setActiveCaseIdsFilter(selectedCaseIds);
    setShowAdvancedSearchModal(false);
    setSearchTerm(''); // Clear basic search term when advanced search is applied
    toast.success(`Đã áp dụng bộ lọc nâng cao với ${selectedCaseIds.length} vụ án được chọn.`);
  }, []);

  const handleRefreshData = useCallback(() => {
    setActiveCaseIdsFilter(null); // Clear advanced filter
    setSearchTerm(''); // Clear basic search
    setAdvancedSearchInitialCriteria({ ngayNhanDon: '', nguoiKhoiKien: '', nguoiBiKien: '' }); // Clear modal's initial criteria
    fetchCases(); // Re-fetch all cases
  }, [fetchCases]);

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
    filteredCases: finalFilteredCases, // Pass the currently displayed cases to config
    refreshData: fetchCases, // This will re-fetch all data, then the filter will re-apply
    setSelectedRows,
    onUpdateCase: handleUpdateCase,
  });

  // Determine which field to generate/display for the AddCaseModal
  const primaryNumberFieldId = book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'so_chuyen_hoa_giai' : 'so_thu_ly';

  return (
    <div className="p-6 flex flex-col h-full">
      <CaseManagementHeader
        book={book}
        onBack={onBack}
        onRefresh={handleRefreshData} // Use the new combined refresh handler
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
        data={finalFilteredCases} // Use finalFilteredCases for the table
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
          onApplySelection={handleApplyAdvancedSearchSelection} // Changed prop name
          initialCriteria={advancedSearchInitialCriteria}
          book={book} // Pass book to modal
        />
      )}
    </div>
  );
}