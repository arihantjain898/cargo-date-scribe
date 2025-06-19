import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import { useTableColumnGroups, ColumnGroup } from '../hooks/useTableColumnGroups';
import GroupedTableHeader from './GroupedTableHeader';
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

const allFilesColumnGroups: ColumnGroup[] = [
  {
    id: 'location',
    title: 'Location',
    columns: ['originPort', 'originState', 'destinationPort', 'destinationCountry'],
    isCollapsed: false,
    color: 'bg-blue-600'
  },
  {
    id: 'containers',
    title: 'Container Types',
    columns: ['container20', 'container40', 'roro', 'lcl', 'air', 'truck'],
    isCollapsed: false,
    color: 'bg-green-600'
  },
  {
    id: 'contacts',
    title: 'Contacts & Notes',
    columns: ['ssl', 'nvo', 'comments', 'salesContact'],
    isCollapsed: false,
    color: 'bg-purple-600'
  }
];

const AllFilesTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: AllFilesTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof AllFilesRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { groups, toggleGroup, isColumnVisible } = useTableColumnGroups(allFilesColumnGroups);

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
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            autoFocus
          />
          <Button size="sm" variant="ghost" onClick={saveEdit} className="h-6 w-6 p-0">
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={cancelEdit} className="h-6 w-6 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    const containerClasses = isVolumeField ? getContainerVolumeColor(String(value)) : '';

    return (
      <div
        className={`group cursor-pointer hover:bg-blue-50 px-1 py-1 rounded transition-colors ${containerClasses}`}
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            value ? 'text-gray-800' : 'text-gray-400'
          } ${isVolumeField && value ? 'font-semibold' : ''}`}>
            {String(value) || 'Empty'}
          </span>
          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </div>
    );
  };

  const pinnedColumns = (
    <>
      <th className="p-2 text-left border-r-2 border-gray-400 bg-gray-100 sticky left-0 z-30 w-10">
        <Checkbox
          checked={selectedRows.length === data.length && data.length > 0}
          onCheckedChange={handleSelectAll}
        />
      </th>
      <th className="p-2 text-center border-r-2 border-gray-400 bg-gray-100 sticky left-10 z-30 w-16">Actions</th>
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-26 z-30 min-w-20">File</th>
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-46 z-30 min-w-20">Number</th>
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-66 z-30 min-w-24">Customer</th>
      <th className="p-2 text-left font-medium border-r-4 border-gray-400 bg-gray-100 sticky left-90 z-30 min-w-24">Origin Port</th>
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
      <div className="p-4 border-b-2 border-gray-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold">All Files</h3>
        {showScrollHint && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ChevronLeft className="h-4 w-4" />
            <span>Scroll horizontally to see more columns</span>
            <ChevronRight className="h-4 w-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowScrollHint(false)}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="h-[600px]" ref={scrollAreaRef}>
        <table className="w-full text-xs border-collapse border-2 border-gray-300">
          <GroupedTableHeader 
            groups={groups} 
            toggleGroup={toggleGroup}
            pinnedColumns={pinnedColumns}
          >
            {pinnedColumns}
            {isColumnVisible('originState') && <th className="p-2 text-left font-medium border-r border-gray-300">Origin State</th>}
            {isColumnVisible('destinationPort') && <th className="p-2 text-left font-medium border-r border-gray-300">Destination Port</th>}
            {isColumnVisible('destinationCountry') && <th className="p-2 text-left font-medium border-r-2 border-gray-400">Destination Country</th>}
            {isColumnVisible('container20') && <th className="p-2 text-center font-medium border-r border-gray-300">20'</th>}
            {isColumnVisible('container40') && <th className="p-2 text-center font-medium border-r border-gray-300">40'</th>}
            {isColumnVisible('roro') && <th className="p-2 text-center font-medium border-r border-gray-300">RoRo</th>}
            {isColumnVisible('lcl') && <th className="p-2 text-center font-medium border-r border-gray-300">LCL</th>}
            {isColumnVisible('air') && <th className="p-2 text-center font-medium border-r border-gray-300">Air</th>}
            {isColumnVisible('truck') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">Truck</th>}
            {isColumnVisible('ssl') && <th className="p-2 text-left font-medium border-r border-gray-300">SSL</th>}
            {isColumnVisible('nvo') && <th className="p-2 text-left font-medium border-r border-gray-300">NVO</th>}
            {isColumnVisible('comments') && <th className="p-2 text-left font-medium border-r border-gray-300">Comments</th>}
            {isColumnVisible('salesContact') && <th className="p-2 text-left font-medium">Sales Contact</th>}
          </GroupedTableHeader>
          <tbody>
            {data.map((record, index) => (
              <tr
                key={record.id}
                className={`border-b-2 border-gray-300 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-0 z-20">
                  <Checkbox
                    checked={selectedRows.includes(record.id)}
                    onCheckedChange={(checked) => handleSelectRow(record.id, Boolean(checked))}
                  />
                </td>
                <td className="p-2 text-center border-r-2 border-gray-400 bg-gray-50 sticky left-10 z-20">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
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
                <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-26 z-20">{renderCell(record, 'file')}</td>
                <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-46 z-20">{renderCell(record, 'number')}</td>
                <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-66 z-20">{renderCell(record, 'customer')}</td>
                <td className="p-2 border-r-4 border-gray-400 bg-gray-50 sticky left-90 z-20">{renderCell(record, 'originPort')}</td>
                {isColumnVisible('originState') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'originState')}</td>}
                {isColumnVisible('destinationPort') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'destinationPort')}</td>}
                {isColumnVisible('destinationCountry') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'destinationCountry')}</td>}
                {isColumnVisible('container20') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'container20', true)}</td>}
                {isColumnVisible('container40') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'container40', true)}</td>}
                {isColumnVisible('roro') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'roro', true)}</td>}
                {isColumnVisible('lcl') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'lcl', true)}</td>}
                {isColumnVisible('air') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'air', true)}</td>}
                {isColumnVisible('truck') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'truck', true)}</td>}
                {isColumnVisible('ssl') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'ssl')}</td>}
                {isColumnVisible('nvo') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'nvo')}</td>}
                {isColumnVisible('comments') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'comments')}</td>}
                {isColumnVisible('salesContact') && <td className="p-2">{renderCell(record, 'salesContact')}</td>}
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
