
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Archive, ArchiveRestore, Trash2, X, Download, Bell } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import AllFilesTable from './AllFilesTable';
import ExcelExportDialog from './ExcelExportDialog';
import NotificationSetup from './NotificationSetup';
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
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  filteredExportData: TrackingRecord[];
  filteredImportData: ImportTrackingRecord[];
  filteredAllFilesData: AllFilesRecord[];
  filteredDomesticTruckingData: DomesticTruckingRecord[];
  createCorrespondingRecord: (record: AllFilesRecord) => void;
  archiveCorrespondingRecord: (record: AllFilesRecord, archiveStatus: boolean) => void;
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
  onFileClick,
  activeTab,
  setActiveTab,
  filteredExportData,
  filteredImportData,
  filteredAllFilesData,
  filteredDomesticTruckingData,
  createCorrespondingRecord,
  archiveCorrespondingRecord
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
    <Tabs value={activeTab || "allfiles"} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-4 w-auto bg-gradient-to-r from-gray-50 to-slate-50 p-1 rounded-xl border border-gray-200 shadow-inner">
          <TabsTrigger 
            value="allfiles" 
            className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-emerald-50 hover:text-emerald-700"
          >
            📁 All Files
          </TabsTrigger>
          <TabsTrigger 
            value="import" 
            className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-purple-50 hover:text-purple-700"
          >
            📦 Import
          </TabsTrigger>
          <TabsTrigger 
            value="export" 
            className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-orange-50 hover:text-orange-700"
          >
            🚢 Export
          </TabsTrigger>
          <TabsTrigger 
            value="domestic" 
            className="px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-indigo-50 hover:text-indigo-700"
          >
            🚛 Domestic Trucking
          </TabsTrigger>
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
          <div className="flex items-center gap-2">
            <ExcelExportDialog 
              activeTab={activeTab || 'allfiles'}
              exportData={filteredExportData} 
              importData={filteredImportData}
              allFilesData={filteredAllFilesData}
              domesticTruckingData={filteredDomesticTruckingData}
              selectedExportRows={selectedExportRows}
              selectedImportRows={selectedImportRows}
              selectedAllFilesRows={selectedAllFilesRows}
              selectedDomesticTruckingRows={selectedDomesticRows}
            >
            <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            </ExcelExportDialog>
            <Button onClick={addAllFilesRecord} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
            <NotificationSetup>
              <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </NotificationSetup>
          </div>
        </div>
        <AllFilesTable
          data={allFilesData}
          updateRecord={updateAllFilesRecord}
          deleteRecord={deleteAllFilesRecord}
          selectedRows={selectedAllFilesRows}
          setSelectedRows={setSelectedAllFilesRows}
          highlightedRowId={highlightedRowId}
          onFileClick={onFileClick}
          onCreateCorrespondingRow={createCorrespondingRecord}
          onArchiveCorrespondingRecord={archiveCorrespondingRecord}
          importData={importData}
          exportData={exportData}
          domesticData={domesticData}
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
          <div className="flex items-center gap-2">
            <ExcelExportDialog 
              activeTab={activeTab || 'allfiles'}
              exportData={filteredExportData} 
              importData={filteredImportData}
              allFilesData={filteredAllFilesData}
              domesticTruckingData={filteredDomesticTruckingData}
              selectedExportRows={selectedExportRows}
              selectedImportRows={selectedImportRows}
              selectedAllFilesRows={selectedAllFilesRows}
              selectedDomesticTruckingRows={selectedDomesticRows}
            >
              <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </ExcelExportDialog>
            <Button onClick={addImportRecord} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
            <NotificationSetup>
              <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </NotificationSetup>
          </div>
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
          <div className="flex items-center gap-2">
            <ExcelExportDialog 
              activeTab={activeTab || 'allfiles'}
              exportData={filteredExportData} 
              importData={filteredImportData}
              allFilesData={filteredAllFilesData}
              domesticTruckingData={filteredDomesticTruckingData}
              selectedExportRows={selectedExportRows}
              selectedImportRows={selectedImportRows}
              selectedAllFilesRows={selectedAllFilesRows}
              selectedDomesticTruckingRows={selectedDomesticRows}
            >
              <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </ExcelExportDialog>
            <Button onClick={addExportRecord} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
            <NotificationSetup>
              <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </NotificationSetup>
          </div>
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
          <div className="flex items-center gap-2">
            <ExcelExportDialog 
              activeTab={activeTab || 'allfiles'}
              exportData={filteredExportData} 
              importData={filteredImportData}
              allFilesData={filteredAllFilesData}
              domesticTruckingData={filteredDomesticTruckingData}
              selectedExportRows={selectedExportRows}
              selectedImportRows={selectedImportRows}
              selectedAllFilesRows={selectedAllFilesRows}
              selectedDomesticTruckingRows={selectedDomesticRows}
            >
              <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100 border-green-300 text-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </ExcelExportDialog>
            <Button onClick={addDomesticRecord} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Record
            </Button>
            <NotificationSetup>
              <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </NotificationSetup>
          </div>
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
