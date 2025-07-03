
import React, { useState, useEffect, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import FreightTrackerTabs from '@/components/FreightTrackerTabs';
import CalendarView from '@/components/CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FreightTracker: React.FC = () => {
  const currentUserId = 'test-user-123'; // Mock user ID
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
  } = useFreightTrackerData(currentUserId);

  const [showArchivedExport, setShowArchivedExport] = useState(false);
  const [showArchivedImport, setShowArchivedImport] = useState(false);
  const [showArchivedAllFiles, setShowArchivedAllFiles] = useState(false);
  const [showArchivedDomesticTrucking, setShowArchivedDomesticTrucking] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  // Selected rows state for bulk operations
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);

  const addNewExportRecord = () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: '',
      ref: '',
      file: '',
      workOrder: '',
      dropDone: '',
      dropDate: '',
      returnNeeded: '',
      returnDate: '',
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: '',
      titlesDispatched: '',
      validatedFwd: false,
      titlesReturned: '',
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
      userId: currentUserId
    };
    
    addExportItem(newRecord);
  };

  const addNewImportRecord = () => {
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: '',
      booking: '',
      bookingUrl: '',
      file: '',
      etaFinalPod: '',
      bond: 'Continuous',
      poa: false,
      isf: false,
      packingListCommercialInvoice: false,
      billOfLading: false,
      arrivalNotice: false,
      isfFiled: false,
      entryFiled: false,
      blRelease: false,
      customsRelease: false,
      invoiceSent: false,
      paymentReceived: false,
      workOrderSetup: false,
      delivered: '',
      returned: '',
      deliveryDate: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
      userId: currentUserId
    };
    
    addImportItem(newRecord);
  };

  const addNewDomesticRecord = () => {
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
      userId: currentUserId
    };
    
    addDomesticTruckingItem(newRecord);
  };

  const addNewAllFilesRecord = () => {
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
      userId: currentUserId
    };
    
    addAllFilesItem(newRecord);
  };

  const handleFileClick = useCallback((fullFileIdentifier: string) => {
    console.log('File clicked:', fullFileIdentifier);
    
    // Parse the file identifier to determine the target tab and file
    const parts = fullFileIdentifier.split('-');
    if (parts.length >= 2) {
      const fileNumber = parts[0];
      const fileType = parts[1];
      
      console.log('Looking for file:', fileNumber, 'type:', fileType);
      
      // Determine which tab to switch to based on file type or first letter
      let targetTab = 'allfiles';
      let targetId = '';
      
      if (fileType) {
        const firstLetter = fileType.charAt(0).toUpperCase();
        switch (firstLetter) {
          case 'E':
            targetTab = 'export';
            // Find matching export record
            const exportRecord = exportData.find(record => 
              record.file === fileNumber || record.file === fullFileIdentifier
            );
            if (exportRecord) targetId = exportRecord.id;
            break;
          case 'I':
            targetTab = 'import';
            // Find matching import record
            const importRecord = importData.find(record => 
              record.file === fileNumber || record.file === fullFileIdentifier
            );
            if (importRecord) targetId = importRecord.id;
            break;
          case 'D':
            targetTab = 'domestic';
            // Find matching domestic record
            const domesticRecord = domesticTruckingData.find(record => 
              record.file === fileNumber || record.file === fullFileIdentifier
            );
            if (domesticRecord) targetId = domesticRecord.id;
            break;
          default:
            // Stay on all files tab, find the record
            const allFilesRecord = allFilesData.find(record => 
              record.number === fileNumber || record.file === fileType
            );
            if (allFilesRecord) targetId = allFilesRecord.id;
        }
      }
      
      console.log('Target tab:', targetTab, 'Target ID:', targetId);
      
      // Switch to the appropriate tab and highlight the row
      const tabTrigger = document.querySelector(`[value="${targetTab}"]`) as HTMLElement;
      if (tabTrigger) {
        tabTrigger.click();
      }
      
      // Set the highlighted row ID
      setHighlightedRowId(targetId || fullFileIdentifier);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    }
  }, [exportData, importData, domesticTruckingData, allFilesData]);

  const handleCalendarEventClick = useCallback((fileId: string, source: string) => {
    console.log('Calendar event clicked:', fileId, source);
    
    // Determine which tab to switch to based on source
    let targetTab = 'allfiles';
    switch (source) {
      case 'export':
        targetTab = 'export';
        break;
      case 'import':
        targetTab = 'import';
        break;
      case 'domestic':
        targetTab = 'domestic';
        break;
    }
    
    // Switch to the appropriate tab
    const tabTrigger = document.querySelector(`[value="${targetTab}"]`) as HTMLElement;
    if (tabTrigger) {
      tabTrigger.click();
    }
    
    setHighlightedRowId(fileId);
    setTimeout(() => {
      setHighlightedRowId(null);
    }, 3000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tracking">Tracking Tables</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking">
          <FreightTrackerTabs
            exportData={exportData}
            importData={importData}
            domesticData={domesticTruckingData}
            allFilesData={allFilesData}
            updateExportRecord={updateRecord}
            updateImportRecord={updateImportRecord}
            updateDomesticRecord={updateDomesticTruckingRecord}
            updateAllFilesRecord={updateAllFilesRecord}
            deleteExportRecord={deleteExportItem}
            deleteImportRecord={deleteImportItem}
            deleteDomesticRecord={deleteDomesticTruckingItem}
            deleteAllFilesRecord={deleteAllFilesItem}
            addExportRecord={addNewExportRecord}
            addImportRecord={addNewImportRecord}
            addDomesticRecord={addNewDomesticRecord}
            addAllFilesRecord={addNewAllFilesRecord}
            selectedExportRows={selectedExportRows}
            setSelectedExportRows={setSelectedExportRows}
            selectedImportRows={selectedImportRows}
            setSelectedImportRows={setSelectedImportRows}
            selectedDomesticRows={selectedDomesticRows}
            setSelectedDomesticRows={setSelectedDomesticRows}
            selectedAllFilesRows={selectedAllFilesRows}
            setSelectedAllFilesRows={setSelectedAllFilesRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView
            data={exportData}
            importData={importData}
            domesticData={domesticTruckingData}
            onCalendarEventClick={handleCalendarEventClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
