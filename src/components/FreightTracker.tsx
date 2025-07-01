import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"

import AllFilesTable from './AllFilesTable';
import ImportTrackingTable from './ImportTrackingTable';
import TrackingTable from './TrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

// Generate a simple ID without uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

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
      id: generateId(),
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
      id: generateId(),
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
      id: generateId(),
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
      id: generateId(),
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

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Navigating to ${fileType} ${fileNumber}`);
    
    // Determine target tab based on file type
    let targetTab = '';
    let targetData: any[] = [];
    
    const firstLetter = fileType.charAt(0).toUpperCase();
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
        toast.error(`Invalid file type: ${fileType}`);
        return;
    }

    // Find matching record
    const matchingRecord = targetData.find(record => record.file === fileNumber);
    
    if (matchingRecord) {
      // Store current All Files record for back navigation
      sessionStorage.setItem('sourceAllFilesId', ''); // We'll find this by file/number
      
      setActiveTab(targetTab);
      setHighlightedRowId(matchingRecord.id);
      toast.success(`Navigated to ${fileType} ${fileNumber}`);
    } else {
      toast.error(`File ${fileType} ${fileNumber} not found in ${targetTab}`);
    }
  };

  const handleBackToAllFiles = () => {
    const currentTab = activeTab;
    let fileType = '';
    let fileNumber = '';
    
    // Determine file type from current tab
    switch (currentTab) {
      case 'exportTracking':
        fileType = 'E';
        break;
      case 'importTracking':
        fileType = 'I';
        break;
      case 'domesticTrucking':
        fileType = 'D';
        break;
      default:
        setActiveTab('allFiles');
        setHighlightedRowId(null);
        return;
    }

    // Find the highlighted record to get file number
    let currentRecord = null;
    switch (currentTab) {
      case 'exportTracking':
        currentRecord = exportTrackingData.find(r => r.id === highlightedRowId);
        break;
      case 'importTracking':
        currentRecord = importTrackingData.find(r => r.id === highlightedRowId);
        break;
      case 'domesticTrucking':
        currentRecord = domesticTruckingData.find(r => r.id === highlightedRowId);
        break;
    }

    if (currentRecord) {
      fileNumber = currentRecord.file;
      
      // Find matching All Files record
      const allFilesRecord = allFilesData.find(record => 
        record.file === fileType && record.number === fileNumber
      );
      
      if (allFilesRecord) {
        setActiveTab('allFiles');
        setHighlightedRowId(allFilesRecord.id);
        toast.success(`Returned to All Files - ${fileType}${fileNumber}`);
      } else {
        setActiveTab('allFiles');
        setHighlightedRowId(null);
        toast.info('Returned to All Files');
      }
    } else {
      setActiveTab('allFiles');
      setHighlightedRowId(null);
      toast.info('Returned to All Files');
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
