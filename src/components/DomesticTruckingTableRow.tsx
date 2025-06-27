
import React from 'react';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
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

interface DomesticTruckingTableRowProps {
  record: DomesticTruckingRecord;
  index: number;
  updateRecord: (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  showArchived: boolean;
  selectedRows?: string[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
}

const DomesticTruckingTableRow = ({ 
  record, 
  index, 
  updateRecord, 
  deleteRecord, 
  onArchive, 
  onUnarchive, 
  showArchived,
  selectedRows = [],
  setSelectedRows
}: DomesticTruckingTableRowProps) => {
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
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value)}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <input
          type="checkbox"
          checked={record.woSent}
          onChange={(e) => updateRecord(record.id, 'woSent', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <input
          type="checkbox"
          checked={record.insurance}
          onChange={(e) => updateRecord(record.id, 'insurance', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.pickDate}
          onSave={(value) => updateRecord(record.id, 'pickDate', value)}
          isDate={true}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.delivered}
          onSave={(value) => updateRecord(record.id, 'delivered', value)}
          isDate={true}
        />
      </td>
      <td className="border-r border-gray-300 p-1 text-center">
        <input
          type="checkbox"
          checked={record.paymentReceived}
          onChange={(e) => updateRecord(record.id, 'paymentReceived', e.target.checked)}
          className="w-4 h-4"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <input
          type="checkbox"
          checked={record.paymentMade}
          onChange={(e) => updateRecord(record.id, 'paymentMade', e.target.checked)}
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

export default DomesticTruckingTableRow;
