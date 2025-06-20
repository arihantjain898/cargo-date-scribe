
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
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
  updateRecord: (id: string, field: keyof AllFilesRecord, value: any) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const AllFilesTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: AllFilesTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof AllFilesRecord } | null>(null);
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

  const startEdit = (id: string, field: keyof AllFilesRecord, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const saveEdit = () => {
    if (editingCell) {
      const { id, field } = editingCell;
      updateRecord(id, field, editValue);
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

  const getRowConditionalClasses = (record: AllFilesRecord): string => {
    // No completion check for All Files - just return normal styling
    return '';
  };

  const renderCell = (record: AllFilesRecord, field: keyof AllFilesRecord, isVolumeField = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 min-w-0 p-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-5 text-xs min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-2 w-2 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-4 w-4 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-2 w-2 text-red-600" />
          </Button>
        </div>
      );
    }

    const containerClasses = isVolumeField ? getContainerVolumeColor(String(value)) : '';

    return (
      <div
        className={`flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1.5 py-1 rounded transition-all duration-200 min-h-[24px] border border-transparent hover:border-blue-200 ${containerClasses}`}
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-xs truncate ${
          value ? 'text-gray-800' : 'text-gray-400 italic opacity-50'
        } ${isVolumeField && value ? 'font-semibold text-white' : ''}`}>
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
              {data.map((record, index) => {
                const conditionalClasses = getRowConditionalClasses(record);
                return (
                  <tr
                    key={record.id}
                    className={`border-b-2 border-gray-400 transition-all duration-200 ${
                      conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
                    }`}
                  >
                    <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">{renderCell(record, 'customer')}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'file')}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'number')}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'originPort')}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'originState')}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'destinationPort')}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'destinationCountry')}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'container20', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'container40', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'roro', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'lcl', true)}</td>
                    <td className="border-r border-gray-500 p-1">{renderCell(record, 'air', true)}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'truck', true)}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'ssl')}</td>
                    <td className="border-r-4 border-black p-1">{renderCell(record, 'nvo')}</td>
                    <td className="border-l-4 border-black border-r border-gray-500 p-1">{renderCell(record, 'comments')}</td>
                    <td className="border-l-4 border-black border-r-4 border-black p-1">{renderCell(record, 'salesContact')}</td>
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
                );
              })}
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
