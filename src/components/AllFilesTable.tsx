import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import { useTableColumns, ColumnConfig } from '../hooks/useTableColumns';
import TableColumnManager from './TableColumnManager';
import ResizableTableHeader from './ResizableTableHeader';
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

  const initialColumns: ColumnConfig[] = [
    { id: 'file', label: 'File', visible: true, width: 60, minWidth: 50 },
    { id: 'number', label: 'Number', visible: true, width: 70, minWidth: 60 },
    { id: 'customer', label: 'Customer', visible: true, width: 100, minWidth: 90 },
    { id: 'originPort', label: 'Origin Port', visible: true, width: 90, minWidth: 80, group: 'Origin' },
    { id: 'originState', label: 'Origin State', visible: true, width: 80, minWidth: 70, group: 'Origin' },
    { id: 'destinationPort', label: 'Destination Port', visible: true, width: 100, minWidth: 90, group: 'Destination' },
    { id: 'destinationCountry', label: 'Destination Country', visible: true, width: 100, minWidth: 90, group: 'Destination' },
    { id: 'container20', label: '20\'', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'container40', label: '40\'', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'roro', label: 'RoRo', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'lcl', label: 'LCL', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'air', label: 'Air', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'truck', label: 'Truck', visible: true, width: 50, minWidth: 40, group: 'Transport Types' },
    { id: 'ssl', label: 'SSL', visible: true, width: 70, minWidth: 60, group: 'Service Providers' },
    { id: 'nvo', label: 'NVO', visible: true, width: 70, minWidth: 60, group: 'Service Providers' },
    { id: 'comments', label: 'Comments', visible: true, width: 80, minWidth: 70 },
    { id: 'salesContact', label: 'Sales Contact', visible: true, width: 90, minWidth: 80 },
  ];

  const {
    columns,
    collapsedGroups,
    toggleColumnVisibility,
    updateColumnWidth,
    toggleGroup,
    getVisibleColumns
  } = useTableColumns(initialColumns);

  const visibleColumns = getVisibleColumns();

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
        <div className="flex items-center gap-1 min-w-0 px-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-4 text-[10px] min-w-0 flex-1 border-blue-300 focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" className="h-3 w-3 p-0 shrink-0 hover:bg-green-100" onClick={saveEdit}>
            <Save className="h-2 w-2 text-green-600" />
          </Button>
          <Button size="sm" variant="ghost" className="h-3 w-3 p-0 shrink-0 hover:bg-red-100" onClick={cancelEdit}>
            <X className="h-2 w-2 text-red-600" />
          </Button>
        </div>
      );
    }

    const containerClasses = isVolumeField ? getContainerVolumeColor(String(value)) : '';

    return (
      <div
        className={`flex items-center justify-between group cursor-pointer hover:bg-blue-50 px-1 rounded transition-all duration-200 min-h-[20px] border border-transparent hover:border-blue-200 ${containerClasses}`}
        onClick={() => startEdit(record.id, field, value)}
      >
        <span className={`text-[10px] truncate ${
          value ? 'text-gray-800' : 'text-gray-300 opacity-50'
        } ${isVolumeField && value ? 'font-semibold' : ''}`}>
          {String(value) || ''}
        </span>
        <Edit3 className="h-2 w-2 opacity-0 group-hover:opacity-70 text-blue-600 shrink-0 ml-1 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">All Files</h3>
        <TableColumnManager
          columns={columns}
          collapsedGroups={collapsedGroups}
          onToggleColumn={toggleColumnVisibility}
          onToggleGroup={toggleGroup}
        />
      </div>
      
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div style={{ minWidth: `${visibleColumns.reduce((sum, col) => sum + col.width, 100)}px` }}>
          <table className="w-full border-collapse text-[10px]">
            <thead className="sticky top-0 bg-white z-30 shadow-sm">
              <tr className="border-b border-gray-300 bg-white">
                <th className="bg-gray-100 border-r border-gray-300 p-1 text-center font-bold text-gray-900 w-8 sticky left-0 z-40">
                  <Checkbox
                    checked={selectedRows.length === data.length && data.length > 0}
                    onCheckedChange={handleSelectAll}
                    className="h-3 w-3"
                  />
                </th>
                <th className="bg-gray-100 border-r border-gray-300 p-1 text-center font-bold text-gray-900 w-10 sticky left-8 z-40">
                  Del
                </th>
                <ResizableTableHeader
                  width={60}
                  minWidth={50}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-18 z-40"
                >
                  File
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={70}
                  minWidth={60}
                  onResize={() => {}}
                  className="bg-blue-100 border-r border-gray-300 p-1 text-left font-bold text-gray-900 sticky left-[78px] z-40"
                >
                  Number
                </ResizableTableHeader>
                <ResizableTableHeader
                  width={100}
                  minWidth={90}
                  onResize={() => {}}
                  className="bg-blue-100 border-r-2 border-gray-500 p-1 text-left font-bold text-gray-900 sticky left-[148px] z-40"
                >
                  Customer
                </ResizableTableHeader>
                
                {visibleColumns.filter(col => !['file', 'number', 'customer'].includes(col.id)).map((column) => (
                  <ResizableTableHeader
                    key={column.id}
                    width={column.width}
                    minWidth={column.minWidth}
                    onResize={(width) => updateColumnWidth(column.id, width)}
                    className="border-r border-gray-300 p-1 text-center font-bold text-gray-900 bg-gray-50"
                  >
                    {column.label}
                  </ResizableTableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={record.id}
                  className={`border-b border-gray-100 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="p-1 text-center border-r border-gray-200 sticky left-0 z-20 bg-inherit">
                    <Checkbox
                      checked={selectedRows.includes(record.id)}
                      onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                      className="h-3 w-3"
                    />
                  </td>
                  <td className="p-1 text-center border-r border-gray-200 sticky left-8 z-20 bg-inherit">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-2 w-2 text-red-500" />
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
                  
                  <td className="border-r border-gray-200 p-1 sticky left-18 z-20 bg-inherit" style={{ width: '60px' }}>
                    {renderCell(record, 'file')}
                  </td>
                  <td className="border-r border-gray-200 p-1 sticky left-[78px] z-20 bg-inherit" style={{ width: '70px' }}>
                    {renderCell(record, 'number')}
                  </td>
                  <td className="border-r-2 border-gray-500 p-1 sticky left-[148px] z-20 bg-inherit" style={{ width: '100px' }}>
                    {renderCell(record, 'customer')}
                  </td>

                  {visibleColumns.filter(col => !['file', 'number', 'customer'].includes(col.id)).map((column) => {
                    const field = column.id as keyof AllFilesRecord;
                    const isVolumeField = ['container20', 'container40', 'roro', 'lcl', 'air', 'truck'].includes(field);
                    
                    return (
                      <td 
                        key={column.id} 
                        className="border-r border-gray-200 p-1" 
                        style={{ width: `${column.width}px` }}
                      >
                        {renderCell(record, field, isVolumeField)}
                      </td>
                    );
                  })}
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

export default AllFilesTable;
