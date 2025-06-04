
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
}

const TrackingTable = ({ data, updateRecord, deleteRecord }: TrackingTableProps) => {
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

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0">
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
        <div className="flex items-center justify-center py-1">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-4 w-4 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors min-h-[32px]"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs font-medium truncate ${
          isDate && value ? 'text-blue-700 font-semibold' : 
          value ? 'text-gray-800' : 'text-gray-400'
        }`}>
          {String(value) || '—'}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-60 text-blue-600 shrink-0 ml-1" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[calc(100vh-320px)] w-full">
        <div className="min-w-[2800px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-20 shadow-sm">
              <tr>
                <th className="border-r-2 border-gray-300 p-2 text-center font-bold text-gray-700 bg-gray-50 w-12">
                  🗑️
                </th>
                <th colSpan={4} className="border-r-2 border-blue-300 p-3 text-center font-bold text-blue-800 bg-gradient-to-r from-blue-50 to-blue-100">
                  📋 PROJECT INFO
                </th>
                <th colSpan={4} className="border-r-2 border-green-300 p-3 text-center font-bold text-green-800 bg-gradient-to-r from-green-50 to-green-100">
                  🚚 DROP / RETURN
                </th>
                <th colSpan={4} className="border-r-2 border-purple-300 p-3 text-center font-bold text-purple-800 bg-gradient-to-r from-purple-50 to-purple-100">
                  📄 DOCUMENTS
                </th>
                <th colSpan={3} className="border-r-2 border-orange-300 p-3 text-center font-bold text-orange-800 bg-gradient-to-r from-orange-50 to-orange-100">
                  🏷️ TITLES
                </th>
                <th colSpan={3} className="border-r-2 border-pink-300 p-3 text-center font-bold text-pink-800 bg-gradient-to-r from-pink-50 to-pink-100">
                  💰 INVOICING
                </th>
                <th colSpan={2} className="border-r-2 border-yellow-300 p-3 text-center font-bold text-yellow-800 bg-gradient-to-r from-yellow-50 to-yellow-100">
                  💳 PAYMENT
                </th>
                <th colSpan={3} className="border-r-2 border-red-300 p-3 text-center font-bold text-red-800 bg-gradient-to-r from-red-50 to-red-100">
                  ✅ FINAL
                </th>
                <th className="p-3 text-center font-bold text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100">
                  📝 NOTES
                </th>
              </tr>
              <tr className="bg-white border-b-2 border-gray-300">
                <th className="border-r-2 border-gray-300 p-2 text-center font-semibold text-gray-600 bg-gray-25 w-12">Del</th>
                <th className="border-r border-gray-300 p-2 text-left font-semibold text-gray-700 bg-blue-25 min-w-[100px] text-xs">Customer</th>
                <th className="border-r border-gray-300 p-2 text-left font-semibold text-gray-700 bg-blue-25 min-w-[80px] text-xs">REF #</th>
                <th className="border-r border-gray-300 p-2 text-left font-semibold text-gray-700 bg-blue-25 min-w-[80px] text-xs">File #</th>
                <th className="border-r-2 border-blue-300 p-2 text-left font-semibold text-gray-700 bg-blue-25 min-w-[100px] text-xs">Work Order #</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-green-25 min-w-[80px] text-xs">Drop Done</th>
                <th className="border-r border-gray-300 p-2 text-left font-semibold text-gray-700 bg-green-25 min-w-[100px] text-xs">Drop Date</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-green-25 min-w-[100px] text-xs">Return Needed</th>
                <th className="border-r-2 border-green-300 p-2 text-left font-semibold text-gray-700 bg-green-25 min-w-[100px] text-xs">Return Date</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-purple-25 min-w-[80px] text-xs">Docs Sent</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-purple-25 min-w-[100px] text-xs">Docs Received</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-purple-25 min-w-[120px] text-xs">AES/MBL/VGM</th>
                <th className="border-r-2 border-purple-300 p-2 text-left font-semibold text-gray-700 bg-purple-25 min-w-[120px] text-xs">Doc Cutoff Date</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-orange-25 min-w-[110px] text-xs">Titles Dispatched</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-orange-25 min-w-[110px] text-xs">Validated & FWD'd</th>
                <th className="border-r-2 border-orange-300 p-2 text-center font-semibold text-gray-700 bg-orange-25 min-w-[110px] text-xs">Titles Returned</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-pink-25 min-w-[120px] text-xs">SSL Draft Inv. Rec'd</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-pink-25 min-w-[120px] text-xs">Draft Inv. Approved</th>
                <th className="border-r-2 border-pink-300 p-2 text-center font-semibold text-gray-700 bg-pink-25 min-w-[130px] text-xs">Transphere Inv. Sent</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-yellow-25 min-w-[100px] text-xs">Payment Rec'd</th>
                <th className="border-r-2 border-yellow-300 p-2 text-center font-semibold text-gray-700 bg-yellow-25 min-w-[80px] text-xs">SSL Paid</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-red-25 min-w-[80px] text-xs">Insured</th>
                <th className="border-r border-gray-300 p-2 text-center font-semibold text-gray-700 bg-red-25 min-w-[80px] text-xs">Released</th>
                <th className="border-r-2 border-red-300 p-2 text-center font-semibold text-gray-700 bg-red-25 min-w-[130px] text-xs">Docs Sent to Customer</th>
                <th className="p-2 text-left font-semibold text-gray-700 bg-gray-25 min-w-[150px] text-xs">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record.id} className={`border-b border-gray-200 hover:bg-gray-50/80 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                }`}>
                  <td className="border-r-2 border-gray-300 p-1 text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-100">
                          <Trash2 className="h-3 w-3 text-red-600" />
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
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'customer')}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'ref')}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'file')}</td>
                  <td className="border-r-2 border-blue-300 p-1">{renderCell(record, 'workOrder')}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'dropDone', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="border-r-2 border-green-300 p-1">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'docsSent', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="border-r-2 border-purple-300 p-1">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="border-r-2 border-orange-300 p-1">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="border-r-2 border-pink-300 p-1">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="border-r-2 border-yellow-300 p-1">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'insured', true)}</td>
                  <td className="border-r border-gray-300 p-1">{renderCell(record, 'released', true)}</td>
                  <td className="border-r-2 border-red-300 p-1">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-1">{renderCell(record, 'notes')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
