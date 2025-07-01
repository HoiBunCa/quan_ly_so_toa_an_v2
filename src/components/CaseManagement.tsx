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
import { parseNumberDateString, combineNumberAndDate } from '../utils/dateUtils'; // Import new utilities

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // State for selected row IDs
  // Changed maxSoThuLy to maxNumbersByField to store max numbers for different fields
  const [maxNumbersByField, setMaxNumbersByField] = useState<Record<string, string | null>>({}); 
  const [isMaxNumbersLoading, setIsMaxNumbersLoading] = useState(true); // Generic loading state for all max numbers

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
  
  // Ref to store the WebSocket instance
  const wsRef = useRef<WebSocket | null>(null);

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
    deleteCases, // Expose deleteCases from the hook
    setCases, // Expose setCases for local updates
  } = useCasesData(book);

  // Function to request max numbers update via WebSocket
  const requestMaxNumbersUpdate = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket: Requesting all max numbers update...');
      wsRef.current.send(JSON.stringify({ action: 'get_all_max_numbers', year: book.year }));
    } else {
      console.warn('WebSocket not open. Cannot request max numbers update.');
    }
  }, [book.year]);

  // WebSocket connection for max numbers
  useEffect(() => {
    if (book.caseTypeId === 'HON_NHAN') {
      setIsMaxNumbersLoading(true); // Set loading to true when starting connection
      const ws = new WebSocket('ws://localhost:8003/ws/get-max-so/');
      wsRef.current = ws; // Store the WebSocket instance in the ref

      ws.onopen = () => {
        console.log('WebSocket connected for max numbers');
        // Request all max numbers for the current year on open
        requestMaxNumbersUpdate(); 
      };

      ws.onmessage = (event) => {
        console.log('WebSocket: Raw message received:', event.data);
        const message = JSON.parse(event.data); // Parse the incoming message

        // Check if the message has the expected structure for max numbers update
        console.log("===========", message);
        
        const rawMaxNumbers = message.record; // This is the object containing the max numbers
        const formattedData: Record<string, string | null> = {};
        for (const key in message) {
          if (Object.prototype.hasOwnProperty.call(rawMaxNumbers, key)) {
            formattedData[key] = String(rawMaxNumbers[key]); // Ensure all values are strings
          }
        }
        setMaxNumbersByField(formattedData); 
        console.log('WebSocket: Received max numbers map and setting state:', formattedData);
        
        setIsMaxNumbersLoading(false);
        console.log('WebSocket: Setting isMaxNumbersLoading to false.');
        
        // NEW LOGIC: Reload case list on any WebSocket message
        fetchCases();
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected for max numbers');
        setIsMaxNumbersLoading(false); // Set loading to false on close
        wsRef.current = null; // Clear the ref on close
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Lỗi kết nối WebSocket để lấy số tối đa.');
        setIsMaxNumbersLoading(false); // Set loading to false on error
      };

      return () => {
        ws.close();
      };
    } else {
      // If not HON_NHAN, we don't need to load max numbers, so it's not loading.
      setIsMaxNumbersLoading(false);
      setMaxNumbersByField({}); // Ensure it's empty for non-HON_NHAN types
    }
  }, [book.caseTypeId, book.year, requestMaxNumbersUpdate, fetchCases]); // Add fetchCases to dependencies

  // Renamed to be more generic and accept a fieldKey
  const getNextNumberForField = useCallback((fieldKey: string) => {
    console.log(`getNextNumberForField called for: ${fieldKey}`);
    console.log('Current maxNumbersByField state:', maxNumbersByField); // Log the entire state
    const currentMax = maxNumbersByField[fieldKey];
    console.log(`Current max for ${fieldKey}:`, currentMax, '(Type:', typeof currentMax, ')');

    if (currentMax !== null && currentMax !== undefined && String(currentMax).trim() !== '') {
      const parsedMax = parseInt(String(currentMax), 10); // Ensure it's parsed as an integer
      console.log('Parsed currentMax:', parsedMax);

      if (!isNaN(parsedMax)) {
        // User explicitly requested: "chỉ lấy ra hiển thị, không tự động + 1 vào nữa"
        // This implies the backend sends the *next available* number directly.
        const nextNumber = parsedMax.toString(); 
        console.log(`Generated next number for ${fieldKey}:`, nextNumber);
        return nextNumber;
      }
    }
    // Fallback to '1' if currentMax is invalid or empty.
    console.warn(`Max number for ${fieldKey} is not a valid number or is empty. Falling back to '1'.`);
    return '1';
  }, [maxNumbersByField]); // Dependency on maxNumbersByField ensures this function updates when max numbers change.

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases(); // Refresh data after a new case is added
    requestMaxNumbersUpdate(); // Request updated max numbers after a case is added
  };

  const handleUpdateCase = useCallback(async (caseId: string, prop: string, newValue: any) => {
    const caseToUpdate = cases.find(c => c.id === caseId);
    if (!caseToUpdate) {
      console.warn(`Case with ID ${caseId} not found for update.`);
      return;
    }

    let payload: { [key: string]: any } = { created_by: 1 };
    let updatedDisplayValue: any = newValue; // Value to update in local state for display

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
      const { number, date } = parseNumberDateString(newValue); // date is YYYY-MM-DD from modal
      const originalPropName = prop.replace('thong_tin_', ''); // e.g., 'chuyen_hoa_giai'
      payload[`so_${originalPropName}`] = number;
      payload[`ngay_${originalPropName}`] = date; // Send YYYY-MM-DD to API

      // Reconstruct the display value using combineNumberAndDate for local state
      updatedDisplayValue = combineNumberAndDate(number, date);
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
          updatedC.thong_tin_nguoi_khoi_kien = updatedDisplayValue; // Use updatedDisplayValue
        } else if (prop === 'thong_tin_nguoi_bi_kien') {
          const lines = String(newValue || '').split('\n');
          updatedC.ho_ten_nguoi_bi_kien = lines[0] || '';
          updatedC.nam_sinh_nguoi_bi_kien = lines[1] || '';
          updatedC.dia_chi_nguoi_bi_kien = lines[2] || '';
          updatedC.thong_tin_nguoi_bi_kien = updatedDisplayValue; // Use updatedDisplayValue
        } else if (prop.startsWith('thong_tin_')) {
          const { number, date } = parseNumberDateString(newValue);
          const originalPropName = prop.replace('thong_tin_', '');
          updatedC[`so_${originalPropName}`] = number;
          updatedC[`ngay_${originalPropName}`] = date;
          updatedC[prop] = updatedDisplayValue; // Use the correctly formatted display value
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
    // data.date is already YYYY-MM-DD from the modal input type="date"
    const combinedValueForAPI = combineNumberAndDate(data.number, data.date); // This is for API, but we need to pass the raw number/date to handleUpdateCase
    
    try {
      // Pass the raw number and date to handleUpdateCase, which will then format for API and display
      // The `newValue` for `handleUpdateCase` should be the string that `parseNumberDateString` can understand.
      // So, we reconstruct it here in the format expected by `parseNumberDateString`
      const rawCombinedString = [
        data.number ? `Số: ${data.number}` : '',
        data.date ? `Ngày: ${data.date}` : '' // Keep YYYY-MM-DD here for parsing
      ].filter(Boolean).join('\n');

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
      // When opening modal, parse the combined display string back to individual fields
      const caseItem = cases.find(c => c.id === caseId);
      const name = caseItem?.ho_ten_nguoi_khoi_kien || '';
      const year = caseItem?.nam_sinh_nguoi_khoi_kien || '';
      const address = caseItem?.dia_chi_nguoi_khoi_kien || '';
      setCurrentPlaintiffInfo({ name, year, address });
      setShowPlaintiffInfoModal(true);
    } else if (prop === 'thong_tin_nguoi_bi_kien') {
      setCurrentCaseIdForDefendantEdit(caseId);
      // When opening modal, parse the combined display string back to individual fields
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
      
      // When opening modal, get the raw number and date from the case object
      const caseItem = cases.find(c => c.id === caseId);
      const originalPropName = prop.replace('thong_tin_', '');
      const number = caseItem?.[`so_${originalPropName}`] || '';
      const date = caseItem?.[`ngay_${originalPropName}`] || ''; // This date is YYYY-MM-DD from API
      
      setCurrentNumberDateInfo({ number, date });
      setShowNumberDateInfoModal(true);
    }
  }, [caseType.attributes, cases]); // Add 'cases' to dependencies

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
    refreshData: fetchCases, // Pass fetchCases as refreshData
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
          onGenerateCaseNumber={() => getNextNumberForField('so_thu_ly')} // Pass specific field key
          isGeneratingCaseNumber={isMaxNumbersLoading} // Use generic loading state
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
          // Derive the field key from currentNumberDateProp
          onGenerateNumber={() => getNextNumberForField(currentNumberDateProp!.replace('thong_tin_', 'so_'))} 
          isGeneratingNumber={isMaxNumbersLoading} // Use generic loading state
        />
      )}
    </div>
  );
}