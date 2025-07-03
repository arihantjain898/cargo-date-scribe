
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

  // Check if all boolean fields are true (completed)
  const isCompleted = record.poa && record.isf && record.packingListCommercialInvoice && 
    record.billOfLading && record.arrivalNotice && record.isfFiled && record.entryFiled && 
    record.blRelease && record.customsRelease && record.invoiceSent && record.paymentReceived && 
    record.workOrderSetup && record.delivered === 'Yes';

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
      // Extract number from file (remove letters)
      const fileNumber = record.file.replace(/[^0-9]/g, '');
      // Extract letters from file
      const fileType = record.file.replace(/[0-9]/g, '');
      console.log('Import row clicked - extracted number:', fileNumber, 'fileType:', fileType);
      onFileClick(fileNumber, fileType || 'IS');
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
      <td className="border-r border-gray-500 p-1">
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
            />
          )}
        </div>
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          placeholder="Enter file"
          className={isEmpty ? "text-gray-400" : ""}
        />
      </td>
      <td className="border-r-4 border-black p-1">
        <InlineEditCell
          value={record.etaFinalPod}
          onSave={(value) => updateRecord(record.id, 'etaFinalPod', value as string)}
          isDate={true}
          placeholder="Select ETA"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.bond || 'Continuous'}
          onSave={(value) => updateRecord(record.id, 'bond', value as string)}
          isBondColumn={true}
          placeholder="Select bond type"
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.poa === null || record.poa === undefined ? 'Select Value' : 
                 record.poa === true ? 'Yes' : 
                 record.poa === false ? 'No' : 'Select Value'}
          onSave={(value) => {
            if (value === 'Yes') {
              updateRecord(record.id, 'poa', true);
            } else if (value === 'No') {
              updateRecord(record.id, 'poa', false);
            } else if (value === 'Pending') {
              updateRecord(record.id, 'poa', null);
            }
          }}
          isPoaColumn={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isf === null || record.isf === undefined ? '' : record.isf}
          onSave={(value) => updateRecord(record.id, 'isf', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.packingListCommercialInvoice === null || record.packingListCommercialInvoice === undefined ? '' : record.packingListCommercialInvoice}
          onSave={(value) => updateRecord(record.id, 'packingListCommercialInvoice', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.billOfLading === null || record.billOfLading === undefined ? '' : record.billOfLading}
          onSave={(value) => updateRecord(record.id, 'billOfLading', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.arrivalNotice === null || record.arrivalNotice === undefined ? '' : record.arrivalNotice}
          onSave={(value) => updateRecord(record.id, 'arrivalNotice', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.isfFiled === null || record.isfFiled === undefined ? '' : record.isfFiled}
          onSave={(value) => updateRecord(record.id, 'isfFiled', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.entryFiled === null || record.entryFiled === undefined ? '' : record.entryFiled}
          onSave={(value) => updateRecord(record.id, 'entryFiled', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.blRelease === null || record.blRelease === undefined ? '' : record.blRelease}
          onSave={(value) => updateRecord(record.id, 'blRelease', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.customsRelease === null || record.customsRelease === undefined ? '' : record.customsRelease}
          onSave={(value) => updateRecord(record.id, 'customsRelease', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.invoiceSent === null || record.invoiceSent === undefined ? '' : record.invoiceSent}
          onSave={(value) => updateRecord(record.id, 'invoiceSent', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1 text-center">
        <InlineEditCell
          value={record.paymentReceived === null || record.paymentReceived === undefined ? '' : record.paymentReceived}
          onSave={(value) => updateRecord(record.id, 'paymentReceived', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r-4 border-black p-1 text-center">
        <InlineEditCell
          value={record.workOrderSetup === null || record.workOrderSetup === undefined ? '' : record.workOrderSetup}
          onSave={(value) => updateRecord(record.id, 'workOrderSetup', value as boolean)}
          isThreeStateBoolean={true}
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.delivered}
          onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
          options={['No', 'Yes', 'Partial']}
          placeholder="Select status"
        />
      </td>
      <td className="border-r border-gray-500 p-1">
        <InlineEditCell
          value={record.returned}
          onSave={(value) => updateRecord(record.id, 'returned', value as string)}
          options={['No', 'Yes', 'Partial']}
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
