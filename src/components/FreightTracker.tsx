import React, { useState, useEffect, useCallback } from 'react';
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
    console.log('Loading data from localStorage...');
    // Load data from localStorage on component mount
    const storedAllFilesData = localStorage.getItem('allFilesData');
    if (storedAllFilesData) {
      try {
        const parsedData = JSON.parse(storedAllFilesData);
        console.log('Loaded allFilesData:', parsedData);
        setAllFilesData(parsedData);
      } catch (error) {
        console.error('Error parsing allFilesData:', error);
        setAllFilesData([]);
      }
    }

    const storedImportTrackingData = localStorage.getItem('importTrackingData');
    if (storedImportTrackingData) {
      try {
        const parsedData = JSON.parse(storedImportTrackingData);
        console.log('Loaded importTrackingData:', parsedData);
        setImportTrackingData(parsedData);
      } catch (error) {
        console.error('Error parsing importTrackingData:', error);
        setImportTrackingData([]);
      }
    }

    const storedExportTrackingData = localStorage.getItem('exportTrackingData');
    if (storedExportTrackingData) {
      try {
        const parsedData = JSON.parse(storedExportTrackingData);
        console.log('Loaded exportTrackingData:', parsedData);
        setExportTrackingData(parsedData);
      } catch (error) {
        console.error('Error parsing exportTrackingData:', error);
        setExportTrackingData([]);
      }
    }

    const storedDomesticTruckingData = localStorage.getItem('domesticTruckingData');
    if (storedDomesticTruckingData) {
      try {
        const parsedData = JSON.parse(storedDomesticTruckingData);
        console.log('Loaded domesticTruckingData:', parsedData);
        setDomesticTruckingData(parsedData);
      } catch (error) {
        console.error('Error parsing domesticTruckingData:', error);
        setDomesticTruckingData([]);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Saving data to localStorage...');
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
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
      console.log(`Updating ${dataset} record ${id}: ${field} = ${value}`);
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
    console.log(`Deleting from ${dataset}: ${id}`);
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

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Attempting to open ${fileType} ${fileNumber}`);
    
    // Determine which tab to switch to based on file type
    let targetTab = '';
    let foundRecord = false;

    if (fileType.startsWith('E')) {
      // Export file
      targetTab = 'exportTracking';
      const exportRecord = exportTrackingData.find(record => record.file === `${fileType}${fileNumber}`);
      if (exportRecord) {
        foundRecord = true;
        setHighlightedRowId(exportRecord.id);
      }
    } else if (fileType.startsWith('I')) {
      // Import file
      targetTab = 'importTracking';
      const importRecord = importTrackingData.find(record => record.file === `${fileType}${fileNumber}`);
      if (importRecord) {
        foundRecord = true;
        setHighlightedRowId(importRecord.id);
      }
    } else if (fileType.startsWith('D')) {
      // Domestic file
      targetTab = 'domesticTrucking';
      const domesticRecord = domesticTruckingData.find(record => record.file === `${fileType}${fileNumber}`);
      if (domesticRecord) {
        foundRecord = true;
        setHighlightedRowId(domesticRecord.id);
      }
    }

    if (foundRecord && targetTab) {
      setActiveTab(targetTab);
      toast.success(`Opened ${fileType}${fileNumber} in ${targetTab.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      toast.error(`File ${fileType}${fileNumber} not found in corresponding table`);
    }
  };

  const handleBackToAllFiles = (fileNumber: string, fileType: string) => {
    console.log(`Going back to All Files for ${fileType}${fileNumber}`);
    
    // Find matching record in All Files based on file type and number
    const allFilesRecord = allFilesData.find(record => 
      record.file === fileType && record.number === fileNumber
    );
    
    if (allFilesRecord) {
      setActiveTab('allFiles');
      setHighlightedRowId(allFilesRecord.id);
      toast.success(`Found ${fileType}${fileNumber} in All Files`);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      toast.error(`No matching record found in All Files for ${fileType}${fileNumber}`);
    }
  };

  console.log('Current data lengths:', {
    allFiles: allFilesData.length,
    import: importTrackingData.length,
    export: exportTrackingData.length,
    domestic: domesticTruckingData.length
  });

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
          highlightedRowId={highlightedRowId}
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
          onBackToAllFiles={handleBackToAllFiles}
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
          onBackToAllFiles={handleBackToAllFiles}
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
          onBackToAllFiles={handleBackToAllFiles}
        />
      )}
    </div>
  );
};

export default FreightTracker;
