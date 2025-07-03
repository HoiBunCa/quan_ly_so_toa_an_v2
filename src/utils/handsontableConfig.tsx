import { CaseType, Case } from '../types/caseTypes';
import { HotTableProps } from '@handsontable/react';
import Handsontable from 'handsontable';
import { formatDateForDisplay } from './dateUtils'; // Import new utility
import toast from 'react-hot-toast'; // Import toast for error messages
import { authenticatedFetch } from './api'; // Import authenticatedFetch

interface GetHandsontableConfigArgs {
  caseType: CaseType;
  filteredCases: Case[];
  refreshData: () => Promise<void>; // New prop to trigger data refresh
  setSelectedRows: (ids: string[]) => void;
  onUpdateCase: (caseId: string, prop: string, newValue: any) => Promise<void>;
  accessToken: string | null; // Add accessToken
  logout: () => void; // Add logout
}

// Custom renderer for multi-line text (like plaintiff info)
function multiLineTextRenderer(instance: any, td: HTMLElement, row: number, col: number, prop: string, value: any, cellProperties: Handsontable.CellProperties) {
  // Apply default text renderer first
  Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

  // Custom formatting for 'thong_tin_nguoi_khoi_kien', 'thong_tin_nguoi_bi_kien', 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan' and other combined fields
  if (prop === 'thong_tin_nguoi_khoi_kien' || prop === 'thong_tin_nguoi_bi_kien' || prop === 'thong_tin_nguoi_co_quyen_loi_va_nghia_vu_lien_quan') {
    if (typeof value === 'string') {
      const lines = value.split('\n');
      let formattedValue = '';
      if (lines.length >= 1 && lines[0]) {
        formattedValue += `Họ tên: ${lines[0]}`;
      }
      if (lines.length >= 2 && lines[1]) {
        formattedValue += `\nNăm sinh: ${lines[1]}`;
      }
      if (lines.length >= 3 && lines[2]) {
        formattedValue += `\nĐịa chỉ: ${lines[2]}`;
      }
      // Update the innerHTML of the cell with the formatted value
      td.innerHTML = formattedValue;
    }
  } else if (prop.startsWith('thong_tin_') && typeof value === 'string') {
    // For other combined number/date/text fields
    const lines = value.split('\n');
    let formattedValue = '';
    if (lines.length >= 1 && lines[0]) {
      formattedValue += `${lines[0]}`; // "Số: [number]"
    }
    if (lines.length >= 2 && lines[1]) {
      // Ensure the date part is formatted for display
      const datePart = lines[1].startsWith('Ngày: ') ? lines[1].substring('Ngày: '.length) : lines[1];
      formattedValue += `\nNgày: ${formatDateForDisplay(datePart)}`;
    }
    if (lines.length >= 3 && lines[2]) {
      formattedValue += `\n${lines[2]}`; // "Nơi nhận/Cơ quan: [text]"
    }
    td.innerHTML = formattedValue;
  } else if (prop === 'hoi_dong_xet_xu' && typeof value === 'string') {
    // Specific handling for 'hoi_dong_xet_xu' if it's multi-line but not number/date
    td.innerHTML = value;
  }

  td.style.whiteSpace = 'pre-wrap'; // Ensure text wraps
  td.style.wordBreak = 'break-word'; // Break long words
  td.style.verticalAlign = 'top'; // Align text to top
}

// Custom renderer for date fields to display DD-MM-YYYY
function dateDisplayRenderer(instance: any, td: HTMLElement, row: number, col: number, prop: string, value: any, cellProperties: Handsontable.CellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

  if (value && typeof value === 'string') {
    td.innerText = formatDateForDisplay(value); // Use the centralized utility
  }
}

export function getHandsontableConfig({
  caseType,
  filteredCases,
  refreshData, // Now receiving refreshData callback
  setSelectedRows,
  onUpdateCase,
  accessToken, // Destructure accessToken
  logout, // Destructure logout
}: GetHandsontableConfigArgs): Pick<HotTableProps, 'columns' | 'settings'> {

  const columns = caseType.attributes.map(attr => {
    const baseColumn: Handsontable.ColumnSettings = {
      data: attr.id,
      title: attr.name, // Use attr.name directly for the header title
      width: attr.width || 120,
      readOnly: attr.id === 'caseNumber' || attr.id.startsWith('thong_tin_') || attr.id === 'hoi_dong_xet_xu', // Make all combined info fields and hoi_dong_xet_xu read-only
      className: attr.id === 'caseNumber' ? 'font-medium text-blue-600' : ''
    };

    switch (attr.type) {
      case 'dropdown':
        return {
          ...baseColumn,
          type: 'dropdown',
          source: attr.options || [],
          renderer: attr.id === 'status' || attr.options?.includes('Có') || attr.options?.includes('Không') ? (instance: any, td: HTMLElement, row: number, col: number, prop: string, value: string) => {
            const statusColors: { [key: string]: string } = {
              'Đã thụ lý': 'bg-blue-100 text-blue-800',
              'Đang giải quyết': 'bg-yellow-100 text-yellow-800',
              'Đã hòa giải': 'bg-green-100 text-green-800',
              'Đã trả lại đơn': 'bg-red-100 text-red-800',
              'Đã chuyển': 'bg-purple-100 text-purple-800',
              'Filed': 'bg-blue-100 text-blue-800',
              'In Progress': 'bg-yellow-100 text-yellow-800',
              'Settled': 'bg-green-100 text-green-800',
              'Dismissed': 'bg-gray-100 text-gray-800',
              'Judgment': 'bg-purple-100 text-purple-800',
              'Closed': 'bg-gray-100 text-gray-800',
              'Active': 'bg-green-100 text-green-800',
              'Inactive': 'bg-red-100 text-red-800',
              'Có': 'bg-green-100 text-green-800', // For boolean 'Có'
              'Không': 'bg-red-100 text-red-800', // For boolean 'Không'
            };
            
            const colorClass = statusColors[value] || 'bg-gray-100 text-gray-800';
            td.innerHTML = `<span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">${value}</span>`;
            return td;
          } : undefined,
        };
      case 'date':
        return {
          ...baseColumn,
          type: 'date',
          dateFormat: 'YYYY-MM-DD', 
          correctFormat: true,
          renderer: dateDisplayRenderer,
        };
      case 'number':
        return {
          ...baseColumn,
          type: 'numeric',
        };
      case 'textarea':
        return {
          ...baseColumn,
          type: 'text',
          renderer: multiLineTextRenderer,
        };
      default: // For 'text' type
        return {
          ...baseColumn,
          type: 'text',
        };
    }
  });

  const settings: Handsontable.GridSettings = {
    rowHeaders: false,
    colHeaders: true,
    contextMenu: {
      items: {
        'row_above': {},
        'row_below': {},
        'hsep1': '---------',
        'remove_row': {
          name: 'Xóa hàng đã chọn',
          callback: async function(this: Handsontable, key: string, selection: any, clickEvent: any) {
            const hotInstance = this;
            const selectedRanges = hotInstance.getSelected();

            let idsToDelete: string[] = [];

            if (!selectedRanges || selectedRanges.length === 0) {
                const clickedCell = hotInstance.getSelectedLast();
                if (clickedCell) {
                    const clickedRowIndex = clickedCell[0];
                    const caseItem = filteredCases[clickedRowIndex];
                    if (caseItem && caseItem.id) {
                        idsToDelete.push(caseItem.id);
                    }
                }
            } else {
                const uniqueRowIndices = new Set<number>();
                selectedRanges.forEach(range => {
                    const [startRow, , endRow, ] = range;
                    for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
                        uniqueRowIndices.add(i);
                    }
                });
                Array.from(uniqueRowIndices).sort((a, b) => a - b).forEach(rowIndex => {
                    const caseItem = filteredCases[rowIndex];
                    if (caseItem && caseItem.id) {
                        idsToDelete.push(caseItem.id);
                    }
                });
            }

            if (idsToDelete.length === 0) {
                toast.info('Vui lòng chọn ít nhất một hàng để xóa.');
                return;
            }

            const confirmation = confirm(`Bạn có chắc chắn muốn xóa ${idsToDelete.length} vụ án đã chọn? Hành động này không thể hoàn tác.`);
            if (!confirmation) {
                return;
            }

            let successfulDeletions = 0;
            const failedDeletions: string[] = [];

            for (const caseId of idsToDelete) {
                try {
                    let deleteUrl = '';
                    if (caseType.id === 'HON_NHAN') {
                        deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-don-khoi-kien/${caseId}/`;
                    } else if (caseType.id === 'GIAI_QUYET_TRANH_CHAP_HOA_GIAI') {
                        deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-giai-quyet-tranh-chap-duoc-hoa-giai-tai-toa-an/${caseId}/`;
                    } else if (caseType.id === 'TO_TUNG') { // New case type
                        deleteUrl = `http://localhost:8003/home/api/v1/so-thu-ly-to-tung/${caseId}/`;
                    }
                    else {
                        console.warn(`Deletion not supported for case type: ${caseType.id}`);
                        failedDeletions.push(caseId);
                        continue;
                    }

                    const response = await authenticatedFetch(deleteUrl, accessToken, logout, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
                    }
                    successfulDeletions++;
                } catch (e: any) {
                    console.error(`Failed to delete case ${caseId}:`, e);
                    const failedCase = filteredCases.find(c => c.id === caseId);
                    failedDeletions.push(failedCase?.caseNumber || caseId);
                }
            }

            if (successfulDeletions > 0) {
                toast.success(`Đã xóa thành công ${successfulDeletions} vụ án.`);
                // Call the refreshData callback passed from CaseManagement
                if (typeof refreshData === 'function') {
                    refreshData();
                }
            }
            if (failedDeletions.length > 0) {
                toast.error(`Không thể xóa các vụ án: ${failedDeletions.join(', ')}. Vui lòng kiểm tra console để biết thêm chi tiết.`);
            }
          }
        },
        'hsep2': '---------',
        'undo': {},
        'redo': {},
        'cut': {},
        'copy': {},
        'paste': {}
      }
    },
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: false,
    sortIndicator: true,
    columnSorting: true,
    filters: true,
    dropdownMenu: true,
    hiddenColumns: {
      indicators: true
    },
    licenseKey: 'non-commercial-and-evaluation',
    height: 'auto',
    maxRows: 100000,
    stretchH: 'all',
    autoWrapRow: true,
    autoWrapCol: true,
    afterChange: async (changes: any, source: string) => {
      if (source === 'loadData') {
        return;
      }
      if (changes) {
        for (const [rowIndex, prop, oldValue, newValue] of changes) {
          const changedCaseInFilteredData = filteredCases[rowIndex];
          
          // Only update if the property is NOT a combined info field
          if (oldValue !== newValue && changedCaseInFilteredData && !String(prop).startsWith('thong_tin_') && prop !== 'hoi_dong_xet_xu') {
            const caseId = changedCaseInFilteredData.id;
            await onUpdateCase(caseId, prop, newValue);
          }
        }
      }
    },
    afterSelection: (row: number, column: number, row2: number, column2: number) => {
      const selectedCaseIds: string[] = [];
      for (let i = Math.min(row, row2); i <= Math.max(row, row2); i++) {
        const caseItem = filteredCases[i];
        if (caseItem && caseItem.id) {
          selectedCaseIds.push(caseItem.id);
        }
      }
      setSelectedRows(selectedCaseIds);
    },
    afterRenderer: (TD, row, col, prop, value, cellProperties) => {
      const caseItem = filteredCases[row];
      if (caseItem && caseItem.id) {
        TD.setAttribute('data-id', caseItem.id);
      }
    }
  };

  return { columns, settings };
}