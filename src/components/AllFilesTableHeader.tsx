
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface AllFilesTableHeaderProps {
  selectedRows: string[];
  data: AllFilesRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const AllFilesTableHeader = ({ selectedRows, data, setSelectedRows }: AllFilesTableHeaderProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <thead className="sticky top-0 bg-white z-30 shadow-sm">
      <tr className="border-b-4 border-black bg-white">
        <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
        <th colSpan={2} className="border-l-4 border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">File Information</th>
        <th colSpan={2} className="border-l-4 border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Route Information</th>
        <th colSpan={2} className="border-l-4 border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Destination</th>
        <th colSpan={6} className="border-l-4 border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Container & Transport Types</th>
        <th colSpan={2} className="border-l-4 border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-pink-200">Service Providers</th>
        <th className="border-l-4 border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-yellow-200 min-w-[100px]">Comments</th>
        <th className="border-l-4 border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[100px]">Sales Contact</th>
        <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-10">
          <Checkbox
            checked={selectedRows.length === data.length && data.length > 0}
            onCheckedChange={handleSelectAll}
            className="h-3 w-3 border"
          />
        </th>
        <th className="bg-gray-100 p-2 text-center font-bold text-gray-900 w-12">Actions</th>
      </tr>
      <tr className="bg-gray-200 border-b-4 border-gray-500 sticky top-[41px] z-30">
        <th className="bg-gray-300 border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 min-w-[120px] sticky left-0 z-40">Customer</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">File</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Number</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Origin Port</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Origin State</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Destination Port</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Destination Country</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">20'</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">40'</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">RoRo</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">LCL</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Air</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Truck</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">SSL</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">NVO</th>
        <th className="border-l-4 border-black border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Comments</th>
        <th className="border-l-4 border-black border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Sales Contact</th>
        <th className="bg-gray-300 border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 w-10">Select</th>
        <th className="bg-gray-300 p-1 text-center text-xs font-bold text-gray-800 w-12">Archive</th>
      </tr>
    </thead>
  );
};

export default AllFilesTableHeader;
