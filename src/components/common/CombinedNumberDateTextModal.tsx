import React, { useState, useEffect, useRef } from 'react';
import { X, Hash, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { formatDateForDisplay } from '../../utils/dateUtils';

interface CombinedNumberDateTextModalProps {
  title: string;
  initialNumber: string;
  initialDate: string;
  initialText: string;
  numberLabel?: string;
  dateLabel?: string;
  textLabel?: string;
  onSave: (data: { number: string; date: string; text: string }) => void;
  onClose: () => void;
  isSaving: boolean;
  onGenerateNumber?: (fieldKey: string) => string; // Optional: for auto-generating number
  isGeneratingNumber?: boolean; // Optional: loading state for number generation
  latestAutoNumber?: string | null; // Optional: latest auto-generated number
  numberFieldKey?: string; // Optional: key for the number field to pass to onGenerateNumber
}

export default function CombinedNumberDateTextModal({
  title,
  initialNumber,
  initialDate,
  initialText,
  numberLabel = 'Số',
  dateLabel = 'Ngày',
  textLabel = 'Nơi nhận/Cơ quan',
  onSave,
  onClose,
  isSaving,
  onGenerateNumber,
  isGeneratingNumber = false,
  latestAutoNumber,
  numberFieldKey,
}: CombinedNumberDateTextModalProps) {
  const [number, setNumber] = useState(initialNumber);
  const [date, setDate] = useState(initialDate);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');
  const [hasUserEditedNumber, setHasUserEditedNumber] = useState(false);

  const initialLatestAutoNumberRef = useRef(latestAutoNumber);

  useEffect(() => {
    setNumber(initialNumber);
    setDate(initialDate);
    setText(initialText);
    setHasUserEditedNumber(false);
    initialLatestAutoNumberRef.current = latestAutoNumber;
  }, [initialNumber, initialDate, initialText, latestAutoNumber]);

  useEffect(() => {
    if (!hasUserEditedNumber && latestAutoNumber !== null && latestAutoNumber !== undefined && latestAutoNumber !== number) {
      if (number === '' || latestAutoNumber !== initialLatestAutoNumberRef.current) {
        setNumber(latestAutoNumber);
        initialLatestAutoNumberRef.current = latestAutoNumber;
      }
    }
  }, [latestAutoNumber, hasUserEditedNumber, number]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(e.target.value);
    setHasUserEditedNumber(true);
  };

  const handleGenerateNumberClick = () => {
    if (onGenerateNumber && numberFieldKey) {
      const generatedNumber = onGenerateNumber(numberFieldKey);
      setNumber(generatedNumber);
      setHasUserEditedNumber(false);
      initialLatestAutoNumberRef.current = generatedNumber;
      toast('Tự động lấy số.');
    } else {
      console.warn('onGenerateNumber or numberFieldKey not provided for auto-generation.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!number && !date && !text) {
      setError('Vui lòng nhập ít nhất một trường thông tin.');
      return;
    }

    onSave({ number, date, text });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
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
                {numberLabel}
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
                    placeholder={`Nhập ${numberLabel.toLowerCase()}`}
                    disabled={isSaving || isGeneratingNumber}
                  />
                </div>
                {onGenerateNumber && numberFieldKey && (
                  <button
                    type="button"
                    onClick={handleGenerateNumberClick}
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
                )}
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                {dateLabel}
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                />
              </div>
              {date && (
                <p className="text-xs text-gray-500 mt-1">
                  Định dạng hiển thị: {formatDateForDisplay(date)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                {textLabel}
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Nhập ${textLabel.toLowerCase()}`}
                  rows={3}
                  disabled={isSaving}
                ></textarea>
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