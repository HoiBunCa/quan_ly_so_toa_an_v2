import React, { useRef, useEffect, useCallback } from 'react'; // Import useCallback
import { HotTable } from '@handsontable/react';
import { Loader2, AlertCircle, FileText, Plus } from 'lucide-react';
import { Case } from '../../types/caseTypes';
import { HotTableProps } from 'handsontable/plugins/contextMenu';
import Handsontable from 'handsontable'; // Import Handsontable for hooks

interface CaseTableProps {
  data: Case[];
  columns: HotTableProps['columns'];
  settings: HotTableProps['settings'];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  filteredCount: number;
  totalCount: number;
  onAddCase: () => void;
  onCellClick: (caseId: string, prop: string, value: any) => void; // New prop for cell clicks
}

export default function CaseTable({
  data,
  columns,
  settings,
  isLoading,
  error,
  searchTerm,
  filteredCount,
  totalCount,
  onAddCase,
  onCellClick,
}: CaseTableProps) {
  const hotTableRef = useRef<HotTable>(null);

  // Make handleCellMouseDown stable using useCallback
  const handleCellMouseDown = useCallback((event: MouseEvent, coords: Handsontable.CellCoords) => {
    const hotInstance = hotTableRef.current?.hotInstance; // Access current instance here
    // Check if it's a left click and not a header, and if hotInstance exists
    if (event.button === 0 && coords.row >= 0 && coords.col >= 0 && hotInstance) {
      const prop = hotInstance.colToProp(coords.col);
      const caseItem = data[coords.row]; // `data` is a dependency, so this function needs to be in useCallback deps
      
      if (prop === 'thong_tin_nguoi_khoi_kien' && caseItem) {
        onCellClick(caseItem.id, prop, caseItem[prop]);
        event.preventDefault(); // Prevent Handsontable's default editor from opening
        event.stopImmediatePropagation(); // Stop further propagation
      }
    }
  }, [data, onCellClick]); // Dependencies for useCallback

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;

    if (hotInstance) {
      hotInstance.addHook('afterOnCellMouseDown', handleCellMouseDown);

      return () => {
        // Ensure the instance still exists before trying to remove the hook
        // This check is crucial for preventing errors during unmount
        if (hotTableRef.current?.hotInstance) {
          hotTableRef.current.hotInstance.removeHook('afterOnCellMouseDown', handleCellMouseDown);
        }
      };
    }
  }, [handleCellMouseDown]); // Now useEffect depends on the stable handleCellMouseDown

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <span>Đang tải vụ án...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-6 h-6 mr-3" />
            <span>Lỗi: {error}</span>
          </div>
        ) : filteredCount === 0 ? (
          <div className="text-center py-12 flex flex-col justify-center items-center h-full">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy vụ án nào</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Hãy thử điều chỉnh bộ lọc của bạn để xem thêm kết quả.'
                : 'Thêm vụ án mới để bắt đầu quản lý.'}
            </p>
            {!searchTerm && (
              <button
                onClick={onAddCase}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm vụ án mới</span>
              </button>
            )}
          </div>
        ) : (
          <div className="handsontable-container h-full">
            <HotTable
              ref={hotTableRef}
              data={data}
              columns={columns}
              settings={settings}
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}