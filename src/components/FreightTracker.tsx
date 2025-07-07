import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Removed Clerk import - using Firebase auth
import { Plus, ArrowLeft, ArrowRight, Download } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import AllFilesTable from './AllFilesTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import ExcelExportDialog from './ExcelExportDialog';
import { useUndoRedo } from '../hooks/useUndoRedo';

const FreightTracker = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>('test-user-123');
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all_files');

  const {
    exportData,
    importData,
    allFilesData,
    domesticTruckingData,
    loading,
    addExportItem,
    addImportItem,
    addAllFilesItem,
    addDomesticTruckingItem,
    updateRecord,
    updateImportRecord,
    updateAllFilesRecord,
    updateDomesticTruckingRecord,
    deleteExportItem,
    deleteImportItem,
    deleteAllFilesItem,
    deleteDomesticTruckingItem
  } = useFreightTrackerData(currentUserId || '');

  const { undo, redo, canUndo, canRedo } = useUndoRedo({
    exportData: exportData || [],
    importData: importData || [],
    allFilesData: allFilesData || [],
    domesticTruckingData: domesticTruckingData || []
  });

  const onFileClick = useCallback((fileNumber: string, fileType: string) => {
    if (fileType === 'export') {
      setActiveTab('export');
      const foundRecord = exportData?.find(record => record.file === fileNumber);
      if (foundRecord) {
        setHighlightedRowId(foundRecord.id);
      } else {
        toast({
          title: "File Not Found",
          description: `File number ${fileNumber} not found in Export Tracking.`,
        })
      }
    } else if (fileType === 'import') {
      setActiveTab('import');
      const foundRecord = importData?.find(record => record.file === fileNumber);
      if (foundRecord) {
        setHighlightedRowId(foundRecord.id);
      } else {
        toast({
          title: "File Not Found",
          description: `File number ${fileNumber} not found in Import Tracking.`,
        })
      }
    } else if (fileType === 'all_files') {
      setActiveTab('all_files');
      const foundRecord = allFilesData?.find(record => record.number === fileNumber);
      if (foundRecord) {
        setHighlightedRowId(foundRecord.id);
      } else {
        toast({
          title: "File Not Found",
          description: `File number ${fileNumber} not found in All Files.`,
        })
      }
    } else if (fileType === 'domestic_trucking') {
      setActiveTab('domestic_trucking');
      const foundRecord = domesticTruckingData?.find(record => record.file === fileNumber);
      if (foundRecord) {
        setHighlightedRowId(foundRecord.id);
      } else {
        toast({
          title: "File Not Found",
          description: `File number ${fileNumber} not found in Domestic Trucking.`,
        })
      }
    } else {
      toast({
        title: "File Type Not Supported",
        description: `File type ${fileType} is not supported.`,
      })
    }
  }, [exportData, importData, allFilesData, domesticTruckingData, toast, setHighlightedRowId, setActiveTab]);

  const addExportRecord = async () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: '',
      ref: '',
      file: '',
      workOrder: '',
      dropDate: '',
      returnDate: '',
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: '',
      titlesDispatched: 'Select',
      validatedFwd: false,
      titlesReturned: 'Select',
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: '',
      archived: false,
      userId: currentUserId || ''
    };

    try {
      await addExportItem(newRecord);
    } catch (error) {
      console.error("Error adding export record:", error);
      toast({
        title: "Error",
        description: "Failed to add new export record.",
        variant: "destructive",
      })
    }
  };

  const addAllFilesRecord = async () => {
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      customer: '',
      file: '',
      number: '',
      originPort: '',
      originState: '',
      destinationPort: '',
      destinationCountry: '',
      container20: '',
      container40: '',
      roro: '',
      lcl: '',
      air: '',
      truck: '',
      ssl: '',
      nvo: '',
      comments: '',
      salesContact: '',
      archived: false,
      userId: currentUserId || ''
    };

    try {
      await addAllFilesItem(newRecord);
    } catch (error) {
      console.error("Error adding all files record:", error);
      toast({
        title: "Error",
        description: "Failed to add new all files record.",
        variant: "destructive",
      })
    }
  };

  const addDomesticTruckingRecord = async () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: '',
      file: '',
      woSent: false,
      insurance: false,
      pickDate: '',
      delivered: 'No',
      paymentReceived: false,
      paymentMade: false,
      notes: '',
      archived: false,
      userId: currentUserId || ''
    };

    try {
      await addDomesticTruckingItem(newRecord);
    } catch (error) {
      console.error("Error adding domestic trucking record:", error);
      toast({
        title: "Error",
        description: "Failed to add new domestic trucking record.",
        variant: "destructive",
      })
    }
  };


  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Freight Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}><ArrowLeft className="mr-2 h-4 w-4" />Undo</Button>
          <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>Redo<ArrowRight className="ml-2 h-4 w-4" /></Button>
          <ExcelExportDialog 
            exportData={exportData || []} 
            importData={importData || []} 
            allFilesData={allFilesData || []} 
            domesticTruckingData={domesticTruckingData || []}
            activeTab={activeTab}
            selectedExportRows={selectedExportRows}
            selectedImportRows={selectedImportRows}
            selectedAllFilesRows={selectedAllFilesRows}
            selectedDomesticTruckingRows={selectedDomesticTruckingRows}
          >
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </ExcelExportDialog>
        </div>
      </div>

      <Tabs defaultValue="all_files" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all_files">All Files</TabsTrigger>
          <TabsTrigger value="import">Import Tracking</TabsTrigger>
          <TabsTrigger value="export">Export Tracking</TabsTrigger>
          <TabsTrigger value="domestic_trucking">Domestic Trucking</TabsTrigger>
        </TabsList>
        <TabsContent value="all_files">
          <div className="mb-4">
            <Button onClick={addAllFilesRecord}><Plus className="mr-2 h-4 w-4" />Add All Files Record</Button>
          </div>
          <AllFilesTable
            data={allFilesData || []}
            updateRecord={updateAllFilesRecord}
            deleteRecord={deleteAllFilesItem}
            selectedRows={selectedAllFilesRows}
            setSelectedRows={setSelectedAllFilesRows}
            highlightedRowId={highlightedRowId}
            onFileClick={onFileClick}
          />
        </TabsContent>
        <TabsContent value="import">
          <div className="mb-4">
            <Button onClick={addImportItem}><Plus className="mr-2 h-4 w-4" />Add Import Record</Button>
          </div>
          <ImportTrackingTable
            data={importData || []}
            updateRecord={updateImportRecord}
            deleteRecord={deleteImportItem}
            selectedRows={selectedImportRows}
            setSelectedRows={setSelectedImportRows}
            highlightedRowId={highlightedRowId}
            onFileClick={onFileClick}
          />
        </TabsContent>
        <TabsContent value="export">
          <div className="mb-4">
            <Button onClick={addExportRecord}><Plus className="mr-2 h-4 w-4" />Add Export Record</Button>
          </div>
          <TrackingTable
            data={exportData || []}
            updateRecord={updateRecord}
            deleteRecord={deleteExportItem}
            selectedRows={selectedExportRows}
            setSelectedRows={setSelectedExportRows}
            highlightedRowId={highlightedRowId}
            onFileClick={onFileClick}
          />
        </TabsContent>
        <TabsContent value="domestic_trucking">
          <div className="mb-4">
            <Button onClick={addDomesticTruckingRecord}><Plus className="mr-2 h-4 w-4" />Add Domestic Trucking Record</Button>
          </div>
          <DomesticTruckingTable
            data={domesticTruckingData || []}
            updateRecord={updateDomesticTruckingRecord}
            deleteRecord={deleteDomesticTruckingItem}
            selectedRows={selectedDomesticTruckingRows}
            setSelectedRows={setSelectedDomesticTruckingRows}
            highlightedRowId={highlightedRowId}
            onFileClick={onFileClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
