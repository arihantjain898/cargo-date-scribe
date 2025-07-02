
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

interface ImportTrackingTableHeaderProps {
  selectedRows: string[];
  data: ImportTrackingRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImportTrackingTableHeader = ({ selectedRows, data, setSelectedRows }: ImportTrackingTableHeaderProps) => {
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
          Booking
        </th>
        <th className="border-r-4 border-black p-1 text-left font-semibold text-gray-700">
          File
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          ETA Final POD
        </th>
        <th className="border-r border-gray-500 p-1 text-left font-semibold text-gray-700">
          Bond
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          POA
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          ISF
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Packing List/Commercial Invoice
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Bill of Lading
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Arrival Notice
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          ISF Filed
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Entry Filed
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          BL Release
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Customs Release
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Invoice Sent
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Payment Received
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Work Order Setup
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Delivered
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Returned
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Delivery Date
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

export default ImportTrackingTableHeader;
