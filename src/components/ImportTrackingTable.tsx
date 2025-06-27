
import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
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

interface ImportTrackingTableProps {
  data: ImportTrackingRecord[];
  updateRecord: (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImportTrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: ImportTrackingTableProps) => {
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
        <div className="min-w-[1800px]">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b-4 border-black bg-white">
                <th className="bg-gray-100 border-r-4 border-black p-2 text-center font-bold text-gray-900 w-32 sticky left-0 z-40">Customer</th>
                <th colSpan={3} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-blue-200">Basic Information</th>
                <th colSpan={5} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-green-200">Documentation</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-yellow-200">Processing</th>
                <th colSpan={4} className="border-r-4 border-black p-2 text-center font-bold text-gray-900 bg-purple-200">Final Steps</th>
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
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Reference</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">File</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">ETA Final POD</th>
                <th className="border-r border-gray-500 p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[80px]">Bond</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">POA?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[60px]">ISF?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[140px]">Packing List/Comm Inv?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Bill of Lading?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Arrival Notice?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">ISF Filed?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Entry Filed?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">BL Release?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Customs Release?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Invoice Sent?</th>
                <th className="border-r border-gray-500 p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Payment Rec'd?</th>
                <th className="border-r-4 border-black p-1 text-center text-xs font-bold text-gray-800 bg-gray-200 min-w-[120px]">Work Order Setup?</th>
                <th className="border-r-4 border-black p-1 text-left text-xs font-bold text-gray-800 bg-gray-200 min-w-[100px]">Delivery Date</th>
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
                      value={record.reference}
                      onSave={(value) => updateRecord(record.id, 'reference', value as string)}
                      placeholder="Enter reference"
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.file}
                      onSave={(value) => updateRecord(record.id, 'file', value as string)}
                      placeholder="Enter file"
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.etaFinalPod}
                      onSave={(value) => updateRecord(record.id, 'etaFinalPod', value as string)}
                      isDate={true}
                      placeholder="Select ETA date"
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1">
                    <InlineEditCell
                      value={record.bond}
                      onSave={(value) => updateRecord(record.id, 'bond', value as string)}
                      placeholder="Enter bond"
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.poa}
                      onSave={(value) => updateRecord(record.id, 'poa', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.isf}
                      onSave={(value) => updateRecord(record.id, 'isf', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.packingListCommercialInvoice}
                      onSave={(value) => updateRecord(record.id, 'packingListCommercialInvoice', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1 text-center">
                    <InlineEditCell
                      value={record.billOfLading}
                      onSave={(value) => updateRecord(record.id, 'billOfLading', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.arrivalNotice}
                      onSave={(value) => updateRecord(record.id, 'arrivalNotice', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.isfFiled}
                      onSave={(value) => updateRecord(record.id, 'isfFiled', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.entryFiled}
                      onSave={(value) => updateRecord(record.id, 'entryFiled', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1 text-center">
                    <InlineEditCell
                      value={record.blRelease}
                      onSave={(value) => updateRecord(record.id, 'blRelease', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.customsRelease}
                      onSave={(value) => updateRecord(record.id, 'customsRelease', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r border-gray-500 p-1 text-center">
                    <InlineEditCell
                      value={record.invoiceSent}
                      onSave={(value) => updateRecord(record.id, 'invoiceSent', value as boolean)}
                      isBoolean={true}
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
                      value={record.workOrderSetup}
                      onSave={(value) => updateRecord(record.id, 'workOrderSetup', value as boolean)}
                      isBoolean={true}
                    />
                  </td>
                  <td className="border-r-4 border-black p-1">
                    <InlineEditCell
                      value={record.deliveryDate}
                      onSave={(value) => updateRecord(record.id, 'deliveryDate', value as string)}
                      isDate={true}
                      placeholder="Select delivery date"
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
                <td colSpan={21} className="h-12"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ImportTrackingTable;
