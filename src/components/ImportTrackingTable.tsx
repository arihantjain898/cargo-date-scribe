import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
import { useTableColumns, ColumnConfig } from '../hooks/useTableColumns';
import TableColumnManager from './TableColumnManager';
import ResizableTableHeader from './ResizableTableHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ImportTrackingTableProps {
  data: ImportTrackingRecord[];
  updateRecord: (id: string, field: keyof ImportTrackingRecord, value: any) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImportTrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: ImportTrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof ImportTrackingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialColumns: ColumnConfig[] = [
    { id: 'reference', label: 'Reference', visible: true, width: 80, minWidth: 70 },
    { id: 'file', label: 'File', visible: true, width: 60, minWidth: 50 },
    { id: 'etaFinalPod', label: 'ETA (Final POD)', visible: true, width: 90, minWidth: 80 },
    { id: 'bond', label: 'Bond', visible: true, width: 80, minWidth: 70 },
    { id: 'poa', label: 'POA', visible: true, width: 60, minWidth: 50, group: 'Documentation' },
    { id: 'isf', label: 'ISF', visible: true, width: 60, minWidth: 50, group: 'Documentation' },
    { id: 'packingListCommercialInvoice', label: 'Packing List & CI', visible: true, width: 100, minWidth: 90, group: 'Documentation' },
    { id: 'billOfLading', label: 'Bill of Lading', visible: true, width: 90, minWidth: 80, group: 'Documentation' },
    { id: 'arrivalNotice', label: 'Arrival Notice', visible: true, width: 90, minWidth: 80, group: 'Documentation' },
    { id: 'isfFiled', label: 'ISF Filed', visible: true, width: 70, minWidth: 60, group: 'Processing' },
    { id: 'entryFiled', label: 'Entry Filed', visible: true, width: 80, minWidth: 70, group: 'Processing' },
    { id: 'blRelease', label: 'BL Release', visible: true, width: 80, minWidth: 70, group: 'Processing' },
    { id: 'customsRelease', label: 'Customs Release', visible: true, width: 100, minWidth: 90, group: 'Processing' },
    { id: 'invoiceSent', label: 'Invoice Sent?', visible: true, width: 80, minWidth: 70, group: 'Final Steps' },
    { id: 'paymentReceived', label: 'Payment Rec\'d?', visible: true, width: 100, minWidth: 90, group: 'Final Steps' },
    { id: 'workOrderSetup', label: 'W/O Set Up', visible: true, width: 80, minWidth: 70, group: 'Final Steps' },
    { id: 'deliveryDate', label: 'Delivery Date', visible: true, width: 90, minWidth: 80 },
    { id: 'notes', label: 'Notes', visible: true, width: 80, minWidth: 70 },
  ];

  const {
    columns,
    collapsedGroups,
    toggleColumnVisibility,
    updateColumnWidth,
    toggleGroup,
    getVisibleColumns
  } = useTableColumns(initialColumns);

  const visibleColumns = getVisibleColumns();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

  const startEdit = (id: string, field: keyof ImportTrackingRecord, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: any = editValue;

      if (field === 'poa' || field === 'isf' || field === 'packingListCommercialInvoice' ||
          field === 'billOfLading' || field === 'arrivalNotice' || field === 'isfFiled' ||
          field === 'entryFiled' || field === 'blRelease' || field === 'customsRelease' ||
          field === 'invoiceSent' || field === 'paymentReceived' || field === 'workOrderSetup') {
        value = editValue === 'true';
      }

      updateRecord(id, field, value);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const getRowConditionalClasses = (record: ImportTrackingRecord): string => {
    if (isDateOverdue(record.etaFinalPod)) {
      return 'bg-red-50 border-red-200';
    }
    if (isDateWithinDays(record.etaFinalPod, 3)) {
      return 'bg-amber-50 border-amber-200';
    }
    return '';
  };

  const renderCell = (record: ImportTrackingRecord, field: keyof ImportTrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 px-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-4 text-[10px] min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-3 w-3 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-2 w-2 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-3 w-3 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-2 w-2 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      const getStatusLabels = (field: keyof ImportTrackingRecord) => {
        switch (field) {
          case 'poa': return { true: '✅ Received', false: '⚠ Missing' };
          case 'isf': return { true: '✅ Received', false: '⚠ Missing' };
          case 'packingListCommercialInvoice': return { true: '✅ Received', false: '⏳ Pending' };
          case 'billOfLading': return { true: '✅ Received', false: '⏳ Pending' };
          case 'arrivalNotice': return { true: '✅ Received', false: '⏳ Pending' };
          case 'isfFiled': return { true: '✅ Filed', false: '⏳ Pending' };
          case 'entryFiled': return { true: '✅ Filed', false: '⏳ Pending' };
          case 'blRelease': return { true: '✅ Released', false: '⏳ Pending' };
          case 'customsRelease': return { true: '✅ Cleared', false: '⏳ Pending' };
          case 'invoiceSent': return { true: '✅ Sent', false: '⏳ Pending' };
          case 'paymentReceived': return { true: '✅ Received', false: '⏳ Pending' };
          case 'workOrderSetup': return { true: '✅ Set Up', false: '⏳ Pending' };
          default: return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const variant = Boolean(value) ? 'success' : 'secondary';
      
      return (
        <div 
          className="flex items-center justify-center cursor-pointer"
          onClick={() => updateRecord(record.id, field, !value)}
        >
          <StatusBadge
            status={Boolean(value)}
            trueLabel={labels.true}
            falseLabel={labels.false}
            variant={variant}
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1 rounded transition-all duration-200 min-h-[20px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-[10px] truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-1 rounded text-[9px]' :
          value ? 'text-gray-800' : 'text-gray-300 opacity-50'
        }`}>
          {String(value) || ''}
        </span>
        <Edit3 className="h-2 w-2 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">Import Tracking</h3>
        <TableColumnManager
          columns={columns}
          collapsedGroups={collapsedGroups}
          onToggleColumn={toggleColumnVisibility}
          onToggleGroup={toggleGroup}
        />
      </div>
      
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div style={{ minWidth: `${visibleColumns.reduce((sum, col) => sum + col.width, 100)}px` }}>
          <table className="w-full border-collapse text-[10px]">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b border-gray-300 bg-white">
                <th className="bg-gray-100 border-r border-gray-300 p-1 text-center font-bold text-gray-900 w-8 sticky left-0 z-40">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </th>
                <th className="bg-gray-100 border-r border-gray-300 p-1 text-center font-bold text-gray-900 w-10 sticky left-8 z-40">
                  Del
                </th>
                <ResizableTableHeader
                  width={80}
                  minWidth={70}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-18 z-40"
                >
                  Reference
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={60}
                  minWidth={50}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-[98px] z-40"
                >
                  File
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={90}
                  minWidth={80}
                  onResize={() => {}}
                  className="bg-blue-100 border-r-2 border-gray-500 p-1 text-left font-bold text-gray-900 sticky left-[158px] z-40"
                >
                  ETA (Final POD)
                </ResizableTableHeader>
                
                {visibleColumns.filter(col => !['reference', 'file', 'etaFinalPod'].includes(col.id)).map((column) => (
                  <ResizableTableHeader
                    key={column.id}
                    width={column.width}
                    minWidth={column.minWidth}
                    onResize={(width) => updateColumnWidth(column.id, width)}
                    className="border-r border-gray-300 p-1 text-center font-bold text-gray-900 bg-gray-50"
                  >
                    {column.label}
                  </ResizableTableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => {
                const conditionalClasses = getRowConditionalClasses(record);
                return (
                  <tr
                    key={record.id}
                    className={`border-b border-gray-100 transition-all duration-200 ${
                      conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-25')
                    }`}
                  >
                    <td className="p-1 text-center border-r border-gray-200 sticky left-0 z-20 bg-inherit">
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                        className="h-3 w-3"
                      />
                    </td>
                    <td className="p-1 text-center border-r border-gray-200 sticky left-8 z-20 bg-inherit">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 hover:bg-red-50 rounded-full">
                            <Trash2 className="h-2 w-2 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this record for {record.reference}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteRecord(record.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                    
                    <td className="border-r border-gray-200 p-1 sticky left-18 z-20 bg-inherit" style={{ width: '80px' }}>
                      {renderCell(record, 'reference')}
                    </td>
                    <td className="border-r border-gray-200 p-1 sticky left-[98px] z-20 bg-inherit" style={{ width: '60px' }}>
                      {renderCell(record, 'file')}
                    </td>
                    <td className="border-r-2 border-gray-500 p-1 sticky left-[158px] z-20 bg-inherit" style={{ width: '90px' }}>
                      {renderCell(record, 'etaFinalPod', false, true)}
                    </td>

                    {visibleColumns.filter(col => !['reference', 'file', 'etaFinalPod'].includes(col.id)).map((column) => {
                      const field = column.id as keyof ImportTrackingRecord;
                      const isCheckbox = ['poa', 'isf', 'packingListCommercialInvoice', 'billOfLading', 'arrivalNotice', 
                        'isfFiled', 'entryFiled', 'blRelease', 'customsRelease', 'invoiceSent', 'paymentReceived', 'workOrderSetup'].includes(field);
                      const isDate = ['deliveryDate'].includes(field);
                      
                      return (
                        <td 
                          key={column.id} 
                          className="border-r border-gray-200 p-1" 
                          style={{ width: `${column.width}px` }}
                        >
                          {renderCell(record, field, isCheckbox, isDate)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ImportTrackingTable;
