
import React, { useState } from 'react';
import { ExternalLink, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import InlineEditCell from './InlineEditCell';

interface ImportTrackingTableRowProps {
  record: ImportTrackingRecord;
  index: number;
  updateRecord: (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  highlightedRowId?: string | null;
  onFileClick?: (fileNumber: string, fileType: string) => void;
}

const ImportTrackingTableRow = ({
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
}: ImportTrackingTableRowProps) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const isSelected = selectedRows.includes(record.id);
  const isArchived = record.archived;
  const isHighlighted = highlightedRowId === record.id;

  // Check if all boolean fields are true (completed) - FIXED: including 'returned' in the check
  const isCompleted = record.poa === 'Yes' && record.isf === 'Yes' && record.packingListCommercialInvoice === 'Yes' && 
    record.billOfLading === 'Yes' && record.arrivalNotice === 'Yes' && record.isfFiled === 'Yes' && record.entryFiled === 'Yes' && 
    record.blRelease === 'Yes' && record.customsRelease === 'Yes' && record.invoiceSent === 'Yes' && record.paymentReceived === 'Yes' && 
    record.workOrderSetup === 'Yes' && record.delivered === 'Yes' && record.returned === 'Yes';

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
      console.log('Import row clicked - file:', record.file);
      onFileClick(record.file, 'allfiles');
    }
  };

  const handleBookingClick = () => {
    if (record.bookingUrl) {
      window.open(record.bookingUrl, '_blank');
    } else {
      setShowUrlInput(true);
    }
  };

  // More distinctive alternating colors matching export tabs with highlight support
  const rowClassName = `border-b-2 border-gray-500 transition-all duration-200 ${
    isHighlighted ? 'bg-yellow-200 animate-pulse' :
    isArchived ? 'bg-gray-200 opacity-60' : 
    index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
  } ${isCompleted ? 'border-4 border-green-500 bg-green-50' : ''}`;

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
      {/* Column 2: Booking */}
      <td className="border-r border-gray-500 p-1 text-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {record.bookingUrl ? (
              <button
                onClick={handleBookingClick}
                className="text-blue-600 hover:text-blue-800 underline text-left flex items-center gap-1"
                title={`Go to: ${record.bookingUrl}`}
              >
                {record.booking || 'Enter booking'}
                <ExternalLink className="h-3 w-3" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <InlineEditCell
                  value={record.booking}
                  onSave={(value) => updateRecord(record.id, 'booking', value as string)}
                  placeholder="Enter booking"
                  className={isEmpty ? "text-gray-400" : ""}
                  isTextColumn={true}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlInput(true)}
                  className="h-5 w-5 p-0 hover:bg-blue-100"
                  title="Add booking URL"
                >
                  <Link className="h-3 w-3 text-gray-400 hover:text-blue-600" />
                </Button>
              </div>
            )}
          </div>
          {showUrlInput && (
            <InlineEditCell
              value={record.bookingUrl || ''}
              onSave={(value) => {
                updateRecord(record.id, 'bookingUrl', value as string);
                setShowUrlInput(false);
              }}
              placeholder="Enter booking URL (optional)"
              className="text-xs text-gray-500"
              isTextColumn={true}
            />
          )}
        </div>
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
          className={isEmpty ? "text-gray-400" : ""}
          isTextColumn={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.etaFinalPod}
          onSave={(value) => updateRecord(record.id, 'etaFinalPod', value as string)}
          isDate={true}
          placeholder="Select ETA"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.bond || 'Select'}
          onSave={(value) => updateRecord(record.id, 'bond', value as string)}
          isBondColumn={true}
          placeholder="Select bond type"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.poa}
          onSave={(value) => updateRecord(record.id, 'poa', value as string)}
          isPoaColumn={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isf}
          onSave={(value) => updateRecord(record.id, 'isf', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.packingListCommercialInvoice}
          onSave={(value) => updateRecord(record.id, 'packingListCommercialInvoice', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.billOfLading}
          onSave={(value) => updateRecord(record.id, 'billOfLading', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.arrivalNotice}
          onSave={(value) => updateRecord(record.id, 'arrivalNotice', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isfFiled}
          onSave={(value) => updateRecord(record.id, 'isfFiled', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.entryFiled}
          onSave={(value) => updateRecord(record.id, 'entryFiled', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.blRelease}
          onSave={(value) => updateRecord(record.id, 'blRelease', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.customsRelease}
          onSave={(value) => updateRecord(record.id, 'customsRelease', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.invoiceSent}
          onSave={(value) => updateRecord(record.id, 'invoiceSent', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.paymentReceived}
          onSave={(value) => updateRecord(record.id, 'paymentReceived', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.workOrderSetup}
          onSave={(value) => updateRecord(record.id, 'workOrderSetup', value as string)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.delivered || 'Select'}
          onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
          options={['Select', 'Pending', 'Yes', 'No']}
          placeholder="Select status"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.returned || 'Select'}
          onSave={(value) => updateRecord(record.id, 'returned', value as string)}
          options={['Select', 'Pending', 'Yes', 'No']}
          placeholder="Select status"
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
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
};

export default ImportTrackingTableRow;
