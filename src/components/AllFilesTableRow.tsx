
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
  const isArchived = record.archived === 'true' || record.archived === true;

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
      <td className="p-2 border-b border-gray-200 sticky left-0 bg-inherit z-10 min-w-[120px]">
        <InlineEditCell
          value={record.customer}
          onSave={(value) => updateRecord(record.id, 'customer', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <InlineEditCell
            value={record.file}
            onSave={(value) => updateRecord(record.id, 'file', value as string)}
            options={['ES', 'IS', 'DT']}
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
          onSave={(value) => updateRecord(record.id, 'number', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.originPort}
          onSave={(value) => updateRecord(record.id, 'originPort', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.originState}
          onSave={(value) => updateRecord(record.id, 'originState', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.destinationPort}
          onSave={(value) => updateRecord(record.id, 'destinationPort', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.destinationCountry}
          onSave={(value) => updateRecord(record.id, 'destinationCountry', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.container20)} font-medium`}>
        <InlineEditCell
          value={record.container20}
          onSave={(value) => updateRecord(record.id, 'container20', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.container40)} font-medium`}>
        <InlineEditCell
          value={record.container40}
          onSave={(value) => updateRecord(record.id, 'container40', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.roro)} font-medium`}>
        <InlineEditCell
          value={record.roro}
          onSave={(value) => updateRecord(record.id, 'roro', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.lcl)} font-medium`}>
        <InlineEditCell
          value={record.lcl}
          onSave={(value) => updateRecord(record.id, 'lcl', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.air)} font-medium`}>
        <InlineEditCell
          value={record.air}
          onSave={(value) => updateRecord(record.id, 'air', value as string)}
        />
      </td>
      
      <td className={`p-2 border-b border-gray-200 ${getContainerVolumeColor(record.truck)} font-medium`}>
        <InlineEditCell
          value={record.truck}
          onSave={(value) => updateRecord(record.id, 'truck', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.ssl}
          onSave={(value) => updateRecord(record.id, 'ssl', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.nvo}
          onSave={(value) => updateRecord(record.id, 'nvo', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.comments}
          onSave={(value) => updateRecord(record.id, 'comments', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <InlineEditCell
          value={record.salesContact}
          onSave={(value) => updateRecord(record.id, 'salesContact', value as string)}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
        />
      </td>
      
      <td className="p-2 border-b border-gray-200">
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
      </td>
      
      <td className="p-2 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteRecord(record.id)}
          className="h-7 w-7 p-0 hover:bg-red-100 text-red-600"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </td>
    </tr>
  );
};

export default AllFilesTableRow;
