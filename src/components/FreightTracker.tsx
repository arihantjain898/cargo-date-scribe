import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Calendar, Settings, Plus, Database } from 'lucide-react';
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
import { 
  generateAllFilesSampleData, 
  generateImportSampleData, 
  generateExportSampleData, 
  generateDomesticSampleData 
} from '../utils/sampleDataGenerator';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('allFiles');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // For testing: use a test user ID when no user is authenticated
  const currentUserId = user?.uid || 'test-user-123';

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

  console.log('FreightTracker render:', {
    user: user?.uid || 'test-user-123',
    loading,
    exportData: exportData?.length,
    importData: importData?.length,
    allFilesData: allFilesData?.length,
    domesticTruckingData: domesticTruckingData?.length,
    highlightedRowId,
    activeTab
  });

  const loadSampleData = async () => {
    try {
      const allFilesRecords = generateAllFilesSampleData();
      const importRecords = generateImportSampleData();
      const exportRecords = generateExportSampleData();
      const domesticRecords = generateDomesticSampleData();

      // Add all sample data
      for (const record of allFilesRecords) {
        await addAllFilesItem(record);
      }
      for (const record of importRecords) {
        await addImportItem(record);
      }
      for (const record of exportRecords) {
        await addExportItem(record);
      }
      for (const record of domesticRecords) {
        await addDomesticTruckingItem(record);
      }

      toast({
        title: "Sample Data Loaded",
        description: "30 All Files records and 30 linked tracking records have been added.",
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast({
        title: "Error",
        description: "Failed to load sample data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addNewRecord = async (tab: string) => {
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
    console.log('File click from All Files:', { fileNumber, fileType });
    
    // Create the file identifier by combining type and number (e.g., "IS1000", "ES1001", "DT1002")
    const fileIdentifier = `${fileType}${fileNumber}`;
    console.log('Looking for file identifier:', fileIdentifier);
    
    // Find matching record in the appropriate tab based on file type
    let targetTab = 'allFiles';
    let foundRecord = null;
    
    if (fileType === 'IS' || fileType === 'IA') {
      // Import tracking
      console.log('Searching in import data:', importData?.map(r => ({ id: r.id, file: r.file })));
      foundRecord = importData?.find(record => record.file === fileIdentifier);
      if (foundRecord) {
        targetTab = 'importTracking';
        console.log('Found import record:', foundRecord.id);
        setHighlightedRowId(foundRecord.id);
      }
    } else if (fileType === 'ES' || fileType === 'EA') {
      // Export tracking
      console.log('Searching in export data:', exportData?.map(r => ({ id: r.id, file: r.file })));
      foundRecord = exportData?.find(record => record.file === fileIdentifier);
      if (foundRecord) {
        targetTab = 'exportTracking';
        console.log('Found export record:', foundRecord.id);
        setHighlightedRowId(foundRecord.id);
      }
    } else if (fileType === 'DT' || fileType === 'ET') {
      // Domestic trucking
      console.log('Searching in domestic data:', domesticTruckingData?.map(r => ({ id: r.id, file: r.file })));
      foundRecord = domesticTruckingData?.find(record => record.file === fileIdentifier);
      if (foundRecord) {
        targetTab = 'domesticTrucking';
        console.log('Found domestic record:', foundRecord.id);
        setHighlightedRowId(foundRecord.id);
      }
    }
    
    console.log('Found record:', foundRecord, 'Target tab:', targetTab);
    
    if (foundRecord) {
      setActiveTab(targetTab);
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      console.log('No record found for:', fileIdentifier);
      toast({
        title: "No Linked Record Found",
        description: `No ${fileType} record found for file ${fileIdentifier}`,
        variant: "destructive"
      });
    }
  };

  const handleReverseFileClick = (fullFileIdentifier: string) => {
    console.log('Reverse file click from tracking tab:', { fullFileIdentifier });
    
    // Parse the file identifier (e.g., "IS1000" -> fileType: "IS", fileNumber: "1000")
    const fileType = fullFileIdentifier.substring(0, 2); // First 2 characters
    const fileNumber = fullFileIdentifier.substring(2); // Remaining characters
    
    console.log('Parsed:', { fileType, fileNumber });
    console.log('Searching in all files data:', allFilesData?.map(r => ({ id: r.id, file: r.file, number: r.number })));
    
    // Find matching record in All Files table
    const foundRecord = allFilesData?.find(record => 
      record.file === fileType && record.number === fileNumber
    );
    
    console.log('Found All Files record:', foundRecord);
    
    if (foundRecord) {
      setActiveTab('allFiles');
      setHighlightedRowId(foundRecord.id);
      console.log('Setting highlighted row ID:', foundRecord.id);
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      toast({
        title: "No Linked Record Found",
        description: `No All Files record found for ${fileType} ${fileNumber}`,
        variant: "destructive"
      });
    }
  };

  const handleCalendarEventClick = (fileNumber: string, source: string, targetTab?: string) => {
    console.log('Calendar event click:', { fileNumber, source, targetTab });
    
    if (targetTab === 'allFiles') {
      // Parse the file identifier (e.g., "IS1000" -> fileType: "IS", fileNumber: "1000")
      const fileType = fileNumber.substring(0, 2); // First 2 characters
      const fileNumberOnly = fileNumber.substring(2); // Remaining characters
      
      console.log('Parsed for All Files:', { fileType, fileNumberOnly });
      console.log('Searching in all files data:', allFilesData?.map(r => ({ id: r.id, file: r.file, number: r.number })));
      
      // Find matching record in All Files table
      const foundRecord = allFilesData?.find(record => 
        record.file === fileType && record.number === fileNumberOnly
      );
      
      console.log('Found All Files record:', foundRecord);
      
      if (foundRecord) {
        setActiveTab('allFiles');
        setHighlightedRowId(foundRecord.id);
        console.log('Setting highlighted row ID:', foundRecord.id);
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      } else {
        toast({
          title: "No Linked Record Found",
          description: `No All Files record found for ${fileType} ${fileNumberOnly}`,
          variant: "destructive"
        });
      }
    } else {
      // Original logic for linking to tracking tabs
      setHighlightedRowId(fileNumber);
      if (source === 'export') {
        setActiveTab('exportTracking');
      } else if (source === 'import') {
        setActiveTab('importTracking');
      } else if (source === 'domestic') {
        setActiveTab('domesticTrucking');
      }
      setShowCalendar(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showCalendar) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Calendar View</h1>
          <Button onClick={() => setShowCalendar(false)}>
            Back to Tables
          </Button>
        </div>
        <CalendarView
          data={exportData || []}
          importData={importData || []}
          domesticData={domesticTruckingData || []}
          onCalendarEventClick={handleCalendarEventClick}
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Freight Tracking</h1>
        <div className="flex items-center space-x-4">
          <ExcelExportDialog
            activeTab={activeTab}
            exportData={exportData || []}
            importData={importData || []}
            allFilesData={allFilesData || []}
            domesticTruckingData={domesticTruckingData || []}
            selectedExportRows={selectedRows}
            selectedImportRows={selectedRows}
            selectedAllFilesRows={selectedRows}
            selectedDomesticTruckingRows={selectedRows}
          >
            <Button><Download className="mr-2 h-4 w-4" /> Export</Button>
          </ExcelExportDialog>
          <Button><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button variant="outline" onClick={() => setShowCalendar(true)}>
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </Button>
          <Button variant="outline" onClick={loadSampleData}>
            <Database className="mr-2 h-4 w-4" /> Load Sample Data
          </Button>
          <NotificationSettings>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
          </NotificationSettings>
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
            highlightedRowId={highlightedRowId}
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
            onFileClick={handleReverseFileClick}
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
            onFileClick={handleReverseFileClick}
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
            onFileClick={handleReverseFileClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
