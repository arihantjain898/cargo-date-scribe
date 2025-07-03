import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Archive, ArchiveRestore, Trash2, X } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import AllFilesTable from './AllFilesTable';
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

interface FreightTrackerTabsProps {
  exportData: TrackingRecord[];
  importData: ImportTrackingRecord[];
  domesticData: DomesticTruckingRecord[];
  allFilesData: AllFilesRecord[];
  updateExportRecord: (id: string, field: keyof TrackingRecord, value: string | boolean) => void;
  updateImportRecord: (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => void;
  updateDomesticRecord: (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => void;
  updateAllFilesRecord: (id: string, field: keyof AllFilesRecord, value: string | boolean) => void;
  deleteExportRecord: (id: string) => void;
  deleteImportRecord: (id: string) => void;
  deleteDomesticRecord: (id: string) => void;
  deleteAllFilesRecord: (id: string) => void;
  addExportRecord: () => void;
  addImportRecord: () => void;
  addDomesticRecord: () => void;
  addAllFilesRecord: () => void;
  selectedExportRows: string[];
  setSelectedExportRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImportRows: string[];
  setSelectedImportRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDomesticRows: string[];
  setSelectedDomesticRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAllFilesRows: string[];
  setSelectedAllFilesRows: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedRowId?: string | null;
  onFileClick: (fileNumber: string, fileType: string) => void;
}

const FreightTrackerTabs = ({
  exportData,
  importData,
  domesticData,
  allFilesData,
  updateExportRecord,
  updateImportRecord,
  updateDomesticRecord,
  updateAllFilesRecord,
  deleteExportRecord,
  deleteImportRecord,
  deleteDomesticRecord,
  deleteAllFilesRecord,
  addExportRecord,
  addImportRecord,
  addDomesticRecord,
  addAllFilesRecord,
  selectedExportRows,
  setSelectedExportRows,
  selectedImportRows,
  setSelectedImportRows,
  selectedDomesticRows,
  setSelectedDomesticRows,
  selectedAllFilesRows,
  setSelectedAllFilesRows,
  highlightedRowId,
  onFileClick
}: FreightTrackerTabsProps) => {
  // Helper functions for bulk operations
  const handleBulkArchive = (recordIds: string[], updateFunction: any, setSelected: any) => {
    recordIds.forEach(id => updateFunction(id, 'archived', true));
    setSelected([]);
  };

  const handleBulkUnarchive = (recordIds: string[], updateFunction: any, setSelected: any) => {
    recordIds.forEach(id => updateFunction(id, 'archived', false));
    setSelected([]);
  };

  const handleBulkDelete = (recordIds: string[], deleteFunction: any, setSelected: any) => {
    recordIds.forEach(id => deleteFunction(id));
    setSelected([]);
  };

  const handleUnselectAll = (setSelected: any) => {
    setSelected([]);
  };

  // Check if selected rows are archived
  const getArchivedStatus = (selectedIds: string[], data: any[]) => {
    const selectedRecords = data.filter(record => selectedIds.includes(record.id));
    const archivedCount = selectedRecords.filter(record => record.archived).length;
    const unarchivedCount = selectedRecords.length - archivedCount;
    return { archivedCount, unarchivedCount };
  };

  const renderBulkActions = (
    selectedRows: string[],
    data: any[],
    updateFunction: any,
    deleteFunction: any,
    setSelectedRows: any
  ) => {
    if (selectedRows.length === 0) return null;

    const { archivedCount, unarchivedCount } = getArchivedStatus(selectedRows, data);

    return (
      <div className="flex items-center gap-2 ml-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
        <span className="text-sm font-medium text-blue-700">
          {selectedRows.length} selected
        </span>
        
        {unarchivedCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkArchive(selectedRows, updateFunction, setSelectedRows)}
            className="flex items-center gap-1 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            <Archive className="h-3 w-3" />
            Archive ({unarchivedCount})
          </Button>
        )}

        {archivedCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkUnarchive(selectedRows, updateFunction, setSelectedRows)}
            className="flex items-center gap-1 text-green-600 border-green-300 hover:bg-green-50"
          >
            <ArchiveRestore className="h-3 w-3" />
            Unarchive ({archivedCount})
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
              Delete ({selectedRows.length})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Multiple Records</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedRows.length} selected record(s)? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleBulkDelete(selectedRows, deleteFunction, setSelectedRows)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          size="sm"
          variant="outline"
          onClick={() => handleUnselectAll(setSelectedRows)}
          className="flex items-center gap-1 text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          <X className="h-3 w-3" />
          Unselect All
        </Button>
      </div>
    );
  };

  return (
    <Tabs defaultValue="allfiles" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-4 w-auto">
          <TabsTrigger value="allfiles">All Files</TabsTrigger>
          <TabsTrigger value="import">Import Tracking</TabsTrigger>
          <TabsTrigger value="export">Export Tracking</TabsTrigger>
          <TabsTrigger value="domestic">Domestic Trucking</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="allfiles" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderBulkActions(
              selectedAllFilesRows,
              allFilesData,
              updateAllFilesRecord,
              deleteAllFilesRecord,
              setSelectedAllFilesRows
            )}
          </div>
          <Button onClick={addAllFilesRecord} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <AllFilesTable
          data={allFilesData}
          updateRecord={updateAllFilesRecord}
          deleteRecord={deleteAllFilesRecord}
          selectedRows={selectedAllFilesRows}
          setSelectedRows={setSelectedAllFilesRows}
          highlightedRowId={highlightedRowId}
          onFileClick={onFileClick}
        />
      </TabsContent>

      <TabsContent value="import" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderBulkActions(
              selectedImportRows,
              importData,
              updateImportRecord,
              deleteImportRecord,
              setSelectedImportRows
            )}
          </div>
          <Button onClick={addImportRecord} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <ImportTrackingTable
          data={importData}
          updateRecord={updateImportRecord}
          deleteRecord={deleteImportRecord}
          selectedRows={selectedImportRows}
          setSelectedRows={setSelectedImportRows}
          highlightedRowId={highlightedRowId}
          onFileClick={onFileClick}
        />
      </TabsContent>

      <TabsContent value="export" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderBulkActions(
              selectedExportRows,
              exportData,
              updateExportRecord,
              deleteExportRecord,
              setSelectedExportRows
            )}
          </div>
          <Button onClick={addExportRecord} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <TrackingTable
          data={exportData}
          updateRecord={updateExportRecord}
          deleteRecord={deleteExportRecord}
          selectedRows={selectedExportRows}
          setSelectedRows={setSelectedExportRows}
          highlightedRowId={highlightedRowId}
          onFileClick={onFileClick}
        />
      </TabsContent>

      <TabsContent value="domestic" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderBulkActions(
              selectedDomesticRows,
              domesticData,
              updateDomesticRecord,
              deleteDomesticRecord,
              setSelectedDomesticRows
            )}
          </div>
          <Button onClick={addDomesticRecord} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
        <DomesticTruckingTable
          data={domesticData}
          updateRecord={updateDomesticRecord}
          deleteRecord={deleteDomesticRecord}
          selectedRows={selectedDomesticRows}
          setSelectedRows={setSelectedDomesticRows}
          highlightedRowId={highlightedRowId}
          onFileClick={onFileClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FreightTrackerTabs;
