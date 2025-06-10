
import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from './FreightTracker';
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
        <div className="flex items-center gap-1 min-w-0">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-xs min-w-0 flex-1"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={saveEdit}>
            <Save className="h-3 w-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0" onClick={cancelEdit}>
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center py-1">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-4 w-4"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors min-h-[32px]"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs truncate ${
          isDate && value ? 'text-blue-600 font-medium' : 
          value ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {String(value) || '—'}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-60 text-gray-500 shrink-0 ml-1" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="relative">
        <ScrollArea className="h-[calc(100vh-280px)] w-full">
          <div className="min-w-[2400px]">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-30">
                <tr>
                  <th className="sticky left-0 z-40 border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-gray-50 w-16">
                    <Checkbox
                      checked={selectedRows.length === data.length && data.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="h-4 w-4"
                    />
                  </th>
                  <th className="sticky left-16 z-40 border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-gray-50 w-16">
                    Actions
                  </th>
                  <th className="sticky left-32 z-40 border-r border-gray-200 p-3 text-left font-medium text-gray-700 bg-blue-50 min-w-[120px]">
                    Customer
                  </th>
                  <th className="border-r border-gray-200 p-3 text-left font-medium text-gray-700 bg-blue-50 min-w-[80px]">REF #</th>
                  <th className="border-r border-gray-200 p-3 text-left font-medium text-gray-700 bg-blue-50 min-w-[80px]">File #</th>
                  <th className="border-r border-gray-200 p-3 text-left font-medium text-gray-700 bg-blue-50 min-w-[100px]">Work Order #</th>
                  <th colSpan={4} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-green-50">
                    Drop / Return
                  </th>
                  <th colSpan={4} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-purple-50">
                    Documents
                  </th>
                  <th colSpan={3} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-orange-50">
                    Titles
                  </th>
                  <th colSpan={3} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-pink-50">
                    Invoicing
                  </th>
                  <th colSpan={2} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-yellow-50">
                    Payment
                  </th>
                  <th colSpan={3} className="border-r border-gray-200 p-3 text-center font-medium text-gray-700 bg-red-50">
                    Final Steps
                  </th>
                  <th className="p-3 text-center font-medium text-gray-700 bg-gray-50">
                    Notes
                  </th>
                </tr>
                <tr className="bg-white border-b border-gray-200 sticky top-12 z-30">
                  <th className="sticky left-0 z-40 border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-gray-25 w-16">Select</th>
                  <th className="sticky left-16 z-40 border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-gray-25 w-16">Delete</th>
                  <th className="sticky left-32 z-40 border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-blue-25 min-w-[120px]">Customer</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-blue-25 min-w-[80px]">REF #</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-blue-25 min-w-[80px]">File #</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-blue-25 min-w-[100px]">Work Order #</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-green-25 min-w-[80px]">Drop Done</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-green-25 min-w-[100px]">Drop Date</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-green-25 min-w-[100px]">Return Needed</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-green-25 min-w-[100px]">Return Date</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-purple-25 min-w-[80px]">Docs Sent</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-purple-25 min-w-[100px]">Docs Received</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-purple-25 min-w-[120px]">AES/MBL/VGM</th>
                  <th className="border-r border-gray-200 p-2 text-left text-xs font-medium text-gray-600 bg-purple-25 min-w-[120px]">Doc Cutoff Date</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-orange-25 min-w-[110px]">Titles Dispatched</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-orange-25 min-w-[110px]">Validated & FWD'd</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-orange-25 min-w-[110px]">Titles Returned</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-pink-25 min-w-[120px]">SSL Draft Inv. Rec'd</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-pink-25 min-w-[120px]">Draft Inv. Approved</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-pink-25 min-w-[130px]">Transphere Inv. Sent</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-yellow-25 min-w-[100px]">Payment Rec'd</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-yellow-25 min-w-[80px]">SSL Paid</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-red-25 min-w-[80px]">Insured</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-red-25 min-w-[80px]">Released</th>
                  <th className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-600 bg-red-25 min-w-[130px]">Docs Sent to Customer</th>
                  <th className="p-2 text-left text-xs font-medium text-gray-600 bg-gray-25 min-w-[150px]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.map((record, index) => (
                  <tr key={record.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}>
                    <td className="sticky left-0 z-20 border-r border-gray-200 p-2 text-center bg-inherit">
                      <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                        className="h-4 w-4"
                      />
                    </td>
                    <td className="sticky left-16 z-20 border-r border-gray-200 p-2 text-center bg-inherit">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-50">
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
                    <td className="sticky left-32 z-20 border-r border-gray-200 p-1 bg-inherit">{renderCell(record, 'customer')}</td>
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
    </div>
  );
};

export default TrackingTable;
