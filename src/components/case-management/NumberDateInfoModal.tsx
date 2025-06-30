import React, { useState, useEffect } from 'react';
import { X, Hash, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface NumberDateInfo {
  number: string;
  date: string;
}

interface NumberDateInfoModalProps {
  title: string;
  initialData: NumberDateInfo;
  onSave: (data: NumberDateInfo) => void;
  onClose: () => void;
  isSaving: boolean;
  bookYear: number; // New prop
  apiFieldName: string; // New prop: e.g., 'so_chuyen_hoa_giai'
}

// Helper to format date from YYYY-MM-DD to DD-MM-YYYY for display
const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
  }
  return dateString; // Return as is if not in expected format
};

// Helper to parse DD-MM-YYYY (from input) to YYYY-MM-DD (for state/API)
const parseInputDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
  }
  return dateString; // Return as is if not in expected format
};

export default function NumberDateInfoModal({ title, initialData, onSave, onClose, isSaving, bookYear, apiFieldName }: NumberDateInfoModalProps) {
  const [number, setNumber] = useState(initialData.number);
  const [date, setDate] = useState(initialData.date);
  const [error, setError] = useState('');

  useEffect(() => {
    setNumber(initialData.number);
    setDate(initialData.date);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!number && !date) {
      setError('Vui lòng nhập ít nhất Số hoặc Ngày.');
      return;
    }

    onSave({ number, date });
  };

  const handleGenerateNumber = async () => {
    if (!apiFieldName) {
      toast.error('Không thể tự động lấy số: Thiếu tên trường API.');
      return;
    }
    
    setError('');
    try {
      const response = await fetch(`http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/get_max_so/?year=${bookYear}&field_name=${apiFieldName}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const maxNumber = data.max_so ? parseInt(data.max_so) : 0;
      setNumber((maxNumber + 1).toString());
      toast.success('Đã lấy số lớn nhất và tăng lên 1.');
    } catch (e: any) {
      console.error("Failed to fetch max number:", e);
      setError(`Không thể lấy số tự động: ${e.message}`);
      toast.error(`Không thể lấy số tự động: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Hash className="w-5 h-5 mr-2 text-blue-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSaving}
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
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                Số
              </label>
              <div className="flex">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số"
                    disabled={isSaving}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNumber}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors"
                  disabled={isSaving}
                >
                  Tự động lấy số
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="date"
                  value={formatDisplayDate(date)}
                  onChange={(e) => setDate(parseInputDate(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DD-MM-YYYY"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang lưu...
                </span>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}