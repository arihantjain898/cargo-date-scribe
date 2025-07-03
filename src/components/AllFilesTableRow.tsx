import React from 'react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import InlineEditCell from './InlineEditCell';
import AllFilesTableFileCell from './AllFilesTableFileCell';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
  highlightedRowId?: string | null;
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
  onFileClick,
  highlightedRowId
}: AllFilesTableRowProps) => {
  const isSelected = selectedRows.includes(record.id);
  const isArchived = record.archived === 'true' || record.archived === true;
  const isHighlighted = highlightedRowId === record.id;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleFileClick = () => {
    if (onFileClick && record.number && record.file) {
      console.log('AllFiles row clicked - number:', record.number, 'file:', record.file);
      onFileClick(record.number, record.file);
    }
  };

  // More distinctive alternating colors matching export/import tabs with highlight support
  const rowClassName = `border-b-2 border-gray-500 transition-all duration-200 ${
    isHighlighted ? 'bg-yellow-200 animate-pulse' :
    isArchived ? 'bg-gray-200 opacity-60' : 
    index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
  }`;

  // Helper function to get text styling based on content
  const getTextStyling = (value: string, placeholder?: string) => {
    if (!value || value.trim() === '') {
      return 'text-gray-400 italic';
    }
    return 'text-gray-900 font-medium';
  };

  return (
    <tr className={rowClassName} data-row-id={record.id}>
      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={record.customer}
            onSave={(value) => updateRecord(record.id, 'customer', value as string)}
            placeholder="Enter customer"
            className={getTextStyling(record.customer)}
            isTextColumn={true}
          />
          {record.number && record.file && onFileClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileClick}
              className="h-6 w-6 p-0 hover:bg-blue-100"
              title={`Open ${record.file}${record.number} in corresponding tab`}
            >
              <ExternalLink className="h-3 w-3 text-blue-600" />
            </Button>
          )}
        </div>
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <AllFilesTableFileCell
          fileValue={record.file}
          numberValue={record.number}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          className={getTextStyling(record.file)}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.number}
          onSave={(value) => updateRecord(record.id, 'number', value as string)}
          placeholder="Enter number"
          className={getTextStyling(record.number)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.originPort}
          onSave={(value) => updateRecord(record.id, 'originPort', value as string)}
          placeholder="Enter origin port"
          className={getTextStyling(record.originPort)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.originState}
          onSave={(value) => updateRecord(record.id, 'originState', value as string)}
          placeholder="Enter origin state"
          className={getTextStyling(record.originState)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.destinationPort}
          onSave={(value) => updateRecord(record.id, 'destinationPort', value as string)}
          placeholder="Enter destination port"
          className={getTextStyling(record.destinationPort)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.destinationCountry}
          onSave={(value) => updateRecord(record.id, 'destinationCountry', value as string)}
          placeholder="Enter destination country"
          className={getTextStyling(record.destinationCountry)}
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container20)}`}>
        <InlineEditCell
          value={record.container20}
          onSave={(value) => updateRecord(record.id, 'container20', value as string)}
          placeholder="20'"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container40)}`}>
        <InlineEditCell
          value={record.container40}
          onSave={(value) => updateRecord(record.id, 'container40', value as string)}
          placeholder="40'"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.roro)}`}>
        <InlineEditCell
          value={record.roro}
          onSave={(value) => updateRecord(record.id, 'roro', value as string)}
          placeholder="RoRo"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.lcl)}`}>
        <InlineEditCell
          value={record.lcl}
          onSave={(value) => updateRecord(record.id, 'lcl', value as string)}
          placeholder="LCL"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.air)}`}>
        <InlineEditCell
          value={record.air}
          onSave={(value) => updateRecord(record.id, 'air', value as string)}
          placeholder="Air"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className={`border-r-4 border-black p-1 ${getContainerVolumeColor(record.truck)}`}>
        <InlineEditCell
          value={record.truck}
          onSave={(value) => updateRecord(record.id, 'truck', value as string)}
          placeholder="Truck"
          className="font-medium"
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.ssl}
          onSave={(value) => updateRecord(record.id, 'ssl', value as string)}
          placeholder="SSL or Trucker"
          className={getTextStyling(record.ssl)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.nvo}
          onSave={(value) => updateRecord(record.id, 'nvo', value as string)}
          placeholder="NVO"
          className={getTextStyling(record.nvo)}
          isTextColumn={true}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.comments}
          onSave={(value) => updateRecord(record.id, 'comments', value as string)}
          placeholder="Enter comments"
          className={getTextStyling(record.comments)}
          isTextColumn={true}
          isNotesColumn={true}
        />
      </td>
      
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.salesContact}
          onSave={(value) => updateRecord(record.id, 'salesContact', value as string)}
          placeholder="Enter sales contact"
          className={getTextStyling(record.salesContact)}
          isTextColumn={true}
        />
      </td>
      
      <td className="p-1 text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          className="h-3 w-3 border"
        />
      </td>
    </tr>
  );
};

export default AllFilesTableRow;
