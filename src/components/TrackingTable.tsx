import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
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

interface TrackingTableProps {
  data: TrackingRecord[];
  updateRecord: (id: string, field: keyof TrackingRecord, value: any) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const TrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: TrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TrackingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialColumns: ColumnConfig[] = [
    { id: 'customer', label: 'Customer', visible: true, width: 100, minWidth: 80 },
    { id: 'ref', label: 'REF #', visible: true, width: 60, minWidth: 50 },
    { id: 'file', label: 'File #', visible: true, width: 60, minWidth: 50 },
    { id: 'workOrder', label: 'Work Order #', visible: true, width: 80, minWidth: 70 },
    { id: 'dropDone', label: 'Drop Done', visible: true, width: 60, minWidth: 50, group: 'Drop / Return' },
    { id: 'dropDate', label: 'Drop Date', visible: true, width: 80, minWidth: 70, group: 'Drop / Return' },
    { id: 'returnNeeded', label: 'Return Needed', visible: true, width: 80, minWidth: 70, group: 'Drop / Return' },
    { id: 'returnDate', label: 'Return Date', visible: true, width: 80, minWidth: 70, group: 'Drop / Return' },
    { id: 'docsSent', label: 'Docs Sent', visible: true, width: 60, minWidth: 50, group: 'Documents' },
    { id: 'docsReceived', label: 'Docs Received', visible: true, width: 80, minWidth: 70, group: 'Documents' },
    { id: 'aesMblVgmSent', label: 'AES/MBL/VGM', visible: true, width: 90, minWidth: 80, group: 'Documents' },
    { id: 'docCutoffDate', label: 'Doc Cutoff Date', visible: true, width: 90, minWidth: 80, group: 'Documents' },
    { id: 'titlesDispatched', label: 'Titles Dispatched', visible: true, width: 80, minWidth: 70, group: 'Titles' },
    { id: 'validatedFwd', label: 'Validated & FWD\'d', visible: true, width: 80, minWidth: 70, group: 'Titles' },
    { id: 'titlesReturned', label: 'Titles Returned', visible: true, width: 80, minWidth: 70, group: 'Titles' },
    { id: 'sslDraftInvRec', label: 'SSL Draft Inv. Rec\'d', visible: true, width: 90, minWidth: 80, group: 'Invoicing' },
    { id: 'draftInvApproved', label: 'Draft Inv. Approved', visible: true, width: 90, minWidth: 80, group: 'Invoicing' },
    { id: 'transphereInvSent', label: 'Transphere Inv. Sent', visible: true, width: 100, minWidth: 90, group: 'Invoicing' },
    { id: 'paymentRec', label: 'Payment Rec\'d', visible: true, width: 80, minWidth: 70, group: 'Payment' },
    { id: 'sslPaid', label: 'SSL Paid', visible: true, width: 60, minWidth: 50, group: 'Payment' },
    { id: 'insured', label: 'Insured', visible: true, width: 60, minWidth: 50, group: 'Final Steps' },
    { id: 'released', label: 'Released', visible: true, width: 60, minWidth: 50, group: 'Final Steps' },
    { id: 'docsSentToCustomer', label: 'Docs Sent to Customer', visible: true, width: 100, minWidth: 90, group: 'Final Steps' },
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

  const startEdit = (id: string, field: keyof TrackingRecord, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: any = editValue;

      if (field === 'dropDone' || field === 'returnNeeded' || field === 'docsSent' ||
          field === 'docsReceived' || field === 'aesMblVgmSent' || field === 'titlesDispatched' ||
          field === 'validatedFwd' || field === 'titlesReturned' || field === 'sslDraftInvRec' ||
          field === 'draftInvApproved' || field === 'transphereInvSent' || field === 'paymentRec' ||
          field === 'sslPaid' || field === 'insured' || field === 'released' || field === 'docsSentToCustomer') {
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

  const getRowConditionalClasses = (record: TrackingRecord): string => {
    if (isDateOverdue(record.dropDate)) {
      return 'bg-red-50 border-red-200';
    }
    if (isDateWithinDays(record.returnDate, 3)) {
      return 'bg-amber-50 border-amber-200';
    }
    return '';
  };

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
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
      const getStatusLabels = (field: keyof TrackingRecord) => {
        switch (field) {
          case 'dropDone': return { true: 'Dropped', false: 'Pending' };
          case 'returnNeeded': return { true: 'Required', false: 'Not Needed' };
          case 'docsSent': return { true: 'Sent', false: 'Pending' };
          case 'docsReceived': return { true: 'Received', false: 'Pending' };
          case 'aesMblVgmSent': return { true: 'Sent', false: 'Pending' };
          case 'titlesDispatched': return { true: 'Dispatched', false: 'Pending' };
          case 'validatedFwd': return { true: 'Validated', false: 'Pending' };
          case 'titlesReturned': return { true: 'Returned', false: 'Pending' };
          case 'sslDraftInvRec': return { true: 'Received', false: 'Pending' };
          case 'draftInvApproved': return { true: 'Approved', false: 'Pending' };
          case 'transphereInvSent': return { true: 'Sent', false: 'Pending' };
          case 'paymentRec': return { true: 'Received', false: 'Pending' };
          case 'sslPaid': return { true: 'Paid', false: 'Pending' };
          case 'insured': return { true: 'Insured', false: 'Pending' };
          case 'released': return { true: 'Released', false: 'Pending' };
          case 'docsSentToCustomer': return { true: 'Sent', false: 'Pending' };
          default: return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const variant = Boolean(value) ? 'success' : 'default';
      
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
        <h3 className="text-sm font-medium">Export Tracking</h3>
        <TableColumnManager
          columns={columns}
          collapsedGroups={collapsedGroups}
          onToggleColumn={toggleColumnVisibility}
          onToggleGroup={toggleGroup}
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)] w-full" ref={scrollAreaRef}>
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
                  width={100}
                  minWidth={80}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-18 z-40"
                >
                  Customer
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={60}
                  minWidth={50}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-[118px] z-40"
                >
                  REF #
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={60}
                  minWidth={50}
                  onResize={() => {}}
                  className="bg-blue-100 border-r-2 border-gray-500 p-1 text-left font-bold text-gray-900 sticky left-[178px] z-40"
                >
                  File #
                </ResizableTableHeader>
                
                {visibleColumns.filter(col => !['customer', 'ref', 'file'].includes(col.id)).map((column) => (
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
                              Are you sure you want to delete this record for {record.customer}? This action cannot be undone.
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
                    
                    <td className="border-r border-gray-200 p-1 sticky left-18 z-20 bg-inherit" style={{ width: '100px' }}>
                      {renderCell(record, 'customer')}
                    </td>
                    <td className="border-r border-gray-200 p-1 sticky left-[118px] z-20 bg-inherit" style={{ width: '60px' }}>
                      {renderCell(record, 'ref')}
                    </td>
                    <td className="border-r-2 border-gray-500 p-1 sticky left-[178px] z-20 bg-inherit" style={{ width: '60px' }}>
                      {renderCell(record, 'file')}
                    </td>

                    {visibleColumns.filter(col => !['customer', 'ref', 'file'].includes(col.id)).map((column) => {
                      const field = column.id as keyof TrackingRecord;
                      const isCheckbox = ['dropDone', 'returnNeeded', 'docsSent', 'docsReceived', 'aesMblVgmSent', 
                        'titlesDispatched', 'validatedFwd', 'titlesReturned', 'sslDraftInvRec', 'draftInvApproved', 
                        'transphereInvSent', 'paymentRec', 'sslPaid', 'insured', 'released', 'docsSentToCustomer'].includes(field);
                      const isDate = ['dropDate', 'returnDate', 'docCutoffDate'].includes(field);
                      
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

export default TrackingTable;
