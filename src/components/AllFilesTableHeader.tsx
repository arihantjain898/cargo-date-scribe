import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface AllFilesTableHeaderProps {
  selectedRows: string[];
  data: AllFilesRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const AllFilesTableHeader = ({ 
  selectedRows, 
  data, 
  setSelectedRows,
  searchTerm,
  setSearchTerm 
}: AllFilesTableHeaderProps) => {
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
    <>
      <div className="p-4 border-b bg-gray-50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer, file, port, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>
      <thead className="sticky top-0 bg-white z-30 shadow-sm">
        <tr className="border-b-4 border-black bg-white">
          <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
          <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">File Information</th>
          <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Origin</th>
          <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Destination</th>
          <th colSpan={6} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Container & Transport Types</th>
          <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-pink-200">Service Providers</th>
          <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-yellow-200 min-w-[100px]">Comments</th>
          <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[100px]">Sales Contact</th>
          <th className="bg-red-200 p-2 text-center font-bold text-gray-900">Select</th>
        </tr>
        <tr className="bg-gray-200 border-b-4 border-gray-500 sticky top-[41px] z-30">
          <th className="bg-gray-300 border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 min-w-[100px] sticky left-0 z-40">Customer</th>
          <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">File</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Number</th>
          <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Origin Port</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Origin State</th>
          <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Destination Port</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[110px]">Destination Country</th>
          <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">20'</th>
          <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">40'</th>
          <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">RoRo</th>
          <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">LCL</th>
          <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">Air</th>
          <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[50px]">Truck</th>
          <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">SSL or Trucker</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">NVO</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Comments</th>
          <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Sales Contact</th>
          <th className="bg-gray-300 p-1 text-center text-xs font-bold text-gray-800 w-10">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="h-3 w-3 border"
              {...(isIndeterminate && { 'data-indeterminate': true })}
            />
            <div className="text-[8px] leading-tight mt-1">Select</div>
          </th>
        </tr>
      </thead>
    </>
  );
};

export default AllFilesTableHeader;
