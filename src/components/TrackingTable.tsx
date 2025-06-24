
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
import { isExportRecordComplete } from '../utils/completionUtils';
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
  updateRecord: (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const TrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: TrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TrackingRecord } | null>(null);
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
    field: keyof TrackingRecord,
    currentValue: string | boolean
  ) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: string | boolean = editValue;

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
    // Completion check - solid green border
    if (isExportRecordComplete(record)) {
      return 'bg-green-50 border-4 border-green-500 shadow-sm';
    }
    
    // Drop date overdue - red tint
    if (isDateOverdue(record.dropDate)) {
      return 'bg-red-50 border-red-200';
    }
    // Drop date within 3 days - amber highlight
    if (isDateWithinDays(record.dropDate, 3)) {
      return 'bg-amber-50 border-amber-200';
    }
    return '';
  };

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm min-w-0 flex-1 border-2 border-blue-500 focus:border-blue-600 bg-white !text-gray-900 focus:ring-2 focus:ring-blue-200"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
            style={{ 
              color: '#1f2937 !important',
              backgroundColor: '#ffffff !important'
            }}
          />
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-3 w-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      // Replace checkboxes with toned down status badges
      const getStatusLabels = (field: keyof TrackingRecord) => {
        switch (field) {
          case 'dropDone':
            return { true: 'Done', false: 'Pending' };
          case 'returnNeeded':
            return { true: 'Needed', false: 'Not Needed' };
          case 'docsSent':
          case 'docsReceived':
          case 'aesMblVgmSent':
          case 'titlesDispatched':
          case 'validatedFwd':
          case 'titlesReturned':
            return { true: 'Sent', false: 'Pending' };
          case 'sslDraftInvRec':
          case 'draftInvApproved':
          case 'transphereInvSent':
          case 'paymentRec':
          case 'sslPaid':
            return { true: 'Received', false: 'Pending' };
          case 'insured':
          case 'released':
          case 'docsSentToCustomer':
            return { true: 'Yes', false: 'No' };
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
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[28px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
        style={{ minWidth: '80px' }}
      >
        <span className={`text-sm truncate font-medium ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-xs' :
          value ? 'text-gray-900 font-medium' : 'text-gray-400 italic opacity-50'
        }`}>
          {String(value) || (
            <span className="text-gray-400 text-xs opacity-60">—</span>
          )}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[2400px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-4 border-black bg-white">
                <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
                <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Drop & Return</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Documentation</th>
                <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Titles</th>
                <th colSpan={5} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-pink-200">Invoicing & Payment</th>
                <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-yellow-200">Final Steps</th>
                <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[100px]">Notes</th>
                <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-10">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3 border"
                  />
                </th>
                <th className="bg-gray-100 p-2 text-center font-bold text-gray-900 w-12">Actions</th>
              </tr>
              <tr className="bg-gray-200 border-b-4 border-gray-600 sticky top-[41px] z-30">
                <th className="bg-gray-300 border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 min-w-[120px] sticky left-0 z-40">Customer</th>
                <th className="border-r border-gray-600 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Ref</th>
                <th className="border-r border-gray-600 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">File</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Work Order</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Drop Done?</th>
                <th className="border-r border-gray-600 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Drop Date</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Return Needed?</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Return Date</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Docs Sent?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Docs Rec'd?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">AES/MBL/VGM Sent?</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Doc Cutoff Date</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Titles Dispatched?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Validated Fwd?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Titles Returned?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">SSL Draft Inv Rec'd?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Draft Inv Approved?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Transphere Inv Sent?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Payment Rec'd?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">SSL Paid?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Insured?</th>
                <th className="border-r border-gray-600 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Released?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Docs Sent to Customer?</th>
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
                    className={`border-b-2 border-gray-500 transition-all duration-200 ${
                      conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}
                  >
                    <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">{renderCell(record, 'customer')}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'ref')}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'file')}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'workOrder')}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'dropDone', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'dropDate', false, true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'returnNeeded', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'returnDate', false, true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'docsSent', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'docsReceived', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'aesMblVgmSent', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'docCutoffDate', false, true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'titlesDispatched', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'validatedFwd', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'titlesReturned', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'sslDraftInvRec', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'draftInvApproved', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'transphereInvSent', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'paymentRec', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'sslPaid', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'insured', true)}</td>
                    <td className="border-r border-gray-600 p-1">{renderCell(record, 'released', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'docsSentToCustomer', true)}</td>
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
                  </tr>
                );
              })}
              <tr>
                <td colSpan={26} className="h-12"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
