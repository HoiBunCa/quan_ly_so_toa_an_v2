import React, { useState, useCallback } from 'react';
import { CaseBook } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';

// Import new modular components and hook
import CaseManagementHeader from './case-management/CaseManagementHeader';
import CaseTable from './case-management/CaseTable';
import CaseInstructions from './case-management/CaseInstructions';
import { useCasesData } from '../hooks/useCasesData';
import { getHandsontableConfig } from '../utils/handsontableConfig';

// Removed: import { registerAllModules } from 'handsontable/registry';
// Removed: import 'handsontable/dist/handsontable.full.min.css';
// Removed: registerAllModules();

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // State for selected row IDs

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

  const getNextCaseNumber = useCallback(() => {
    const year = book.year;
    const prefix = caseType.code;
    const existingNumbers = cases
      .map(c => c.caseNumber)
      .filter(num => num.startsWith(`${prefix}-${year}-`))
      .map(num => parseInt(num.split('-')[2]) || 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}-${year}-${nextNumber.toString().padStart(3, '0')}`;
  }, [cases, book.year, caseType.code]);

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases(); // Refresh data after a new case is added
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
    } else {
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
          updatedC.thong_tin_nguoi_khoi_kien = newValue; // Keep the combined value for display
        } else {
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
        />
      )}
    </div>
  );
}