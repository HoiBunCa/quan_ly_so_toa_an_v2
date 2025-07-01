import React, { useState, useEffect, useRef } from 'react';
import { X, Hash, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { formatDateForDisplay } from '../../utils/dateUtils';

interface NumberDateInputModalProps {
  title: string;
  initialNumber: string;
  initialDate: string;
  onSave: (data: { number: string; date: string }) => void;
  onClose: () => void;
  isSaving: boolean;
  onGenerateNumber: () => string;
  isGeneratingNumber: boolean;
  latestAutoNumber: string | null; // New prop for the latest auto-generated number
}

export default function NumberDateInputModal({ title, initialNumber, initialDate, onSave, onClose, isSaving, onGenerateNumber, isGeneratingNumber, latestAutoNumber }: NumberDateInputModalProps) {
  const [number, setNumber] = useState(initialNumber);
  const [date, setDate] = useState(initialDate);
  const [error, setError] = useState('');
  const [hasUserEditedNumber, setHasUserEditedNumber] = useState(false); // New state

  // Use a ref to store the initial latestAutoNumber to prevent immediate overwrite
  const initialLatestAutoNumberRef = useRef(latestAutoNumber);

  useEffect(() => {
    // Set initial values when modal opens or initialData changes
    setNumber(initialNumber);
    setDate(initialDate);
    setHasUserEditedNumber(false); // Reset edit flag when initial data changes (e.g., modal re-opens for a different case)
    initialLatestAutoNumberRef.current = latestAutoNumber; // Reset ref
  }, [initialNumber, initialDate, latestAutoNumber]); // Add latestAutoNumber to dependencies

  useEffect(() => {
    // Only set number if the user hasn't edited it and a new auto number is available
    // And if the new latestAutoNumber is different from the current number state
    if (!hasUserEditedNumber && latestAutoNumber !== null && latestAutoNumber !== number) {
      // This condition ensures it only updates if the current number is empty
      // or if the latestAutoNumber has genuinely changed from the *initial* value
      // that was set when the modal opened or last auto-generated.
      if (number === '' || latestAutoNumber !== initialLatestAutoNumberRef.current) {
        setNumber(latestAutoNumber);
        initialLatestAutoNumberRef.current = latestAutoNumber; // Update ref for subsequent comparisons
      }
    }
  }, [latestAutoNumber, hasUserEditedNumber, number]); // Add number to dependencies

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
    setHasUserEditedNumber(true); // User has typed, so set this to true
  };

  const handleGenerateNumber = () => {
    const generatedNumber = onGenerateNumber();
    setNumber(generatedNumber);
    setHasUserEditedNumber(false); // Reset when auto-generating
    initialLatestAutoNumberRef.current = generatedNumber; // Update ref with newly generated number
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!number && !date) {
      setError('Vui lòng nhập ít nhất Số hoặc Ngày.');
      return;
    }

    onSave({ number, date });
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
                    onChange={handleNumberChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số"
                    disabled={isSaving || isGeneratingNumber}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateNumber}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving || isGeneratingNumber}
                >
                  {isGeneratingNumber ? (
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
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSaving}
                />
              </div>
              {date && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDateForDisplay(date)}
                </p>
              )}
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