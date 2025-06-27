
import React from 'react';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrackingRecord } from '../types/TrackingRecord';
import InlineEditCell from './InlineEditCell';
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

interface TrackingTableRowProps {
  record: TrackingRecord;
  index: number;
  updateRecord: (id: string, field: keyof TrackingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  showArchived: boolean;
  selectedRows?: string[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TrackingTableRow = ({ 
  record, 
  index, 
  updateRecord, 
  deleteRecord, 
  onArchive, 
  onUnarchive, 
  showArchived,
  selectedRows = [],
  setSelectedRows
}: TrackingTableRowProps) => {
  const isSelected = selectedRows.includes(record.id);

  const handleSelectChange = (checked: boolean) => {
    if (!setSelectedRows) return;
    
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${record.archived ? 'opacity-60' : ''}`}>
      <td className="bg-gray-100 border-r-4 border-black p-1 text-left sticky left-0 z-20">
        <InlineEditCell
          value={record.customer}
          onSave={(value) => updateRecord(record.id, 'customer', value)}
          className="font-medium text-gray-900"
        />
      </td>
      <td className="border-r border-gray-300 p-1">
        <InlineEditCell
          value={record.ref}
          onSave={(value) => updateRecord(record.id, 'ref', value)}
        />
      </td>
      <td className="border-r border-gray-300 p-1">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value)}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.workOrder}
          onSave={(value) => updateRecord(record.id, 'workOrder', value)}
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <select
          value={record.dropDone}
          onChange={(e) => updateRecord(record.id, 'dropDone', e.target.value)}
          className="w-full p-1 border rounded text-xs"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.dropDate}
          onSave={(value) => updateRecord(record.id, 'dropDate', value)}
          isDate={true}
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <select
          value={record.returnNeeded}
          onChange={(e) => updateRecord(record.id, 'returnNeeded', e.target.value)}
          className="w-full p-1 border rounded text-xs"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.returnDate}
          onSave={(value) => updateRecord(record.id, 'returnDate', value)}
          isDate={true}
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.docsSent}
          onChange={(e) => updateRecord(record.id, 'docsSent', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.docsReceived}
          onChange={(e) => updateRecord(record.id, 'docsReceived', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.aesMblVgmSent}
          onChange={(e) => updateRecord(record.id, 'aesMblVgmSent', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.docCutoffDate}
          onSave={(value) => updateRecord(record.id, 'docCutoffDate', value)}
          isDate={true}
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <select
          value={record.titlesDispatched}
          onChange={(e) => updateRecord(record.id, 'titlesDispatched', e.target.value)}
          className="w-full p-1 border rounded text-xs"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.validatedFwd}
          onChange={(e) => updateRecord(record.id, 'validatedFwd', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <select
          value={record.titlesReturned}
          onChange={(e) => updateRecord(record.id, 'titlesReturned', e.target.value)}
          className="w-full p-1 border rounded text-xs"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.sslDraftInvRec}
          onChange={(e) => updateRecord(record.id, 'sslDraftInvRec', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.draftInvApproved}
          onChange={(e) => updateRecord(record.id, 'draftInvApproved', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.transphereInvSent}
          onChange={(e) => updateRecord(record.id, 'transphereInvSent', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.paymentRec}
          onChange={(e) => updateRecord(record.id, 'paymentRec', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <input
          type="checkbox"
          checked={record.sslPaid}
          onChange={(e) => updateRecord(record.id, 'sslPaid', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.insured}
          onChange={(e) => updateRecord(record.id, 'insured', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.released}
          onChange={(e) => updateRecord(record.id, 'released', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <input
          type="checkbox"
          checked={record.docsSentToCustomer}
          onChange={(e) => updateRecord(record.id, 'docsSentToCustomer', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value)}
          placeholder="Add notes..."
        />
      </td>
      <td className="bg-gray-100 border-r border-gray-300 p-1 text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          className="w-4 h-4"
        />
      </td>
      <td className="bg-gray-100 p-1 text-center">
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => record.archived ? onUnarchive(record.id) : onArchive(record.id)}
            className="h-6 w-6 p-0"
          >
            {record.archived ? <ArchiveRestore className="h-3 w-3" /> : <Archive className="h-3 w-3" />}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-800">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteRecord(record.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
};

export default TrackingTableRow;
