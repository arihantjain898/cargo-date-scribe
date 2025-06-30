
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import FreightTrackerTabs from './FreightTrackerTabs';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { TrackingRecord } from '../types/TrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
  const currentUserId = user?.uid || '';
  
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

  const [activeTab, setActiveTab] = useState('all-files');
  const [newCustomer, setNewCustomer] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);

  console.log('FreightTracker data:', {
    exportData: exportData?.length || 0,
    importData: importData?.length || 0,
    allFilesData: allFilesData?.length || 0,
    domesticTruckingData: domesticTruckingData?.length || 0,
    loading,
    currentUserId
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to continue</h2>
          <p className="text-gray-600">You need to be logged in to access the freight tracker.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Function to add a new record to All Files
  const addAllFilesRecord = async () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: Omit<AllFilesRecord, 'id'> = {
      customer: newCustomer,
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
    };

    try {
      await addAllFilesItem(newRecord);
      setNewCustomer('');
      toast.success('Record added to All Files.');
    } catch (error) {
      console.error('Error adding all files record:', error);
      toast.error('Failed to add record.');
    }
  };

  // Function to add a new record to Import Tracking
  const addImportTrackingRecord = async () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: newCustomer,
      booking: '',
      file: '',
      etaFinalPod: '',
      bond: '',
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
    };

    try {
      await addImportItem(newRecord);
      setNewCustomer('');
      toast.success('Record added to Import Tracking.');
    } catch (error) {
      console.error('Error adding import record:', error);
      toast.error('Failed to add record.');
    }
  };

  // Function to add a new record to Export Tracking
  const addExportTrackingRecord = async () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: newCustomer,
      ref: '',
      file: '',
      workOrder: '',
      dropDone: '',
      dropDate: '',
      returnNeeded: '',
      returnDate: '',
      docsSent: false,
      docsReceived: false,
      docCutoffDate: '',
      aesMblVgmSent: false,
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
    };

    try {
      await addExportItem(newRecord);
      setNewCustomer('');
      toast.success('Record added to Export Tracking.');
    } catch (error) {
      console.error('Error adding export record:', error);
      toast.error('Failed to add record.');
    }
  };

  // Function to add a new record to Domestic Trucking
  const addDomesticTruckingRecord = async () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: newCustomer,
      file: '',
      woSent: false,
      insurance: false,
      pickDate: '',
      delivered: '',
      paymentReceived: false,
      paymentMade: false,
      notes: '',
      archived: false,
    };

    try {
      await addDomesticTruckingItem(newRecord);
      setNewCustomer('');
      toast.success('Record added to Domestic Trucking.');
    } catch (error) {
      console.error('Error adding domestic trucking record:', error);
      toast.error('Failed to add record.');
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Opening ${fileType} ${fileNumber} in checklist`);
    // Add your file opening logic here
  };

  const handleCalendarEventClick = (fileNumber: string, source: string) => {
    console.log(`Calendar event clicked: ${fileNumber} from ${source}`);
    // Add your calendar event logic here
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Freight Tracker</h1>
        
        {/* Add New Record Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Input
            type="text"
            placeholder="Enter customer name"
            value={newCustomer}
            onChange={(e) => setNewCustomer(e.target.value)}
            className="flex-1 min-w-0"
          />
          <div className="flex flex-wrap gap-2">
            {activeTab === 'all-files' && (
              <Button onClick={addAllFilesRecord} size="sm">Add All Files Record</Button>
            )}
            {activeTab === 'import-table' && (
              <Button onClick={addImportTrackingRecord} size="sm">Add Import Record</Button>
            )}
            {activeTab === 'export-table' && (
              <Button onClick={addExportTrackingRecord} size="sm">Add Export Record</Button>
            )}
            {activeTab === 'domestic-trucking' && (
              <Button onClick={addDomesticTruckingRecord} size="sm">Add Domestic Record</Button>
            )}
          </div>
        </div>
      </div>

      <FreightTrackerTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredExportData={exportData || []}
        filteredImportData={importData || []}
        filteredAllFilesData={allFilesData || []}
        filteredDomesticTruckingData={domesticTruckingData || []}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectedImportRows={selectedImportRows}
        setSelectedImportRows={setSelectedImportRows}
        selectedAllFilesRows={selectedAllFilesRows}
        setSelectedAllFilesRows={setSelectedAllFilesRows}
        selectedDomesticTruckingRows={selectedDomesticTruckingRows}
        setSelectedDomesticTruckingRows={setSelectedDomesticTruckingRows}
        updateRecord={updateRecord}
        updateImportRecord={updateImportRecord}
        updateAllFilesRecord={updateAllFilesRecord}
        updateDomesticTruckingRecord={updateDomesticTruckingRecord}
        deleteRecord={deleteExportItem}
        deleteImportRecord={deleteImportItem}
        deleteAllFilesRecord={deleteAllFilesItem}
        deleteDomesticTruckingRecord={deleteDomesticTruckingItem}
        onFileClick={handleFileClick}
        onCalendarEventClick={handleCalendarEventClick}
      />
    </div>
  );
};

export default FreightTracker;
