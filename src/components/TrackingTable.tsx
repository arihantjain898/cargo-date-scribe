
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';
import { TrackingRecord } from './FreightTracker';

interface TrackingTableProps {
  data: TrackingRecord[];
  updateRecord: (id: string, field: keyof TrackingRecord, value: any) => void;
}

const TrackingTable = ({ data, updateRecord }: TrackingTableProps) => {
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
        <div className="flex items-center gap-2 min-w-0">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-9 text-sm min-w-0 flex-1"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={saveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={cancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center py-2">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-5 w-5"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-3 py-2 rounded-md transition-colors min-h-[40px]"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-sm font-medium truncate ${
          isDate && value ? 'text-blue-700 font-semibold' : 
          value ? 'text-gray-900' : 'text-gray-400'
        }`}>
          {String(value) || '—'}
        </span>
        <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-60 text-blue-600 shrink-0 ml-2" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[calc(100vh-320px)]">
        <div className="min-w-[2400px]">
          <table className="w-full">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 border-b border-gray-200">
              <tr>
                <th colSpan={4} className="border-r-2 border-blue-200 p-4 text-center font-bold text-blue-900 bg-blue-50">
                  📋 PROJECT INFO
                </th>
                <th colSpan={4} className="border-r-2 border-green-200 p-4 text-center font-bold text-green-900 bg-green-50">
                  🚚 DROP / RETURN
                </th>
                <th colSpan={4} className="border-r-2 border-purple-200 p-4 text-center font-bold text-purple-900 bg-purple-50">
                  📄 DOCUMENTS
                </th>
                <th colSpan={3} className="border-r-2 border-orange-200 p-4 text-center font-bold text-orange-900 bg-orange-50">
                  🏷️ TITLES
                </th>
                <th colSpan={3} className="border-r-2 border-pink-200 p-4 text-center font-bold text-pink-900 bg-pink-50">
                  💰 INVOICING
                </th>
                <th colSpan={2} className="border-r-2 border-yellow-200 p-4 text-center font-bold text-yellow-900 bg-yellow-50">
                  💳 PAYMENT
                </th>
                <th colSpan={3} className="border-r-2 border-red-200 p-4 text-center font-bold text-red-900 bg-red-50">
                  ✅ FINAL
                </th>
                <th className="p-4 text-center font-bold text-gray-900 bg-gray-50">
                  📝 NOTES
                </th>
              </tr>
              <tr className="bg-white border-b-2 border-gray-300">
                <th className="border-r border-gray-200 p-3 text-left font-semibold text-gray-700 bg-blue-25 min-w-[120px]">Customer</th>
                <th className="border-r border-gray-200 p-3 text-left font-semibold text-gray-700 bg-blue-25 min-w-[100px]">REF #</th>
                <th className="border-r border-gray-200 p-3 text-left font-semibold text-gray-700 bg-blue-25 min-w-[100px]">File #</th>
                <th className="border-r-2 border-blue-200 p-3 text-left font-semibold text-gray-700 bg-blue-25 min-w-[120px]">Work Order #</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-green-25 min-w-[100px]">Drop Done</th>
                <th className="border-r border-gray-200 p-3 text-left font-semibold text-gray-700 bg-green-25 min-w-[120px]">Drop Date</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-green-25 min-w-[120px]">Return Needed</th>
                <th className="border-r-2 border-green-200 p-3 text-left font-semibold text-gray-700 bg-green-25 min-w-[120px]">Return Date</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-purple-25 min-w-[100px]">Docs Sent</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-purple-25 min-w-[120px]">Docs Received</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-purple-25 min-w-[140px]">AES/MBL/VGM</th>
                <th className="border-r-2 border-purple-200 p-3 text-left font-semibold text-gray-700 bg-purple-25 min-w-[140px]">Doc Cutoff Date</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Titles Dispatched</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Validated & FWD'd</th>
                <th className="border-r-2 border-orange-200 p-3 text-center font-semibold text-gray-700 bg-orange-25 min-w-[130px]">Titles Returned</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-pink-25 min-w-[140px]">SSL Draft Inv. Rec'd</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-pink-25 min-w-[140px]">Draft Inv. Approved</th>
                <th className="border-r-2 border-pink-200 p-3 text-center font-semibold text-gray-700 bg-pink-25 min-w-[150px]">Transphere Inv. Sent</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-yellow-25 min-w-[120px]">Payment Rec'd</th>
                <th className="border-r-2 border-yellow-200 p-3 text-center font-semibold text-gray-700 bg-yellow-25 min-w-[100px]">SSL Paid</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-red-25 min-w-[100px]">Insured</th>
                <th className="border-r border-gray-200 p-3 text-center font-semibold text-gray-700 bg-red-25 min-w-[100px]">Released</th>
                <th className="border-r-2 border-red-200 p-3 text-center font-semibold text-gray-700 bg-red-25 min-w-[150px]">Docs Sent to Customer</th>
                <th className="p-3 text-left font-semibold text-gray-700 bg-gray-25 min-w-[200px]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'customer')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'ref')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'file')}</td>
                  <td className="border-r-2 border-blue-200 p-2">{renderCell(record, 'workOrder')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'dropDone', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="border-r-2 border-green-200 p-2">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'docsSent', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="border-r-2 border-purple-200 p-2">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="border-r-2 border-orange-200 p-2">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="border-r-2 border-pink-200 p-2">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="border-r-2 border-yellow-200 p-2">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'insured', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'released', true)}</td>
                  <td className="border-r-2 border-red-200 p-2">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-2">{renderCell(record, 'notes')}</td>
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
