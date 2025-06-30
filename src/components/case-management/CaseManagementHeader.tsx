import React from 'react';
import { 
  ArrowLeft,
  Plus, 
  Download, 
  RefreshCw,
  Trash2,
  Search
} from 'lucide-react';
import { CaseBook } from '../../types/caseTypes';

interface CaseManagementHeaderProps {
  book: CaseBook;
  onBack: () => void;
  onRefresh: () => void;
  onExport: () => void;
  onAddCase: () => void;
  onDeleteSelected: () => void;
  selectedCount: number;
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function CaseManagementHeader({
  book,
  onBack,
  onRefresh,
  onExport,
  onAddCase,
  onDeleteSelected,
  selectedCount,
  isLoading,
  searchTerm,
  onSearchChange,
}: CaseManagementHeaderProps) {
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
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={onAddCase}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case</span>
          </button>
        </div>
      </div>

      {/* Search and Delete Selected */}
      <div className="flex items-center justify-between">
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
        <button
          onClick={onDeleteSelected}
          disabled={selectedCount === 0 || isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Selected ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
}