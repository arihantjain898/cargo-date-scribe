
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

interface DomesticTruckingTableHeaderProps {
  selectedRows: string[];
  data: DomesticTruckingRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const DomesticTruckingTableHeader = ({ selectedRows, data, setSelectedRows }: DomesticTruckingTableHeaderProps) => {
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
        <th className="border-r-4 border-black p-1 text-left font-semibold text-gray-700">
          File
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          WO Sent
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Insurance
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Pick Date
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Delivered
        </th>
        <th className="border-r border-gray-500 p-1 text-center font-semibold text-gray-700">
          Payment Received
        </th>
        <th className="border-r-4 border-black p-1 text-center font-semibold text-gray-700">
          Payment Made
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

export default DomesticTruckingTableHeader;
