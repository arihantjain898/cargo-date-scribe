
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X, Trash2 } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import { StatusBadge } from '@/components/ui/status-badge';
import { isDateOverdue, isDateWithinDays } from '../utils/dateUtils';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const renderCell = (record: TrackingRecord, field: keyof TrackingRecord, isCheckbox = false, isDate = false) => {
    const isEditing = editingCell?.id === record.id && editingCell?.field === field;
    const value = record[field];

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            type={isDate ? 'date' : 'text'}
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

    if (isCheckbox) {
      const getStatusLabels = (field: keyof TrackingRecord) => {
        switch (field) {
          case 'dropDone': return { true: 'Dropped', false: 'Pending' };
          case 'returnNeeded': return { true: 'Required', false: 'Not Needed' };
          case 'docsSent': return { true: 'Sent', false: 'Pending' };
          case 'docsReceived': return { true: 'Received', false: 'Pending' };
          case 'aesMblVgmSent': return { true: 'Sent', false: 'Pending' };
          case 'titlesDispatched': return { true: 'Dispatched', false: 'Pending' };
          case 'validatedFwd': return { true: 'Validated', false: 'Pending' };
          case 'titlesReturned': return { true: 'Returned', false: 'Pending' };
          case 'sslDraftInvRec': return { true: 'Received', false: 'Pending' };
          case 'draftInvApproved': return { true: 'Approved', false: 'Pending' };
          case 'transphereInvSent': return { true: 'Sent', false: 'Pending' };
          case 'paymentRec': return { true: 'Received', false: 'Pending' };
          case 'sslPaid': return { true: 'Paid', false: 'Pending' };
          case 'insured': return { true: 'Insured', false: 'Pending' };
          case 'released': return { true: 'Released', false: 'Pending' };
          case 'docsSentToCustomer': return { true: 'Sent', false: 'Pending' };
          default: return { true: 'Yes', false: 'No' };
        }
      };

      const labels = getStatusLabels(field);
      const variant = Boolean(value) ? 'success' : 'default';
      
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
        className="group cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors"
        onClick={() => startEdit(record.id, field, value)}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            isDate && value ? 'text-blue-700 bg-blue-50 px-1 rounded text-xs' :
            value ? 'text-gray-800' : 'text-gray-400'
          }`}>
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
        <h3 className="text-lg font-semibold">Export Tracking</h3>
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)]">
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
              <th className="p-3 text-left font-medium border-r border-gray-200">Customer</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">REF #</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">File #</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Work Order #</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Drop Done</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Drop Date</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Return Needed</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Return Date</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Docs Sent</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Docs Received</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">AES/MBL/VGM</th>
              <th className="p-3 text-left font-medium border-r border-gray-200">Doc Cutoff Date</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Titles Dispatched</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Validated & FWD'd</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Titles Returned</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">SSL Draft Inv. Rec'd</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Draft Inv. Approved</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Transphere Inv. Sent</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Payment Rec'd</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">SSL Paid</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Insured</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Released</th>
              <th className="p-3 text-center font-medium border-r border-gray-200">Docs Sent to Customer</th>
              <th className="p-3 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => {
              const conditionalClasses = getRowConditionalClasses(record);
              return (
                <tr
                  key={record.id}
                  className={`border-b hover:bg-gray-100 ${
                    conditionalClasses || (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')
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
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'customer')}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'ref')}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'file')}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'workOrder')}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'dropDone', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'dropDate', false, true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'returnNeeded', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'returnDate', false, true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'docsSent', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'docsReceived', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'aesMblVgmSent', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'docCutoffDate', false, true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'titlesDispatched', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'validatedFwd', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'titlesReturned', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'sslDraftInvRec', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'draftInvApproved', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'transphereInvSent', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'paymentRec', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'sslPaid', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'insured', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'released', true)}</td>
                  <td className="p-3 border-r border-gray-200">{renderCell(record, 'docsSentToCustomer', true)}</td>
                  <td className="p-3">{renderCell(record, 'notes')}</td>
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
