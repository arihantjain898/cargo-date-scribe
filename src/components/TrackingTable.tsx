
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
      
      // Convert to appropriate type based on field
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
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-xs"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={saveEdit}>
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1 rounded"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs ${isDate && value ? 'font-medium text-blue-600' : ''}`}>
          {String(value) || '-'}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-50" />
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="min-w-[2000px]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200">
                <th colSpan={4} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">INFO</th>
                <th colSpan={4} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">DROP / RETURN</th>
                <th colSpan={4} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">DOCUMENTS</th>
                <th colSpan={3} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">TITLES</th>
                <th colSpan={3} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">INVOICING</th>
                <th colSpan={2} className="border-r border-gray-300 p-3 text-center font-semibold text-gray-700">PAYMENT</th>
                <th colSpan={3} className="p-3 text-center font-semibold text-gray-700">FINAL</th>
                <th className="p-3 text-center font-semibold text-gray-700">NOTES</th>
              </tr>
              <tr className="bg-white border-b border-gray-200">
                <th className="border-r border-gray-200 p-2 text-left font-medium text-gray-600">Customer</th>
                <th className="border-r border-gray-200 p-2 text-left font-medium text-gray-600">REF #</th>
                <th className="border-r border-gray-200 p-2 text-left font-medium text-gray-600">File #</th>
                <th className="border-r border-gray-300 p-2 text-left font-medium text-gray-600">Work Order #</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Drop Done</th>
                <th className="border-r border-gray-200 p-2 text-left font-medium text-gray-600">Drop Date</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Return Needed</th>
                <th className="border-r border-gray-300 p-2 text-left font-medium text-gray-600">Return Date</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Docs Sent</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Docs Received</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">AES/MBL/VGM Sent</th>
                <th className="border-r border-gray-300 p-2 text-left font-medium text-gray-600">Doc Cutoff Date</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Titles Dispatched</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Validated & FWD'd</th>
                <th className="border-r border-gray-300 p-2 text-center font-medium text-gray-600">Titles Returned</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">SSL Draft Inv. Rec'd</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Draft Inv. Approved</th>
                <th className="border-r border-gray-300 p-2 text-center font-medium text-gray-600">Transphere Inv. Sent</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Payment Rec'd</th>
                <th className="border-r border-gray-300 p-2 text-center font-medium text-gray-600">SSL Paid</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Insured</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Released</th>
                <th className="border-r border-gray-200 p-2 text-center font-medium text-gray-600">Docs Sent to Customer</th>
                <th className="p-2 text-left font-medium text-gray-600">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr key={record.id} className={`border-b border-gray-100 hover:bg-gray-25 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'customer')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'ref')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'file')}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'workOrder')}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'dropDone', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'docsSent', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="border-r border-gray-300 p-2">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'insured', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'released', true)}</td>
                  <td className="border-r border-gray-200 p-2">{renderCell(record, 'docsSentToCustomer', true)}</td>
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
