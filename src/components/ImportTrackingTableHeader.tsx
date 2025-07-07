
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

interface ImportTrackingTableHeaderProps {
  selectedRows: string[];
  data: ImportTrackingRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ImportTrackingTableHeader = ({
  selectedRows,
  data,
  setSelectedRows,
  searchTerm,
  setSearchTerm
}: ImportTrackingTableHeaderProps) => {
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
    <thead className="sticky top-0 bg-white z-30 shadow-sm">
      <tr className="bg-white border-b">
        <th colSpan={22} className="p-4 text-left">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer, booking, file, bond..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </th>
      </tr>
      <tr className="border-b-4 border-black bg-white">
        <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-24 sticky left-0 z-40">Customer</th>
        <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
        <th colSpan={5} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Documentation</th>
        <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-yellow-200">Processing</th>
        <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Final Steps</th>
        <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Delivery</th>
        <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[120px]">Notes</th>
        <th className="bg-red-200 p-2 text-center font-bold text-gray-900">Select</th>
      </tr>
      <tr className="bg-gray-200 border-b-4 border-gray-500 sticky top-[41px] z-30">
        <th className="bg-gray-300 border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 w-[90px] sticky left-0 z-40">Customer</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Booking</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">File</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">ETA Final POD</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 w-[55px]">Bond</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[40px]">POA?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[40px]">ISF?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Packing List/Comm Inv?</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">Bill of Lading?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[65px]">Arrival Notice?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">ISF Filed?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">Entry Filed?</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">BL Release?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Customs Release?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">Invoice Sent?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Payment Rec'd?</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Work Order Setup?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">Delivered?</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 w-[60px]">Returned?</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 w-[70px]">Delivery Date</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Notes</th>
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
  );
};

export default ImportTrackingTableHeader;
