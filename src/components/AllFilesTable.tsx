
import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
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

interface AllFilesTableProps {
  data: AllFilesRecord[];
  updateRecord: (
    id: string,
    field: keyof AllFilesRecord,
    value: string
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const AllFilesTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: AllFilesTableProps) => {
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

  const getVolumeFieldStyles = (value: string): string => {
    const containerClasses = getContainerVolumeColor(value);
    return containerClasses;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[1800px]">
          <table className="w-full border-collapse text-xs">
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
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.file}
                      onSave={(value) => updateRecord(record.id, 'file', value as string)}
                      placeholder="Enter file"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.number}
                      onSave={(value) => updateRecord(record.id, 'number', value as string)}
                      placeholder="Enter number"
                    />
                  </td>
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.originPort}
                      onSave={(value) => updateRecord(record.id, 'originPort', value as string)}
                      placeholder="Enter origin port"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.originState}
                      onSave={(value) => updateRecord(record.id, 'originState', value as string)}
                      placeholder="Enter origin state"
                    />
                  </td>
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.destinationPort}
                      onSave={(value) => updateRecord(record.id, 'destinationPort', value as string)}
                      placeholder="Enter destination port"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.destinationCountry}
                      onSave={(value) => updateRecord(record.id, 'destinationCountry', value as string)}
                      placeholder="Enter destination country"
                    />
                  </td>
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.container20}
                      onSave={(value) => updateRecord(record.id, 'container20', value as string)}
                      placeholder="20'"
                      className={getVolumeFieldStyles(record.container20)}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.container40}
                      onSave={(value) => updateRecord(record.id, 'container40', value as string)}
                      placeholder="40'"
                      className={getVolumeFieldStyles(record.container40)}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.roro}
                      onSave={(value) => updateRecord(record.id, 'roro', value as string)}
                      placeholder="RoRo"
                      className={getVolumeFieldStyles(record.roro)}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.lcl}
                      onSave={(value) => updateRecord(record.id, 'lcl', value as string)}
                      placeholder="LCL"
                      className={getVolumeFieldStyles(record.lcl)}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.air}
                      onSave={(value) => updateRecord(record.id, 'air', value as string)}
                      placeholder="Air"
                      className={getVolumeFieldStyles(record.air)}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.truck}
                      onSave={(value) => updateRecord(record.id, 'truck', value as string)}
                      placeholder="Truck"
                      className={getVolumeFieldStyles(record.truck)}
                    />
                  </td>
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.ssl}
                      onSave={(value) => updateRecord(record.id, 'ssl', value as string)}
                      placeholder="Enter SSL"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.nvo}
                      onSave={(value) => updateRecord(record.id, 'nvo', value as string)}
                      placeholder="Enter NVO"
                    />
                  </td>
                  <td className="border-l-4 border-black border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.comments}
                      onSave={(value) => updateRecord(record.id, 'comments', value as string)}
                      placeholder="Enter comments"
                    />
                  </td>
                  <td className="border-l-4 border-black border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.salesContact}
                      onSave={(value) => updateRecord(record.id, 'salesContact', value as string)}
                      placeholder="Enter sales contact"
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
                <td colSpan={20} className="h-16"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AllFilesTable;
