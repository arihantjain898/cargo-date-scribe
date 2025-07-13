
import React, { memo, useMemo, useCallback } from 'react';
import { ExternalLink, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TrackingRecord } from '../types/TrackingRecord';
import InlineEditCell from './InlineEditCell';

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
  onFileClick?: (fileNumber: string, fileType: string) => void;
}

const TrackingTableRow = memo(({
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
  const isSelected = useMemo(() => selectedRows.includes(record.id), [selectedRows, record.id]);
  const isArchived = record.archived;
  const isHighlighted = highlightedRowId === record.id;

  const handleCheckboxChange = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  }, [record.id, setSelectedRows]);

  const handleFileClick = useCallback(() => {
    if (onFileClick && record.file) {
      console.log('Export row clicked - file:', record.file);
      onFileClick(record.file, 'allfiles');
    }
  }, [onFileClick, record.file]);

  const handleDateStatusToggle = useCallback((field: 'dropDateStatus' | 'returnDateStatus') => {
    const currentStatus = record[field] || 'gray';
    const statusCycle = ['gray', 'yellow', 'green', 'red'] as const;
    const currentIndex = statusCycle.indexOf(currentStatus);
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

  // Check if all boolean fields are completed - memoized for performance
  const { isCompleted, isEmpty } = useMemo(() => {
    const checkCompleted = (val: string | boolean) => {
      if (val === 'Yes' || val === true || val === 'N/A') return true;
      if (val === 'No' || val === false || val === 'Pending' || val === 'Select' || val === '' || val === undefined) return false;
      return false;
    };
    
    const completed = checkCompleted(record.docsSent) && checkCompleted(record.docsReceived) && checkCompleted(record.aesMblVgmSent) && 
      checkCompleted(record.titlesDispatched) && checkCompleted(record.validatedFwd) && checkCompleted(record.titlesReturned) && 
      checkCompleted(record.sslDraftInvRec) && checkCompleted(record.draftInvApproved) && checkCompleted(record.transphereInvSent) && 
      checkCompleted(record.paymentRec) && checkCompleted(record.sslPaid) && checkCompleted(record.insured) && checkCompleted(record.released) &&
      record.dropDateStatus === 'green' && record.returnDateStatus === 'green';

    const empty = !record.customer && !record.file;
    
    return { isCompleted: completed, isEmpty: empty };
  }, [record]);

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
      {/* Column 1: Customer */}
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
      {/* Column 2: Ref */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.ref}
          onSave={(value) => updateRecord(record.id, 'ref', value as string)}
          placeholder="Enter ref"
          className={isEmpty ? "text-gray-400" : ""}
          isTextColumn={true}
        />
      </td>
      {/* Column 3: File */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
          className={isEmpty ? "text-gray-400" : ""}
          isTextColumn={true}
        />
      </td>
      {/* Column 4: Work Order */}
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.workOrder}
          onSave={(value) => updateRecord(record.id, 'workOrder', value as string)}
          placeholder="Enter work order"
          isTextColumn={true}
        />
      </td>
      {/* Column 5: Drop Date with Status */}
      <td className="border-r border-gray-500 p-1 text-center">
        <div className="flex items-center gap-1 justify-center">
          <InlineEditCell
            value={record.dropDate}
            onSave={(value) => updateRecord(record.id, 'dropDate', value as string)}
            isDate={true}
            placeholder="Select drop date"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateStatusToggle('dropDateStatus')}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title="Toggle status"
          >
            <Circle className={`h-4 w-4 ${getStatusColor(record.dropDateStatus)} border-2 rounded-full`} />
          </Button>
        </div>
      </td>
      {/* Column 6: Return Date with Status */}
      <td className="border-r-4 border-black p-1 text-center">
        <div className="flex items-center gap-1 justify-center">
          <InlineEditCell
            value={record.returnDate}
            onSave={(value) => updateRecord(record.id, 'returnDate', value as string)}
            isDate={true}
            placeholder="Select return date"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateStatusToggle('returnDateStatus')}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            title="Toggle status"
          >
            <Circle className={`h-4 w-4 ${getStatusColor(record.returnDateStatus)} border-2 rounded-full`} />
          </Button>
        </div>
      </td>
      {/* Column 7: Docs Sent */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.docsSent}
          onSave={(value) => updateRecord(record.id, 'docsSent', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 8: Docs Received */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.docsReceived}
          onSave={(value) => updateRecord(record.id, 'docsReceived', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 9: Doc Cutoff Date */}
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.docCutoffDate}
          onSave={(value) => updateRecord(record.id, 'docCutoffDate', value as string)}
          isDate={true}
          placeholder="Select cutoff date"
        />
      </td>
      {/* Column 10: AES/MBL/VGM Sent */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.aesMblVgmSent}
          onSave={(value) => updateRecord(record.id, 'aesMblVgmSent', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 11: Titles Dispatched */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.titlesDispatched || 'Select'}
          onSave={(value) => updateRecord(record.id, 'titlesDispatched', value as string)}
          isFiveStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 12: Validated Fwd */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.validatedFwd || 'Select'}
          onSave={(value) => updateRecord(record.id, 'validatedFwd', value as string)}
          isFiveStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 13: Titles Returned */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.titlesReturned || 'Select'}
          onSave={(value) => updateRecord(record.id, 'titlesReturned', value as string)}
          isFiveStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 14: SSL Draft Inv Rec */}
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.sslDraftInvRec}
          onSave={(value) => updateRecord(record.id, 'sslDraftInvRec', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 15: Draft Inv Approved */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.draftInvApproved}
          onSave={(value) => updateRecord(record.id, 'draftInvApproved', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 16: Transphere Inv Sent */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.transphereInvSent}
          onSave={(value) => updateRecord(record.id, 'transphereInvSent', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 17: Payment Rec */}
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.paymentRec}
          onSave={(value) => updateRecord(record.id, 'paymentRec', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 18: SSL Paid */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.sslPaid}
          onSave={(value) => updateRecord(record.id, 'sslPaid', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 19: Insured */}
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.insured}
          onSave={(value) => updateRecord(record.id, 'insured', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 20: Released */}
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.released}
          onSave={(value) => updateRecord(record.id, 'released', value as string)}
          isThreeStateBoolean={true}
          selectText="Select"
        />
      </td>
      {/* Column 21: Notes */}
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value as string)}
          placeholder="Enter notes"
          isTextColumn={true}
          isNotesColumn={true}
        />
      </td>
      {/* Column 22: Select */}
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

export default TrackingTableRow;
