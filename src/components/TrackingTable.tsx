
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
        <div className="flex items-center gap-2 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-3 w-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center py-3">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-5 w-5 border-2 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-3 py-3 rounded-md transition-all duration-200 min-h-[44px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-sm font-medium truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-2 py-1 rounded' : 
          value ? 'text-gray-800' : 'text-gray-400 italic'
        }`}>
          {String(value) || 'Empty'}
        </span>
        <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-2 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[calc(100vh-280px)] w-full">
        <div className="min-w-[2600px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-30 shadow-lg">
              <tr className="border-b-4 border-gray-300">
                <th className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-gray-50 w-20 shadow-sm">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-5 w-5 border-2"
                  />
                </th>
                <th className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-gray-50 w-24 shadow-sm">
                  Actions
                </th>
                <th className="border-r border-gray-300 p-4 text-left font-bold text-gray-900 bg-blue-50 min-w-[160px] shadow-sm">
                  Customer
                </th>
                <th className="border-r border-gray-300 p-4 text-left font-bold text-gray-900 bg-blue-50 min-w-[100px] shadow-sm">REF #</th>
                <th className="border-r border-gray-300 p-4 text-left font-bold text-gray-900 bg-blue-50 min-w-[100px] shadow-sm">File #</th>
                <th className="border-r border-gray-300 p-4 text-left font-bold text-gray-900 bg-blue-50 min-w-[120px] shadow-sm">Work Order #</th>
                <th colSpan={4} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-emerald-100 shadow-sm">
                  Drop / Return
                </th>
                <th colSpan={4} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-purple-100 shadow-sm">
                  Documents
                </th>
                <th colSpan={3} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-orange-100 shadow-sm">
                  Titles
                </th>
                <th colSpan={3} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-pink-100 shadow-sm">
                  Invoicing
                </th>
                <th colSpan={2} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-yellow-100 shadow-sm">
                  Payment
                </th>
                <th colSpan={3} className="border-r border-gray-300 p-4 text-center font-bold text-gray-900 bg-red-100 shadow-sm">
                  Final Steps
                </th>
                <th className="p-4 text-center font-bold text-gray-900 bg-gray-50 min-w-[180px] shadow-sm">
                  Notes
                </th>
              </tr>
              <tr className="bg-white border-b-2 border-gray-200 sticky top-16 z-30 shadow-md">
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-gray-25 w-20">Select</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-gray-25 w-24">Delete</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-blue-25 min-w-[160px]">Customer</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-blue-25 min-w-[100px]">REF #</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-blue-25 min-w-[100px]">File #</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-blue-25 min-w-[120px]">Work Order #</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-emerald-25 min-w-[100px]">Drop Done</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-emerald-25 min-w-[120px]">Drop Date</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-emerald-25 min-w-[120px]">Return Needed</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-emerald-25 min-w-[120px]">Return Date</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-purple-25 min-w-[100px]">Docs Sent</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-purple-25 min-w-[120px]">Docs Received</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-purple-25 min-w-[140px]">AES/MBL/VGM</th>
                <th className="border-r border-gray-200 p-3 text-left text-sm font-semibold text-gray-700 bg-purple-25 min-w-[140px]">Doc Cutoff Date</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Titles Dispatched</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Validated & FWD'd</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Titles Returned</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-pink-25 min-w-[140px]">SSL Draft Inv. Rec'd</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-pink-25 min-w-[140px]">Draft Inv. Approved</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-pink-25 min-w-[150px]">Transphere Inv. Sent</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-yellow-25 min-w-[120px]">Payment Rec'd</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-yellow-25 min-w-[100px]">SSL Paid</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-red-25 min-w-[100px]">Insured</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-red-25 min-w-[100px]">Released</th>
                <th className="border-r border-gray-200 p-3 text-center text-sm font-semibold text-gray-700 bg-red-25 min-w-[150px]">Docs Sent to Customer</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 bg-gray-25 min-w-[180px]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record.id} className={`border-b-2 border-gray-100 hover:bg-blue-25 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}>
                  <td className="border-r border-gray-200 p-2 text-center bg-white">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                      className="h-5 w-5 border-2"
                    />
                  </td>
                  <td className="border-r border-gray-200 p-2 text-center bg-white">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-4 w-4 text-red-500" />
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
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'customer')}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'ref')}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'file')}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'workOrder')}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'dropDone', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'docsSent', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'insured', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'released', true)}</td>
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-1">{renderCell(record, 'notes')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
