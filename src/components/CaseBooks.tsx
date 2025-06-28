import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit3,
  Loader2, // Import Loader2 icon for loading state
  AlertCircle // Import AlertCircle for error state
} from 'lucide-react';
import { CaseBook } from '../types/caseTypes';
import { caseTypes } from '../data/caseTypesData';
// import CreateBookModal from './CreateBookModal'; // Keep import for type reference, but modal is rendered in Dashboard

interface CaseBooksProps {
  onSelectBook: (book: CaseBook) => void;
  books: CaseBook[]; // Now received as prop
  setBooks: React.Dispatch<React.SetStateAction<CaseBook[]>>; // Now received as prop
  setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>; // Now received as prop
}

export default function CaseBooks({ onSelectBook, books, setBooks, setShowCreateModal }: CaseBooksProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  const years = Array.from(new Set(books.map(book => book.year))).sort((a, b) => b - a);

  useEffect(() => {
    const fetchCaseBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8003/home/api/v1/danh-sach-so/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        data = data.results;
        // Map API response to CaseBook interface
        const fetchedBooks: CaseBook[] = data.map((item: any) => ({
          id: item.id,
          caseTypeId: item.code,
          caseTypeName: item.name,
          year: item.year,
          createdDate: item.created_time,
          caseCount: item.count_case
        }));
        setBooks(fetchedBooks);
      } catch (e: any) {
        console.error("Failed to fetch case books:", e);
        setError(`Failed to load case books: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseBooks();
  }, [setBooks]); // Re-run effect if setBooks changes (though it's stable)

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.caseTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.year.toString().includes(searchTerm);
    const matchesYear = selectedYear === 'all' || book.year.toString() === selectedYear;
    const matchesType = selectedType === 'all' || book.caseTypeId === selectedType;
    
    return matchesSearch && matchesYear && matchesType;
  });

  const handleDeleteBook = (bookId: string) => {
    if (confirm('Are you sure you want to delete this case book? This action cannot be undone.')) {
      // In a real application, you would call an API to delete the book here.
      // For now, we'll just update the local state.
      setBooks(books.filter(book => book.id !== bookId));
    }
  };

  const totalCases = books.reduce((sum, book) => sum + book.caseCount, 0);

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-7 h-7 mr-3 text-blue-600" />
              Case Books Management
            </h1>
            <p className="text-gray-600 mt-1">Manage case books by type and year</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Book</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-emerald-600">{totalCases}</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Years</p>
                <p className="text-2xl font-bold text-gray-900">{years.length}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Case Types</p>
                <p className="text-2xl font-bold text-blue-600">{caseTypes.length}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {caseTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mr-3" />
          <span>Đang tải sổ án...</span>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-6 h-6 mr-3" />
          <span>Lỗi: {error}</span>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col justify-center items-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sổ án nào</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedYear !== 'all' || selectedType !== 'all'
              ? 'Hãy thử điều chỉnh bộ lọc của bạn để xem thêm kết quả.'
              : 'Tạo sổ án đầu tiên của bạn để bắt đầu.'}
          </p>
          {(!searchTerm && selectedYear === 'all' && selectedType === 'all') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo sổ mới</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{book.caseTypeName}</h3>
                      <p className="text-sm text-gray-600">Năm {book.year}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số vụ án:</span>
                    <span className="font-medium text-gray-900">{book.caseCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="text-gray-900">{new Date(book.createdDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectBook(book)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Mở sổ
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Book Modal is now rendered in Dashboard */}
    </div>
  );
}