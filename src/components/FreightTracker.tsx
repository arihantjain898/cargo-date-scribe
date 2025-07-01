
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import FreightTrackerTabs from './FreightTrackerTabs';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
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
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);

  console.log('FreightTracker - Current data:', {
    allFiles: allFilesData.length,
    import: importData.length,
    export: exportData.length,
    domestic: domesticTruckingData.length,
    loading,
    userId: currentUserId
  });

  // Generate ID without uuid
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

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
    console.log(`Linking to file: ${fileNumber}, type: ${fileType}`);
    
    // Find corresponding record in the appropriate table based on file type
    let targetTab = '';
    let targetRecordId = '';

    if (fileType === 'ES' || fileType === 'EA' || fileType === 'ET') {
      // Export tracking
      const exportRecord = exportData.find(record => 
        record.file === fileNumber || record.ref === fileNumber
      );
      if (exportRecord) {
        targetTab = 'export-table';
        targetRecordId = exportRecord.id;
      }
    } else if (fileType === 'IS' || fileType === 'IA') {
      // Import tracking
      const importRecord = importData.find(record => 
        record.file === fileNumber || record.booking === fileNumber
      );
      if (importRecord) {
        targetTab = 'import-table';
        targetRecordId = importRecord.id;
      }
    } else if (fileType === 'DT') {
      // Domestic trucking
      const domesticRecord = domesticTruckingData.find(record => 
        record.file === fileNumber
      );
      if (domesticRecord) {
        targetTab = 'domestic-trucking';
        targetRecordId = domesticRecord.id;
      }
    }

    if (targetTab && targetRecordId) {
      setActiveTab(targetTab);
      setHighlightedRowId(targetRecordId);
      
      // Clear highlight after animation
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      toast.error(`No matching record found for ${fileType} ${fileNumber}`);
    }
  };

  // Filter non-archived data
  const filteredExportData = exportData.filter(record => !record.archived);
  const filteredImportData = importData.filter(record => !record.archived);
  const filteredAllFilesData = allFilesData.filter(record => !record.archived);
  const filteredDomesticTruckingData = domesticTruckingData.filter(record => !record.archived);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading freight tracker data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Freight Tracker</h1>

      {/* Add New Record Section */}
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter customer name"
          value={newCustomer}
          onChange={(e) => setNewCustomer(e.target.value)}
        />
        {activeTab === 'all-files' && (
          <Button onClick={addAllFilesRecord}>Add All Files Record</Button>
        )}
        {activeTab === 'import-table' && (
          <Button onClick={addImportTrackingRecord}>Add Import Record</Button>
        )}
        {activeTab === 'export-table' && (
          <Button onClick={addExportTrackingRecord}>Add Export Record</Button>
        )}
        {activeTab === 'domestic-trucking' && (
          <Button onClick={addDomesticTruckingRecord}>Add Domestic Record</Button>
        )}
      </div>

      <FreightTrackerTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredExportData={filteredExportData}
        filteredImportData={filteredImportData}
        filteredAllFilesData={filteredAllFilesData}
        filteredDomesticTruckingData={filteredDomesticTruckingData}
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
        highlightedRowId={highlightedRowId}
        setHighlightedRowId={setHighlightedRowId}
      />
    </div>
  );
};

export default FreightTracker;
