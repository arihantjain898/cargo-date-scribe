import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
import { isImportRecordComplete } from '../utils/completionUtils';
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
  updateRecord: (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => void;
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

  const startEdit = (
    id: string,
    field: keyof ImportTrackingRecord,
    currentValue: string | boolean
  ) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: string | boolean = editValue;

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
    // Completion check - solid green border
    if (isImportRecordComplete(record)) {
      return 'bg-green-50 border-4 border-green-500 shadow-sm';
    }
    
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-[9999]" onClick={cancelEdit}>
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[500px] w-full mx-4 z-[10000]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editing: {field}
              </label>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                type={isDate ? 'date' : 'text'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveEdit();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                  }
                }}
                autoFocus
                placeholder={`Enter ${field}...`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={cancelEdit}
                className="px-4"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={saveEdit}
                className="px-4 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (isCheckbox) {
      const getStatusLabels = (field: keyof ImportTrackingRecord) => {
        switch (field) {
          case 'poa':
          case 'isf':
          case 'packingListCommercialInvoice':
          case 'billOfLading':
          case 'arrivalNotice':
            return { true: 'Received', false: 'Missing' };
          case 'isfFiled':
          case 'entryFiled':
            return { true: 'Filed', false: 'Pending' };
          case 'blRelease':
          case 'customsRelease':
            return { true: 'Released', false: 'Pending' };
          case 'invoiceSent':
            return { true: 'Sent', false: 'Pending' };
          case 'paymentReceived':
            return { true: 'Received', false: 'Pending' };
          case 'workOrderSetup':
            return { true: 'Setup', false: 'Pending' };
          default:
            return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const boolValue = value as boolean;
      const variant = boolValue ? 'success' : 'default';
      
      return (
        <div 
          className="flex items-center justify-center py-1 cursor-pointer"
          onClick={() => updateRecord(record.id, field, !value)}
        >
          <StatusBadge
            status={boolValue}
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
            <span className="text-gray-400 text-[10px] opacity-60">Click to edit</span>
          )}
        </span>
        <Edit3 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[2200px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-4 border-black bg-white">
                <th className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-yellow-200">Customer</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
                <th colSpan={5} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-emerald-200">Documentation</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Processing</th>
                <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Final Steps</th>
                <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-pink-200 min-w-[100px]">Delivery Date</th>
                <th className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-gray-200 min-w-[100px]">Notes</th>
                <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-10">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3 border"
                  />
                </th>
                <th className="bg-gray-100 p-2 text-center font-bold text-gray-900 w-12">Actions</th>
              </tr>
              <tr className="bg-gray-200 border-b-4 border-gray-500 sticky top-[41px] z-30">
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Customer</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Reference</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">File</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">ETA (Final POD)</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Bond</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">POA</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">ISF</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Packing List & CI</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Bill of Lading</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Arrival Notice</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">ISF Filed</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Entry Filed</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">BL Release</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Customs Release</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Invoice Sent?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Payment Rec'd?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">W/O Set Up</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Delivery Date</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Notes</th>
                <th className="bg-gray-300 border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 w-10">Select</th>
                <th className="bg-gray-300 p-1 text-center text-xs font-bold text-gray-800 w-12">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => {
                const conditionalClasses = getRowConditionalClasses(record);
                return (
                  <tr
                    key={record.id}
                    className={`border-b-2 border-gray-400 transition-all duration-200 ${
                      conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}
                  >
                    <td className="border-r-4 border-black p-1">
                      <div
                        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[24px] border border-transparent hover:border-blue-200"
                        onClick={() => startEdit(record.id, 'customer', record.customer)}
                      >
                        <span className="text-xs truncate font-bold text-gray-800">
                          {record.customer || (
                            <span className="text-gray-400 text-[10px] opacity-60">Click to edit</span>
                          )}
                        </span>
                        <Edit3 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
                      </div>
                    </td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'reference')}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'file')}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'etaFinalPod', false, true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'bond')}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'poa', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'isf', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'packingListCommercialInvoice', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'billOfLading', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'arrivalNotice', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'isfFiled', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'entryFiled', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'blRelease', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'customsRelease', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'invoiceSent', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'paymentReceived', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'workOrderSetup', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'deliveryDate', false, true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'notes')}</td>
                    <td className="p-1 text-center border-r-4 border-black">
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                        className="h-3 w-3 border"
                      />
                    </td>
                    <td className="p-1 text-center">
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
                              Are you sure you want to delete this record for {record.customer} - {record.reference}? This action cannot be undone.
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
