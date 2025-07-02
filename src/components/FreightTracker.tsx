
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Calendar, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import ExcelExportDialog from './ExcelExportDialog';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import AllFilesTable from './AllFilesTable';
import ImportTrackingTable from './ImportTrackingTable';
import TrackingTable from './TrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { TrackingRecord } from '../types/TrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('allFiles');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

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

  const addNewRecord = async (tab: string) => {
    if (!user?.uid) {
      toast({
        title: "Error",
        description: "You must be logged in to add records.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (tab === 'allFiles') {
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
          archived: false
        };
        await addAllFilesItem(newRecord);
      } else if (tab === 'importTracking') {
        const newRecord: Omit<ImportTrackingRecord, 'id'> = {
          customer: '',
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
          delivered: 'No',
          returned: 'No',
          deliveryDate: '',
          notes: '',
          archived: false
        };
        await addImportItem(newRecord);
      } else if (tab === 'exportTracking') {
        const newRecord: Omit<TrackingRecord, 'id'> = {
          customer: '',
          ref: '',
          file: '',
          workOrder: '',
          dropDone: 'No',
          dropDate: '',
          returnNeeded: 'No',
          returnDate: '',
          docsSent: false,
          docsReceived: false,
          docCutoffDate: '',
          aesMblVgmSent: false,
          titlesDispatched: 'N/A',
          validatedFwd: false,
          titlesReturned: 'N/A',
          sslDraftInvRec: false,
          draftInvApproved: false,
          transphereInvSent: false,
          paymentRec: false,
          sslPaid: false,
          insured: false,
          released: false,
          docsSentToCustomer: false,
          notes: '',
          archived: false
        };
        await addExportItem(newRecord);
      } else if (tab === 'domesticTrucking') {
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
          archived: false
        };
        await addDomesticTruckingItem(newRecord);
      }
      
      toast({
        title: "Record Added",
        description: "New record has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding record:', error);
      toast({
        title: "Error",
        description: "Failed to add record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRecord = async (
    tab: string,
    id: string,
    field: string,
    value: string | boolean
  ) => {
    try {
      if (tab === 'allFiles') {
        await updateAllFilesRecord(id, field as keyof AllFilesRecord, value as string);
      } else if (tab === 'importTracking') {
        await updateImportRecord(id, field as keyof ImportTrackingRecord, value);
      } else if (tab === 'exportTracking') {
        await updateRecord(id, field as keyof TrackingRecord, value);
      } else if (tab === 'domesticTrucking') {
        await updateDomesticTruckingRecord(id, field as keyof DomesticTruckingRecord, value);
      }
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        title: "Error",
        description: "Failed to update record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRecord = async (tab: string, id: string) => {
    try {
      if (tab === 'allFiles') {
        await deleteAllFilesItem(id);
      } else if (tab === 'importTracking') {
        await deleteImportItem(id);
      } else if (tab === 'exportTracking') {
        await deleteExportItem(id);
      } else if (tab === 'domesticTrucking') {
        await deleteDomesticTruckingItem(id);
      }
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      toast({
        title: "Record Deleted",
        description: "Record has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: "Failed to delete record. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    setHighlightedRowId(fileNumber);
    setActiveTab('allFiles');
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Freight Tracking</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsExportDialogOpen(true)}><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button variant="outline" onClick={() => setIsCalendarOpen(true)}><Calendar className="mr-2 h-4 w-4" /> Calendar</Button>
          <Button variant="outline" onClick={() => setIsSettingsOpen(true)}><Settings className="mr-2 h-4 w-4" /> Settings</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="allFiles">All Files</TabsTrigger>
          <TabsTrigger value="importTracking">Import Tracking</TabsTrigger>
          <TabsTrigger value="exportTracking">Export Tracking</TabsTrigger>
          <TabsTrigger value="domesticTrucking">Domestic Trucking</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">
            {activeTab === 'allFiles' && 'All Files'}
            {activeTab === 'importTracking' && 'Import Tracking'}
            {activeTab === 'exportTracking' && 'Export Tracking'}
            {activeTab === 'domesticTrucking' && 'Domestic Trucking'}
          </h2>
          <Button size="sm" onClick={() => addNewRecord(activeTab)}>
            <Plus className="mr-2 h-4 w-4" /> Add Record
          </Button>
        </div>

        <TabsContent value="allFiles">
          <AllFilesTable
            data={allFilesData || []}
            updateRecord={(id, field, value) => handleUpdateRecord('allFiles', id, field, value)}
            deleteRecord={(id) => handleDeleteRecord('allFiles', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onFileClick={handleFileClick}
          />
        </TabsContent>

        <TabsContent value="importTracking">
          <ImportTrackingTable
            data={importData || []}
            updateRecord={(id, field, value) => handleUpdateRecord('importTracking', id, field, value)}
            deleteRecord={(id) => handleDeleteRecord('importTracking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>

        <TabsContent value="exportTracking">
          <TrackingTable
            data={exportData || []}
            updateRecord={(id, field, value) => handleUpdateRecord('exportTracking', id, field, value)}
            deleteRecord={(id) => handleDeleteRecord('exportTracking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>

        <TabsContent value="domesticTrucking">
          <DomesticTruckingTable
            data={domesticTruckingData || []}
            updateRecord={(id, field, value) => handleUpdateRecord('domesticTrucking', id, field, value)}
            deleteRecord={(id) => handleDeleteRecord('domesticTrucking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        </TabsContent>
      </Tabs>

      <ExcelExportDialog 
        isOpen={isExportDialogOpen} 
        onClose={() => setIsExportDialogOpen(false)}
      />
      <CalendarView 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)}
      />
      <NotificationSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default FreightTracker;
