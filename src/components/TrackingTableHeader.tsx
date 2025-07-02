
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { TrackingRecord } from '../types/TrackingRecord';

interface TrackingTableHeaderProps {
  selectedRows: string[];
  data: TrackingRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const TrackingTableHeader = ({ selectedRows, data, setSelectedRows }: TrackingTableHeaderProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="border-r-4 border-black p-1 text-left font-semibold text-gray-700 sticky left-0 z-20 bg-gray-50">
          Customer
        </th>
        <th className="border-r border-gray-500 p-1 text-left font-semibold text-gray-700">
          Ref
        </th>
        <th className="border-r-4 border-black p-1 text-left font-semibold text-gray-700">
          File
        </th>
        <th className="border-r border-gray-500 p-1 text-left font-semibold text-gray-700">
          Work Order
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Drop Done
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Drop Date
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Return Needed
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Return Date
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Docs Sent
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Docs Received
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Doc Cutoff Date
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          AES/MBL/VGM Sent
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Titles Dispatched
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Validated Fwd
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Titles Returned
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          SSL Draft Inv Rec
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Draft Inv Approved
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Transphere Inv Sent
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Payment Rec
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          SSL Paid
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Insured
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Released
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Docs Sent to Customer
        </th>
        <th className="border-r-4 border-black p-1 text-left font-semibold text-gray-700">
          Notes
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            className="h-3 w-3 border"
          />
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Archive
        </th>
        <th className="p-1 text-center font-semibold text-gray-700">
          Delete
        </th>
      </tr>
    </thead>
  );
};

export default TrackingTableHeader;
