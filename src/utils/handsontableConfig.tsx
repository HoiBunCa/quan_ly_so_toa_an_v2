import { CaseType, Case } from '../types/caseTypes';
import { HotTableProps } from '@handsontable/react';
import Handsontable from 'handsontable';
import { Text, Calendar, Hash, ListFilter, FileText } from 'lucide-react'; // Import necessary icons
import ReactDOMServer from 'react-dom/server'; // To render React components to HTML string

interface GetHandsontableConfigArgs {
  caseType: CaseType;
  filteredCases: Case[];
  deleteCases: (ids: string[]) => Promise<void>;
  setSelectedRows: (ids: string[]) => void;
  onUpdateCase: (caseId: string, prop: string, newValue: any) => Promise<void>;
}

// Custom renderer for multi-line text (like plaintiff info)
function multiLineTextRenderer(instance: any, td: HTMLElement, row: number, col: number, prop: string, value: any, cellProperties: Handsontable.CellProperties) {
  // Apply default text renderer first
  Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

  // Custom formatting for 'thong_tin_nguoi_khoi_kien', 'thong_tin_nguoi_bi_kien', and other combined fields
  if (prop === 'thong_tin_nguoi_khoi_kien' || prop === 'thong_tin_nguoi_bi_kien') {
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
    // For other combined number/date fields
    const lines = value.split('\n');
    let formattedValue = '';
    if (lines.length >= 1 && lines[0]) {
      formattedValue += `${lines[0]}`; // "Số: [number]"
    }
    if (lines.length >= 2 && lines[1]) {
      formattedValue += `\n${lines[1]}`; // "Ngày: [date]"
    }
    td.innerHTML = formattedValue;
  }

  td.style.whiteSpace = 'pre-wrap'; // Ensure text wraps
  td.style.wordBreak = 'break-word'; // Break long words
  td.style.verticalAlign = 'top'; // Align text to top
}

// Custom renderer for date fields to display DD-MM-YYYY
function dateDisplayRenderer(instance: any, td: HTMLElement, row: number, col: number, prop: string, value: any, cellProperties: Handsontable.CellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

  if (value && typeof value === 'string') {
    const parts = value.split('-'); // Assuming value is YYYY-MM-DD
    if (parts.length === 3) {
      td.innerText = `${parts[2]}-${parts[1]}-${parts[0]}`; // Format to DD-MM-YYYY
    }
  }
}

export function getHandsontableConfig({
  caseType,
  filteredCases,
  deleteCases,
  setSelectedRows,
  onUpdateCase,
}: GetHandsontableConfigArgs): Pick<HotTableProps, 'columns' | 'settings'> {

  const columns = caseType.attributes.map(attr => {
    const baseColumn: Handsontable.ColumnSettings = {
      data: attr.id,
      title: attr.name,
      width: attr.width || 120,
      readOnly: attr.id === 'caseNumber', 
      className: attr.id === 'caseNumber' ? 'font-medium text-blue-600' : ''
    };

    switch (attr.type) {
      case 'dropdown':
        return {
          ...baseColumn,
          type: 'dropdown',
          source: attr.options || [],
          renderer: attr.id === 'status' ? (instance: any, td: HTMLElement, row: number, col: number, prop: string, value: string) => {
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
              'Inactive': 'bg-red-100 text-red-800'
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
    colHeaders: (colIndex: number) => {
      const column = columns[colIndex];
      if (!column) return '';
      const attrId = column.data as string;
      const attr = caseType.attributes.find(a => a.id === attrId);
      const iconMap = {
        text: <Text className="w-4 h-4 mr-1 text-gray-500" />,
        number: <Hash className="w-4 h-4 mr-1 text-gray-500" />,
        date: <Calendar className="w-4 h-4 mr-1 text-gray-500" />,
        dropdown: <ListFilter className="w-4 h-4 mr-1 text-gray-500" />,
        textarea: <FileText className="w-4 h-4 mr-1 text-gray-500" />
      };
      const icon = iconMap[attr?.type || 'text'];
      return ReactDOMServer.renderToStaticMarkup(
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {icon}
          <span style={{ fontWeight: 600, color: '#374151' }}>{attr?.name || ''}</span>
        </span>
      );
    },
    contextMenu: {
      items: {
        'row_above': {},
        'row_below': {},
        'hsep1': '---------',
        'remove_row': {
          name: 'Xóa hàng đã chọn',
          callback: function(key: string, selection: any, clickEvent: any) {
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
                const caseItem = filteredCases[rowIndex];
                if (caseItem && caseItem.id) {
                  idsFromSelection.push(caseItem.id);
                }
              });
              deleteCases(idsFromSelection);
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
          if (oldValue !== newValue && changedCaseInFilteredData && !String(prop).startsWith('thong_tin_')) {
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