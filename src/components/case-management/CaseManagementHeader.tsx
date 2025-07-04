import React from 'react';
import { 
  ArrowLeft,
  Plus, 
  Download, 
  RefreshCw,
  Search,
  FileText,
  Loader2,
  Filter // Import Filter icon for advanced search
} from 'lucide-react';
import { CaseBook } from '../../types/caseTypes';

interface CaseManagementHeaderProps {
  book: CaseBook;
  onBack: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onAddCase: () => void;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filteredCount: number;
  totalCount: number;
  onAdvancedSearchClick: () => void; // New prop for advanced search button
}

export default function CaseManagementHeader({
  book,
  onBack,
  onRefresh,
  onExport,
  onAddCase,
  isLoading,
  searchTerm,
  onSearchChange,
  filteredCount,
  totalCount,
  onAdvancedSearchClick, // Destructure new prop
}: CaseManagementHeaderProps) {

  console.log("============ book.caseTypeId: ", book.caseTypeId);

  return (
    <div className="mb-8">
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
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          {(book.caseTypeId === 'HON_NHAN') && (
          <button
            onClick={onAddCase}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm vụ án</span>
          </button>)}

          {(book.caseTypeId === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' || book.caseTypeId === 'TO_TUNG') && (
            <button
              onClick={onAdvancedSearchClick}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm vụ án</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-3"> {/* Group search input and advanced search button */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tải...
              </span>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </>
            )}
          </button>
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} cases
          </div>
        </div>
      </div>
    </div>
  );
}