import React, { useState, useEffect, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import FreightTrackerTabs from '@/components/FreightTrackerTabs';
import CalendarView from '@/components/CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const FreightTracker: React.FC = () => {
  const currentUserId = 'test-user-123'; // Mock user ID
  const { toast } = useToast();
  
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

  const handleFileClick = useCallback((fileNumber: string, fileType: string) => {
    console.log('File clicked - fileNumber:', fileNumber, 'fileType:', fileType);
    
    // Determine target tab based on file type first letter
    let targetTab = 'allfiles';
    let targetRecord = null;
    
    // Check first letter of file type to determine tab
    const firstLetter = fileType?.charAt(0)?.toUpperCase();
    console.log('First letter:', firstLetter, 'Full fileType:', fileType);
    
    switch (firstLetter) {
      case 'E':
        targetTab = 'export';
        // Try multiple matching patterns for export records
        targetRecord = exportData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          const searchFile = `${fileType}${fileNumber}`.toLowerCase();
          console.log('Checking export record:', recordFile, 'against:', searchFile);
          return recordFile === searchFile || 
                 recordFile === `e${fileNumber}` ||
                 recordFile === `et${fileNumber}` ||
                 recordFile === fileNumber.toLowerCase();
        });
        break;
      case 'I':
        targetTab = 'import';
        // Try multiple matching patterns for import records
        targetRecord = importData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          const searchFile = `${fileType}${fileNumber}`.toLowerCase();
          console.log('Checking import record:', recordFile, 'against:', searchFile);
          return recordFile === searchFile || 
                 recordFile === `i${fileNumber}` ||
                 recordFile === `is${fileNumber}` ||
                 recordFile === fileNumber.toLowerCase();
        });
        break;
      case 'D':
        targetTab = 'domestic';
        // Try multiple matching patterns for domestic records
        targetRecord = domesticTruckingData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          const searchFile = `${fileType}${fileNumber}`.toLowerCase();
          console.log('Checking domestic record:', recordFile, 'against:', searchFile);
          return recordFile === searchFile || 
                 recordFile === `d${fileNumber}` ||
                 recordFile === `dt${fileNumber}` ||
                 recordFile === fileNumber.toLowerCase();
        });
        break;
      default:
        // Stay on all files tab, try to find by number
        targetRecord = allFilesData.find(record => {
          const recordNumber = record.number?.toLowerCase() || '';
          const recordFile = record.file?.toLowerCase() || '';
          console.log('Checking allFiles record number:', recordNumber, 'file:', recordFile, 'against number:', fileNumber.toLowerCase());
          return recordNumber === fileNumber.toLowerCase() || 
                 recordFile === fileType.toLowerCase();
        });
    }
    
    console.log('Target tab:', targetTab, 'Target record found:', !!targetRecord, targetRecord?.id);
    
    if (targetRecord) {
      // Use a timeout to ensure the tab switch happens first
      setTimeout(() => {
        // Switch to the appropriate tab by triggering a click on the tab trigger
        const tabTrigger = document.querySelector(`[data-state="inactive"][value="${targetTab}"]`) as HTMLElement;
        if (tabTrigger) {
          console.log('Clicking tab trigger for:', targetTab);
          tabTrigger.click();
        }
        
        // Set the highlighted row ID after a small delay to ensure tab is switched
        setTimeout(() => {
          console.log('Setting highlighted row ID:', targetRecord.id);
          setHighlightedRowId(targetRecord.id);
          
          // Clear highlight after 3 seconds
          setTimeout(() => {
            setHighlightedRowId(null);
          }, 3000);
        }, 100);
        
        toast({
          title: "Record Found",
          description: `Switched to ${targetTab} tab and highlighted matching record`,
        });
      }, 50);
    } else {
      toast({
        title: "Record Not Found",
        description: `No matching record found for ${fileType}${fileNumber} in ${targetTab} tab`,
        variant: "destructive"
      });
    }
  }, [exportData, importData, domesticTruckingData, allFilesData, toast]);

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
    <div className="w-full min-h-screen px-2 py-4 max-w-[98vw]">
      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="mb-6">
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
