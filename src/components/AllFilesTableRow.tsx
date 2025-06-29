
import React from 'react';
import { Trash2, Archive, ArchiveRestore, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import InlineEditCell from './InlineEditCell';

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
  const isArchived = record.archived === 'true';

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleFileClick = () => {
    if (onFileClick && record.number) {
      onFileClick(record.number, record.file);
    }
  };

  const rowClasses = `
    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
    ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
    ${isArchived ? 'opacity-60' : ''}
    hover:bg-gray-100 transition-colors
  `;

  return (
    <tr className={rowClasses}>
      <td className="p-2 border-b border-gray-200 sticky left-0 bg-inherit z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200 sticky left-8 bg-inherit z-10">
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={record.file}
            onUpdate={(value) => updateRecord(record.id, 'file', value)}
            type="select"
            options={['ES', 'IS', 'DT', 'LC']}
          />
          {record.number && onFileClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileClick}
              className="h-6 w-6 p-0 hover:bg-blue-100"
              title="Open linked checklist"
            >
              <ExternalLink className="h-3 w-3 text-blue-600" />
            </Button>
          )}
        </div>
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.number}
          onUpdate={(value) => updateRecord(record.id, 'number', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.customer}
          onUpdate={(value) => updateRecord(record.id, 'customer', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.originPort}
          onUpdate={(value) => updateRecord(record.id, 'originPort', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.originState}
          onUpdate={(value) => updateRecord(record.id, 'originState', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.destinationPort}
          onUpdate={(value) => updateRecord(record.id, 'destinationPort', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.destinationCountry}
          onUpdate={(value) => updateRecord(record.id, 'destinationCountry', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.container20)} font-medium`}>
        <InlineEditCell
          value={record.container20}
          onUpdate={(value) => updateRecord(record.id, 'container20', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.container40)} font-medium`}>
        <InlineEditCell
          value={record.container40}
          onUpdate={(value) => updateRecord(record.id, 'container40', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.roro)} font-medium`}>
        <InlineEditCell
          value={record.roro}
          onUpdate={(value) => updateRecord(record.id, 'roro', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.lcl)} font-medium`}>
        <InlineEditCell
          value={record.lcl}
          onUpdate={(value) => updateRecord(record.id, 'lcl', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.air)} font-medium`}>
        <InlineEditCell
          value={record.air}
          onUpdate={(value) => updateRecord(record.id, 'air', value)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.truck)} font-medium`}>
        <InlineEditCell
          value={record.truck}
          onUpdate={(value) => updateRecord(record.id, 'truck', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.ssl}
          onUpdate={(value) => updateRecord(record.id, 'ssl', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.nvo}
          onUpdate={(value) => updateRecord(record.id, 'nvo', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.comments}
          onUpdate={(value) => updateRecord(record.id, 'comments', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.salesContact}
          onUpdate={(value) => updateRecord(record.id, 'salesContact', value)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200 sticky right-0 bg-inherit">
        <div className="flex items-center gap-1">
          {!showArchived && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(record.id)}
              className="h-7 w-7 p-0 hover:bg-gray-200"
              title="Archive"
            >
              <Archive className="h-3 w-3" />
            </Button>
          )}
          
          {showArchived && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnarchive(record.id)}
              className="h-7 w-7 p-0 hover:bg-gray-200"
              title="Unarchive"
            >
              <ArchiveRestore className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteRecord(record.id)}
            className="h-7 w-7 p-0 hover:bg-red-100 text-red-600"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default AllFilesTableRow;
