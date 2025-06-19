
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
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showReferenceIndicator, setShowReferenceIndicator] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = event.currentTarget.scrollLeft;
    setScrollLeft(scrollLeft);
    setShowReferenceIndicator(scrollLeft > 200);
  };

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
    // ETA overdue - red tint
    if (isDateOverdue(record.etaFinalPod)) {
      return 'bg-red-50 border-red-200';
    }
    // ETA within 3 days - amber highlight
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
        <div className="flex items-center gap-1 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-5 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-2 w-2 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-2 w-2 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      // Replace checkboxes with status badges
      const getStatusLabels = (field: keyof ImportTrackingRecord) => {
        switch (field) {
          case 'poa':
          case 'isf':
          case 'packingListCommercialInvoice':
          case 'billOfLading':
          case 'arrivalNotice':
            return { true: '✅ Received', false: '⚠ Missing' };
          case 'isfFiled':
          case 'entryFiled':
            return { true: '✅ Filed', false: '⏳ Pending' };
          case 'blRelease':
          case 'customsRelease':
            return { true: '✅ Released', false: '⏳ Pending' };
          case 'invoiceSent':
            return { true: '✅ Sent', false: '⏳ Pending' };
          case 'paymentReceived':
            return { true: '✅ Received', false: '⏳ Pending' };
          case 'workOrderSetup':
            return { true: '✅ Setup', false: '⏳ Pending' };
          default:
            return { true: '✅ Yes', false: '⚠ No' };
        }
      };

      const labels = getStatusLabels(field);
      const variant = Boolean(value) ? 'success' : 'default';
      
      return (
        <div 
          className="flex items-center justify-center py-1 cursor-pointer"
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
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[24px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-[10px]' :
          value ? 'text-gray-800' : 'text-gray-400 italic opacity-50'
        }`}>
          {String(value) || (
            <span className="text-gray-400 text-[10px] opacity-60">—</span>
          )}
        </span>
        <Edit3 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden relative">
      {showReferenceIndicator && (
        <div className="absolute top-20 left-4 z-50 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs font-medium">
          Reference: {data.find(record => record.id)?.reference || 'Multiple References'}
        </div>
      )}
      
      <ScrollArea 
        className="h-[600px] w-full" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="min-w-[2200px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-4 border-gray-600 bg-white">
                <th className="bg-gray-100 border-r-4 border-gray-600 p-2 text-center font-bold text-gray-900 w-10">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3 border"
                  />
                </th>
                <th className="bg-gray-100 border-r-4 border-gray-600 p-2 text-center font-bold text-gray-900 w-12">
                  Actions
                </th>
                <th className="border-r-2 border-gray-600 p-2 text-left font-bold text-gray-900 bg-blue-200 min-w-[100px]">
                  Reference
                </th>
                <th className="border-r-2 border-gray-600 p-2 text-left font-bold text-gray-900 bg-blue-200 min-w-[80px]">File</th>
                <th className="border-r-2 border-gray-600 p-2 text-left font-bold text-gray-900 bg-blue-200 min-w-[100px]">ETA (Final POD)</th>
                <th className="border-r-6 border-gray-600 p-2 text-left font-bold text-gray-900 bg-blue-200 min-w-[100px]">Bond</th>
                <th colSpan={5} className="border-r-6 border-gray-600 p-2 text-center font-bold text-gray-900 bg-emerald-200">
                  Documentation
                </th>
                <th colSpan={4} className="border-r-6 border-gray-600 p-2 text-center font-bold text-gray-900 bg-purple-200">
                  Processing
                </th>
                <th colSpan={3} className="border-r-6 border-gray-600 p-2 text-center font-bold text-gray-900 bg-orange-200">
                  Final Steps
                </th>
                <th className="border-r-2 border-gray-600 p-2 text-left font-bold text-gray-900 bg-pink-200 min-w-[100px]">Delivery Date</th>
                <th className="p-2 text-center font-bold text-gray-900 bg-gray-200 min-w-[100px]">
                  Notes
                </th>
              </tr>
              <tr className="bg-white border-b-2 border-gray-500 sticky top-[41px] z-30">
                <th className="bg-gray-50 border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 w-10">Select</th>
                <th className="bg-gray-50 border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 w-12">Delete</th>
                <th className="border-r-2 border-gray-500 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[100px]">Reference</th>
                <th className="border-r-2 border-gray-500 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[80px]">File</th>
                <th className="border-r-2 border-gray-500 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[100px]">ETA (Final POD)</th>
                <th className="border-r-4 border-gray-500 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[100px]">Bond</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[70px]">POA</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[70px]">ISF</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[120px]">Packing List & CI</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[100px]">Bill of Lading</th>
                <th className="border-r-4 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[100px]">Arrival Notice</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[80px]">ISF Filed</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[90px]">Entry Filed</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[90px]">BL Release</th>
                <th className="border-r-4 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[110px]">Customs Release</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[90px]">Invoice Sent?</th>
                <th className="border-r-2 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[110px]">Payment Rec'd?</th>
                <th className="border-r-4 border-gray-500 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[100px]">W/O Set Up</th>
                <th className="border-r-2 border-gray-500 p-1 text-left text-xs font-semibold text-gray-700 bg-pink-50 min-w-[100px]">Delivery Date</th>
                <th className="p-1 text-left text-xs font-semibold text-gray-700 bg-gray-50 min-w-[100px]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => {
                const conditionalClasses = getRowConditionalClasses(record);
                return (
                  <tr
                    key={record.id}
                    className={`border-b-2 border-gray-300 transition-all duration-200 ${
                      conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}
                  >
                    <td className="p-1 text-center border-r-2 border-gray-400">
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                        className="h-3 w-3 border"
                      />
                    </td>
                    <td className="p-1 text-center border-r-2 border-gray-400">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-50 rounded-full">
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
                    
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'reference')}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'file')}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'etaFinalPod', false, true)}</td>
                    <td className="border-r-4 border-gray-400 p-1">{renderCell(record, 'bond')}</td>

                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'poa', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'isf', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'packingListCommercialInvoice', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'billOfLading', true)}</td>
                    <td className="border-r-4 border-gray-400 p-1">{renderCell(record, 'arrivalNotice', true)}</td>

                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'isfFiled', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'entryFiled', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'blRelease', true)}</td>
                    <td className="border-r-4 border-gray-400 p-1">{renderCell(record, 'customsRelease', true)}</td>

                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'invoiceSent', true)}</td>
                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'paymentReceived', true)}</td>
                    <td className="border-r-4 border-gray-400 p-1">{renderCell(record, 'workOrderSetup', true)}</td>

                    <td className="border-r-2 border-gray-400 p-1">{renderCell(record, 'deliveryDate', false, true)}</td>

                    <td className="p-1">{renderCell(record, 'notes')}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={21} className="h-12"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ImportTrackingTable;
