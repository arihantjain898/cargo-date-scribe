
import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import InlineEditCell from './InlineEditCell';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DomesticTruckingTableProps {
  data: DomesticTruckingRecord[];
  updateRecord: (
    id: string,
    field: keyof DomesticTruckingRecord,
    value: string | boolean
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const DomesticTruckingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: DomesticTruckingTableProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(data.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[1200px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-4 border-black bg-white">
                <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
                <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
                <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Schedule</th>
                <th colSpan={2} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Payment</th>
                <th className="border-r-4 border-black p-2 text-left font-bold text-gray-900 bg-gray-200 min-w-[100px]">Notes</th>
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
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">File</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">W/O Sent?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Insurance?</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Pick Date</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Delivered</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Payment Rec'd?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Payment Made?</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Notes</th>
                <th className="bg-gray-300 border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 w-10">Select</th>
                <th className="bg-gray-300 p-1 text-center text-xs font-bold text-gray-800 w-12">Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b-2 border-gray-400 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
                    <InlineEditCell
                      value={record.customer}
                      onSave={(value) => updateRecord(record.id, 'customer', value as string)}
                      placeholder="Enter customer name"
                      className="font-bold"
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.file}
                      onSave={(value) => updateRecord(record.id, 'file', value as string)}
                      placeholder="Enter file"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1 text-center">
                    <InlineEditCell
                      value={record.woSent}
                      onSave={(value) => updateRecord(record.id, 'woSent', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.insurance}
                      onSave={(value) => updateRecord(record.id, 'insurance', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.pickDate}
                      onSave={(value) => updateRecord(record.id, 'pickDate', value as string)}
                      isDate={true}
                      placeholder="Select pick date"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.delivered}
                      onSave={(value) => updateRecord(record.id, 'delivered', value as string)}
                      isDate={true}
                      placeholder="Select delivery date"
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.paymentReceived}
                      onSave={(value) => updateRecord(record.id, 'paymentReceived', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1 text-center">
                    <InlineEditCell
                      value={record.paymentMade}
                      onSave={(value) => updateRecord(record.id, 'paymentMade', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.notes}
                      onSave={(value) => updateRecord(record.id, 'notes', value as string)}
                      placeholder="Enter notes"
                    />
                  </td>
                  <td className="p-1 text-center border-r-4 border-black">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                      className="h-3 w-3 border"
                    />
                  </td>
                  <td className="p-1 text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Record</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this record for {record.customer}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteRecord(record.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={11} className="h-12"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default DomesticTruckingTable;
