import React, { useState, useEffect } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload, Package, Truck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import AllFilesTable from './AllFilesTable';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import ExcelExportDialog from './ExcelExportDialog';
import ExcelImportDialog from './ExcelImportDialog';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { sampleTrackingData } from '../data/sampleData';
import { sampleImportData } from '../data/sampleImportData';
import { sampleAllFilesData } from '../data/sampleAllFilesData';
import { useExcelImport } from '../hooks/useExcelImport';
import { useSearch, useImportSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useNotifications } from '../hooks/useNotifications';
import { useFirestore } from '../hooks/useFirestore';

const FreightTracker = () => {
  // Get active tab from localStorage or default to 'export-table'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('freight-tracker-active-tab') || 'export-table';
  });

  // Persist active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freight-tracker-active-tab', activeTab);
  }, [activeTab]);

  // Use Firebase for data persistence - assuming user is logged in for now
  const currentUserId = 'demo-user'; // In production, get this from Firebase Auth
  const {
    data: firebaseExportData,
    loading: exportLoading,
    addItem: addExportItem,
    updateItem: updateExportItem,
    deleteItem: deleteExportItem
  } = useFirestore<TrackingRecord>('export_tracking', currentUserId);

  const {
    data: firebaseImportData,
    loading: importLoading,
    addItem: addImportItem,
    updateItem: updateImportItem,
    deleteItem: deleteImportItem
  } = useFirestore<ImportTrackingRecord>('import_tracking', currentUserId);

  const {
    data: firebaseAllFilesData,
    loading: allFilesLoading,
    addItem: addAllFilesItem,
    updateItem: updateAllFilesItem,
    deleteItem: deleteAllFilesItem
  } = useFirestore<AllFilesRecord>('all_files', currentUserId);

  // Create completed sample data by modifying the first few records
  const getCompletedExportData = (): TrackingRecord[] => {
    const data = [...sampleTrackingData];
    // Make first 2 records completed
    data.slice(0, 2).forEach(record => {
      record.dropDone = true;
      record.docsSent = true;
      record.docsReceived = true;
      record.aesMblVgmSent = true;
      record.titlesDispatched = true;
      record.validatedFwd = true;
      record.titlesReturned = true;
      record.sslDraftInvRec = true;
      record.draftInvApproved = true;
      record.transphereInvSent = true;
      record.paymentRec = true;
      record.sslPaid = true;
      record.insured = true;
      record.released = true;
      record.docsSentToCustomer = true;
      record.customer = record.customer || 'Completed Customer';
      record.ref = record.ref || 'COMP001';
      record.file = record.file || 'ES123';
      record.workOrder = record.workOrder || 'WO001';
    });
    return data;
  };

  const getCompletedImportData = (): ImportTrackingRecord[] => {
    const data = [...sampleImportData];
    // Make first 2 records completed
    data.slice(0, 2).forEach(record => {
      record.poa = true;
      record.isf = true;
      record.packingListCommercialInvoice = true;
      record.billOfLading = true;
      record.arrivalNotice = true;
      record.isfFiled = true;
      record.entryFiled = true;
      record.blRelease = true;
      record.customsRelease = true;
      record.invoiceSent = true;
      record.paymentReceived = true;
      record.workOrderSetup = true;
      record.reference = record.reference || 'IMP001';
      record.file = record.file || 'IS123';
      record.etaFinalPod = record.etaFinalPod || '2024-01-15';
      record.bond = record.bond || 'BOND123';
    });
    return data;
  };

  const getCompletedAllFilesData = (): AllFilesRecord[] => {
    const data = [...sampleAllFilesData];
    // Make first 2 records completed
    data.slice(0, 2).forEach(record => {
      record.file = 'ES';
      record.number = '123456';
      record.customer = 'Completed Customer Inc.';
      record.originPort = 'Los Angeles';
      record.destinationPort = 'Hamburg';
      record.destinationCountry = 'Germany';
      record.container20 = '2';
    });
    return data;
  };

  // Initialize with sample data only if Firebase is empty AND not loading
  const [hasInitialized, setHasInitialized] = useState(false);
  const [localExportData, setLocalExportData] = useState<TrackingRecord[]>([]);
  const [localImportData, setLocalImportData] = useState<ImportTrackingRecord[]>([]);
  const [localAllFilesData, setLocalAllFilesData] = useState<AllFilesRecord[]>([]);

  // Initialize data - use Firebase data, only use sample data if Firebase is completely empty
  useEffect(() => {
    if (!exportLoading && !hasInitialized) {
      if (firebaseExportData.length > 0) {
        console.log('Loading Firebase export data:', firebaseExportData.length, 'records');
        setLocalExportData(firebaseExportData);
      } else {
        console.log('No Firebase export data, using sample data');
        setLocalExportData(getCompletedExportData());
      }
      setHasInitialized(true);
    } else if (!exportLoading && firebaseExportData.length > 0) {
      console.log('Updating from Firebase export data:', firebaseExportData.length, 'records');
      setLocalExportData(firebaseExportData);
    }
  }, [firebaseExportData, exportLoading, hasInitialized]);

  useEffect(() => {
    if (!importLoading) {
      if (firebaseImportData.length > 0) {
        setLocalImportData(firebaseImportData);
      } else if (localImportData.length === 0) {
        setLocalImportData(getCompletedImportData());
      }
    }
  }, [firebaseImportData, importLoading]);

  useEffect(() => {
    if (!allFilesLoading) {
      if (firebaseAllFilesData.length > 0) {
        setLocalAllFilesData(firebaseAllFilesData);
      } else if (localAllFilesData.length === 0) {
        setLocalAllFilesData(getCompletedAllFilesData());
      }
    }
  }, [firebaseAllFilesData, allFilesLoading]);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);

  const { notifications, addNotification } = useNotifications();
  const { fileInputRef, importFromExcel } = useExcelImport(setLocalExportData, setLocalImportData, setLocalAllFilesData);
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(localExportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(localImportData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(localAllFilesData);

  // Demo notification on mount
  useEffect(() => {
    if (hasInitialized) {
      addNotification(
        'Welcome to Freight Tracker',
        'Your data is now synced with Firebase. Changes will persist across sessions.',
        'success'
      );
    }
  }, [addNotification, hasInitialized]);

  // Get current search term and setter based on active tab
  const getCurrentSearchProps = () => {
    switch (activeTab) {
      case 'export-table':
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
      case 'import-table':
        return { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm };
      case 'all-files':
        return { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm };
      default:
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
    }
  };

  const { searchTerm, setSearchTerm } = getCurrentSearchProps();

  const getImportDataType = (): 'export' | 'import' | 'all-files' => {
    switch (activeTab) {
      case 'export-table':
        return 'export';
      case 'import-table':
        return 'import';
      case 'all-files':
        return 'all-files';
      default:
        return 'export';
    }
  };

  const updateRecord = async (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => {
    console.log('Updating export record:', id, field, value);
    
    // Update local state immediately for responsiveness
    setLocalExportData(prev => prev.map(record =>
      record.id === id ? { ...record, [field]: value } : record
    ));

    // Update Firebase
    try {
      await updateExportItem(id, { [field]: value } as Partial<TrackingRecord>);
      console.log('Successfully updated export record in Firebase');
    } catch (error) {
      console.error('Error updating export record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
      // Revert local changes on error
      setLocalExportData(prev => prev.map(record =>
        record.id === id ? { ...record, [field]: record[field] } : record
      ));
    }
  };

  const updateImportRecord = async (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => {
    // Update local state immediately for responsiveness
    setLocalImportData(prev => prev.map(record =>
      record.id === id ? { ...record, [field]: value } : record
    ));

    // Update Firebase
    try {
      await updateImportItem(id, { [field]: value } as Partial<ImportTrackingRecord>);
    } catch (error) {
      console.error('Error updating import record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateAllFilesRecord = async (
    id: string,
    field: keyof AllFilesRecord,
    value: string
  ) => {
    // Update local state immediately for responsiveness
    setLocalAllFilesData(prev => prev.map(record =>
      record.id === id ? { ...record, [field]: value } : record
    ));

    // Update Firebase
    try {
      await updateAllFilesItem(id, { [field]: value } as Partial<AllFilesRecord>);
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const deleteRecord = async (id: string) => {
    // Update local state immediately
    setLocalExportData(prev => prev.filter(record => record.id !== id));
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));

    // Delete from Firebase
    try {
      await deleteExportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting export record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteImportRecord = async (id: string) => {
    // Update local state immediately
    setLocalImportData(prev => prev.filter(record => record.id !== id));
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));

    // Delete from Firebase
    try {
      await deleteImportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting import record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteAllFilesRecord = async (id: string) => {
    // Update local state immediately
    setLocalAllFilesData(prev => prev.filter(record => record.id !== id));
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));

    // Delete from Firebase
    try {
      await deleteAllFilesItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting all files record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const addNewRecord = async () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: "",
      ref: "",
      file: "",
      workOrder: "",
      dropDone: false,
      dropDate: "",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "",
      titlesDispatched: false,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    };

    try {
      console.log('Adding new export record...');
      const id = await addExportItem(newRecord);
      console.log('Successfully added export record with ID:', id);
      addNotification('Success', 'New export record added', 'success');
    } catch (error) {
      console.error('Error adding export record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  };

  const addNewImportRecord = async () => {
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      reference: "",
      file: "",
      etaFinalPod: "",
      bond: "",
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
      deliveryDate: "",
      notes: ""
    };

    try {
      const id = await addImportItem(newRecord);
      addNotification('Success', 'New import record added', 'success');
    } catch (error) {
      console.error('Error adding import record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  };

  const addNewAllFilesRecord = async () => {
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      file: "ES",
      number: "",
      customer: "",
      originPort: "",
      originState: "",
      destinationPort: "",
      destinationCountry: "",
      container20: "",
      container40: "",
      roro: "",
      lcl: "",
      air: "",
      truck: "",
      ssl: "",
      nvo: "",
      comments: "",
      salesContact: ""
    };

    try {
      const id = await addAllFilesItem(newRecord);
      addNotification('Success', 'New all files record added', 'success');
    } catch (error) {
      console.error('Error adding all files record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  };

  // Universal add record function based on active tab
  const handleAddRecord = () => {
    switch (activeTab) {
      case 'export-table':
        addNewRecord();
        break;
      case 'import-table':
        addNewImportRecord();
        break;
      case 'all-files':
        addNewAllFilesRecord();
        break;
      default:
        addNewRecord();
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'export-table':
        return 'Search by customer, ref, file, or work order...';
      case 'import-table':
        return 'Search by reference, file, bond, or notes...';
      case 'all-files':
        return 'Search by customer, file, port, or destination...';
      default:
        return 'Search...';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Freight Forwarding Tracker</h1>
                <p className="text-sm md:text-base text-gray-600">Comprehensive shipment tracking and management system</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <ExcelExportDialog 
                  activeTab={activeTab}
                  exportData={filteredExportData} 
                  importData={filteredImportData}
                  allFilesData={filteredAllFilesData}
                  selectedExportRows={selectedRows}
                  selectedImportRows={selectedImportRows}
                  selectedAllFilesRows={selectedAllFilesRows}
                >
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Export Excel
                  </Button>
                </ExcelExportDialog>

                <ExcelImportDialog
                  activeTab={activeTab}
                  onImportClick={handleImportClick}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs md:text-sm"
                  >
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Import Excel
                  </Button>
                </ExcelImportDialog>

                <NotificationSettings>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Notifications
                  </Button>
                </NotificationSettings>
                
                <Button 
                  onClick={handleAddRecord} 
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add Record
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => importFromExcel(e, getImportDataType())}
              className="hidden"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-4 md:mx-6 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
                <TabsTrigger 
                  value="export-table" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Package className="w-3 h-3 md:w-4 md:h-4" />
                  Export Checklist
                </TabsTrigger>
                <TabsTrigger 
                  value="import-table" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Truck className="w-3 h-3 md:w-4 md:h-4" />
                  Import Checklist
                </TabsTrigger>
                <TabsTrigger 
                  value="all-files" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  All Files
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="export-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <TrackingTable 
                  data={filteredExportData} 
                  updateRecord={updateRecord} 
                  deleteRecord={deleteRecord}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </TabsContent>

              <TabsContent value="import-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <ImportTrackingTable 
                  data={filteredImportData} 
                  updateRecord={updateImportRecord} 
                  deleteRecord={deleteImportRecord}
                  selectedRows={selectedImportRows}
                  setSelectedRows={setSelectedImportRows}
                />
              </TabsContent>

              <TabsContent value="all-files" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <AllFilesTable 
                  data={filteredAllFilesData} 
                  updateRecord={updateAllFilesRecord} 
                  deleteRecord={deleteAllFilesRecord}
                  selectedRows={selectedAllFilesRows}
                  setSelectedRows={setSelectedAllFilesRows}
                />
              </TabsContent>

              <TabsContent value="calendar" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <CalendarView data={filteredExportData} importData={filteredImportData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
