
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

  const renderCell = (record: AllFilesRecord, field: keyof AllFilesRecord, isVolumeField = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={saveEdit}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    const containerClasses = isVolumeField ? getContainerVolumeColor(String(value)) : '';

    return (
      <div
        className={`group cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors ${containerClasses}`}
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            value ? 'text-gray-800' : 'text-gray-400'
          } ${isVolumeField && value ? 'font-semibold' : ''}`}>
            {String(value) || 'Empty'}
          </span>
          <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">All Files</h3>
      </div>
      
      <ScrollArea className="h-[600px]">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="border-b">
              <th className="p-3 text-left border-r border-gray-200">
                <Checkbox
                  checked={selectedRows.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-center border-r border-gray-200">Actions</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">File</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Number</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Customer</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Origin Port</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Origin State</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Destination Port</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Destination Country</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">20'</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">40'</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">RoRo</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">LCL</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Air</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Truck</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">SSL</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">NVO</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Comments</th>
              <th className="p-3 text-left font-medium">Sales Contact</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr
                key={record.id}
                className={`border-b hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-3 border-r border-gray-200">
                  <Checkbox
                    checked={selectedRows.includes(record.id)}
                    onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                  />
                </td>
                <td className="p-3 text-center border-r border-gray-200">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'file')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'number')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'customer')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'originPort')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'originState')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'destinationPort')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'destinationCountry')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'container20', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'container40', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'roro', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'lcl', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'air', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'truck', true)}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'ssl')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'nvo')}</td>
                <td className="p-3 border-r border-gray-200">{renderCell(record, 'comments')}</td>
                <td className="p-3">{renderCell(record, 'salesContact')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AllFilesTable;
