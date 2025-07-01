import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
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
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  isHighlighted?: boolean;
}

const TrackingTableRow = ({ 
  record, 
  index, 
  updateRecord, 
  deleteRecord, 
  onArchive, 
  onUnarchive,
  selectedRows,
  setSelectedRows,
  showArchived,
  isHighlighted = false
}: TrackingTableRowProps) => {
  const isArchived = record.archived;
  
  // Check if record is completed (all boolean fields are true)
  const isCompleted = record.docsSent && record.docsReceived && record.aesMblVgmSent && 
                     record.validatedFwd && record.sslDraftInvRec && record.draftInvApproved && 
                     record.transphereInvSent && record.paymentRec && record.sslPaid && 
                     record.insured && record.released && record.docsSentToCustomer;
  
  const rowClassName = `border-b-2 border-gray-400 transition-all duration-200 ${
    isArchived ? 'bg-gray-100 opacity-50' : 
    isHighlighted ? 'bg-yellow-200 border-yellow-400' :
    isCompleted ? 'bg-green-50 border-2 border-green-500' :
    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
  }`;

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  return (
    <tr className={rowClassName} data-row-id={record.id}>
      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
        <InlineEditCell
          value={record.customer}
          onSave={(value) => updateRecord(record.id, 'customer', value as string)}
          placeholder="Enter customer name"
          className="font-bold"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.ref}
          onSave={(value) => updateRecord(record.id, 'ref', value as string)}
          placeholder="Enter reference"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.workOrder}
          onSave={(value) => updateRecord(record.id, 'workOrder', value as string)}
          placeholder="Enter booking#"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.dropDone}
          onSave={(value) => updateRecord(record.id, 'dropDone', value as string)}
          placeholder="Select status"
          options={['No', 'Pending', 'Yes']}
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.dropDate}
          onSave={(value) => updateRecord(record.id, 'dropDate', value as string)}
          isDate={true}
          placeholder="Select drop date"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.returnNeeded}
          onSave={(value) => updateRecord(record.id, 'returnNeeded', value as string)}
          placeholder="Select status"
          options={['No', 'Pending', 'Yes']}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.returnDate}
          onSave={(value) => updateRecord(record.id, 'returnDate', value as string)}
          isDate={true}
          placeholder="Select return date"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.docsSent}
          onSave={(value) => updateRecord(record.id, 'docsSent', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.docsReceived}
          onSave={(value) => updateRecord(record.id, 'docsReceived', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.docCutoffDate}
          onSave={(value) => updateRecord(record.id, 'docCutoffDate', value as string)}
          isDate={true}
          placeholder="Select cutoff date"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.aesMblVgmSent}
          onSave={(value) => updateRecord(record.id, 'aesMblVgmSent', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.titlesDispatched}
          onSave={(value) => updateRecord(record.id, 'titlesDispatched', value as string)}
          placeholder="Select status"
          options={['N/A', 'Yes', 'No']}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.validatedFwd}
          onSave={(value) => updateRecord(record.id, 'validatedFwd', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.titlesReturned}
          onSave={(value) => updateRecord(record.id, 'titlesReturned', value as string)}
          placeholder="Select status"
          options={['N/A', 'Yes', 'No']}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.sslDraftInvRec}
          onSave={(value) => updateRecord(record.id, 'sslDraftInvRec', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.draftInvApproved}
          onSave={(value) => updateRecord(record.id, 'draftInvApproved', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.transphereInvSent}
          onSave={(value) => updateRecord(record.id, 'transphereInvSent', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.paymentRec}
          onSave={(value) => updateRecord(record.id, 'paymentRec', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.sslPaid}
          onSave={(value) => updateRecord(record.id, 'sslPaid', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.insured}
          onSave={(value) => updateRecord(record.id, 'insured', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.released}
          onSave={(value) => updateRecord(record.id, 'released', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value as string)}
          placeholder="Enter notes"
        />
      </td>
      <td className="p-1 text-center border-r border-gray-500">
        <Checkbox
          checked={selectedRows.includes(record.id)}
          onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
          className="h-3 w-3 border"
        />
      </td>
      <td className="p-1 text-center border-r border-gray-500">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-yellow-50 rounded-full">
              {isArchived ? (
                <ArchiveRestore className="h-3 w-3 text-green-600" />
              ) : (
                <Archive className="h-3 w-3 text-yellow-600" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isArchived ? 'Unarchive Record' : 'Archive Record'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isArchived 
                  ? `Are you sure you want to unarchive this record for ${record.customer}? It will be visible in the main view again.`
                  : `Are you sure you want to archive this record for ${record.customer}? Archived records will be hidden from the main view.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => isArchived ? onUnarchive(record.id) : onArchive(record.id)}
                className={isArchived ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
              >
                {isArchived ? 'Unarchive' : 'Archive'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
};

export default TrackingTableRow;
