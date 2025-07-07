import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';
import CalendarView from './CalendarView';
import { useUndoRedo } from '../hooks/useUndoRedo';

const FreightTracker = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>('test-user-123');
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('allfiles');
  const [currentView, setCurrentView] = useState<'tables' | 'calendar'>('tables');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // Simple filtering for now - will enhance later
  const filteredExportData = useMemo(() => {
    if (!searchTerm.trim()) return exportData || [];
    const lowercaseSearch = searchTerm.toLowerCase();
    return (exportData || []).filter(record =>
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.ref || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.workOrder || '').toLowerCase().includes(lowercaseSearch) ||
      (record.notes || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [exportData, searchTerm]);

  const filteredImportData = useMemo(() => {
    if (!searchTerm.trim()) return importData || [];
    const lowercaseSearch = searchTerm.toLowerCase();
    return (importData || []).filter(record =>
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.booking || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.notes || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [importData, searchTerm]);

  const filteredAllFilesData = useMemo(() => {
    if (!searchTerm.trim()) return allFilesData || [];
    const lowercaseSearch = searchTerm.toLowerCase();
    return (allFilesData || []).filter(record =>
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.number || '').toLowerCase().includes(lowercaseSearch) ||
      (record.comments || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [allFilesData, searchTerm]);

  const filteredDomesticTruckingData = useMemo(() => {
    if (!searchTerm.trim()) return domesticTruckingData || [];
    const lowercaseSearch = searchTerm.toLowerCase();
    return (domesticTruckingData || []).filter(record =>
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.notes || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [domesticTruckingData, searchTerm]);

  const onFileClick = useCallback((fileNumber: string, fileType: string) => {
    let targetTab = '';
    let foundRecord = null;

    if (fileType === 'export') {
      targetTab = 'export';
      foundRecord = exportData?.find(record => record.file === fileNumber);
    } else if (fileType === 'import') {
      targetTab = 'import';
      foundRecord = importData?.find(record => record.file === fileNumber);
    } else if (fileType === 'all_files' || fileType === 'allfiles') {
      targetTab = 'allfiles';
      foundRecord = allFilesData?.find(record => record.number === fileNumber);
    } else if (fileType === 'domestic_trucking' || fileType === 'domestic') {
      targetTab = 'domestic';
      foundRecord = domesticTruckingData?.find(record => record.file === fileNumber);
    }

    if (foundRecord) {
      setActiveTab(targetTab);
      setCurrentView('tables');
      setHighlightedRowId(foundRecord.id);
    } else {
      toast({
        title: "File Not Found",
        description: `File number ${fileNumber} not found in ${fileType} tracking.`,
      });
    }
  }, [exportData, importData, allFilesData, domesticTruckingData]);

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
      });
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
      });
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
      });
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Freight Tracker</h1>
      </div>

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'tables' | 'calendar')} className="space-y-4">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="tables">📊 Tracking Tables</TabsTrigger>
          <TabsTrigger value="calendar">📅 Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <FreightTrackerTabs
            exportData={filteredExportData}
            importData={filteredImportData}
            domesticData={filteredDomesticTruckingData}
            allFilesData={filteredAllFilesData}
            updateExportRecord={updateRecord}
            updateImportRecord={updateImportRecord}
            updateDomesticRecord={updateDomesticTruckingRecord}
            updateAllFilesRecord={updateAllFilesRecord}
            deleteExportRecord={deleteExportItem}
            deleteImportRecord={deleteImportItem}
            deleteDomesticRecord={deleteDomesticTruckingItem}
            deleteAllFilesRecord={deleteAllFilesItem}
            addExportRecord={addExportRecord}
            addImportRecord={addImportItem}
            addDomesticRecord={addDomesticTruckingRecord}
            addAllFilesRecord={addAllFilesRecord}
            selectedExportRows={selectedExportRows}
            setSelectedExportRows={setSelectedExportRows}
            selectedImportRows={selectedImportRows}
            setSelectedImportRows={setSelectedImportRows}
            selectedDomesticRows={selectedDomesticTruckingRows}
            setSelectedDomesticRows={setSelectedDomesticTruckingRows}
            selectedAllFilesRows={selectedAllFilesRows}
            setSelectedAllFilesRows={setSelectedAllFilesRows}
            highlightedRowId={highlightedRowId}
            onFileClick={onFileClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredExportData={filteredExportData}
            filteredImportData={filteredImportData}
            filteredAllFilesData={filteredAllFilesData}
            filteredDomesticTruckingData={filteredDomesticTruckingData}
          />
        </TabsContent>
        
        <TabsContent value="calendar">
          <CalendarView
            data={filteredExportData}
            importData={filteredImportData}
            domesticData={filteredDomesticTruckingData}
            onCalendarEventClick={onFileClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;