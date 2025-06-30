
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface AllFilesTableHeaderProps {
  selectedRows: string[];
  data: AllFilesRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const AllFilesTableHeader = ({ selectedRows, data, setSelectedRows }: AllFilesTableHeaderProps) => {
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isPartiallySelected = selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <thead className="bg-gray-100 sticky top-0 z-10">
      <tr className="text-xs font-bold text-gray-700">
        <th className="border-r-4 border-black p-2 text-left sticky left-0 z-20 bg-gray-100 min-w-32">
          Customer
        </th>
        <th className="border-r border-gray-500 p-2 text-left min-w-20">
          File
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-20">
          Number
        </th>
        <th className="border-r border-gray-500 p-2 text-left min-w-24">
          Origin Port
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-24">
          Origin State
        </th>
        <th className="border-r border-gray-500 p-2 text-left min-w-32">
          Destination Port
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-32">
          Destination Country
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-16">
          20'
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-16">
          40'
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-16">
          RoRo
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-16">
          LCL
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-16">
          Air
        </th>
        <th className="border-r-4 border-black p-2 text-center min-w-16">
          Truck
        </th>
        <th className="border-r border-gray-500 p-2 text-left min-w-24">
          SSL or Trucker
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-20">
          NVO
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-32">
          Comments
        </th>
        <th className="border-r-4 border-black p-2 text-left min-w-32">
          Sales Contact
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-12">
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isPartiallySelected;
            }}
            onCheckedChange={handleSelectAll}
            className="h-3 w-3 border"
          />
        </th>
        <th className="border-r border-gray-500 p-2 text-center min-w-12">
          Archive
        </th>
        <th className="p-2 text-center min-w-12">
          Delete
        </th>
      </tr>
    </thead>
  );
};

export default AllFilesTableHeader;
