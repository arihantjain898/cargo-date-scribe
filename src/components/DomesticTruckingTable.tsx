
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
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
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof DomesticTruckingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

  const startEdit = (
    id: string,
    field: keyof DomesticTruckingRecord,
    currentValue: string | boolean
  ) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      let value: string | boolean = editValue;

      if (field === 'woSent' || field === 'insurance' || field === 'paymentReceived' || field === 'paymentMade') {
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

  const renderCell = (record: DomesticTruckingRecord, field: keyof DomesticTruckingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 p-1 relative z-50">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-5 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500 bg-white relative z-50"
            type={isDate ? 'date' : 'text'}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-green-100 relative z-50" onClick={saveEdit}>
            <Save className="h-2 w-2 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-red-100 relative z-50" onClick={cancelEdit}>
            <X className="h-2 w-2 text-red-600" />
          </Button>
        </div>
      );
    }

    if (isCheckbox) {
      const getStatusLabels = (field: keyof DomesticTruckingRecord) => {
        switch (field) {
          case 'woSent':
            return { true: 'Sent', false: 'Pending' };
          case 'insurance':
            return { true: 'Yes', false: 'No' };
          case 'paymentReceived':
          case 'paymentMade':
            return { true: 'Yes', false: 'No' };
          default:
            return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const boolValue = value as boolean;
      const variant = boolValue ? 'success' : 'default';
      
      return (
        <div 
          className="flex items-center justify-center py-1 cursor-pointer"
          onClick={() => updateRecord(record.id, field, !value)}
        >
          <StatusBadge
            status={boolValue}
            trueLabel={labels.true}
            falseLabel={labels.false}
            variant={variant}
          />
        </div>
      );
    }

    return (
      <div
        className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[24px] border border-transparent hover:border-blue-200"
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs truncate ${
          isDate && value ? 'text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-[10px]' :
          value ? 'text-gray-800' : 'text-gray-400 italic opacity-50'
        }`}>
          {String(value) || (
            <span className="text-gray-400 text-[10px] opacity-60">—</span>
          )}
        </span>
        <Edit3 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
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
                    <div
                      className="flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[24px] border border-transparent hover:border-blue-200"
                      onClick={() => startEdit(record.id, 'customer', record.customer)}
                    >
                      <span className="text-xs truncate font-bold text-gray-800">
                        {record.customer || (
                          <span className="text-gray-400 text-[10px] opacity-60">—</span>
                        )}
                      </span>
                      <Edit3 className="h-2.5 w-2.5 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
                    </div>
                  </td>
                  <td className="border-r border-gray-500 p-1">{renderCell(record, 'file')}</td>
                  <td className="border-r-4 border-black p-1">{renderCell(record, 'woSent', true)}</td>
                  <td className="border-r border-gray-500 p-1">{renderCell(record, 'insurance', true)}</td>
                  <td className="border-r-4 border-black p-1">{renderCell(record, 'pickDate', false, true)}</td>
                  <td className="border-r-4 border-black p-1">{renderCell(record, 'delivered', false, true)}</td>
                  <td className="border-r border-gray-500 p-1">{renderCell(record, 'paymentReceived', true)}</td>
                  <td className="border-r-4 border-black p-1">{renderCell(record, 'paymentMade', true)}</td>
                  <td className="border-r-4 border-black p-1">{renderCell(record, 'notes')}</td>
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
