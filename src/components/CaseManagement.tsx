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
  User
} from 'lucide-react';
import { CaseBook, Case } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
import { mockCases } from '../data/mockCaseData';

// Register Handsontable's modules
registerAllModules();

interface CaseManagementProps {
  book: CaseBook;
  onBack: () => void;
}

export default function CaseManagement({ book, onBack }: CaseManagementProps) {
  const hotTableRef = useRef<HotTable>(null);
  const [cases, setCases] = useState<Case[]>(mockCases[book.id] || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const caseType = caseTypes.find(type => type.id === book.caseTypeId);
  
  if (!caseType) {
    return <div>Case type not found</div>;
  }

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

  const addNewCase = () => {
    const newCase: Case = {
      id: `case-${Date.now()}`,
      caseNumber: getNextCaseNumber(),
      bookId: book.id,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    // Initialize with default values based on case type attributes
    caseType.attributes.forEach(attr => {
      if (attr.id !== 'caseNumber') {
        (newCase as any)[attr.id] = attr.type === 'number' ? 0 : '';
      }
    });
    
    const newCases = [...cases, newCase];
    setCases(newCases);
    
    // Focus on the new row
    setTimeout(() => {
      const hot = hotTableRef.current?.hotInstance;
      if (hot) {
        hot.selectCell(newCases.length - 1, 1);
      }
    }, 100);
  };

  const deleteSelectedRows = () => {
    if (selectedRows.length === 0) return;
    
    const newCases = cases.filter((_, index) => !selectedRows.includes(index));
    setCases(newCases);
    setSelectedRows([]);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCases([...(mockCases[book.id] || [])]);
      setIsLoading(false);
    }, 1000);
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
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
    rowHeaders: true,
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
    height: '100%', // Changed from 'auto' to '100%'
    maxRows: 1000,
    stretchH: 'all',
    autoWrapRow: true,
    autoWrapCol: true,
    afterChange: (changes: any) => {
      if (changes) {
        const newCases = [...cases];
        changes.forEach(([row, prop, oldValue, newValue]: any) => {
          if (oldValue !== newValue && newCases[row]) {
            (newCases[row] as any)[prop] = newValue;
            newCases[row].lastModified = new Date().toISOString().split('T')[0];
          }
        });
        setCases(newCases);
      }
    },
    afterSelection: (row: number, column: number, row2: number, column2: number) => {
      const selectedRowsArray = [];
      for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
        selectedRowsArray.push(i);
      }
      setSelectedRows(selectedRowsArray);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full"> {/* Added flex flex-col h-full */}
      {/* Header */}
      <div className="mb-8 flex-shrink-0"> {/* Added flex-shrink-0 */}
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
              onClick={addNewCase}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Case</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {cases.filter(c => {
                    const caseDate = new Date(c.createdDate);
                    const now = new Date();
                    return caseDate.getMonth() === now.getMonth() && caseDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => {
                    const status = (c as any).status;
                    return status && !['Closed', 'Dismissed', 'Settled', 'Judgment'].includes(status);
                  }).length}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Case Type</p>
                <p className="text-lg font-bold text-blue-600">{caseType.code}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
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
            
            {selectedRows.length > 0 && (
              <button
                onClick={deleteSelectedRows}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected ({selectedRows.length})</span>
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredCases.length} of {cases.length} cases
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col"> {/* Added flex-1 flex flex-col */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0"> {/* Added flex-shrink-0 */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Cases Table</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Edit3 className="w-4 h-4" />
              <span>Click any cell to edit</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden"> {/* Added flex-1 overflow-hidden */}
          <div className="handsontable-container h-full"> {/* Added h-full */}
            <HotTable
              ref={hotTableRef}
              settings={hotSettings}
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Table Features:</h4>
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
  );
}