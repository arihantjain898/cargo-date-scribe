
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useFirebaseAuth';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import TrackingTable from '@/components/TrackingTable';
import ImportTrackingTable from '@/components/ImportTrackingTable';
import AllFilesTable from '@/components/AllFilesTable';
import DomesticTruckingTable from '@/components/DomesticTruckingTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const FreightTracker: React.FC = () => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.uid || '';
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

  const addNewExportRecord = () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: '',
      style: '',
      article: '',
      container: '',
      eta: '',
      actualArrival: '',
      thirtyDays: false,
      sixtyDays: false,
      ninetyDays: false,
      demurrage: '',
      origin: '',
      destination: '',
      forwarder: '',
      trackingNumber: '',
      trucker: '',
      driver: '',
      deliveryDate: '',
      pod: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
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
      fileNumber: '',
      fileType: '',
      customer: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
      userId: currentUserId
    };
    addAllFilesItem(newRecord);
  };

  const addNewDomesticTruckingRecord = () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: '',
      pickupNumber: '',
      deliveryNumber: '',
      trailerNumber: '',
      driverName: '',
      driverCell: '',
      checkIn: '',
      checkOut: '',
      weight: '',
      pallets: '',
      staging: '',
      seal: '',
      startTime: '',
      endTime: '',
      temp: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
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
            selectedRows={[]}
            setSelectedRows={() => {}}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>
        <TabsContent value="export">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Export Tracking</h2>
            <Button onClick={addNewExportRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New Export Record</Button>
          </div>
          <TrackingTable
            data={exportData}
            updateRecord={updateRecord}
            deleteRecord={deleteExportItem}
            selectedRows={[]}
            setSelectedRows={() => {}}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
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
            selectedRows={[]}
            setSelectedRows={() => {}}
            highlightedRowId={highlightedRowId}
            onFileClick={(fileNumber: string, fileType: string) => handleFileClick(`${fileNumber}-${fileType}`)}
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
            selectedRows={[]}
            setSelectedRows={() => {}}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
