
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Archive, ArchiveRestore, ArrowLeft } from 'lucide-react';
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
  isHighlighted?: boolean;
  onBackToAllFiles?: (fileNumber: string, fileType: string) => void;
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
  isHighlighted,
  onBackToAllFiles
}: DomesticTruckingTableRowProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  };

  const handleBackToAllFiles = () => {
    if (onBackToAllFiles && record.file) {
      // Extract file type and number from the file field
      const fileType = record.file.substring(0, 2); // e.g., "DT"
      const fileNumber = record.file.substring(2); // e.g., "001"
      onBackToAllFiles(fileNumber, fileType);
    }
  };

  return (
    <tr className={`border-b hover:bg-gray-50 ${isHighlighted ? 'bg-yellow-100' : ''} ${record.archived ? 'opacity-50' : ''}`}>
      <td className="p-2 border-r">
        <input
          type="checkbox"
          checked={selectedRows.includes(record.id)}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="rounded"
        />
      </td>
      <td className="p-2 border-r text-xs font-medium">
        <div className="flex items-center gap-2">
          {onBackToAllFiles && record.file && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToAllFiles}
              className="h-6 w-6 p-0"
              title="Back to All Files"
            >
              <ArrowLeft className="h-3 w-3" />
            </Button>
          )}
          <InlineEditCell
            value={record.customer}
            onSave={(value) => updateRecord(record.id, 'customer', value)}
          />
        </div>
      </td>
      <td className="p-2 border-r">
        <InlineEditCell
          value={record.file}
          onSave={(value) => updateRecord(record.id, 'file', value)}
        />
      </td>
      <td className="p-2 border-r text-center">
        <input
          type="checkbox"
          checked={record.woSent}
          onChange={(e) => updateRecord(record.id, 'woSent', e.target.checked)}
          className="rounded"
        />
      </td>
      <td className="p-2 border-r text-center">
        <input
          type="checkbox"
          checked={record.insurance}
          onChange={(e) => updateRecord(record.id, 'insurance', e.target.checked)}
          className="rounded"
        />
      </td>
      <td className="p-2 border-r">
        <InlineEditCell
          value={record.pickDate}
          onSave={(value) => updateRecord(record.id, 'pickDate', value)}
        />
      </td>
      <td className="p-2 border-r">
        <InlineEditCell
          value={record.delivered}
          onSave={(value) => updateRecord(record.id, 'delivered', value)}
        />
      </td>
      <td className="p-2 border-r text-center">
        <input
          type="checkbox"
          checked={record.paymentReceived}
          onChange={(e) => updateRecord(record.id, 'paymentReceived', e.target.checked)}
          className="rounded"
        />
      </td>
      <td className="p-2 border-r text-center">
        <input
          type="checkbox"
          checked={record.paymentMade}
          onChange={(e) => updateRecord(record.id, 'paymentMade', e.target.checked)}
          className="rounded"
        />
      </td>
      <td className="p-2 border-r">
        <InlineEditCell
          value={record.notes}
          onSave={(value) => updateRecord(record.id, 'notes', value)}
        />
      </td>
      <td className="p-2 text-center">
        <div className="flex items-center justify-center gap-1">
          {showArchived ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnarchive(record.id)}
              className="h-6 w-6 p-0"
              title="Unarchive"
            >
              <ArchiveRestore className="h-3 w-3" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(record.id)}
              className="h-6 w-6 p-0"
              title="Archive"
            >
              <Archive className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteRecord(record.id)}
            className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default DomesticTruckingTableRow;
