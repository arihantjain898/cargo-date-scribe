
import React, { useState, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import FreightTrackerTabs from '@/components/FreightTrackerTabs';
import CalendarView from '@/components/CalendarView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FreightTracker: React.FC = () => {
  const currentUserId = 'demo-user'; // Simplified for demo
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

  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);

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
      docsSent: null,
      docsReceived: null,
      docCutoffDate: '',
      aesMblVgmSent: null,
      titlesDispatched: '',
      validatedFwd: null,
      titlesReturned: '',
      sslDraftInvRec: null,
      draftInvApproved: null,
      transphereInvSent: null,
      paymentRec: null,
      sslPaid: null,
      insured: null,
      released: null,
      docsSentToCustomer: null,
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
      bond: '',
      poa: null,
      isf: null,
      packingListCommercialInvoice: null,
      billOfLading: null,
      arrivalNotice: null,
      isfFiled: null,
      entryFiled: null,
      blRelease: null,
      customsRelease: null,
      invoiceSent: null,
      paymentReceived: null,
      workOrderSetup: null,
      delivered: '',
      returned: '',
      deliveryDate: '',
      notes: '',
      createdAt: new Date().toISOString(),
      archived: false,
      userId: currentUserId
    };
    
    addImportItem(newRecord);
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

  const addNewDomesticTruckingRecord = () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: '',
      file: '',
      woSent: null,
      insurance: null,
      pickDate: '',
      delivered: '',
      paymentReceived: null,
      paymentMade: null,
      notes: '',
      archived: false,
      userId: currentUserId
    };
    addDomesticTruckingItem(newRecord);
  };

  const handleFileClick = useCallback((fullFileIdentifier: string) => {
    setHighlightedRowId(fullFileIdentifier);
    setTimeout(() => {
      setHighlightedRowId(null);
    }, 3000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="tables">
        <TabsList className="mb-4">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
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
            addDomesticRecord={addNewDomesticTruckingRecord}
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
            onCalendarEventClick={handleFileClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
