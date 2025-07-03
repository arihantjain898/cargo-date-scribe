import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import ExportTrackingTable from '@/components/ExportTrackingTable';
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
      poNumber: '',
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
      fileName: '',
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
      puNumber: '',
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
      <Tabs defaultvalue="import">
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
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border-r-4 border-black p-2 text-left sticky left-0 z-20 bg-gray-100 min-w-[120px]">Customer</th>
                    <th className="border-r border-gray-500 p-2 text-left min-w-[100px]">Booking</th>
                    <th className="border-r border-gray-500 p-2 text-left min-w-[80px]">File</th>
                    <th className="border-r-4 border-black p-2 text-left min-w-[120px]">ETA Final POD</th>
                    <th className="border-r border-gray-500 p-2 text-left min-w-[80px]">Bond</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[60px]">POA</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[60px]">ISF</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[100px]">PL/CI</th>
                    <th className="border-r-4 border-black p-2 text-center min-w-[80px]">BOL</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Arrival Notice</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">ISF Filed</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Entry Filed</th>
                    <th className="border-r-4 border-black p-2 text-center min-w-[80px]">BL Release</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Customs Release</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Invoice Sent</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Payment Received</th>
                    <th className="border-r-4 border-black p-2 text-center min-w-[80px]">WO Setup</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Delivered</th>
                    <th className="border-r border-gray-500 p-2 text-center min-w-[80px]">Returned</th>
                    <th className="border-r-4 border-black p-2 text-center min-w-[100px]">Delivery Date</th>
                    <th className="border-r-4 border-black p-2 text-left min-w-[120px]">Notes</th>
                    <th className="p-2 text-center min-w-[60px]">Select</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.map((record, index) => (
                    <tr key={record.id} className={`border-b-2 border-gray-500 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
                    }`}>
                      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
                        <div className="min-w-[120px]">{record.customer || 'Enter customer'}</div>
                      </td>
                      <td className="border-r border-gray-500 p-1">
                        <div className="min-w-[100px]">{record.booking || 'Enter booking'}</div>
                      </td>
                      <td className="border-r border-gray-500 p-1">
                        <div className="min-w-[80px]">{record.file || 'Enter file'}</div>
                      </td>
                      <td className="border-r-4 border-black p-1">
                        <div className="min-w-[120px]">{record.etaFinalPod || 'Select ETA'}</div>
                      </td>
                      <td className="border-r border-gray-500 p-1">
                        <div className="min-w-[80px]">{record.bond || 'Enter bond'}</div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[60px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.poa === null || record.poa === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.poa 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.poa === null || record.poa === undefined ? 'Pending' : record.poa ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[60px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.isf === null || record.isf === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.isf 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.isf === null || record.isf === undefined ? 'Pending' : record.isf ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[100px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.packingListCommercialInvoice === null || record.packingListCommercialInvoice === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.packingListCommercialInvoice 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.packingListCommercialInvoice === null || record.packingListCommercialInvoice === undefined ? 'Pending' : record.packingListCommercialInvoice ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r-4 border-black p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.billOfLading === null || record.billOfLading === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.billOfLading 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.billOfLading === null || record.billOfLading === undefined ? 'Pending' : record.billOfLading ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.arrivalNotice === null || record.arrivalNotice === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.arrivalNotice 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.arrivalNotice === null || record.arrivalNotice === undefined ? 'Pending' : record.arrivalNotice ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.isfFiled === null || record.isfFiled === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.isfFiled 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.isfFiled === null || record.isfFiled === undefined ? 'Pending' : record.isfFiled ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.entryFiled === null || record.entryFiled === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.entryFiled 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.entryFiled === null || record.entryFiled === undefined ? 'Pending' : record.entryFiled ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r-4 border-black p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.blRelease === null || record.blRelease === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.blRelease 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.blRelease === null || record.blRelease === undefined ? 'Pending' : record.blRelease ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.customsRelease === null || record.customsRelease === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.customsRelease 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.customsRelease === null || record.customsRelease === undefined ? 'Pending' : record.customsRelease ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.invoiceSent === null || record.invoiceSent === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.invoiceSent 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.invoiceSent === null || record.invoiceSent === undefined ? 'Pending' : record.invoiceSent ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.paymentReceived === null || record.paymentReceived === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.paymentReceived 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.paymentReceived === null || record.paymentReceived === undefined ? 'Pending' : record.paymentReceived ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r-4 border-black p-1 text-center">
                        <div className="min-w-[80px] flex justify-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                            record.workOrderSetup === null || record.workOrderSetup === undefined 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : record.workOrderSetup 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}>
                            {record.workOrderSetup === null || record.workOrderSetup === undefined ? 'Pending' : record.workOrderSetup ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </td>
                      <td className="border-r border-gray-500 p-1">
                        <div className="min-w-[80px]">{record.delivered || 'Select status'}</div>
                      </td>
                      <td className="border-r border-gray-500 p-1">
                        <div className="min-w-[80px]">{record.returned || 'Select status'}</div>
                      </td>
                      <td className="border-r-4 border-black p-1">
                        <div className="min-w-[100px]">{record.deliveryDate || 'Select delivery date'}</div>
                      </td>
                      <td className="border-r-4 border-black p-1">
                        <div className="min-w-[120px]">{record.notes || 'Enter notes'}</div>
                      </td>
                      <td className="p-1 text-center">
                        <div className="min-w-[60px] flex justify-center">
                          <input type="checkbox" className="h-3 w-3" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="export">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Export Tracking</h2>
            <Button onClick={addNewExportRecord}><PlusIcon className="mr-2 h-4 w-4" />Add New Export Record</Button>
          </div>
          <ExportTrackingTable
            data={exportData}
            updateRecord={updateRecord}
            deleteRecord={deleteExportItem}
            showArchived={showArchivedExport}
            setShowArchived={setShowArchivedExport}
            highlightedRowId={highlightedRowId}
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
            showArchived={showArchivedAllFiles}
            setShowArchived={setShowArchivedAllFiles}
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
            showArchived={showArchivedDomesticTrucking}
            setShowArchived={setShowArchivedDomesticTrucking}
            highlightedRowId={highlightedRowId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
