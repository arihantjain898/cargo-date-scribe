import React from 'react';
import { Trash2, Archive, ArchiveRestore, ExternalLink } from 'lucide-react';
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
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  highlightedRowId?: string | null;
  onFileClick?: (fullFileIdentifier: string) => void;
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
  highlightedRowId,
  onFileClick
}: TrackingTableRowProps) => {
  const isSelected = selectedRows.includes(record.id);
  const isArchived = record.archived;
  const isHighlighted = highlightedRowId === record.id;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleFileClick = () => {
    if (onFileClick && record.file) {
      onFileClick(record.file);
    }
  };

  // Check if all boolean fields are true (completed)
  const isCompleted = record.dropDone === 'Yes' && record.returnNeeded === 'Yes' && 
    record.docsReceived && record.aesMblVgmSent && record.validatedFwd && 
    record.sslDraftInvRec && record.draftInvApproved && record.transphereInvSent && 
    record.paymentRec && record.sslPaid && record.insured && record.released && 
    record.docsSentToCustomer;

  // Check if record is empty (has no meaningful data)
  const isEmpty = !record.customer && !record.file;

  // More distinctive alternating colors matching import tabs with highlight support
  const rowClassName = `border-b-2 border-gray-500 transition-all duration-200 ${
    isHighlighted ? 'bg-yellow-200 animate-pulse' :
    isArchived ? 'bg-gray-200 opacity-60' : 
    index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
  } ${isCompleted ? 'border-4 border-green-500 bg-green-50' : ''}`;

  return (
    <tr className={rowClassName} data-row-id={record.id}>
      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={record.customer}
            onSave={(value) => updateRecord(record.id, 'customer', value as string)}
            placeholder="Enter customer name"
            className={isEmpty ? "text-gray-400" : "font-bold"}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFileClick}
            className="h-6 w-6 p-0 hover:bg-blue-100"
            title={`Open ${record.file || 'file'} in All Files`}
            disabled={!record.file}
          >
            <ExternalLink className={`h-3 w-3 ${record.file ? 'text-blue-600' : 'text-gray-400'}`} />
          </Button>
        </div>
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.ref}
          onSave={(value) => updateRecord(record.id, 'ref', value as string)}
          placeholder="Enter ref"
          className={isEmpty ? "text-gray-400" : ""}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
          className={isEmpty ? "text-gray-400" : ""}
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.workOrder}
          onSave={(value) => updateRecord(record.id, 'workOrder', value as string)}
          placeholder="Enter work order"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.dropDone}
          onSave={(value) => updateRecord(record.id, 'dropDone', value as string)}
          options={['No', 'Yes', 'N/A']}
          placeholder="Select status"
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
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.returnNeeded}
          onSave={(value) => updateRecord(record.id, 'returnNeeded', value as string)}
          options={['No', 'Yes', 'N/A']}
          placeholder="Select status"
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
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.titlesDispatched}
          onSave={(value) => updateRecord(record.id, 'titlesDispatched', value as string)}
          options={['N/A', 'Pending', 'Completed']}
          placeholder="Select status"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.validatedFwd}
          onSave={(value) => updateRecord(record.id, 'validatedFwd', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.titlesReturned}
          onSave={(value) => updateRecord(record.id, 'titlesReturned', value as string)}
          options={['N/A', 'Pending', 'Completed']}
          placeholder="Select status"
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
      <td className="border-r border-gray-500 p-1 text-center">
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
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.released}
          onSave={(value) => updateRecord(record.id, 'released', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.docsSentToCustomer}
          onSave={(value) => updateRecord(record.id, 'docsSentToCustomer', value as boolean)}
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
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
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
