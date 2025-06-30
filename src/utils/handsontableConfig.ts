import { CaseType, Case } from '../types/caseTypes';
import { HotTableProps } from '@handsontable/react';
import Handsontable from 'handsontable';

interface GetHandsontableConfigArgs {
  caseType: CaseType;
  filteredCases: Case[];
  deleteCases: (ids: string[]) => Promise<void>;
  setSelectedRows: (ids: string[]) => void;
  onUpdateCase: (caseId: string, prop: string, newValue: any) => Promise<void>;
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
          } : undefined
        };
      case 'date':
        return {
          ...baseColumn,
          type: 'date',
          dateFormat: 'YYYY-MM-DD'
        };
      case 'number':
        return {
          ...baseColumn,
          type: 'numeric'
        };
      case 'textarea':
        return {
          ...baseColumn,
          type: 'text',
          renderer: (instance: any, td: HTMLElement, row: number, col: number, prop: string, value: string) => {
            td.innerHTML = value ? value.replace(/\n/g, '<br>') : '';
            return td;
          },
          editor: 'textarea'
        };
      default:
        return {
          ...baseColumn,
          type: 'text'
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
          
          if (oldValue !== newValue && changedCaseInFilteredData) {
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