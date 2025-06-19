import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
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

interface TrackingTableProps {
  data: TrackingRecord[];
  updateRecord: (id: string, field: keyof TrackingRecord, value: any) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

const exportColumnGroups: ColumnGroup[] = [
  {
    id: 'documents',
    title: 'Documents',
    columns: ['docsSent', 'docsReceived', 'aesMblVgmSent', 'docCutoffDate'],
    isCollapsed: false,
    color: 'bg-blue-600'
  },
  {
    id: 'processing',
    title: 'Processing',
    columns: ['dropDone', 'dropDate', 'returnNeeded', 'returnDate'],
    isCollapsed: false,
    color: 'bg-green-600'
  },
  {
    id: 'titles',
    title: 'Titles',
    columns: ['titlesDispatched', 'validatedFwd', 'titlesReturned'],
    isCollapsed: false,
    color: 'bg-purple-600'
  },
  {
    id: 'billing',
    title: 'Billing & Payment',
    columns: ['sslDraftInvRec', 'draftInvApproved', 'transphereInvSent', 'paymentRec', 'sslPaid'],
    isCollapsed: false,
    color: 'bg-orange-600'
  },
  {
    id: 'completion',
    title: 'Completion',
    columns: ['insured', 'released', 'docsSentToCustomer'],
    isCollapsed: false,
    color: 'bg-red-600'
  }
];

const TrackingTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: TrackingTableProps) => {
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof TrackingRecord } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { groups, toggleGroup, isColumnVisible } = useTableColumnGroups(exportColumnGroups);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

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

  const getRowConditionalClasses = (record: TrackingRecord): string => {
    if (isDateOverdue(record.dropDate)) {
      return 'bg-red-50 border-red-200';
    }
    if (isDateWithinDays(record.returnDate, 3)) {
      return 'bg-amber-50 border-amber-200';
    }
    return '';
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
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-26 z-30 min-w-24">Customer</th>
      <th className="p-2 text-left font-medium border-r-2 border-gray-400 bg-gray-100 sticky left-50 z-30 min-w-20">REF #</th>
      <th className="p-2 text-left font-medium border-r-4 border-gray-400 bg-gray-100 sticky left-70 z-30 min-w-20">File #</th>
    </>
  );

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-6 text-xs"
            type={isDate ? 'date' : 'text'}
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

    if (isCheckbox) {
      const getStatusLabels = (field: keyof TrackingRecord) => {
        switch (field) {
          case 'dropDone': return { true: '✅ Dropped', false: '⏳ Pending' };
          case 'returnNeeded': return { true: '✅ Required', false: '❌ Not Needed' };
          case 'docsSent': return { true: '✅ Sent', false: '⏳ Pending' };
          case 'docsReceived': return { true: '✅ Received', false: '⏳ Pending' };
          case 'aesMblVgmSent': return { true: '✅ Sent', false: '⏳ Pending' };
          case 'titlesDispatched': return { true: '✅ Dispatched', false: '⏳ Pending' };
          case 'validatedFwd': return { true: '✅ Validated', false: '⏳ Pending' };
          case 'titlesReturned': return { true: '✅ Returned', false: '⏳ Pending' };
          case 'sslDraftInvRec': return { true: '✅ Received', false: '⏳ Pending' };
          case 'draftInvApproved': return { true: '✅ Approved', false: '⏳ Pending' };
          case 'transphereInvSent': return { true: '✅ Sent', false: '⏳ Pending' };
          case 'paymentRec': return { true: '✅ Received', false: '⏳ Pending' };
          case 'sslPaid': return { true: '✅ Paid', false: '⏳ Pending' };
          case 'insured': return { true: '✅ Insured', false: '⏳ Pending' };
          case 'released': return { true: '✅ Released', false: '⏳ Pending' };
          case 'docsSentToCustomer': return { true: '✅ Sent', false: '⏳ Pending' };
          default: return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const variant = Boolean(value) ? 'success' : 'secondary';
      
      return (
        <div 
          className="flex justify-center cursor-pointer"
          onClick={() => updateRecord(record.id, field, !value)}
        >
          <StatusBadge
            status={Boolean(value)}
            trueLabel={labels.true}
            falseLabel={labels.false}
            variant={variant}
          />
        </div>
      );
    }

    return (
      <div
        className="group cursor-pointer hover:bg-blue-50 px-1 py-1 rounded transition-colors"
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${
            isDate && value ? 'text-blue-700 bg-blue-50 px-1 rounded' :
            value ? 'text-gray-800' : 'text-gray-400'
          }`}>
            {String(value) || 'Empty'}
          </span>
          <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 text-blue-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
      <div className="p-4 border-b-2 border-gray-300 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Export Tracking</h3>
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
      
      <ScrollArea className="h-[calc(100vh-220px)]" ref={scrollAreaRef}>
        <table className="w-full text-xs border-collapse border-2 border-gray-300">
          <GroupedTableHeader 
            groups={groups} 
            toggleGroup={toggleGroup}
            pinnedColumns={pinnedColumns}
          >
            {pinnedColumns}
            <th className="p-2 text-left font-medium border-r border-gray-300">Work Order #</th>
            {isColumnVisible('dropDone') && <th className="p-2 text-center font-medium border-r border-gray-300">Drop Done</th>}
            {isColumnVisible('dropDate') && <th className="p-2 text-left font-medium border-r border-gray-300">Drop Date</th>}
            {isColumnVisible('returnNeeded') && <th className="p-2 text-center font-medium border-r border-gray-300">Return Needed</th>}
            {isColumnVisible('returnDate') && <th className="p-2 text-left font-medium border-r-2 border-gray-400">Return Date</th>}
            {isColumnVisible('docsSent') && <th className="p-2 text-center font-medium border-r border-gray-300">Docs Sent</th>}
            {isColumnVisible('docsReceived') && <th className="p-2 text-center font-medium border-r border-gray-300">Docs Received</th>}
            {isColumnVisible('aesMblVgmSent') && <th className="p-2 text-center font-medium border-r border-gray-300">AES/MBL/VGM</th>}
            {isColumnVisible('docCutoffDate') && <th className="p-2 text-left font-medium border-r-2 border-gray-400">Doc Cutoff Date</th>}
            {isColumnVisible('titlesDispatched') && <th className="p-2 text-center font-medium border-r border-gray-300">Titles Dispatched</th>}
            {isColumnVisible('validatedFwd') && <th className="p-2 text-center font-medium border-r border-gray-300">Validated & FWD'd</th>}
            {isColumnVisible('titlesReturned') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">Titles Returned</th>}
            {isColumnVisible('sslDraftInvRec') && <th className="p-2 text-center font-medium border-r border-gray-300">SSL Draft Inv. Rec'd</th>}
            {isColumnVisible('draftInvApproved') && <th className="p-2 text-center font-medium border-r border-gray-300">Draft Inv. Approved</th>}
            {isColumnVisible('transphereInvSent') && <th className="p-2 text-center font-medium border-r border-gray-300">Transphere Inv. Sent</th>}
            {isColumnVisible('paymentRec') && <th className="p-2 text-center font-medium border-r border-gray-300">Payment Rec'd</th>}
            {isColumnVisible('sslPaid') && <th className="p-2 text-center font-medium border-r-2 border-gray-400">SSL Paid</th>}
            {isColumnVisible('insured') && <th className="p-2 text-center font-medium border-r border-gray-300">Insured</th>}
            {isColumnVisible('released') && <th className="p-2 text-center font-medium border-r border-gray-300">Released</th>}
            {isColumnVisible('docsSentToCustomer') && <th className="p-2 text-center font-medium border-r border-gray-300">Docs Sent to Customer</th>}
            <th className="p-2 text-left font-medium">Notes</th>
          </GroupedTableHeader>
          <tbody>
            {data.map((record, index) => {
              const conditionalClasses = getRowConditionalClasses(record);
              return (
                <tr
                  key={record.id}
                  className={`border-b-2 border-gray-300 hover:bg-gray-100 ${
                    conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
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
                  <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-26 z-20">{renderCell(record, 'customer')}</td>
                  <td className="p-2 border-r-2 border-gray-400 bg-gray-50 sticky left-50 z-20">{renderCell(record, 'ref')}</td>
                  <td className="p-2 border-r-4 border-gray-400 bg-gray-50 sticky left-70 z-20">{renderCell(record, 'file')}</td>
                  <td className="p-2 border-r border-gray-300">{renderCell(record, 'workOrder')}</td>
                  {isColumnVisible('dropDone') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'dropDone', true)}</td>}
                  {isColumnVisible('dropDate') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'dropDate', false, true)}</td>}
                  {isColumnVisible('returnNeeded') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'returnNeeded', true)}</td>}
                  {isColumnVisible('returnDate') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'returnDate', false, true)}</td>}
                  {isColumnVisible('docsSent') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'docsSent', true)}</td>}
                  {isColumnVisible('docsReceived') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'docsReceived', true)}</td>}
                  {isColumnVisible('aesMblVgmSent') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'aesMblVgmSent', true)}</td>}
                  {isColumnVisible('docCutoffDate') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'docCutoffDate', false, true)}</td>}
                  {isColumnVisible('titlesDispatched') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'titlesDispatched', true)}</td>}
                  {isColumnVisible('validatedFwd') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'validatedFwd', true)}</td>}
                  {isColumnVisible('titlesReturned') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'titlesReturned', true)}</td>}
                  {isColumnVisible('sslDraftInvRec') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'sslDraftInvRec', true)}</td>}
                  {isColumnVisible('draftInvApproved') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'draftInvApproved', true)}</td>}
                  {isColumnVisible('transphereInvSent') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'transphereInvSent', true)}</td>}
                  {isColumnVisible('paymentRec') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'paymentRec', true)}</td>}
                  {isColumnVisible('sslPaid') && <td className="p-2 border-r-2 border-gray-400">{renderCell(record, 'sslPaid', true)}</td>}
                  {isColumnVisible('insured') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'insured', true)}</td>}
                  {isColumnVisible('released') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'released', true)}</td>}
                  {isColumnVisible('docsSentToCustomer') && <td className="p-2 border-r border-gray-300">{renderCell(record, 'docsSentToCustomer', true)}</td>}
                  <td className="p-2">{renderCell(record, 'notes')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
