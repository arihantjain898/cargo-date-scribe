
import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
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

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-2.5 w-2.5 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-2.5 w-2.5 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center py-1.5">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-4 w-4 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-2 py-1.5 rounded transition-all duration-200 min-h-[32px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs font-medium truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]' : 
          value ? 'text-gray-800' : 'text-gray-400 italic'
        }`}>
          {String(value) || 'Empty'}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[calc(100vh-240px)] w-full">
        <div className="min-w-[2400px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-2 border-gray-400">
                <th className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-gray-100 w-12 sticky left-0 z-40 shadow-r-lg">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-4 w-4 border-2"
                  />
                </th>
                <th className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-gray-100 w-16 sticky left-12 z-40 shadow-r-lg">
                  Actions
                </th>
                <th className="border-r-2 border-gray-400 p-2 text-left font-bold text-gray-900 bg-blue-100 min-w-[140px] sticky left-28 z-40 shadow-r-lg">
                  Customer
                </th>
                <th className="border-r-2 border-gray-400 p-2 text-left font-bold text-gray-900 bg-blue-100 min-w-[80px]">REF #</th>
                <th className="border-r-2 border-gray-400 p-2 text-left font-bold text-gray-900 bg-blue-100 min-w-[80px]">File #</th>
                <th className="border-r-2 border-gray-400 p-2 text-left font-bold text-gray-900 bg-blue-100 min-w-[100px]">Work Order #</th>
                <th colSpan={4} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-emerald-100">
                  Drop / Return
                </th>
                <th colSpan={4} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-purple-100">
                  Documents
                </th>
                <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-orange-100">
                  Titles
                </th>
                <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-pink-100">
                  Invoicing
                </th>
                <th colSpan={2} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-yellow-100">
                  Payment
                </th>
                <th colSpan={3} className="border-r-2 border-gray-400 p-2 text-center font-bold text-gray-900 bg-red-100">
                  Final Steps
                </th>
                <th className="p-2 text-center font-bold text-gray-900 bg-gray-100 min-w-[120px]">
                  Notes
                </th>
              </tr>
              <tr className="bg-white border-b-2 border-gray-300 sticky top-12 z-30">
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 w-12 sticky left-0 z-40 shadow-r-lg">Select</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-gray-50 w-16 sticky left-12 z-40 shadow-r-lg">Delete</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[140px] sticky left-28 z-40 shadow-r-lg">Customer</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[80px]">REF #</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[80px]">File #</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[100px]">Work Order #</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[80px]">Drop Done</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[100px]">Drop Date</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[100px]">Return Needed</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[100px]">Return Date</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[80px]">Docs Sent</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[100px]">Docs Received</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[120px]">AES/MBL/VGM</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-left text-xs font-semibold text-gray-700 bg-purple-50 min-w-[120px]">Doc Cutoff Date</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[110px]">Titles Dispatched</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[110px]">Validated & FWD'd</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[110px]">Titles Returned</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[120px]">SSL Draft Inv. Rec'd</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[120px]">Draft Inv. Approved</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[130px]">Transphere Inv. Sent</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-yellow-50 min-w-[100px]">Payment Rec'd</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-yellow-50 min-w-[80px]">SSL Paid</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[80px]">Insured</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[80px]">Released</th>
                <th className="border-r-2 border-gray-300 p-1.5 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[130px]">Docs Sent to Customer</th>
                <th className="p-1.5 text-left text-xs font-semibold text-gray-700 bg-gray-50 min-w-[120px]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record.id} className={`border-b border-gray-200 hover:bg-blue-25 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }`}>
                  <td className="border-r-2 border-gray-300 p-1 text-center bg-white sticky left-0 z-30 shadow-r">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                      className="h-4 w-4 border-2"
                    />
                  </td>
                  <td className="border-r-2 border-gray-300 p-1 text-center bg-white sticky left-12 z-30 shadow-r">
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
                  <td className={`border-r-2 border-gray-300 p-0.5 sticky left-28 z-30 shadow-r ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}>{renderCell(record, 'customer')}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'ref')}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'file')}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'workOrder')}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'dropDone', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'docsSent', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'insured', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'released', true)}</td>
                  <td className="border-r-2 border-gray-300 p-0.5">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-0.5">{renderCell(record, 'notes')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <style jsx>{`
        .shadow-r {
          box-shadow: 2px 0 4px -1px rgba(0, 0, 0, 0.1);
        }
        .shadow-r-lg {
          box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default TrackingTable;
