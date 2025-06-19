import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
import { useTableColumnGroups, ColumnGroup } from '../hooks/useTableColumnGroups';
import GroupedTableHeader from './GroupedTableHeader';
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

const importColumnGroups: ColumnGroup[] = [
  {
    id: 'required',
    title: 'Required Documents',
    columns: ['poa', 'isf'],
    isCollapsed: false,
    color: 'bg-red-600'
  },
  {
    id: 'documents',
    title: 'Documents',
    columns: ['packingListCommercialInvoice', 'billOfLading', 'arrivalNotice'],
    isCollapsed: false,
    color: 'bg-blue-600'
  },
  {
    id: 'filing',
    title: 'Filing',
    columns: ['isfFiled', 'entryFiled'],
    isCollapsed: false,
    color: 'bg-green-600'
  },
  {
    id: 'customs',
    title: 'Customs',
    columns: ['blRelease', 'customsRelease'],
    isCollapsed: false,
    color: 'bg-purple-600'
  },
  {
    id: 'billing',
    title: 'Billing',
    columns: ['invoiceSent', 'paymentReceived'],
    isCollapsed: false,
    color: 'bg-orange-600'
  }
];

const ImportTrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: ImportTrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof ImportTrackingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { groups, toggleGroup, isColumnVisible } = useTableColumnGroups(importColumnGroups);

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

  const pinnedColumns = (
    <>
      <th className="p-2 text-left border-r-2 border-gray-400 bg-gray-100 sticky left-0 z-30 w-10">
        <Checkbox
          checked={selectedRows.length === data.length && data.length > 0}
          onCheckedChange={handleSelectAll}
        />
      </th>
      <th className="p-2 text-center border-r-2 border-gray-400 bg-gray-100 sticky left-10 z-30 w-16">Actions</th>
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-26 z-30 min-w-24">Reference</th>
      <th className="p-2 text-left font-medium border-r-4 border-gray-400 bg-gray-100 sticky left-50 z-30 min-w-20">File</th>
    </>
  );

  const renderCell = (record: ImportTrackingRecord, field: keyof ImportTrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 text-xs"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-6 w-6 p-0">
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
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
          className="flex justify-center cursor-pointer"
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
        className="group cursor-pointer hover:bg-blue-50 px-1 py-1 rounded transition-colors"
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            isDate && value ? 'text-blue-700 bg-blue-50 px-1 rounded' :
            value ? 'text-gray-800' : 'text-gray-400'
          }`}>
            {String(value) || 'Empty'}
          </span>
          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
      <div className="p-4 border-b-2 border-gray-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Import Tracking</h3>
        {showScrollHint && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ChevronLeft className="h-4 w-4" />
            <span>Scroll horizontally to see more columns</span>
            <ChevronRight className="h-4 w-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowScrollHint(false)}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[600px]" ref={scrollAreaRef}>
        <table className="w-full text-xs border-collapse border-2 border-gray-300">
          <GroupedTableHeader 
            groups={groups} 
            toggleGroup={toggleGroup}
            pinnedColumns={pinnedColumns}
          >
            {pinnedColumns}
            <th className="p-2 text-left font-medium border-r border-gray-300">ETA (Final POD)</th>
            <th className="p-2 text-left font-medium border-r-2 border-gray-400">Bond</th>
            {isColumnVisible('poa') && <th className="p-2 text-center font-medium border-r border-gray-300">POA</th>}
            {isColumnVisible('isf') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">ISF</th>}
            {isColumnVisible('packingListCommercialInvoice') && <th className="p-2 text-center font-medium border-r border-gray-300">Packing List & CI</th>}
            {isColumnVisible('billOfLading') && <th className="p-2 text-center font-medium border-r border-gray-300">Bill of Lading</th>}
            {isColumnVisible('arrivalNotice') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">Arrival Notice</th>}
            {isColumnVisible('isfFiled') && <th className="p-2 text-center font-medium border-r border-gray-300">ISF Filed</th>}
            {isColumnVisible('entryFiled') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">Entry Filed</th>}
            {isColumnVisible('blRelease') && <th className="p-2 text-center font-medium border-r border-gray-300">BL Release</th>}
            {isColumnVisible('customsRelease') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">Customs Release</th>}
            {isColumnVisible('invoiceSent') && <th className="p-2 text-center font-medium border-r border-gray-300">Invoice Sent?</th>}
            {isColumnVisible('paymentReceived') && <th className="p-2 text-center font-medium border-r border-gray-300">Payment Rec'd?</th>}
            <th className="p-2 text-center font-medium border-r border-gray-300">W/O Set Up</th>
            <th className="p-2 text-left font-medium border-r border-gray-300">Delivery Date</th>
            <th className="p-2 text-left font-medium">Notes</th>
          </GroupedTableHeader>
          <tbody>
            {data.map((record, index) => {
              const conditionalClasses = getRowConditionalClasses(record);
              return (
                <tr
                  key={record.id}
                  className={`border-b-2 border-gray-300 hover:bg-gray-100 ${
                    conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                  }`}
                >
                  <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-0 z-20">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                    />
                  </td>
                  <td className="p-2 text-center border-r-2 border-gray-400 bg-gray-50 sticky left-10 z-20">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Trash2 className="h-3 w-3 text-red-500" />
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
                  <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-26 z-20">{renderCell(record, 'reference')}</td>
                  <td className="p-2 border-r-4 border-gray-400 bg-gray-50 sticky left-50 z-20">{renderCell(record, 'file')}</td>
                  <td className="p-2 border-r border-gray-300">{renderCell(record, 'etaFinalPod', false, true)}</td>
                  <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'bond')}</td>
                  {isColumnVisible('poa') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'poa', true)}</td>}
                  {isColumnVisible('isf') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'isf', true)}</td>}
                  {isColumnVisible('packingListCommercialInvoice') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'packingListCommercialInvoice', true)}</td>}
                  {isColumnVisible('billOfLading') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'billOfLading', true)}</td>}
                  {isColumnVisible('arrivalNotice') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'arrivalNotice', true)}</td>}
                  {isColumnVisible('isfFiled') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'isfFiled', true)}</td>}
                  {isColumnVisible('entryFiled') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'entryFiled', true)}</td>}
                  {isColumnVisible('blRelease') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'blRelease', true)}</td>}
                  {isColumnVisible('customsRelease') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'customsRelease', true)}</td>}
                  {isColumnVisible('invoiceSent') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'invoiceSent', true)}</td>}
                  {isColumnVisible('paymentReceived') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'paymentReceived', true)}</td>}
                  <td className="p-2 border-r border-gray-300">{renderCell(record, 'workOrderSetup', true)}</td>
                  <td className="p-2 border-r border-gray-300">{renderCell(record, 'deliveryDate', false, true)}</td>
                  <td className="p-2">{renderCell(record, 'notes')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ImportTrackingTable;
