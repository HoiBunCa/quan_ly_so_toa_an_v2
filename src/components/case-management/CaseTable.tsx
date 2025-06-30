import React, { useRef, useEffect, useCallback } from 'react';
import { HotTable } from '@handsontable/react';
import { Loader2, AlertCircle, FileText, Plus } from 'lucide-react';
import { Case } from '../../types/caseTypes';
import { HotTableProps } from 'handsontable/plugins/contextMenu';
import Handsontable from 'handsontable'; // Import Handsontable for hooks
import toast from 'react-hot-toast'; // Import toast for error messages

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
  onCellClick: (caseId: string, prop: string, value: any) => void;
  deleteCases: (ids: string[]) => Promise<void>; // Add deleteCases prop
  setSelectedRows: (ids: string[]) => void; // Add setSelectedRows prop
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
  deleteCases, // Destructure deleteCases
  setSelectedRows, // Destructure setSelectedRows
}: CaseTableProps) {
  const hotTableRef = useRef<HotTable>(null);
  const dataRef = useRef<Case[]>(data); // Ref to keep track of the latest data
  const deleteCasesRef = useRef<(ids: string[]) => Promise<void>>(deleteCases); // Ref for deleteCases function

  // Update refs when props change
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    deleteCasesRef.current = deleteCases;
  }, [deleteCases]);

  // Make handleCellMouseDown stable using useCallback
  const handleCellMouseDown = useCallback((event: MouseEvent, coords: Handsontable.CellCoords) => {
    const hotInstance = hotTableRef.current?.hotInstance; // Access current instance here
    // Check if it's a left click and not a header, and if hotInstance exists
    if (event.button === 0 && coords.row >= 0 && coords.col >= 0 && hotInstance) {
      const prop = hotInstance.colToProp(coords.col);
      const caseItem = dataRef.current[coords.row]; // Use dataRef.current
      
      // Check if the property starts with 'thong_tin_' (our convention for combined fields)
      if (prop.startsWith('thong_tin_') && caseItem) { 
        onCellClick(caseItem.id, prop, caseItem[prop]);
        event.preventDefault(); // Prevent Handsontable's default editor from opening
        event.stopImmediatePropagation(); // Stop further propagation
      }
    }
  }, [onCellClick]); // Dependencies for useCallback

  useEffect(() => {
    const hotInstance = hotTableRef.current?.hotInstance;

    if (hotInstance) {
      hotInstance.addHook('afterOnCellMouseDown', handleCellMouseDown);

      // Define the context menu hook here
      const handleBeforeContextMenuShow = (coords: Handsontable.CellCoords[], menuItems: Handsontable.contextMenu.MenuItemConfig[]) => {
        // Find and remove the default 'remove_row' item if it exists
        const defaultRemoveRowIndex = menuItems.findIndex(item => (item as any).key === 'remove_row');
        if (defaultRemoveRowIndex !== -1) {
          menuItems.splice(defaultRemoveRowIndex, 1);
        }

        // Add our custom 'remove_row' item
        menuItems.push({
          key: 'remove_row',
          name: 'Xóa hàng đã chọn',
          callback: function(this: Handsontable, key: string, selection: any, clickEvent: any) {
            const hot = this;
            const selectedRange = hot.getSelectedLast();

            if (selectedRange) {
              const [startRow, , endRow, ] = selectedRange;
              const rowIndicesToDelete: number[] = [];
              for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
                rowIndicesToDelete.push(i);
              }

              const idsFromSelection: string[] = [];
              rowIndicesToDelete.forEach(rowIndex => {
                const caseItem = dataRef.current[rowIndex]; // Use dataRef.current
                if (caseItem && caseItem.id) {
                  idsFromSelection.push(caseItem.id);
                }
              });

              if (typeof deleteCasesRef.current === 'function') {
                deleteCasesRef.current(idsFromSelection);
              } else {
                console.error('deleteCasesRef.current is not a function in context menu callback!', deleteCasesRef.current);
                toast.error('Lỗi: Không thể xóa vụ án. Chức năng xóa không khả dụng.');
              }
            }
          }
        });
      };

      hotInstance.addHook('beforeContextMenuShow', handleBeforeContextMenuShow);

      return () => {
        if (hotTableRef.current?.hotInstance) {
          hotTableRef.current.hotInstance.removeHook('afterOnCellMouseDown', handleCellMouseDown);
          hotTableRef.current.hotInstance.removeHook('beforeContextMenuShow', handleBeforeContextMenuShow);
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
              settings={{
                ...settings, // Spread existing settings
                // Override contextMenu here to ensure it's handled by CaseTable
                contextMenu: {
                  items: {
                    'row_above': {},
                    'row_below': {},
                    'hsep1': '---------',
                    // 'remove_row' will be added dynamically by beforeContextMenuShow hook
                    'hsep2': '---------',
                    'undo': {},
                    'redo': {},
                    'cut': {},
                    'copy': {},
                    'paste': {}
                  }
                },
                afterSelection: (row: number, column: number, row2: number, column2: number) => {
                  const selectedCaseIds: string[] = [];
                  for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
                    const caseItem = dataRef.current[i]; // Use dataRef.current
                    if (caseItem && caseItem.id) {
                      selectedCaseIds.push(caseItem.id);
                    }
                  }
                  setSelectedRows(selectedCaseIds);
                },
              }}
              height="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
}