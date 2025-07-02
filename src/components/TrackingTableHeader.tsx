
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
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-16">Ref</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-16">File</th>
        <th className="p-2 text-left border-r border-gray-500 bg-blue-100 font-medium text-xs min-w-20">Work Order</th>
        <th className="p-2 text-left border-r border-gray-500 bg-green-100 font-medium text-xs min-w-16">Drop Done</th>
        <th className="p-2 text-left border-r border-gray-500 bg-green-100 font-medium text-xs min-w-20">Drop Date</th>
        <th className="p-2 text-left border-r border-gray-500 bg-green-100 font-medium text-xs min-w-16">Return Needed</th>
        <th className="p-2 text-left border-r border-gray-500 bg-green-100 font-medium text-xs min-w-20">Return Date</th>
        <th className="p-2 text-center border-r border-gray-500 bg-yellow-100 font-medium text-xs w-16">Docs Sent</th>
        <th className="p-2 text-center border-r border-gray-500 bg-yellow-100 font-medium text-xs w-16">Docs Received</th>
        <th className="p-2 text-left border-r border-gray-500 bg-yellow-100 font-medium text-xs min-w-20">Doc Cutoff Date</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">AES/MBL/VGM Sent</th>
        <th className="p-2 text-left border-r border-gray-500 bg-orange-100 font-medium text-xs min-w-16">Titles Dispatched</th>
        <th className="p-2 text-center border-r border-gray-500 bg-orange-100 font-medium text-xs w-16">Validated Fwd</th>
        <th className="p-2 text-left border-r border-gray-500 bg-orange-100 font-medium text-xs min-w-16">Titles Returned</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">SSL Draft Inv Rec</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">Draft Inv Approved</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">Transphere Inv Sent</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">Payment Rec</th>
        <th className="p-2 text-center border-r border-gray-500 bg-red-100 font-medium text-xs w-16">SSL Paid</th>
        <th className="p-2 text-center border-r border-gray-500 bg-purple-100 font-medium text-xs w-16">Insured</th>
        <th className="p-2 text-center border-r border-gray-500 bg-purple-100 font-medium text-xs w-16">Released</th>
        <th className="p-2 text-center border-r border-gray-500 bg-purple-100 font-medium text-xs w-16">Docs Sent to Customer</th>
        <th className="p-2 text-left bg-gray-100 font-medium text-xs min-w-32">Notes</th>
      </tr>
    </thead>
  );
};

export default TrackingTableHeader;
