
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
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
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={saveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit}>
            <X className="h-4 w-4" />
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
        className="group cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            isDate && value ? 'text-blue-700 bg-blue-50 px-1 rounded text-xs' :
            value ? 'text-gray-800' : 'text-gray-400'
          }`}>
            {String(value) || 'Empty'}
          </span>
          <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Import Tracking</h3>
      </div>
      
      <ScrollArea className="h-[600px]">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b">
              <th className="p-3 text-left">
                <Checkbox
                  checked={selectedRows.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-center">Actions</th>
              <th className="p-3 text-left font-medium">Reference</th>
              <th className="p-3 text-left font-medium">File</th>
              <th className="p-3 text-left font-medium">ETA (Final POD)</th>
              <th className="p-3 text-left font-medium">Bond</th>
              <th className="p-3 text-center font-medium">POA</th>
              <th className="p-3 text-center font-medium">ISF</th>
              <th className="p-3 text-center font-medium">Packing List & CI</th>
              <th className="p-3 text-center font-medium">Bill of Lading</th>
              <th className="p-3 text-center font-medium">Arrival Notice</th>
              <th className="p-3 text-center font-medium">ISF Filed</th>
              <th className="p-3 text-center font-medium">Entry Filed</th>
              <th className="p-3 text-center font-medium">BL Release</th>
              <th className="p-3 text-center font-medium">Customs Release</th>
              <th className="p-3 text-center font-medium">Invoice Sent?</th>
              <th className="p-3 text-center font-medium">Payment Rec'd?</th>
              <th className="p-3 text-center font-medium">W/O Set Up</th>
              <th className="p-3 text-left font-medium">Delivery Date</th>
              <th className="p-3 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => {
              const conditionalClasses = getRowConditionalClasses(record);
              return (
                <tr
                  key={record.id}
                  className={`border-b hover:bg-gray-25 ${
                    conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-25')
                  }`}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4 text-red-500" />
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
                  <td className="p-3">{renderCell(record, 'reference')}</td>
                  <td className="p-3">{renderCell(record, 'file')}</td>
                  <td className="p-3">{renderCell(record, 'etaFinalPod', false, true)}</td>
                  <td className="p-3">{renderCell(record, 'bond')}</td>
                  <td className="p-3">{renderCell(record, 'poa', true)}</td>
                  <td className="p-3">{renderCell(record, 'isf', true)}</td>
                  <td className="p-3">{renderCell(record, 'packingListCommercialInvoice', true)}</td>
                  <td className="p-3">{renderCell(record, 'billOfLading', true)}</td>
                  <td className="p-3">{renderCell(record, 'arrivalNotice', true)}</td>
                  <td className="p-3">{renderCell(record, 'isfFiled', true)}</td>
                  <td className="p-3">{renderCell(record, 'entryFiled', true)}</td>
                  <td className="p-3">{renderCell(record, 'blRelease', true)}</td>
                  <td className="p-3">{renderCell(record, 'customsRelease', true)}</td>
                  <td className="p-3">{renderCell(record, 'invoiceSent', true)}</td>
                  <td className="p-3">{renderCell(record, 'paymentReceived', true)}</td>
                  <td className="p-3">{renderCell(record, 'workOrderSetup', true)}</td>
                  <td className="p-3">{renderCell(record, 'deliveryDate', false, true)}</td>
                  <td className="p-3">{renderCell(record, 'notes')}</td>
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
