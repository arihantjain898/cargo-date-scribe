
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';

interface TrackingTableHeaderProps {
  selectedRows: string[];
  data: TrackingRecord[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TrackingTableHeader = ({
  selectedRows,
  data,
  setSelectedRows,
  searchTerm,
  setSearchTerm
}: TrackingTableHeaderProps) => {
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
        <th colSpan={18} className="p-4 text-left">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by customer, ref, file, work order, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </th>
      </tr>
      <tr className="border-b-4 border-black bg-white sticky top-[73px] z-30">
        <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
        <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
        <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Drop & Return</th>
        <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-yellow-200">Documents</th>
        <th colSpan={5} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Title Processing</th>
        <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-orange-200">Invoice & Payment</th>
        <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-pink-200">Final Steps</th>
        <th className="p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[300px]">Notes</th>
        <th className="bg-red-200 p-2 text-center font-bold text-gray-900 w-12">Select</th>
      </tr>
      <tr className="bg-gray-200 border-b-4 border-gray-500 sticky top-[121px] z-30">
        <th className="bg-gray-300 border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 min-w-[100px] sticky left-0 z-40">Customer</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Ref</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">File</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Work Order</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Drop Date</th>
        <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Return Date</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Docs Sent</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Docs Rec'd</th>
        <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[90px]">Doc Cutoff Date</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">AES/MBL/VGM Sent</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Titles Dispatched</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Validated Fwd</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Titles Returned</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">SSL Draft<br/>Inv Rec</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Draft Inv Approved</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Transphere Inv Sent</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[70px]">Payment Rec</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">SSL Paid</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Insured</th>
        <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">Released</th>
        <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Docs Sent to Customer</th>
        <th className="p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[300px]">Notes</th>
        <th className="bg-gray-300 p-1 text-center text-xs font-bold text-gray-800 w-12">
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

export default TrackingTableHeader;
