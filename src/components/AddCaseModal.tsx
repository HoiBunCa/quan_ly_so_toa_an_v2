import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDateForDisplay } from '../utils/dateUtils';

interface AddCaseModalProps {
  onClose: () => void;
  onCaseAdded: () => void;
  bookId: string;
  bookYear: number;
  caseTypeCode: string;
  onGenerateCaseNumber: () => string;
  isGeneratingCaseNumber: boolean;
  latestAutoNumber: string | null;
}

export default function AddCaseModal({ onClose, onCaseAdded, bookId, bookYear, caseTypeCode, onGenerateCaseNumber, isGeneratingCaseNumber, latestAutoNumber }: AddCaseModalProps) {
  const [primaryNumber, setPrimaryNumber] = useState(''); // Renamed from soThuLy for generality
  const [primaryDate, setPrimaryDate] = useState(new Date().toISOString().split('T')[0]); // Renamed from ngayThuLy for generality
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserEditedPrimaryNumber, setHasUserEditedPrimaryNumber] = useState(false); // Renamed

  const initialLatestAutoNumberRef = useRef(latestAutoNumber);

  useEffect(() => {
    // Only set primaryNumber if the user hasn't edited it and a new auto number is available
    if (!hasUserEditedPrimaryNumber && latestAutoNumber !== null && latestAutoNumber !== primaryNumber) {
      if (primaryNumber === '' || latestAutoNumber !== initialLatestAutoNumberRef.current) {
        setPrimaryNumber(latestAutoNumber);
        initialLatestAutoNumberRef.current = latestAutoNumber;
      }
    }
  }, [latestAutoNumber, hasUserEditedPrimaryNumber, primaryNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!primaryNumber || !primaryDate) {
      setError('Vui lòng nhập đầy đủ Số và Ngày.');
      return;
    }

    setIsSubmitting(true);
    let apiUrl = '';
    let payload: { [key: string]: any } = { created_by: 1 };

    if (caseTypeCode === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
      apiUrl = 'http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap/';
      payload.so_chuyen_hoa_giai = primaryNumber;
      payload.ngay_chuyen_hoa_giai = primaryDate;
    } else {
      // Default for HON_NHAN and any other types
      apiUrl = 'http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/';
      payload.so_thu_ly = primaryNumber;
      payload.ngay_thu_ly = primaryDate;
    }

    try {
      const response = await fetch(apiUrl, {
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

  const handlePrimaryNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryNumber(e.target.value);
    setHasUserEditedPrimaryNumber(true);
  };

  const handleGenerateNumber = () => {
    const generatedNumber = onGenerateCaseNumber();
    setPrimaryNumber(generatedNumber);
    setHasUserEditedPrimaryNumber(false);
    console.log('Generated Case Number:', generatedNumber);
    toast('Tự động lấy số.');
  };

  // Determine labels and placeholders based on case type
  const numberLabel = caseTypeCode === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'Số chuyển hoà giải' : 'Số thụ lý';
  const dateLabel = caseTypeCode === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'Ngày chuyển hoà giải' : 'Ngày thụ lý';
  const placeholderText = caseTypeCode === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI' ? 'Nhập số chuyển hoà giải' : 'Nhập số thụ lý';

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
              <label htmlFor="primaryNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {numberLabel}
              </label>
              <div className="flex">
                <div className="relative flex-1">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="primaryNumber"
                    value={primaryNumber}
                    onChange={handlePrimaryNumberChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={placeholderText}
                    required
                    disabled={isSubmitting || isGeneratingCaseNumber}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNumber}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isGeneratingCaseNumber}
                >
                  {isGeneratingCaseNumber ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tải số...
                    </span>
                  ) : (
                    'Tự động lấy số'
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="primaryDate" className="block text-sm font-medium text-gray-700 mb-2">
                {dateLabel}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="primaryDate"
                  value={primaryDate}
                  onChange={(e) => setPrimaryDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {primaryDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDateForDisplay(primaryDate)}
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