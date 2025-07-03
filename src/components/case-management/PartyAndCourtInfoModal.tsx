import React, { useState, useEffect } from 'react';
import { X, User, Home, AlertCircle, Loader2 } from 'lucide-react';

interface PartyAndCourtInfo {
  partyName: string;
  courtAddress: string;
}

interface PartyAndCourtInfoModalProps {
  initialData: PartyAndCourtInfo;
  onSave: (data: PartyAndCourtInfo) => void;
  onClose: () => void;
  isSaving: boolean;
}

export default function PartyAndCourtInfoModal({ initialData, onSave, onClose, isSaving }: PartyAndCourtInfoModalProps) {
  const [partyName, setPartyName] = useState(initialData.partyName);
  const [courtAddress, setCourtAddress] = useState(initialData.courtAddress);
  const [error, setError] = useState('');

  useEffect(() => {
    setPartyName(initialData.partyName);
    setCourtAddress(initialData.courtAddress);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!partyName && !courtAddress) {
      setError('Vui lòng nhập ít nhất Họ tên đương sự lựa chọn hoặc TAND nơi quản lý hoà giải viên.');
      return;
    }

    onSave({ partyName, courtAddress });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Chỉnh sửa Thông tin đương sự lựa chọn và Toà án quản lý
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
              <label htmlFor="partyName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên đương sự lựa chọn
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="partyName"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập họ tên đương sự lựa chọn"
                  disabled={isSaving}
                />
              </div>
            </div>

            <div>
              <label htmlFor="courtAddress" className="block text-sm font-medium text-gray-700 mb-2">
                TAND nơi quản lý hoà giải viên
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <textarea
                  id="courtAddress"
                  value={courtAddress}
                  onChange={(e) => setCourtAddress(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập TAND nơi quản lý hoà giải viên"
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