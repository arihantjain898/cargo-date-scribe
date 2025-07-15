import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Load saved tab from localStorage, default to 'allfiles' if not found
    return localStorage.getItem('freightTracker-activeTab') || 'allfiles';
  });
  const [currentView, setCurrentView] = useState<'tables' | 'calendar'>(() => {
    // Load saved view from localStorage, default to 'tables' if not found
    return (localStorage.getItem('freightTracker-currentView') as 'tables' | 'calendar') || 'tables';
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    deleteDomesticTruckingItem,
    createCorrespondingRecord
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

  const onFileClick = useCallback((fileIdentifier: string, fileType: string) => {
    let targetTab = '';
    let foundRecord = null;
    let searchDescription = '';

    if (fileType === 'export') {
      targetTab = 'export';
      foundRecord = exportData?.find(record => record.file?.trim() === fileIdentifier.trim());
      searchDescription = `"${fileIdentifier}" in Export tab file column`;
    } else if (fileType === 'import') {
      targetTab = 'import';
      foundRecord = importData?.find(record => record.file?.trim() === fileIdentifier.trim());
      searchDescription = `"${fileIdentifier}" in Import tab file column`;
    } else if (fileType === 'allfiles') {
      targetTab = 'allfiles';
      // For linking to all files: split fileIdentifier into prefix (first 2 chars) and number (rest)
      if (fileIdentifier.length < 3) {
        console.log('Invalid file identifier for All Files linking:', fileIdentifier);
        toast({
          title: "Invalid File Format",
          description: `File "${fileIdentifier}" must have at least 3 characters (2 letters + digits).`,
          variant: "destructive",
        });
        return;
      }
      
      const filePrefix = fileIdentifier.slice(0, 2).toUpperCase();
      const numberPart = fileIdentifier.slice(2);
      
      foundRecord = allFilesData?.find(record => {
        const recordFile = record.file?.trim().toUpperCase();
        const recordNumber = record.number?.trim();
        const matches = recordFile === filePrefix && recordNumber === numberPart;
        console.log(`Checking All Files record: file="${recordFile}" vs "${filePrefix}", number="${recordNumber}" vs "${numberPart}", matches: ${matches}`);
        return matches;
      });
      searchDescription = `file="${filePrefix}" and number="${numberPart}" in All Files tab`;
    } else if (fileType === 'domestic') {
      targetTab = 'domestic';
      foundRecord = domesticTruckingData?.find(record => record.file?.trim() === fileIdentifier.trim());
      searchDescription = `"${fileIdentifier}" in Domestic Trucking tab file column`;
    }

    console.log(`File linking attempt: Looking for ${searchDescription}, found: ${!!foundRecord}`);

    if (foundRecord) {
      setActiveTab(targetTab);
      // Save the new tab to localStorage
      localStorage.setItem('freightTracker-activeTab', targetTab);
      setCurrentView('tables');
      
      // Clear any existing highlight timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
        highlightTimeoutRef.current = null;
      }
      
      // Set the highlight
      setHighlightedRowId(foundRecord.id);
      
      // Clear highlight after exactly 3 seconds
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedRowId(null);
        highlightTimeoutRef.current = null;
      }, 3000);
    } else {
      toast({
        title: "File Not Found",
        description: `Could not find ${searchDescription}.`,
        variant: "destructive",
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
      docsSent: 'Select',
      docsReceived: 'Select',
      aesMblVgmSent: 'Select',
      docCutoffDate: '',
      titlesDispatched: 'Select',
      validatedFwd: 'Select',
      titlesReturned: 'Select',
      sslDraftInvRec: 'Select',
      draftInvApproved: 'Select',
      transphereInvSent: 'Select',
      paymentRec: 'Select',
      sslPaid: 'Select',
      insured: 'Select',
      released: 'Select',
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
      delivered: '',
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Freight Tracker</h1>
      </div>

      <Tabs value={currentView} onValueChange={(value) => {
        const newView = value as 'tables' | 'calendar';
        setCurrentView(newView);
        localStorage.setItem('freightTracker-currentView', newView);
      }} className="space-y-4">
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
            createCorrespondingRecord={createCorrespondingRecord}
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
            setActiveTab={(tab) => {
              setActiveTab(tab);
              // Save tab to localStorage whenever it changes
              localStorage.setItem('freightTracker-activeTab', tab);
            }}
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