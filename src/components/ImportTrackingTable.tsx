import React, { useState } from 'react';
import { Trash2, Archive, ArchiveRestore, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import ImportTrackingTableHeader from './ImportTrackingTableHeader';
import ImportTrackingTableRow from './ImportTrackingTableRow';
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
import { toast } from 'sonner';
import ExcelExportDialog from './ExcelExportDialog';

interface ImportTrackingTableProps {
  data: ImportTrackingRecord[];
  updateRecord: (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedRowId?: string | null;
  onBackToAllFiles?: () => void;
}

const ImportTrackingTable = ({
  data,
  updateRecord,
  deleteRecord,
  selectedRows,
  setSelectedRows,
  highlightedRowId,
  onBackToAllFiles
}: ImportTrackingTableProps) => {
  const [showArchived, setShowArchived] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const filteredData = showArchived ? data : data.filter(record => !record.archived);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredData.map(record => record.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleBulkDelete = () => {
    selectedRows.forEach(id => deleteRecord(id));
    setSelectedRows([]);
    toast.success(`${selectedRows.length} records deleted.`);
  };

  const handleBulkArchive = () => {
    selectedRows.forEach(id => {
      const record = data.find(r => r.id === id);
      if (record) {
        updateRecord(id, 'archived', true);
      }
    });
    setSelectedRows([]);
    toast.success(`${selectedRows.length} records archived.`);
  };

  const handleArchive = (id: string) => {
    updateRecord(id, 'archived', true);
    toast.success('Record archived.');
  };

  const handleUnarchive = (id: string) => {
    updateRecord(id, 'archived', false);
    toast.success('Record unarchived.');
  };

  const handleImportFromExcel = () => {
    toast.info('Excel import functionality coming soon!');
  };

  const allSelected = filteredData.length > 0 && selectedRows.length === filteredData.length;
  const someSelected = selectedRows.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className="border"
          />
          <span className="text-sm text-gray-600">
            {selectedRows.length > 0 ? `${selectedRows.length} selected` : 'Select all'}
          </span>
          {someSelected && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected ({selectedRows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Records</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete {selectedRows.length} selected records? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4 mr-1" />
                    Archive Selected ({selectedRows.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Archive Selected Records</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to archive {selectedRows.length} selected records? Archived records will be hidden from the main view.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkArchive} className="bg-yellow-600 hover:bg-yellow-700">
                      Archive
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? <ArchiveRestore className="h-4 w-4 mr-1" /> : <Archive className="h-4 w-4 mr-1" />}
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleImportFromExcel}
          >
            <Upload className="h-4 w-4 mr-1" />
            Import Excel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-4 w-4 mr-1" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <ImportTrackingTableHeader />
            <tbody>
              {filteredData.map((record, index) => (
                <ImportTrackingTableRow
                  key={record.id}
                  record={record}
                  index={index}
                  updateRecord={updateRecord}
                  deleteRecord={deleteRecord}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  showArchived={showArchived}
                  isHighlighted={record.id === highlightedRowId}
                  onBackToAllFiles={onBackToAllFiles}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ExcelExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        data={filteredData}
        filename="import-tracking"
        title="Export Import Tracking Data"
      />
    </div>
  );
};

export default ImportTrackingTable;
