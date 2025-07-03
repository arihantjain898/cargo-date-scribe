
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import InlineEditCell from './InlineEditCell';

interface DomesticTruckingTableRowProps {
  record: DomesticTruckingRecord;
  index: number;
  updateRecord: (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  highlightedRowId?: string | null;
  onFileClick?: (fileNumber: string, fileType: string) => void;
}

const DomesticTruckingTableRow = ({
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
}: DomesticTruckingTableRowProps) => {
  const isSelected = selectedRows.includes(record.id);
  const isArchived = record.archived;
  const isHighlighted = highlightedRowId === record.id;

  // Check if all boolean fields are true (completed)
  const isCompleted = record.woSent && record.insurance && record.paymentReceived && record.paymentMade;

  // Check if record is empty (has no meaningful data)
  const isEmpty = !record.customer && !record.file;

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleFileClick = () => {
    if (onFileClick && record.file) {
      // Parse the file to extract file type and number for reverse linking
      const fileMatch = record.file.match(/^([A-Za-z]{1,2})(\d+)$/);
      if (fileMatch) {
        const [, fileType, fileNumber] = fileMatch;
        console.log('Domestic row clicked - parsed fileType:', fileType, 'fileNumber:', fileNumber);
        onFileClick(fileNumber, fileType);
      } else {
        console.log('Domestic row clicked - could not parse file:', record.file);
        // Fallback: treat the whole file as fileNumber with empty fileType
        onFileClick(record.file, '');
      }
    }
  };

  // More distinctive alternating colors matching export/import tabs
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
            isTextColumn={true}
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
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
          className={isEmpty ? "text-gray-400" : ""}
          isTextColumn={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.woSent}
          onSave={(value) => updateRecord(record.id, 'woSent', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.insurance}
          onSave={(value) => updateRecord(record.id, 'insurance', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.pickDate}
          onSave={(value) => updateRecord(record.id, 'pickDate', value as string)}
          isDate={true}
          placeholder="Select pick date"
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.delivered}
          onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
          isDate={true}
          placeholder="Select delivery date"
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
          value={record.paymentMade}
          onSave={(value) => updateRecord(record.id, 'paymentMade', value as boolean)}
          isBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value as string)}
          placeholder="Enter notes"
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

export default DomesticTruckingTableRow;
