import React, { useState, useEffect } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload, Package, Truck, FileText, Trash2 } from 'lucide-react';
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

  // Use Firebase for data persistence
  const currentUserId = 'demo-user';
  const {
    data: exportData,
    loading: exportLoading,
    addItem: addExportItem,
    updateItem: updateExportItem,
    deleteItem: deleteExportItem
  } = useFirestore<TrackingRecord>('export_tracking', currentUserId);

  const {
    data: importData,
    loading: importLoading,
    addItem: addImportItem,
    updateItem: updateImportItem,
    deleteItem: deleteImportItem
  } = useFirestore<ImportTrackingRecord>('import_tracking', currentUserId);

  const {
    data: allFilesData,
    loading: allFilesLoading,
    addItem: addAllFilesItem,
    updateItem: updateAllFilesItem,
    deleteItem: deleteAllFilesItem
  } = useFirestore<AllFilesRecord>('all_files', currentUserId);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [sampleDataAdded, setSampleDataAdded] = useState(false);

  const { notifications, addNotification } = useNotifications();
  const { fileInputRef, importFromExcel } = useExcelImport(() => {}, () => {}, () => {});
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);

  // Welcome notification on mount
  useEffect(() => {
    if (!exportLoading && !importLoading && !allFilesLoading) {
      addNotification(
        'Welcome to Freight Tracker',
        'Your data is synced with Firebase. All changes will persist.',
        'success'
      );
    }
  }, [addNotification, exportLoading, importLoading, allFilesLoading]);

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
    
    try {
      await updateExportItem(id, { [field]: value } as Partial<TrackingRecord>);
      console.log('Successfully updated export record in Firebase');
    } catch (error) {
      console.error('Error updating export record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateImportRecord = async (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => {
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
    try {
      await updateAllFilesItem(id, { [field]: value } as Partial<AllFilesRecord>);
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const deleteRecord = async (id: string) => {
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteExportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting export record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteImportRecord = async (id: string) => {
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteImportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting import record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteAllFilesRecord = async (id: string) => {
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteAllFilesItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting all files record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteBulkExportRecords = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      await Promise.all(selectedRows.map(id => deleteExportItem(id)));
      setSelectedRows([]);
      addNotification('Success', `Deleted ${selectedRows.length} export records`, 'success');
    } catch (error) {
      console.error('Error deleting export records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const deleteBulkImportRecords = async () => {
    if (selectedImportRows.length === 0) return;
    
    try {
      await Promise.all(selectedImportRows.map(id => deleteImportItem(id)));
      setSelectedImportRows([]);
      addNotification('Success', `Deleted ${selectedImportRows.length} import records`, 'success');
    } catch (error) {
      console.error('Error deleting import records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const deleteBulkAllFilesRecords = async () => {
    if (selectedAllFilesRows.length === 0) return;
    
    try {
      await Promise.all(selectedAllFilesRows.map(id => deleteAllFilesItem(id)));
      setSelectedAllFilesRows([]);
      addNotification('Success', `Deleted ${selectedAllFilesRows.length} all files records`, 'success');
    } catch (error) {
      console.error('Error deleting all files records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const addNewRecord = async () => {
    console.log('=== STARTING TO ADD NEW EXPORT RECORD ===');
    
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

    console.log('New record to add:', newRecord);
    console.log('Current user ID:', currentUserId);
    console.log('addExportItem function:', addExportItem);

    try {
      const id = await addExportItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED EXPORT RECORD ===', id);
      addNotification('Success', 'New export record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING EXPORT RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewImportRecord = async () => {
    console.log('=== STARTING TO ADD NEW IMPORT RECORD ===');
    
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: "",
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

    console.log('New import record to add:', newRecord);
    console.log('Current user ID:', currentUserId);

    try {
      const id = await addImportItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED IMPORT RECORD ===', id);
      addNotification('Success', 'New import record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING IMPORT RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewAllFilesRecord = async () => {
    console.log('=== STARTING TO ADD NEW ALL FILES RECORD ===');
    
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

    console.log('New all files record to add:', newRecord);
    console.log('Current user ID:', currentUserId);

    try {
      const id = await addAllFilesItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED ALL FILES RECORD ===', id);
      addNotification('Success', 'New all files record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING ALL FILES RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  // Universal add record function based on active tab
  const handleAddRecord = () => {
    console.log('=== ADD RECORD BUTTON CLICKED ===');
    console.log('Active tab:', activeTab);
    console.log('Export data length:', exportData.length);
    console.log('Import data length:', importData.length);
    console.log('All files data length:', allFilesData.length);
    
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
        console.log('Unknown tab, defaulting to export');
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

  if (exportLoading || importLoading || allFilesLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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

                {/* Conditional bulk delete button */}
                {((activeTab === 'export-table' && selectedRows.length > 0) ||
                  (activeTab === 'import-table' && selectedImportRows.length > 0) ||
                  (activeTab === 'all-files' && selectedAllFilesRows.length > 0)) && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => {
                      if (activeTab === 'export-table') deleteBulkExportRecords();
                      else if (activeTab === 'import-table') deleteBulkImportRecords();
                      else if (activeTab === 'all-files') deleteBulkAllFilesRecords();
                    }}
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Delete Selected ({
                      activeTab === 'export-table' ? selectedRows.length :
                      activeTab === 'import-table' ? selectedImportRows.length :
                      selectedAllFilesRows.length
                    })
                  </Button>
                )}

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
