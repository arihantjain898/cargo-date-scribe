
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
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="p-2 text-left border-r border-gray-500 bg-gray-100 font-medium text-xs w-8">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isSomeSelected;
            }}
            onCheckedChange={handleSelectAll}
            className="h-3 w-3 border"
          />
        </th>
        <th className="p-2 text-center border-r border-gray-500 bg-gray-100 font-medium text-xs w-8">Archive</th>
        <th className="p-2 text-center border-r border-gray-500 bg-gray-100 font-medium text-xs w-8">Delete</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-24">Customer</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-16">Booking</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-16">File</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-16">Bond</th>
        <th className="p-2 text-left border-r border-gray-500 bg-yellow-100 font-medium text-xs min-w-20">ETA Final POD</th>
        <th className="p-2 text-center border-r border-gray-500 bg-green-100 font-medium text-xs w-12">POA</th>
        <th className="p-2 text-center border-r border-gray-500 bg-green-100 font-medium text-xs w-12">ISF</th>
        <th className="p-2 text-center border-r border-gray-500 bg-green-100 font-medium text-xs w-16">Packing List/CI</th>
        <th className="p-2 text-center border-r border-gray-500 bg-green-100 font-medium text-xs w-12">B/L</th>
        <th className="p-2 text-center border-r border-gray-500 bg-green-100 font-medium text-xs w-16">Arrival Notice</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">ISF Filed</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">Entry Filed</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">BL Release</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">Customs Release</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">Invoice Sent</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">Payment Received</th>
        <th className="p-2 text-center border-r border-gray-500 bg-purple-100 font-medium text-xs w-16">W/O Setup</th>
        <th className="p-2 text-left border-r border-gray-500 bg-purple-100 font-medium text-xs min-w-16">Delivered</th>
        <th className="p-2 text-left border-r border-gray-500 bg-purple-100 font-medium text-xs min-w-16">Returned</th>
        <th className="p-2 text-left border-r border-gray-500 bg-purple-100 font-medium text-xs min-w-20">Delivery Date</th>
        <th className="p-2 text-left bg-gray-100 font-medium text-xs min-w-32">Notes</th>
      </tr>
    </thead>
  );
};

export default ImportTrackingTableHeader;
