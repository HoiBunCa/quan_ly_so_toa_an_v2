import React, { useState } from 'react';
import { X, FileText, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddCaseModalProps {
  onClose: () => void;
  onCaseAdded: () => void;
  bookId: string; // Pass the current book's ID
  bookYear: number; // Pass the current book's year for case number generation
  caseTypeCode: string; // Pass the case type code for case number generation
  onGenerateCaseNumber: () => string; // Updated prop for auto-generating case number
}

export default function AddCaseModal({ onClose, onCaseAdded, bookId, bookYear, caseTypeCode, onGenerateCaseNumber }: AddCaseModalProps) {
  const [soThuLy, setSoThuLy] = useState('');
  const [ngayThuLy, setNgayThuLy] = useState(new Date().toISOString().split('T')[0]); // State stores YYYY-MM-DD
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to format YYYY-MM-DD to DD-MM-YYYY for display
  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
    }
    return dateString; // Return as is if not in expected format
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!soThuLy || !ngayThuLy) {
      setError('Vui lòng nhập đầy đủ Số thụ lý và Ngày thụ lý.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        so_thu_ly: soThuLy,
        ngay_thu_ly: ngayThuLy, // API still receives YYYY-MM-DD
        created_by: 1,
      };

      const response = await fetch('http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      toast.success('Vụ án đã được thêm thành công!');
      onCaseAdded();
      onClose();
    } catch (e: any) {
      console.error("Failed to add case:", e);
      setError(`Thêm vụ án thất bại: ${e.message}`);
      toast.error(`Thêm vụ án thất bại: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateNumber = () => {
    const generatedNumber = onGenerateCaseNumber();
    setSoThuLy(generatedNumber);
    toast.info('Tự động lấy số thụ lý.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Thêm Vụ Án Mới
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
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
              <label htmlFor="soThuLy" className="block text-sm font-medium text-gray-700 mb-2">
                Số thụ lý
              </label>
              <div className="flex">
                <div className="relative flex-1">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="soThuLy"
                    value={soThuLy}
                    onChange={(e) => setSoThuLy(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số thụ lý"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNumber}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  Tự động lấy số
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="ngayThuLy" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày thụ lý
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="ngayThuLy"
                  value={ngayThuLy} // Value is YYYY-MM-DD for type="date"
                  onChange={(e) => setNgayThuLy(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {ngayThuLy && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDisplayDate(ngayThuLy)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang thêm...
                </span>
              ) : (
                'Thêm Vụ Án'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}