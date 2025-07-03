
import React, { useState, useEffect, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import ImportTrackingTable from '@/components/ImportTrackingTable';
import AllFilesTable from '@/components/AllFilesTable';
import DomesticTruckingTable from '@/components/DomesticTruckingTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const FreightTracker: React.FC = () => {
  const currentUserId = 'dummy-user-id'; // Simplified for build
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

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
      archived: false,
      createdAt: new Date().toISOString(),
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
      <Tabs defaultValue="import">
        <TabsList className="mb-4">
          <TabsTrigger value="export">Export Tracking</TabsTrigger>
          <TabsTrigger value="import">Import Tracking</TabsTrigger>
          <TabsTrigger value="allFiles">All Files</TabsTrigger>
          <TabsTrigger value="domesticTrucking">Domestic Trucking</TabsTrigger>
        </TabsList>
        <TabsContent value="import">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Import Tracking</h2>
            <Button onClick={addNewImportRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New Import Record</Button>
          </div>
          <ImportTrackingTable
            data={importData}
            updateRecord={updateImportRecord}
            deleteRecord={deleteImportItem}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>
        <TabsContent value="export">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Export Tracking</h2>
            <Button onClick={addNewExportRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New Export Record</Button>
          </div>
          <div>Export tracking table would go here</div>
        </TabsContent>
        <TabsContent value="allFiles">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">All Files</h2>
            <Button onClick={addNewAllFilesRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New File Record</Button>
          </div>
          <AllFilesTable
            data={allFilesData}
            updateRecord={updateAllFilesRecord}
            deleteRecord={deleteAllFilesItem}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
          />
        </TabsContent>
        <TabsContent value="domesticTrucking">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Domestic Trucking</h2>
            <Button onClick={addNewDomesticTruckingRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New Domestic Trucking Record</Button>
          </div>
          <DomesticTruckingTable
            data={domesticTruckingData}
            updateRecord={updateDomesticTruckingRecord}
            deleteRecord={deleteDomesticTruckingItem}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
