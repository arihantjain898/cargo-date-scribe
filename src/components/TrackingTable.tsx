
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
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

interface TrackingTableProps {
  data: TrackingRecord[];
  updateRecord: (id: string, field: keyof TrackingRecord, value: any) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const TrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: TrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TrackingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showCustomerIndicator, setShowCustomerIndicator] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide customer indicator
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = event.currentTarget.scrollLeft;
    setScrollLeft(scrollLeft);
    setShowCustomerIndicator(scrollLeft > 300); // Show after scrolling past customer info section
  };

  const startEdit = (id: string, field: keyof TrackingRecord, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: any = editValue;

      if (field === 'dropDone' || field === 'returnNeeded' || field === 'docsSent' ||
          field === 'docsReceived' || field === 'aesMblVgmSent' || field === 'titlesDispatched' ||
          field === 'validatedFwd' || field === 'titlesReturned' || field === 'sslDraftInvRec' ||
          field === 'draftInvApproved' || field === 'transphereInvSent' || field === 'paymentRec' ||
          field === 'sslPaid' || field === 'insured' || field === 'released' || field === 'docsSentToCustomer') {
        value = editValue === 'true';
      }

      updateRecord(id, field, value);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

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

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-3 w-3 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-5 w-5 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      return (
        <div className="flex items-center justify-center py-1">
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(checked) => updateRecord(record.id, field, checked)}
            className="h-4 w-4 border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-2 py-1.5 rounded transition-all duration-200 min-h-[28px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-sm truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs font-medium' :
          value ? 'text-gray-800' : 'text-gray-400 italic'
        }`}>
          {String(value) || 'Empty'}
        </span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-2 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative">
      {/* Floating Customer Indicator */}
      {showCustomerIndicator && (
        <div className="absolute top-20 left-4 z-40 bg-blue-600 text-white px-3 py-1 rounded-lg shadow-lg text-xs font-medium">
          Viewing columns for multiple customers
        </div>
      )}
      
      <ScrollArea 
        className="h-[60vh] md:h-[70vh] w-full" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="min-w-[320px] md:min-w-[2400px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-30 border-b-4 border-gray-600">
              {/* Header Row 1 (Main Categories) */}
              <tr className="bg-white shadow-md">
                <th className="bg-gray-100 border-r-2 border-gray-500 p-2 md:p-1.5 text-center font-bold text-gray-900 text-xs md:text-sm w-12 md:w-10">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-4 w-4 border"
                  />
                </th>
                <th className="bg-gray-100 border-r-2 border-gray-500 p-2 md:p-1.5 text-center font-bold text-gray-900 text-xs md:text-sm w-16 md:w-12">
                  Actions
                </th>
                {/* Mobile: Show only essential columns */}
                <th className="border-r-2 border-gray-500 p-2 md:p-1.5 text-left font-bold text-gray-900 bg-blue-100 min-w-[120px] text-xs md:text-sm">
                  Customer
                </th>
                <th className="hidden md:table-cell border-r-2 border-gray-500 p-1.5 text-left font-bold text-gray-900 bg-blue-100 min-w-[70px] text-sm">REF #</th>
                <th className="hidden md:table-cell border-r-2 border-gray-500 p-1.5 text-left font-bold text-gray-900 bg-blue-100 min-w-[70px] text-sm">File #</th>
                <th className="border-r-4 border-gray-500 p-2 md:p-1.5 text-left font-bold text-gray-900 bg-blue-100 min-w-[90px] text-xs md:text-sm">Work Order #</th>
                <th colSpan={4} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-emerald-100 text-sm">
                  Drop / Return
                </th>
                <th colSpan={4} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-purple-100 text-sm">
                  Documents
                </th>
                <th colSpan={3} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-orange-100 text-sm">
                  Titles
                </th>
                <th colSpan={3} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-pink-100 text-sm">
                  Invoicing
                </th>
                <th colSpan={2} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-yellow-100 text-sm">
                  Payment
                </th>
                <th colSpan={3} className="hidden md:table-cell border-r-4 border-gray-500 p-1.5 text-center font-bold text-gray-900 bg-red-100 text-sm">
                  Final Steps
                </th>
                <th className="p-2 md:p-1.5 text-center font-bold text-gray-900 bg-gray-100 min-w-[100px] text-xs md:text-sm">
                  Notes
                </th>
              </tr>
              {/* Header Row 2 (Sub-categories) - Hidden on mobile */}
              <tr className="hidden md:table-row bg-white shadow-sm sticky top-10 z-30">
                <th className="bg-gray-50 border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 w-10">Select</th>
                <th className="bg-gray-50 border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 w-12">Delete</th>
                <th className="border-r-2 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[120px]">Customer</th>
                <th className="border-r-2 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[70px]">REF #</th>
                <th className="border-r-2 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[70px]">File #</th>
                <th className="border-r-4 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-blue-50 min-w-[90px]">Work Order #</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[70px]">Drop Done</th>
                <th className="border-r-2 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[90px]">Drop Date</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[90px]">Return Needed</th>
                <th className="border-r-4 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-emerald-50 min-w-[90px]">Return Date</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[70px]">Docs Sent</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[90px]">Docs Received</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-purple-50 min-w-[110px]">AES/MBL/VGM</th>
                <th className="border-r-4 border-gray-400 p-1 text-left text-xs font-semibold text-gray-700 bg-purple-50 min-w-[110px]">Doc Cutoff Date</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[100px]">Titles Dispatched</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[100px]">Validated & FWD'd</th>
                <th className="border-r-4 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-orange-50 min-w-[100px]">Titles Returned</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[110px]">SSL Draft Inv. Rec'd</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[110px]">Draft Inv. Approved</th>
                <th className="border-r-4 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-pink-50 min-w-[120px]">Transphere Inv. Sent</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-yellow-50 min-w-[90px]">Payment Rec'd</th>
                <th className="border-r-4 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-yellow-50 min-w-[70px]">SSL Paid</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[70px]">Insured</th>
                <th className="border-r-2 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[70px]">Released</th>
                <th className="border-r-4 border-gray-400 p-1 text-center text-xs font-semibold text-gray-700 bg-red-50 min-w-[120px]">Docs Sent to Customer</th>
                <th className="p-1 text-left text-xs font-semibold text-gray-700 bg-gray-50 min-w-[100px]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b-2 border-gray-200 hover:bg-blue-50 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* Select and Delete columns */}
                  <td className="p-2 md:p-1 text-center border-r border-gray-200">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                      className="h-4 w-4 border-2"
                    />
                  </td>
                  <td className="p-2 md:p-1 text-center border-r border-gray-200">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-4 w-4 text-red-500" />
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
                  
                  {/* Customer Info Section */}
                  <td className="border-r border-gray-200 p-1">{renderCell(record, 'customer')}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'ref')}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'file')}</td>
                  <td className="border-r-4 border-gray-300 p-1">{renderCell(record, 'workOrder')}</td>

                  {/* All other columns hidden on mobile */}
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'dropDone', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'docsSent', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'insured', true)}</td>
                  <td className="hidden md:table-cell border-r border-gray-200 p-1">{renderCell(record, 'released', true)}</td>
                  <td className="hidden md:table-cell border-r-4 border-gray-300 p-1">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-1">{renderCell(record, 'notes')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
