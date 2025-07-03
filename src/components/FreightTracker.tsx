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
  const [activeTab, setActiveTab] = useState('allfiles');
  const [mainActiveTab, setMainActiveTab] = useState('tracking');

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
    
    let targetRecord = null;
    let targetTab = 'allfiles';
    
    // Check if we're doing reverse linking (from other tabs to All Files)
    if (activeTab !== 'allfiles') {
      console.log('Reverse linking from', activeTab, 'to All Files');
      // Find matching record in All Files where file column matches fileType and number column matches fileNumber
      targetRecord = allFilesData.find(record => {
        const recordFile = record.file?.toLowerCase() || '';
        const recordNumber = record.number?.toLowerCase() || '';
        
        return recordFile === fileType.toLowerCase() && recordNumber === fileNumber.toLowerCase();
      });
      
      if (targetRecord) {
        setActiveTab('allfiles');
        setTimeout(() => {
          console.log('Setting highlighted row ID for All Files:', targetRecord.id);
          setHighlightedRowId(targetRecord.id);
          setTimeout(() => {
            setHighlightedRowId(null);
          }, 3000);
        }, 200);
        
        toast({
          title: "Record Found",
          description: `Found matching record in All Files tab`,
        });
        return;
      } else {
        toast({
          title: "Record Not Found",
          description: `No matching record found in All Files for ${fileType}${fileNumber}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Original forward linking (from All Files to other tabs)
    // Determine target tab based on file type first letter
    const firstLetter = fileType?.charAt(0)?.toUpperCase();
    console.log('First letter:', firstLetter, 'Full fileType:', fileType);
    
    // Create search strings for matching
    const searchStrings = [
      `${fileType}${fileNumber}`.toLowerCase(),
      `${fileType.toLowerCase()}${fileNumber}`,
      fileNumber.toLowerCase(),
      `${firstLetter?.toLowerCase()}${fileNumber}`,
      `${firstLetter?.toLowerCase()}s${fileNumber}`,
      `${firstLetter?.toLowerCase()}t${fileNumber}`
    ];
    
    switch (firstLetter) {
      case 'E':
        targetTab = 'export';
        targetRecord = exportData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      case 'I':
        targetTab = 'import';
        targetRecord = importData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      case 'D':
        targetTab = 'domestic';
        targetRecord = domesticTruckingData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      default:
        // Stay on all files tab, try to find by number
        targetRecord = allFilesData.find(record => {
          const recordNumber = record.number?.toLowerCase() || '';
          const recordFile = record.file?.toLowerCase() || '';
          return recordNumber === fileNumber.toLowerCase() || 
                 recordFile === fileType.toLowerCase();
        });
    }
    
    console.log('Target tab:', targetTab, 'Target record found:', !!targetRecord, targetRecord?.id);
    
    if (targetRecord) {
      // Switch to the appropriate tab
      setActiveTab(targetTab);
      
      // Set the highlighted row ID after a small delay to ensure tab is switched
      setTimeout(() => {
        console.log('Setting highlighted row ID:', targetRecord.id);
        setHighlightedRowId(targetRecord.id);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      }, 200);
      
      toast({
        title: "Record Found",
        description: `Switched to ${targetTab} tab and highlighted matching record`,
      });
    } else {
      toast({
        title: "Record Not Found",
        description: `No matching record found for ${fileType}${fileNumber} in ${targetTab} tab`,
        variant: "destructive"
      });
    }
  }, [exportData, importData, domesticTruckingData, allFilesData, toast, activeTab]);

  const handleCalendarEventClick = useCallback((fileId: string, source: string) => {
    console.log('FreightTracker: Calendar event clicked:', fileId, source);
    
    // Switch to the tracking tables tab first
    setMainActiveTab('tracking');
    
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
    
    console.log('FreightTracker: Switching to tab:', targetTab, 'for fileId:', fileId);
    
    // Switch to the appropriate tab
    setTimeout(() => {
      setActiveTab(targetTab);
      
      // Set the highlighted row ID after a small delay to ensure tab is switched
      setTimeout(() => {
        console.log('FreightTracker: Setting highlighted row ID:', fileId);
        setHighlightedRowId(fileId);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      }, 300);
    }, 100);
    
    toast({
      title: "Navigating to Record",
      description: `Switching to ${targetTab} tab and highlighting record`,
    });
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen px-2 py-4 max-w-[85vw] mx-auto">
      <Tabs value={mainActiveTab} onValueChange={setMainActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tracking">Tracking Tables</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="max-h-[92vh] overflow-hidden">
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="calendar" className="max-h-[92vh] overflow-hidden">
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
