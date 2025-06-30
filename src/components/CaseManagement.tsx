import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CaseBook } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';
import PlaintiffInfoModal from './case-management/PlaintiffInfoModal';
import DefendantInfoModal from './case-management/DefendantInfoModal';
import NumberDateInputModal from './common/NumberDateInputModal';

// Import new modular components and hook
import CaseManagementHeader from './case-management/CaseManagementHeader';
import CaseTable from './case-management/CaseTable';
import CaseInstructions from './case-management/CaseInstructions';
import { useCasesData } from '../hooks/useCasesData';
import { getHandsontableConfig } from '../utils/handsontableConfig';

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // State for selected row IDs
  const [maxSoThuLy, setMaxSoThuLy] = useState<string | null>(null); // State to store max_so_thu_ly from WebSocket
  const [isMaxSoThuLyLoading, setIsMaxSoThuLyLoading] = useState(true); // New state for loading max_so_thu_ly

  // State for Plaintiff Info Modal
  const [showPlaintiffInfoModal, setShowPlaintiffInfoModal] = useState(false);
  const [currentCaseIdForPlaintiffEdit, setCurrentCaseIdForPlaintiffEdit] = useState<string | null>(null);
  const [currentPlaintiffInfo, setCurrentPlaintiffInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingPlaintiffInfo, setIsSavingPlaintiffInfo] = useState(false);

  // State for Defendant Info Modal
  const [showDefendantInfoModal, setShowDefendantInfoModal] = useState(false);
  const [currentCaseIdForDefendantEdit, setCurrentCaseIdForDefendantEdit] = useState<string | null>(null);
  const [currentDefendantInfo, setCurrentDefendantInfo] = useState({ name: '', year: '', address: '' });
  const [isSavingDefendantInfo, setIsSavingDefendantInfo] = useState(false);

  // State for generic Number/Date Info Modal
  const [showNumberDateInfoModal, setShowNumberDateInfoModal] = useState(false);
  const [currentNumberDateInfo, setCurrentNumberDateInfo] = useState({ number: '', date: '' });
  const [currentNumberDateProp, setCurrentNumberDateProp] = useState<string | null>(null);
  const [currentNumberDateCaseId, setCurrentNumberDateCaseId] = useState<string | null>(null);
  const [isSavingNumberDateInfo, setIsSavingNumberDateInfo] = useState(false);
  const [numberDateModalTitle, setNumberDateModalTitle] = useState('');

  const caseType = caseTypes.find(type => type.id === book.caseTypeId);
  
  if (!caseType) {
    return <div>Case type not found</div>;
  }

  const {
    cases,
    filteredCases,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    fetchCases,
    deleteCases,
    setCases, // Expose setCases for local updates
  } = useCasesData(book);

  // WebSocket connection for max_so_thu_ly
  useEffect(() => {
    if (book.caseTypeId === 'HON_NHAN') {
      setIsMaxSoThuLyLoading(true); // Set loading to true when starting connection
      const ws = new WebSocket('ws://localhost:8003/ws/get-max-so/');

      ws.onopen = () => {
        console.log('WebSocket connected for max_so_thu_ly');
        ws.send(JSON.stringify({ action: 'get_max_so_thu_ly', year: book.year }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.so_thu_ly !== undefined && data.so_thu_ly !== null) {
          setMaxSoThuLy(String(data.so_thu_ly)); // Ensure it's a string
          console.log('WebSocket: Received max_so_thu_ly and setting state:', data.so_thu_ly);
        } else {
          setMaxSoThuLy(null); // Explicitly set to null if undefined/null
          console.log('WebSocket: Received undefined/null max_so_thu_ly. Setting state to null.');
        }
        setIsMaxSoThuLyLoading(false);
        console.log('WebSocket: Setting isMaxSoThuLyLoading to false.');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected for max_so_thu_ly');
        setIsMaxSoThuLyLoading(false); // Set loading to false on close
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Lỗi kết nối WebSocket để lấy số thụ lý tối đa.');
        setIsMaxSoThuLyLoading(false); // Set loading to false on error
      };

      return () => {
        ws.close();
      };
    } else {
      // If not HON_NHAN, we don't need to load max_so_thu_ly, so it's not loading.
      setIsMaxSoThuLyLoading(false);
      setMaxSoThuLy(null); // Ensure it's null for non-HON_NHAN types
    }
  }, [book.caseTypeId, book.year]); // Reconnect if book type or year changes

  const getNextCaseNumber = useCallback(() => {
    console.log('getNextCaseNumber called.');
    console.log('Current maxSoThuLy from WebSocket:', maxSoThuLy, '(Type:', typeof maxSoThuLy, ')');

    // The 'maxSoThuLy' state already holds the maximum 'so_thu_ly' value from the WebSocket.
    // We need to ensure it's a valid number string before incrementing.
    if (maxSoThuLy !== null && maxSoThuLy !== undefined && String(maxSoThuLy).trim() !== '') {
      const currentSoThuLy = parseInt(String(maxSoThuLy), 10); // Ensure it's parsed as an integer
      console.log('Parsed currentSoThuLy:', currentSoThuLy);

      if (!isNaN(currentSoThuLy)) {
        const nextSoThuLy = (currentSoThuLy + 1).toString();
        console.log('Generated next so_thu_ly:', nextSoThuLy);
        return nextSoThuLy;
      }
    }

    // Fallback logic if maxSoThuLy is not available or invalid
    console.log('maxSoThuLy is not a valid number. Falling back to date-based generation.');
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    const fallbackNumber = `${dd}${mm}${yyyy}`;
    console.log('Fallback number:', fallbackNumber);
    return fallbackNumber;
  }, [maxSoThuLy]); // Dependency on maxSoThuLy ensures this function updates when maxSoThuLy changes.

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases(); // Refresh data after a new case is added
  };

  // Helper to parse combined "Số: [number]\nNgày: [date]" string
  const parseNumberDateString = (combinedString: string) => {
    const lines = String(combinedString || '').split('\n');
    let number = '';
    let date = '';
    if (lines[0]?.startsWith('Số: ')) {
      number = lines[0].substring('Số: '.length);
    }
    if (lines[1]?.startsWith('Ngày: ')) {
      // Convert DD-MM-YYYY back to YYYY-MM-DD for internal state
      const dateParts = lines[1].substring('Ngày: '.length).split('-');
      if (dateParts.length === 3) {
        date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      } else {
        date = lines[1].substring('Ngày: '.length);
      }
    }
    return { number, date };
  };

  const handleUpdateCase = useCallback(async (caseId: string, prop: string, newValue: any) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) {
      console.warn(`Case with ID ${caseId} not found for update.`);
      return;
    }

    let payload: { [key: string]: any } = { created_by: 1 };

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
    } else if (prop.startsWith('thong_tin_')) { // Handle combined number/date fields
      const { number, date } = parseNumberDateString(newValue);
      const originalPropName = prop.replace('thong_tin_', ''); // e.g., 'chuyen_hoa_giai'
      payload[`so_${originalPropName}`] = number;
      payload[`ngay_${originalPropName}`] = date;
    }
    else {
      payload[prop] = newValue;
    }

    // Optimistic update: Update local state immediately
    setCases(prevCases => prevCases.map(c => {
      if (c.id === caseId) {
        const updatedC = { ...c, lastModified: new Date().toISOString().split('T')[0] };
        if (prop === 'thong_tin_nguoi_khoi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_khoi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_khoi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_khoi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_khoi_kien = newValue;
        } else if (prop === 'thong_tin_nguoi_bi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_bi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_bi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_bi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_bi_kien = newValue;
        } else if (prop.startsWith('thong_tin_')) {
          const { number, date } = parseNumberDateString(newValue);
          const originalPropName = prop.replace('thong_tin_', '');
          updatedC[`so_${originalPropName}`] = number;
          updatedC[`ngay_${originalPropName}`] = date;
          updatedC[prop] = newValue; // Keep the combined value for display
        }
        else {
          updatedC[prop] = newValue;
        }
        return updatedC;
      }
      return c;
    }));

    try {
      const response = await fetch(`http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`, {
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
      // Revert if API call fails (optional, but good for robustness)
      fetchCases(); 
    }
  }, [cases, fetchCases, setCases, caseType.attributes]);

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
    // Format date back to YYYY-MM-DD for API
    // The date from modal is already YYYY-MM-DD, so no need to reformat here.
    const combinedValue = [
      data.number ? `Số: ${data.number}` : '',
      data.date ? `Ngày: ${data.date}` : ''
    ].filter(Boolean).join('\n');
    
    try {
      await handleUpdateCase(currentNumberDateCaseId, currentNumberDateProp, combinedValue);
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
      const lines = String(value || '').split('\n');
      setCurrentPlaintiffInfo({
        name: lines[0]?.replace('Họ tên: ', '') || '',
        year: lines[1]?.replace('Năm sinh: ', '') || '',
        address: lines[2]?.replace('Địa chỉ: ', '') || ''
      });
      setShowPlaintiffInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      setCurrentCaseIdForDefendantEdit(caseId);
      const lines = String(value || '').split('\n');
      setCurrentDefendantInfo({
        name: lines[0]?.replace('Họ tên: ', '') || '',
        year: lines[1]?.replace('Năm sinh: ', '') || '',
        address: lines[2]?.replace('Địa chỉ: ', '') || ''
      });
      setShowDefendantInfoModal(true);
    } else if (prop.startsWith('thong_tin_') && attribute?.type === 'textarea') {
      setCurrentNumberDateCaseId(caseId);
      setCurrentNumberDateProp(prop);
      setNumberDateModalTitle(`Chỉnh sửa ${title}`);
      const { number, date } = parseNumberDateString(String(value || ''));
      setCurrentNumberDateInfo({ number, date });
      setShowNumberDateInfoModal(true);
    }
  }, [caseType.attributes]);

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

  const { columns, settings } = getHandsontableConfig({
    caseType,
    filteredCases,
    deleteCases,
    setSelectedRows,
    onUpdateCase: handleUpdateCase,
  });

  return (
    <div className="p-6 flex flex-col h-full">
      <CaseManagementHeader
        book={book}
        onBack={onBack}
        onRefresh={fetchCases}
        onExport={exportData}
        onAddCase={handleAddNewCaseClick}
        onDeleteSelected={() => deleteCases(selectedRows)}
        selectedCount={selectedRows.length}
        isLoading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <CaseTable
        data={filteredCases}
        columns={columns}
        settings={settings}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        filteredCount={filteredCases.length}
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
          onGenerateCaseNumber={getNextCaseNumber}
          isGeneratingCaseNumber={isMaxSoThuLyLoading}
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
        />
      )}
    </div>
  );
}