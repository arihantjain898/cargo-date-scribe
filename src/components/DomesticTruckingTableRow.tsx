import React, { memo, useMemo, useCallback } from 'react';
import { ExternalLink, Circle } from 'lucide-react';
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

const DomesticTruckingTableRow = memo(({
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
  const isSelected = useMemo(() => selectedRows.includes(record.id), [selectedRows, record.id]);
  const isArchived = record.archived;
  const isHighlighted = highlightedRowId === record.id;

  // Memoized computed values for performance
  const { isCompleted, isEmpty } = useMemo(() => {
    const checkCompleted = (val: string | boolean) => {
      if (val === 'Yes' || val === true || val === 'N/A') return true;
      if (val === 'No' || val === false || val === 'Pending' || val === 'Select' || val === '' || val === undefined) return false;
      return false;
    };
    
    const completed = checkCompleted(record.woSent) && checkCompleted(record.insurance) && 
      checkCompleted(record.paymentReceived) && checkCompleted(record.paymentMade) && 
      record.pickDateStatus === 'green' && record.deliveredStatus === 'green';
    
    const empty = !record.customer && !record.file;
    
    return { isCompleted: completed, isEmpty: empty };
  }, [record]);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  }, [record.id, setSelectedRows]);

  const handleFileClick = useCallback(() => {
    if (onFileClick && record.file) {
      console.log('Domestic row clicked - file:', record.file);
      onFileClick(record.file, 'allfiles');
    }
  }, [onFileClick, record.file]);

  const handleDateStatusToggle = useCallback((field: 'pickDateStatus' | 'deliveredStatus') => {
    const currentStatus = record[field] || 'gray';
    const statusCycle = ['gray', 'yellow', 'green', 'red'] as const;
    const currentIndex = statusCycle.indexOf(currentStatus as 'gray' | 'yellow' | 'green' | 'red');
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    updateRecord(record.id, field, nextStatus);
  }, [record, updateRecord]);

  const getStatusColor = useCallback((status?: string) => {
    switch (status) {
      case 'yellow':
        return 'bg-yellow-400 border-yellow-500';
      case 'green':
        return 'bg-green-400 border-green-500';
      case 'red':
        return 'bg-red-400 border-red-500';
      default:
        return 'bg-gray-400 border-gray-500';
    }
  }, []);

  // Memoized row className for performance
  const rowClassName = useMemo(() => 
    `border-b-2 border-gray-500 ${
      isHighlighted ? 'bg-yellow-200' :
      isArchived ? 'bg-gray-200 opacity-60' : 
      index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
    } ${isCompleted ? 'border-4 border-green-500 bg-green-50' : ''}`,
    [isHighlighted, isArchived, index, isCompleted]
  );

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
      <td className="border-r-4 border-black p-1 text-center">
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
          value={record.woSent || 'Select'}
          onSave={(value) => updateRecord(record.id, 'woSent', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.insurance || 'Select'}
          onSave={(value) => updateRecord(record.id, 'insurance', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <div className="flex items-center gap-1 justify-center">
          <InlineEditCell
            value={record.pickDate}
            onSave={(value) => updateRecord(record.id, 'pickDate', value as string)}
            isDate={true}
            placeholder="Select pick date"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateStatusToggle('pickDateStatus')}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title="Toggle status"
          >
            <Circle className={`h-4 w-4 ${getStatusColor(record.pickDateStatus)} border-2 rounded-full`} />
          </Button>
        </div>
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <div className="flex items-center gap-1 justify-center">
          <InlineEditCell
            value={record.delivered}
            onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
            isDate={true}
            placeholder="Select delivery date"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateStatusToggle('deliveredStatus')}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title="Toggle status"
          >
            <Circle className={`h-4 w-4 ${getStatusColor(record.deliveredStatus)} border-2 rounded-full`} />
          </Button>
        </div>
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.paymentReceived || 'Select'}
          onSave={(value) => updateRecord(record.id, 'paymentReceived', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.paymentMade || 'Select'}
          onSave={(value) => updateRecord(record.id, 'paymentMade', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-left">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value as string)}
          placeholder="Enter notes"
          isTextColumn={true}
          isNotesColumn={true}
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
});

export default DomesticTruckingTableRow;
