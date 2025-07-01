
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
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
  } = useFreightTrackerData(user?.uid || '');

  const [activeTab, setActiveTab] = useState('allFiles');
  const [newCustomer, setNewCustomer] = useState('');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  console.log('FreightTracker - Current data:', {
    allFiles: allFilesData.length,
    import: importData.length,
    export: exportData.length,
    domestic: domesticTruckingData.length,
    loading,
    userId: user?.uid
  });

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

  // Generic function to update a record in a dataset
  const updateRecordGeneric = useCallback(
    (dataset: string, id: string, field: string, value: string | boolean) => {
      console.log('Updating record:', { dataset, id, field, value });
      switch (dataset) {
        case 'allFiles':
          updateAllFilesRecord(id, field as keyof AllFilesRecord, value as string);
          break;
        case 'importTracking':
          updateImportRecord(id, field as keyof ImportTrackingRecord, value);
          break;
        case 'exportTracking':
          updateRecord(id, field as keyof TrackingRecord, value);
          break;
        case 'domesticTrucking':
          updateDomesticTruckingRecord(id, field as keyof DomesticTruckingRecord, value);
          break;
        default:
          console.error(`Invalid dataset: ${dataset}`);
      }
    },
    [updateRecord, updateImportRecord, updateAllFilesRecord, updateDomesticTruckingRecord]
  );

  // Generic function to delete a record from a dataset
  const deleteRecord = (dataset: string, id: string) => {
    console.log('Deleting record:', { dataset, id });
    switch (dataset) {
      case 'allFiles':
        deleteAllFilesItem(id);
        break;
      case 'importTracking':
        deleteImportItem(id);
        break;
      case 'exportTracking':
        deleteExportItem(id);
        break;
      case 'domesticTrucking':
        deleteDomesticTruckingItem(id);
        break;
      default:
        console.error(`Invalid dataset: ${dataset}`);
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Opening ${fileType} ${fileNumber} in checklist`);
    // Add your file opening logic here
  };

  // Handle back to all files navigation
  const handleBackToAllFiles = () => {
    console.log('Navigating back to All Files');
    setActiveTab('allFiles');
    setHighlightedRowId(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

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
          updateRecord={(id, field, value) => updateRecordGeneric('allFiles', id, field, value)}
          deleteRecord={(id) => deleteRecord('allFiles', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onFileClick={handleFileClick}
        />
      )}
      {activeTab === 'importTracking' && (
        <ImportTrackingTable
          data={importData}
          updateRecord={(id, field, value) => updateRecordGeneric('importTracking', id, field, value)}
          deleteRecord={(id) => deleteRecord('importTracking', id)}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          highlightedRowId={highlightedRowId}
          onBackToAllFiles={handleBackToAllFiles}
        />
      )}
      {activeTab === 'exportTracking' && (
        <TrackingTable
          data={exportData}
          updateRecord={(id, field, value) => updateRecordGeneric('exportTracking', id, field, value)}
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
          updateRecord={(id, field, value) => updateRecordGeneric('domesticTrucking', id, field, value)}
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
