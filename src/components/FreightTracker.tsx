import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { TrackingRecord } from '../types/TrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

import AllFilesTable from './AllFilesTable';
import ImportTrackingTable from './ImportTrackingTable';
import TrackingTable from './TrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';

const FreightTracker = () => {
  const [activeTab, setActiveTab] = useState('allFiles');
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const [importTrackingData, setImportTrackingData] = useState<ImportTrackingRecord[]>([]);
  const [exportTrackingData, setExportTrackingData] = useState<TrackingRecord[]>([]);
  const [domesticTruckingData, setDomesticTruckingData] = useState<DomesticTruckingRecord[]>([]);
  const [newCustomer, setNewCustomer] = useState('');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedAllFilesData = localStorage.getItem('allFilesData');
    if (storedAllFilesData) {
      setAllFilesData(JSON.parse(storedAllFilesData));
    }

    const storedImportTrackingData = localStorage.getItem('importTrackingData');
    if (storedImportTrackingData) {
      setImportTrackingData(JSON.parse(storedImportTrackingData));
    }

    const storedExportTrackingData = localStorage.getItem('exportTrackingData');
    if (storedExportTrackingData) {
      setExportTrackingData(JSON.parse(storedExportTrackingData));
    }

    const storedDomesticTruckingData = localStorage.getItem('domesticTruckingData');
    if (storedDomesticTruckingData) {
      setDomesticTruckingData(JSON.parse(storedDomesticTruckingData));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('allFilesData', JSON.stringify(allFilesData));
    localStorage.setItem('importTrackingData', JSON.stringify(importTrackingData));
    localStorage.setItem('exportTrackingData', JSON.stringify(exportTrackingData));
    localStorage.setItem('domesticTruckingData', JSON.stringify(domesticTruckingData));
  }, [allFilesData, importTrackingData, exportTrackingData, domesticTruckingData]);

  // Function to add a new record to All Files
  const addAllFilesRecord = () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: AllFilesRecord = {
      id: uuidv4(),
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

    setAllFilesData(prevData => [...prevData, newRecord]);
    setNewCustomer('');
    toast.success('Record added to All Files.');
  };

  // Function to add a new record to Import Tracking
  const addImportTrackingRecord = () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: ImportTrackingRecord = {
      id: uuidv4(),
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

    setImportTrackingData(prevData => [...prevData, newRecord]);
    setNewCustomer('');
    toast.success('Record added to Import Tracking.');
  };

  // Function to add a new record to Export Tracking
  const addExportTrackingRecord = () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: TrackingRecord = {
      id: uuidv4(),
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

    setExportTrackingData(prevData => [...prevData, newRecord]);
    setNewCustomer('');
    toast.success('Record added to Export Tracking.');
  };

  // Function to add a new record to Domestic Trucking
  const addDomesticTruckingRecord = () => {
    if (newCustomer.trim() === '') {
      toast.error('Customer cannot be empty.');
      return;
    }

    const newRecord: DomesticTruckingRecord = {
      id: uuidv4(),
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

    setDomesticTruckingData(prevData => [...prevData, newRecord]);
    setNewCustomer('');
    toast.success('Record added to Domestic Trucking.');
  };

  // Generic function to update a record in a dataset
  const updateRecord = useCallback(
    (dataset: string, id: string, field: string, value: string | boolean) => {
      switch (dataset) {
        case 'allFiles':
          setAllFilesData(prevData =>
            prevData.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );
          break;
        case 'importTracking':
          setImportTrackingData(prevData =>
            prevData.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );
          break;
        case 'exportTracking':
          setExportTrackingData(prevData =>
            prevData.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );
          break;
        case 'domesticTrucking':
          setDomesticTruckingData(prevData =>
            prevData.map(item =>
              item.id === id ? { ...item, [field]: value } : item
            )
          );
          break;
        default:
          console.error(`Invalid dataset: ${dataset}`);
      }
    },
    []
  );

  // Generic function to delete a record from a dataset
  const deleteRecord = (dataset: string, id: string) => {
    switch (dataset) {
      case 'allFiles':
        setAllFilesData(prevData => prevData.filter(item => item.id !== id));
        break;
      case 'importTracking':
        setImportTrackingData(prevData => prevData.filter(item => item.id !== id));
        break;
      case 'exportTracking':
        setExportTrackingData(prevData => prevData.filter(item => item.id !== id));
        break;
      case 'domesticTrucking':
        setDomesticTruckingData(prevData => prevData.filter(item => item.id !== id));
        break;
      default:
        console.error(`Invalid dataset: ${dataset}`);
    }
  };

  // Enhanced file click handler that determines which tab to navigate to
  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Attempting to link ${fileType} ${fileNumber}`);
    
    const firstLetter = fileType.charAt(0).toUpperCase();
    let targetTab = '';
    let targetData: any[] = [];
    
    // Determine target tab based on first letter
    switch (firstLetter) {
      case 'E':
        targetTab = 'exportTracking';
        targetData = exportTrackingData;
        break;
      case 'I':
        targetTab = 'importTracking';
        targetData = importTrackingData;
        break;
      case 'D':
        targetTab = 'domesticTrucking';
        targetData = domesticTruckingData;
        break;
      default:
        toast.error(`Unknown file type: ${fileType}`);
        return;
    }
    
    // Find matching record by file number
    const matchingRecord = targetData.find(record => record.file === fileNumber);
    
    if (matchingRecord) {
      setActiveTab(targetTab);
      setHighlightedRowId(matchingRecord.id);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
      
      toast.success(`Found ${fileType} ${fileNumber} in ${targetTab === 'exportTracking' ? 'Export Checklist' : targetTab === 'importTracking' ? 'Import Checklist' : 'Domestic Trucking'}`);
    } else {
      toast.error(`No matching record found for ${fileType} ${fileNumber}`);
    }
  };

  // Back to All Files handler - finds matching record in All Files based on file type and number
  const handleBackToAllFiles = (fileNumber: string, currentTab: string) => {
    console.log(`Attempting to link back to All Files from ${currentTab} for file ${fileNumber}`);
    
    // Determine file type prefix based on current tab
    let fileTypePrefix = '';
    switch (currentTab) {
      case 'exportTracking':
        fileTypePrefix = 'E'; // Could be EA, ES, or ET
        break;
      case 'importTracking':
        fileTypePrefix = 'I'; // Could be IS or IA
        break;
      case 'domesticTrucking':
        fileTypePrefix = 'D'; // Could be DT
        break;
      default:
        toast.error('Unknown tab for linking back to All Files');
        return;
    }
    
    // Find matching All Files record
    const matchingRecord = allFilesData.find(record => {
      const recordFileType = record.file;
      const recordNumber = record.number;
      
      // Check if the file type starts with the expected prefix and number matches
      return recordFileType.startsWith(fileTypePrefix) && recordNumber === fileNumber;
    });
    
    if (matchingRecord) {
      setActiveTab('allFiles');
      setHighlightedRowId(matchingRecord.id);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
      
      toast.success(`Found corresponding All Files record for ${matchingRecord.file} ${fileNumber}`);
    } else {
      toast.error(`No matching All Files record found for file ${fileNumber}`);
    }
  };

  // Enhanced calendar event click handler
  const handleCalendarEventClick = (fileNumber: string, source: string) => {
    console.log(`Calendar event clicked: ${fileNumber} from ${source}`);
    
    // Extract file type and number from fileNumber (assuming format like "EA123" or "IS456")
    const fileTypeMatch = fileNumber.match(/^([A-Z]{2})(\d+)$/);
    
    if (!fileTypeMatch) {
      toast.error(`Invalid file number format: ${fileNumber}`);
      return;
    }
    
    const [, fileType, number] = fileTypeMatch;
    
    // First, try to find and navigate to the All Files record
    const allFilesRecord = allFilesData.find(record => 
      record.file === fileType && record.number === number
    );
    
    if (allFilesRecord) {
      setActiveTab('allFiles');
      setHighlightedRowId(allFilesRecord.id);
      
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
      
      toast.success(`Found ${fileType} ${number} in All Files`);
      return;
    }
    
    // If not found in All Files, try the specific checklist tabs
    const firstLetter = fileType.charAt(0);
    let targetTab = '';
    let targetData: any[] = [];
    
    switch (firstLetter) {
      case 'E':
        targetTab = 'exportTracking';
        targetData = exportTrackingData;
        break;
      case 'I':
        targetTab = 'importTracking';
        targetData = importTrackingData;
        break;
      case 'D':
        targetTab = 'domesticTrucking';
        targetData = domesticTruckingData;
        break;
      default:
        toast.error(`Unknown file type: ${fileType}`);
        return;
    }
    
    const checklistRecord = targetData.find(record => record.file === number);
    
    if (checklistRecord) {
      setActiveTab(targetTab);
      setHighlightedRowId(checklistRecord.id);
      
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
      
      toast.success(`Found ${fileType} ${number} in ${targetTab === 'exportTracking' ? 'Export Checklist' : targetTab === 'importTracking' ? 'Import Checklist' : 'Domestic Trucking'}`);
    } else {
      toast.error(`No matching record found for ${fileType} ${number}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Freight Tracker</h1>

      {/* Tabs */}
      <div className="mb-4">
        <Button
          variant={activeTab === 'allFiles' ? 'default' : 'outline'}
          onClick={() => setActiveTab('allFiles')}
        >
          All Files
        </Button>
        <Button
          variant={activeTab === 'importTracking' ? 'default' : 'outline'}
          onClick={() => setActiveTab('importTracking')}
        >
          Import Tracking
        </Button>
        <Button
          variant={activeTab === 'exportTracking' ? 'default' : 'outline'}
          onClick={() => setActiveTab('exportTracking')}
        >
          Export Tracking
        </Button>
        <Button
          variant={activeTab === 'domesticTrucking' ? 'default' : 'outline'}
          onClick={() => setActiveTab('domesticTrucking')}
        >
          Domestic Trucking
        </Button>
      </div>

      {/* Add New Record Section */}
      <div className="mb-4 flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter customer name"
          value={newCustomer}
          onChange={(e) => setNewCustomer(e.target.value)}
        />
        {activeTab === 'allFiles' && (
          <Button onClick={addAllFilesRecord}>Add All Files Record</Button>
        )}
        {activeTab === 'importTracking' && (
          <Button onClick={addImportTrackingRecord}>Add Import Record</Button>
        )}
        {activeTab === 'exportTracking' && (
          <Button onClick={addExportTrackingRecord}>Add Export Record</Button>
        )}
        {activeTab === 'domesticTrucking' && (
          <Button onClick={addDomesticTruckingRecord}>Add Domestic Record</Button>
        )}
      </div>

      {/* Tables */}
      {activeTab === 'allFiles' && (
        <AllFilesTable
          data={allFilesData}
          updateRecord={(id, field, value) => updateRecord('allFiles', id, field, value)}
          deleteRecord={(id) => deleteRecord('allFiles', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onFileClick={handleFileClick}
        />
      )}
      {activeTab === 'importTracking' && (
        <ImportTrackingTable
          data={importTrackingData}
          updateRecord={(id, field, value) => updateRecord('importTracking', id, field, value)}
          deleteRecord={(id) => deleteRecord('importTracking', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          highlightedRowId={highlightedRowId}
          onBackToAllFiles={(fileNumber) => handleBackToAllFiles(fileNumber, 'importTracking')}
        />
      )}
      {activeTab === 'exportTracking' && (
        <TrackingTable
          data={exportTrackingData}
          updateRecord={(id, field, value) => updateRecord('exportTracking', id, field, value)}
          deleteRecord={(id) => deleteRecord('exportTracking', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          highlightedRowId={highlightedRowId}
          onBackToAllFiles={(fileNumber) => handleBackToAllFiles(fileNumber, 'exportTracking')}
        />
      )}
      {activeTab === 'domesticTrucking' && (
        <DomesticTruckingTable
          data={domesticTruckingData}
          updateRecord={(id, field, value) => updateRecord('domesticTrucking', id, field, value)}
          deleteRecord={(id) => deleteRecord('domesticTrucking', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          highlightedRowId={highlightedRowId}
          onBackToAllFiles={(fileNumber) => handleBackToAllFiles(fileNumber, 'domesticTrucking')}
        />
      )}
    </div>
  );
};

export default FreightTracker;
