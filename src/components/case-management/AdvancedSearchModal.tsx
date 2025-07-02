import React, { useState, useEffect } from 'react';
import { X, Calendar, User, AlertCircle, Search as SearchIcon, Loader2 } from 'lucide-react';
import { formatDateForDisplay } from '../../utils/dateUtils';

export interface AdvancedSearchCriteria {
  ngayNhanDon: string;
  nguoiKhoiKien: string;
  nguoiBiKien: string;
}

interface AdvancedSearchModalProps {
  onClose: () => void;
  onSearch: (criteria: AdvancedSearchCriteria) => void;
  initialCriteria: AdvancedSearchCriteria;
  isSearching: boolean;
}

export default function AdvancedSearchModal({ onClose, onSearch, initialCriteria, isSearching }: AdvancedSearchModalProps) {
  const [ngayNhanDon, setNgayNhanDon] = useState(initialCriteria.ngayNhanDon);
  const [nguoiKhoiKien, setNguoiKhoiKien] = useState(initialCriteria.nguoiKhoiKien);
  const [nguoiBiKien, setNguoiBiKien] = useState(initialCriteria.nguoiBiKien);
  const [error, setError] = useState('');

  useEffect(() => {
    setNgayNhanDon(initialCriteria.ngayNhanDon);
    setNguoiKhoiKien(initialCriteria.nguoiKhoiKien);
    setNguoiBiKien(initialCriteria.nguoiBiKien);
  }, [initialCriteria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // If all fields are empty, show an error or allow empty search
    if (!ngayNhanDon && !nguoiKhoiKien && !nguoiBiKien) {
      setError('Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
      return;
    }

    onSearch({ ngayNhanDon, nguoiKhoiKien, nguoiBiKien });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <SearchIcon className="w-5 h-5 mr-2 text-blue-600" />
            Tìm kiếm nâng cao
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSearching}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="ngayNhanDon" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày nhận đơn
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="ngayNhanDon"
                  value={ngayNhanDon}
                  onChange={(e) => setNgayNhanDon(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSearching}
                />
              </div>
              {ngayNhanDon && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDateForDisplay(ngayNhanDon)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="nguoiKhoiKien" className="block text-sm font-medium text-gray-700 mb-2">
                Người khởi kiện
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="nguoiKhoiKien"
                  value={nguoiKhoiKien}
                  onChange={(e) => setNguoiKhoiKien(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người khởi kiện"
                  disabled={isSearching}
                />
              </div>
            </div>

            <div>
              <label htmlFor="nguoiBiKien" className="block text-sm font-medium text-gray-700 mb-2">
                Người bị kiện
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="nguoiBiKien"
                  value={nguoiBiKien}
                  onChange={(e) => setNguoiBiKien(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên người bị kiện"
                  disabled={isSearching}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSearching}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSearching}
            >
              {isSearching ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tìm...
                </span>
              ) : (
                'Tìm kiếm'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}