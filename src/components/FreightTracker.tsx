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

const FreightTracker = () => {
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

  const [data, setData] = useState<TrackingRecord[]>(getCompletedExportData());
  const [importData, setImportData] = useState<ImportTrackingRecord[]>(getCompletedImportData());
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>(getCompletedAllFilesData());
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('export-table');

  const { notifications, addNotification } = useNotifications();
  const { fileInputRef, importFromExcel } = useExcelImport(setData, setImportData, setAllFilesData);
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(data);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);

  // Demo notification on mount
  useEffect(() => {
    addNotification(
      'Welcome to Freight Tracker',
      'In-app notifications are now enabled. Completed rows are highlighted with green borders.',
      'success'
    );
  }, [addNotification]);

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

  const updateRecord = (id: string, field: keyof TrackingRecord, value: any) => {
    setData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const updateImportRecord = (id: string, field: keyof ImportTrackingRecord, value: any) => {
    setImportData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const updateAllFilesRecord = (id: string, field: keyof AllFilesRecord, value: any) => {
    setAllFilesData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const deleteRecord = (id: string) => {
    setData(prev => prev.filter(record => record.id !== id));
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));
  };

  const deleteImportRecord = (id: string) => {
    setImportData(prev => prev.filter(record => record.id !== id));
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));
  };

  const deleteAllFilesRecord = (id: string) => {
    setAllFilesData(prev => prev.filter(record => record.id !== id));
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));
  };

  const addNewRecord = () => {
    const newRecord: TrackingRecord = {
      id: Date.now().toString(),
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
    setData(prev => [...prev, newRecord]);
  };

  const addNewImportRecord = () => {
    const newRecord: ImportTrackingRecord = {
      id: Date.now().toString(),
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
    setImportData(prev => [...prev, newRecord]);
  };

  const addNewAllFilesRecord = () => {
    const newRecord: AllFilesRecord = {
      id: Date.now().toString(),
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
    setAllFilesData(prev => [...prev, newRecord]);
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
                  onClick={addNewRecord} 
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add Export Record
                </Button>
                <Button 
                  onClick={addNewImportRecord} 
                  size="sm"
                  variant="secondary"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add Import Record
                </Button>
                <Button 
                  onClick={addNewAllFilesRecord} 
                  size="sm"
                  variant="outline"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add File Record
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
