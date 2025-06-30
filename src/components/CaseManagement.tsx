import React, { useRef, useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { 
  ArrowLeft,
  Plus, 
  Download, 
  Upload, 
  Filter,
  Search,
  RefreshCw,
  Trash2,
  Edit3,
  Save,
  FileText,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  ChevronDown, // Import ChevronDown icon
  ChevronUp // Import ChevronUp icon
} from 'lucide-react';
import { CaseBook, Case } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import { mockCases } from '../data/mockCaseData';
import toast from 'react-hot-toast';
import AddCaseModal from './AddCaseModal';

registerAllModules();

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const hotTableRef = useRef<HotTable>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Changed to store IDs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false); // Changed to false for auto-collapse

  const caseType = caseTypes.find(type => type.id === book.caseTypeId);
  
  if (!caseType) {
    return <div>Case type not found</div>;
  }

  const fetchCases = async () => {
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
            id: item.id.toString(), // Here, id is converted to string
            caseNumber: item.so_thu_ly || '',
            bookId: book.id,
            createdDate: item.ngay_thu_ly || item.ngay_nhan_don || '',
            lastModified: new Date().toISOString().split('T')[0],
            ...item
          };
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
  };

  useEffect(() => {
    fetchCases();
  }, [book]);

  const getNextCaseNumber = () => {
    const year = book.year;
    const prefix = caseType.code;
    const existingNumbers = cases
      .map(c => c.caseNumber)
      .filter(num => num.startsWith(`${prefix}-${year}-`))
      .map(num => parseInt(num.split('-')[2]) || 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleAddNewCaseClick = () => {
    setShowAddCaseModal(true);
  };

  const handleCaseAdded = () => {
    setShowAddCaseModal(false);
    fetchCases();
  };

  const deleteSelectedRows = async () => {
    if (selectedRows.length === 0) {
      toast.info('Vui lòng chọn ít nhất một hàng để xóa.');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedRows.length} vụ án đã chọn? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setIsLoading(true);
    let successfulDeletions = 0;
    // Now selectedRows contains IDs, so we find the actual case objects from the main 'cases' array
    const casesToDelete = cases.filter(caseItem => selectedRows.includes(caseItem.id));
    const failedDeletions: string[] = [];

    for (const caseItem of casesToDelete) {
      if (caseItem && caseItem.id) {
        try {
          const response = await fetch(`http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseItem.id}/`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
          }
          successfulDeletions++;
        } catch (e: any) {
          console.error(`Failed to delete case ${caseItem.id}:`, e);
          failedDeletions.push(caseItem.caseNumber || caseItem.id);
        }
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
    setSelectedRows([]); // Clear selected IDs
  };

  const refreshData = () => {
    fetchCases();
  };

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

  const filteredCases = cases.filter(caseItem =>
    Object.values(caseItem).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = caseType.attributes.map(attr => {
    const baseColumn = {
      data: attr.id,
      title: attr.name,
      width: attr.width || 120,
      readOnly: attr.id === 'caseNumber',
      className: attr.id === 'caseNumber' ? 'font-medium text-blue-600' : ''
    };

    switch (attr.type) {
      case 'dropdown':
        return {
          ...baseColumn,
          type: 'dropdown',
          source: attr.options || [],
          renderer: attr.id === 'status' ? (instance: any, td: HTMLElement, row: number, col: number, prop: string, value: string) => {
            const statusColors: { [key: string]: string } = {
              'Đã thụ lý': 'bg-blue-100 text-blue-800',
              'Đang giải quyết': 'bg-yellow-100 text-yellow-800',
              'Đã hòa giải': 'bg-green-100 text-green-800',
              'Đã trả lại đơn': 'bg-red-100 text-red-800',
              'Đã chuyển': 'bg-purple-100 text-purple-800',
              'Filed': 'bg-blue-100 text-blue-800',
              'In Progress': 'bg-yellow-100 text-yellow-800',
              'Settled': 'bg-green-100 text-green-800',
              'Dismissed': 'bg-gray-100 text-gray-800',
              'Judgment': 'bg-purple-100 text-purple-800',
              'Closed': 'bg-gray-100 text-gray-800',
              'Active': 'bg-green-100 text-green-800',
              'Inactive': 'bg-red-100 text-red-800'
            };
            
            const colorClass = statusColors[value] || 'bg-gray-100 text-gray-800';
            td.innerHTML = `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${value}</span>`;
            return td;
          } : undefined
        };
      case 'date':
        return {
          ...baseColumn,
          type: 'date',
          dateFormat: 'YYYY-MM-DD'
        };
      case 'number':
        return {
          ...baseColumn,
          type: 'numeric'
        };
      case 'textarea':
        return {
          ...baseColumn,
          type: 'text',
          width: 200
        };
      default:
        return {
          ...baseColumn,
          type: 'text'
        };
    }
  });

  const hotSettings = {
    data: filteredCases,
    columns: columns,
    rowHeaders: false,
    colHeaders: true,
    contextMenu: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: false,
    sortIndicator: true,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    hiddenColumns: {
      indicators: true
    },
    licenseKey: 'non-commercial-and-evaluation',
    height: 'auto',
    maxRows: 100000,
    stretchH: 'all',
    autoWrapRow: true,
    autoWrapCol: true,
    // fixedColumnsStart: 1,
    afterChange: async (changes: any, source: string) => {
      if (source === 'loadData') {
        return;
      }
      if (changes) {
        for (const [rowIndex, prop, oldValue, newValue] of changes) {
          // Get the case object from the currently displayed (filtered) data
          const changedCaseInFilteredData = filteredCases[rowIndex];
          
          if (oldValue !== newValue && changedCaseInFilteredData) {
            const caseId = changedCaseInFilteredData.id;

            // Find the actual case object in the main 'cases' array using its ID
            const caseToUpdate = cases.find(c => c.id === caseId);

            if (!caseToUpdate) {
              console.warn(`Case with ID ${caseId} not found in main cases array.`);
              continue; // Skip if not found
            }

            // Create a new array with the updated case to trigger re-render
            const updatedCases = cases.map(c => 
              c.id === caseId ? { ...c, [prop]: newValue, lastModified: new Date().toISOString().split('T')[0] } : c
            );
            setCases(updatedCases); // Update the main cases state

            const payload: { [key: string]: any } = {
              [prop]: newValue,
              created_by: 1
            };

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
              // Optionally, revert the local change if update fails
              // fetchCases(); 
            }
          }
        }
      }
    },
    afterSelection: (row: number, column: number, row2: number, column2: number) => {
      const selectedCaseIds: string[] = [];
      for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
        // Get the ID from the filtered data, as the selection is based on the displayed data
        const caseItem = filteredCases[i];
        if (caseItem && caseItem.id) {
          selectedCaseIds.push(caseItem.id);
        }
      }
      setSelectedRows(selectedCaseIds); // Now selectedRows holds IDs, not indices
    },
    afterRenderer: (TD, row, col, prop, value, cellProperties) => {
      const caseItem = filteredCases[row];
      if (caseItem && caseItem.id) {
        TD.setAttribute('data-id', caseItem.id);
      }
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Books</span>
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="w-7 h-7 mr-3 text-blue-600" />
                {book.caseTypeName} - {book.year}
              </h1>
              <p className="text-gray-600 mt-1">Manage cases for {book.caseTypeName.toLowerCase()} in {book.year}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <button
              onClick={handleAddNewCaseClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Case</span>
            </button>
          </div>
        </div>

        {/* Search and Delete Selected */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          <button
            onClick={deleteSelectedRows}
            disabled={selectedRows.length === 0 || isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedRows.length})</span>
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">

        
        <div className="p-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span>Đang tải vụ án...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-6 h-6 mr-3" />
              <span>Lỗi: {error}</span>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12 flex flex-col justify-center items-center h-full">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy vụ án nào</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Hãy thử điều chỉnh bộ lọc của bạn để xem thêm kết quả.'
                  : 'Thêm vụ án mới để bắt đầu quản lý.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddNewCaseClick}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm vụ án mới</span>
                </button>
              )}
            </div>
          ) : (
            <div className="handsontable-container h-full">
              <HotTable
                ref={hotTableRef}
                settings={hotSettings}
                height="100%"
              />
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div
          className="flex items-center justify-between p-[0.5rem] cursor-pointer"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <h4 className="text-sm font-semibold text-blue-900">Table Features:</h4>
          {showInstructions ? (
            <ChevronUp className="w-5 h-5 text-blue-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-700" />
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showInstructions ? 'max-h-96 opacity-100 p-4 pt-0' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click any cell to edit inline (except Case Number)</li>
            <li>• Right-click for context menu with additional options</li>
            <li>• Use column headers to sort and filter data</li>
            <li>• Drag column borders to resize</li>
            <li>• Select multiple rows and use "Delete Selected" button</li>
            <li>• Case numbers are automatically generated</li>
          </ul>
        </div>
      </div>

      {/* Add Case Modal */}
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