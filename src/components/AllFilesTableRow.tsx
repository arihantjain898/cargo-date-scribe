
import React from 'react';
import { Trash2, Archive, ArchiveRestore, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
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

interface AllFilesTableRowProps {
  record: AllFilesRecord;
  index: number;
  updateRecord: (id: string, field: keyof AllFilesRecord, value: string) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  onFileClick?: (fileNumber: string, fileType: string) => void;
}

const AllFilesTableRow = ({
  record,
  index,
  updateRecord,
  deleteRecord,
  onArchive,
  onUnarchive,
  selectedRows,
  setSelectedRows,
  showArchived,
  onFileClick
}: AllFilesTableRowProps) => {
  const isSelected = selectedRows.includes(record.id);
  const isArchived = record.archived === 'true' || record.archived === true;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleFileClick = () => {
    if (onFileClick && record.number && record.file) {
      // Use the file type (ES, IS, DT) and the number to link
      onFileClick(record.number, record.file);
    }
  };

  const rowClassName = `border-b-2 border-gray-400 transition-all duration-200 ${
    isArchived ? 'bg-gray-100 opacity-50' : 
    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
  }`;

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
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={record.file}
            onSave={(value) => updateRecord(record.id, 'file', value as string)}
            options={['ES', 'IS', 'DT']}
          />
          {record.number && record.file && onFileClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileClick}
              className="h-6 w-6 p-0 hover:bg-blue-100"
              title={`Open ${record.file} ${record.number} in checklist`}
            >
              <ExternalLink className="h-3 w-3 text-blue-600" />
            </Button>
          )}
        </div>
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.number}
          onSave={(value) => updateRecord(record.id, 'number', value as string)}
          placeholder="Enter number"
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.originPort}
          onSave={(value) => updateRecord(record.id, 'originPort', value as string)}
          placeholder="Enter origin port"
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.originState}
          onSave={(value) => updateRecord(record.id, 'originState', value as string)}
          placeholder="Enter origin state"
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.destinationPort}
          onSave={(value) => updateRecord(record.id, 'destinationPort', value as string)}
          placeholder="Enter destination port"
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.destinationCountry}
          onSave={(value) => updateRecord(record.id, 'destinationCountry', value as string)}
          placeholder="Enter destination country"
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container20)} font-medium`}>
        <InlineEditCell
          value={record.container20}
          onSave={(value) => updateRecord(record.id, 'container20', value as string)}
          placeholder="20'"
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container40)} font-medium`}>
        <InlineEditCell
          value={record.container40}
          onSave={(value) => updateRecord(record.id, 'container40', value as string)}
          placeholder="40'"
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.roro)} font-medium`}>
        <InlineEditCell
          value={record.roro}
          onSave={(value) => updateRecord(record.id, 'roro', value as string)}
          placeholder="RoRo"
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.lcl)} font-medium`}>
        <InlineEditCell
          value={record.lcl}
          onSave={(value) => updateRecord(record.id, 'lcl', value as string)}
          placeholder="LCL"
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.air)} font-medium`}>
        <InlineEditCell
          value={record.air}
          onSave={(value) => updateRecord(record.id, 'air', value as string)}
          placeholder="Air"
        />
      </td>
      
      <td className={`border-r-4 border-black p-1 ${getContainerVolumeColor(record.truck)} font-medium`}>
        <InlineEditCell
          value={record.truck}
          onSave={(value) => updateRecord(record.id, 'truck', value as string)}
          placeholder="Truck"
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.ssl}
          onSave={(value) => updateRecord(record.id, 'ssl', value as string)}
          placeholder="SSL"
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.nvo}
          onSave={(value) => updateRecord(record.id, 'nvo', value as string)}
          placeholder="NVO"
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.comments}
          onSave={(value) => updateRecord(record.id, 'comments', value as string)}
          placeholder="Enter comments"
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.salesContact}
          onSave={(value) => updateRecord(record.id, 'salesContact', value as string)}
          placeholder="Enter sales contact"
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

export default AllFilesTableRow;
