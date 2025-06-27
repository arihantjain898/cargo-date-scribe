
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
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

interface ImportTrackingTableRowProps {
  record: ImportTrackingRecord;
  index: number;
  updateRecord: (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  showArchived: boolean;
}

const ImportTrackingTableRow = ({ 
  record, 
  index, 
  updateRecord, 
  deleteRecord, 
  onArchive, 
  onUnarchive, 
  showArchived 
}: ImportTrackingTableRowProps) => {
  const isArchived = record.archived;
  const rowClassName = `border-b-2 border-gray-400 transition-all duration-200 ${
    isArchived ? 'bg-gray-100 opacity-50' : 
    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
  }`;

  return (
    <tr className={rowClassName}>
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
          value={record.booking}
          onSave={(value) => updateRecord(record.id, 'booking', value as string)}
          placeholder="Enter booking"
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
          value={record.etaFinalPod}
          onSave={(value) => updateRecord(record.id, 'etaFinalPod', value as string)}
          isDate={true}
          placeholder="Select ETA date"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.bond}
          onSave={(value) => updateRecord(record.id, 'bond', value as string)}
          placeholder="Enter bond"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.poa}
          onSave={(value) => updateRecord(record.id, 'poa', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isf}
          onSave={(value) => updateRecord(record.id, 'isf', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.packingListCommercialInvoice}
          onSave={(value) => updateRecord(record.id, 'packingListCommercialInvoice', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.billOfLading}
          onSave={(value) => updateRecord(record.id, 'billOfLading', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.arrivalNotice}
          onSave={(value) => updateRecord(record.id, 'arrivalNotice', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isfFiled}
          onSave={(value) => updateRecord(record.id, 'isfFiled', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.entryFiled}
          onSave={(value) => updateRecord(record.id, 'entryFiled', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.blRelease}
          onSave={(value) => updateRecord(record.id, 'blRelease', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.customsRelease}
          onSave={(value) => updateRecord(record.id, 'customsRelease', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.invoiceSent}
          onSave={(value) => updateRecord(record.id, 'invoiceSent', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.paymentReceived}
          onSave={(value) => updateRecord(record.id, 'paymentReceived', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.workOrderSetup}
          onSave={(value) => updateRecord(record.id, 'workOrderSetup', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.delivered}
          onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
          placeholder="Select status"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.returned}
          onSave={(value) => updateRecord(record.id, 'returned', value as string)}
          placeholder="Select status"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.deliveryDate}
          onSave={(value) => updateRecord(record.id, 'deliveryDate', value as string)}
          isDate={true}
          placeholder="Select delivery date"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value as string)}
          placeholder="Enter notes"
        />
      </td>
      <td className="p-1 text-center border-r-4 border-black">
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

export default ImportTrackingTableRow;
