
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Calendar, Settings, Plus, Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ExcelExportDialog from './ExcelExportDialog';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import AllFilesTable from './AllFilesTable';
import ImportTrackingTable from './ImportTrackingTable';
import TrackingTable from './TrackingTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { TrackingRecord } from '../types/TrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

// Simple ID generator to replace uuid
const generateId = () => Math.random().toString(36).substr(2, 9);

const FreightTracker = () => {
  const [activeTab, setActiveTab] = useState('allFiles');
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const [importTrackingData, setImportTrackingData] = useState<ImportTrackingRecord[]>([]);
  const [exportTrackingData, setExportTrackingData] = useState<TrackingRecord[]>([]);
  const [domesticTruckingData, setDomesticTruckingData] = useState<DomesticTruckingRecord[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load data from local storage on component mount
    const storedAllFilesData = localStorage.getItem('allFilesData');
    if (storedAllFilesData) {
      try {
        const parsedData = JSON.parse(storedAllFilesData);
        setAllFilesData(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error parsing allFilesData:', error);
        setAllFilesData([]);
      }
    }

    const storedImportTrackingData = localStorage.getItem('importTrackingData');
    if (storedImportTrackingData) {
      try {
        const parsedData = JSON.parse(storedImportTrackingData);
        setImportTrackingData(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error parsing importTrackingData:', error);
        setImportTrackingData([]);
      }
    }

    const storedExportTrackingData = localStorage.getItem('exportTrackingData');
    if (storedExportTrackingData) {
      try {
        const parsedData = JSON.parse(storedExportTrackingData);
        setExportTrackingData(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error parsing exportTrackingData:', error);
        setExportTrackingData([]);
      }
    }

    const storedDomesticTruckingData = localStorage.getItem('domesticTruckingData');
    if (storedDomesticTruckingData) {
      try {
        const parsedData = JSON.parse(storedDomesticTruckingData);
        setDomesticTruckingData(Array.isArray(parsedData) ? parsedData : []);
      } catch (error) {
        console.error('Error parsing domesticTruckingData:', error);
        setDomesticTruckingData([]);
      }
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever data changes
    if (allFilesData && Array.isArray(allFilesData)) {
      localStorage.setItem('allFilesData', JSON.stringify(allFilesData));
    }
    if (importTrackingData && Array.isArray(importTrackingData)) {
      localStorage.setItem('importTrackingData', JSON.stringify(importTrackingData));
    }
    if (exportTrackingData && Array.isArray(exportTrackingData)) {
      localStorage.setItem('exportTrackingData', JSON.stringify(exportTrackingData));
    }
    if (domesticTruckingData && Array.isArray(domesticTruckingData)) {
      localStorage.setItem('domesticTruckingData', JSON.stringify(domesticTruckingData));
    }
  }, [allFilesData, importTrackingData, exportTrackingData, domesticTruckingData]);

  const addNewRecord = (tab: string) => {
    const newId = generateId();
    
    if (tab === 'allFiles') {
      const newRecord: AllFilesRecord = {
        id: newId,
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
      setAllFilesData(prev => Array.isArray(prev) ? [...prev, newRecord] : [newRecord]);
    } else if (tab === 'importTracking') {
      const newRecord: ImportTrackingRecord = {
        id: newId,
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
      setImportTrackingData(prev => Array.isArray(prev) ? [...prev, newRecord] : [newRecord]);
    } else if (tab === 'exportTracking') {
      const newRecord: TrackingRecord = {
        id: newId,
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
      setExportTrackingData(prev => Array.isArray(prev) ? [...prev, newRecord] : [newRecord]);
    } else if (tab === 'domesticTrucking') {
      const newRecord: DomesticTruckingRecord = {
        id: newId,
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
      setDomesticTruckingData(prev => Array.isArray(prev) ? [...prev, newRecord] : [newRecord]);
    }
    
    toast({
      title: "Record Added",
      description: "New record has been added successfully.",
    });
  };

  const updateRecord = (
    tab: string,
    id: string,
    field: string,
    value: string | boolean
  ) => {
    if (tab === 'allFiles') {
      setAllFilesData(prev =>
        Array.isArray(prev) ? prev.map(record =>
          record.id === id ? { ...record, [field]: value } : record
        ) : []
      );
    } else if (tab === 'importTracking') {
      setImportTrackingData(prev =>
        Array.isArray(prev) ? prev.map(record =>
          record.id === id ? { ...record, [field]: value } : record
        ) : []
      );
    } else if (tab === 'exportTracking') {
      setExportTrackingData(prev =>
        Array.isArray(prev) ? prev.map(record =>
          record.id === id ? { ...record, [field]: value } : record
        ) : []
      );
    } else if (tab === 'domesticTrucking') {
      setDomesticTruckingData(prev =>
        Array.isArray(prev) ? prev.map(record =>
          record.id === id ? { ...record, [field]: value } : record
        ) : []
      );
    }
  };

  const deleteRecord = (tab: string, id: string) => {
    if (tab === 'allFiles') {
      setAllFilesData(prev => Array.isArray(prev) ? prev.filter(record => record.id !== id) : []);
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    } else if (tab === 'importTracking') {
      setImportTrackingData(prev => Array.isArray(prev) ? prev.filter(record => record.id !== id) : []);
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    } else if (tab === 'exportTracking') {
      setExportTrackingData(prev => Array.isArray(prev) ? prev.filter(record => record.id !== id) : []);
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    } else if (tab === 'domesticTrucking') {
      setDomesticTruckingData(prev => Array.isArray(prev) ? prev.filter(record => record.id !== id) : []);
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    setHighlightedRowId(fileNumber);
    setActiveTab('allFiles');
  };

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

        {activeTab === 'allFiles' && (
          <AllFilesTable
            data={allFilesData || []}
            updateRecord={(id, field, value) => updateRecord('allFiles', id, field, value)}
            deleteRecord={(id) => deleteRecord('allFiles', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onFileClick={handleFileClick}
          />
        )}
        {activeTab === 'importTracking' && (
          <ImportTrackingTable
            data={importTrackingData || []}
            updateRecord={(id, field, value) => updateRecord('importTracking', id, field, value)}
            deleteRecord={(id) => deleteRecord('importTracking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        )}
        {activeTab === 'exportTracking' && (
          <TrackingTable
            data={exportTrackingData || []}
            updateRecord={(id, field, value) => updateRecord('exportTracking', id, field, value)}
            deleteRecord={(id) => deleteRecord('exportTracking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        )}
        {activeTab === 'domesticTrucking' && (
          <DomesticTruckingTable
            data={domesticTruckingData || []}
            updateRecord={(id, field, value) => updateRecord('domesticTrucking', id, field, value)}
            deleteRecord={(id) => deleteRecord('domesticTrucking', id)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
          />
        )}
      </Tabs>

      <ExcelExportDialog 
        open={isExportDialogOpen} 
        onOpenChange={setIsExportDialogOpen}
      />
      <CalendarView 
        open={isCalendarOpen} 
        onOpenChange={setIsCalendarOpen}
      />
      <NotificationSettings 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
};

export default FreightTracker;
