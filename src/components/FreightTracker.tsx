
import React, { useState, useRef } from 'react';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useDomesticTruckingSearch } from '../hooks/useDomesticTruckingSearch';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';

const FreightTracker = () => {
  const [activeTab, setActiveTab] = useState('all-files');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  
  const currentUserId = 'demo-user';
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

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    set: setHistory,
  } = useUndoRedo();

  React.useEffect(() => {
    setHistory({
      exportData,
      importData,
      allFilesData,
      domesticTruckingData
    });
  }, [exportData, importData, allFilesData, domesticTruckingData, setHistory]);

  const handleAddRecord = () => {
    if (activeTab === 'export-table') {
      addExportItem({
        customer: 'New Customer',
        ref: 'New Ref',
        file: 'New File',
        workOrder: 'New Work Order',
        dropDone: '',
        dropDate: '',
        returnNeeded: '',
        returnDate: '',
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: '',
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
        userId: currentUserId
      });
    } else if (activeTab === 'import-table') {
      addImportItem({
        customer: 'New Customer',
        booking: 'New Booking',
        file: 'New File',
        bond: 'New Bond',
        etaFinalPod: '',
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
        userId: currentUserId
      });
    } else if (activeTab === 'all-files') {
      addAllFilesItem({
        customer: 'New Customer',
        file: 'New File',
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
        userId: currentUserId
      });
    } else if (activeTab === 'domestic-trucking') {
      addDomesticTruckingItem({
        customer: 'New Customer',
        file: 'New File',
        woSent: false,
        insurance: false,
        pickDate: '',
        delivered: '',
        paymentReceived: false,
        paymentMade: false,
        notes: '',
        archived: false,
        userId: currentUserId
      });
    }
  };

  const handleDeleteBulkRecords = () => {
    if (activeTab === 'export-table') {
      selectedRows.forEach(id => deleteExportItem(id));
      setSelectedRows([]);
    } else if (activeTab === 'import-table') {
      selectedImportRows.forEach(id => deleteImportItem(id));
      setSelectedImportRows([]);
    } else if (activeTab === 'all-files') {
      selectedAllFilesRows.forEach(id => deleteAllFilesItem(id));
      setSelectedAllFilesRows([]);
    } else if (activeTab === 'domestic-trucking') {
      selectedDomesticTruckingRows.forEach(id => deleteDomesticTruckingItem(id));
      setSelectedDomesticTruckingRows([]);
    }
  };

  const handleArchiveBulkRecords = () => {
    if (activeTab === 'export-table') {
      selectedRows.forEach(id => updateRecord(id, 'archived', true));
      setSelectedRows([]);
    } else if (activeTab === 'import-table') {
      selectedImportRows.forEach(id => updateImportRecord(id, 'archived', true));
      setSelectedImportRows([]);
    } else if (activeTab === 'domestic-trucking') {
      selectedDomesticTruckingRows.forEach(id => updateDomesticTruckingRecord(id, 'archived', true));
      setSelectedDomesticTruckingRows([]);
    }
  };

  // Search functionality with proper typing
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  
  // Create a custom search hook for import data
  const [importSearchTerm, setImportSearchTerm] = useState('');
  const filteredImportData = importData.filter((record) => {
    if (!importSearchTerm) return true;
    const searchLower = importSearchTerm.toLowerCase();
    return (
      record.customer?.toLowerCase().includes(searchLower) ||
      record.booking?.toLowerCase().includes(searchLower) ||
      record.file?.toLowerCase().includes(searchLower) ||
      record.bond?.toLowerCase().includes(searchLower) ||
      record.notes?.toLowerCase().includes(searchLower)
    );
  });

  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);
  const { searchTerm: domesticTruckingSearchTerm, setSearchTerm: setDomesticTruckingSearchTerm, filteredData: filteredDomesticTruckingData } = useDomesticTruckingSearch(domesticTruckingData);

  const getSearchTerm = () => {
    switch (activeTab) {
      case 'export-table':
        return exportSearchTerm;
      case 'import-table':
        return importSearchTerm;
      case 'all-files':
        return allFilesSearchTerm;
      case 'domestic-trucking':
        return domesticTruckingSearchTerm;
      default:
        return '';
    }
  };

  const setSearchTerm = (term: string) => {
    switch (activeTab) {
      case 'export-table':
        setExportSearchTerm(term);
        break;
      case 'import-table':
        setImportSearchTerm(term);
        break;
       case 'all-files':
        setAllFilesSearchTerm(term);
        break;
      case 'domestic-trucking':
        setDomesticTruckingSearchTerm(term);
        break;
      default:
        break;
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log(`Linking to file: ${fileNumber}, type: ${fileType}`);
    
    let targetTab = '';
    let targetData: any[] = [];
    let found = false;
    let searchFileNumber = '';
    
    if (fileType === 'ES') {
      targetTab = 'export-table';
      targetData = exportData;
      searchFileNumber = `ES${fileNumber}`;
      const targetRecord = exportData.find(record => record.file === searchFileNumber);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    } else if (fileType === 'IS') {
      targetTab = 'import-table';
      targetData = importData;
      searchFileNumber = `IS${fileNumber}`;
      const targetRecord = importData.find(record => record.file === searchFileNumber);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    } else if (fileType === 'DT') {
      targetTab = 'domestic-trucking';
      targetData = domesticTruckingData;
      searchFileNumber = `DT${fileNumber}`;
      const targetRecord = domesticTruckingData.find(record => record.file === searchFileNumber);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    }
    
    if (!found) {
      alert(`No matching record found in ${fileType} table for file: ${searchFileNumber}`);
      return;
    }
    
    setActiveTab(targetTab);
    
    setTimeout(() => {
      const targetElement = document.querySelector(`[data-row-id="${found ? (targetData.find(r => r.file === searchFileNumber)?.id) : ''}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    }, 100);
  };

  const handleCalendarEventClick = (eventFile: string, eventSource: string) => {
    console.log(`Calendar linking to file: ${eventFile}, source: ${eventSource}`);
    
    let targetTab = '';
    let targetData: any[] = [];
    let found = false;
    
    if (eventSource === 'export') {
      targetTab = 'export-table';
      targetData = exportData;
      const targetRecord = exportData.find(record => record.file === eventFile);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    } else if (eventSource === 'import') {
      targetTab = 'import-table';
      targetData = importData;
      const targetRecord = importData.find(record => record.file === eventFile);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    } else if (eventSource === 'domestic') {
      targetTab = 'domestic-trucking';
      targetData = domesticTruckingData;
      const targetRecord = domesticTruckingData.find(record => record.file === eventFile);
      if (targetRecord) {
        found = true;
        setHighlightedRowId(targetRecord.id);
      }
    }
    
    if (!found) {
      alert(`No matching record found in ${eventSource} table for file: ${eventFile}`);
      return;
    }
    
    setActiveTab(targetTab);
    
    setTimeout(() => {
      const targetElement = document.querySelector(`[data-row-id="${found ? (targetData.find(r => r.file === eventFile)?.id) : ''}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    }, 100);
  };

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FreightTrackerHeader
        activeTab={activeTab}
        searchTerm={getSearchTerm()}
        setSearchTerm={setSearchTerm}
        selectedRows={selectedRows}
        selectedImportRows={selectedImportRows}
        selectedAllFilesRows={selectedAllFilesRows}
        selectedDomesticTruckingRows={selectedDomesticTruckingRows}
        filteredExportData={filteredExportData}
        filteredImportData={filteredImportData}
        filteredAllFilesData={filteredAllFilesData}
        filteredDomesticTruckingData={filteredDomesticTruckingData}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onAddRecord={handleAddRecord}
        onDeleteBulkRecords={handleDeleteBulkRecords}
        onArchiveBulkRecords={handleArchiveBulkRecords}
      />

      <FreightTrackerTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredExportData={filteredExportData}
        filteredImportData={filteredImportData}
        filteredAllFilesData={filteredAllFilesData}
        filteredDomesticTruckingData={filteredDomesticTruckingData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        selectedImportRows={selectedImportRows}
        setSelectedImportRows={setSelectedImportRows}
        selectedAllFilesRows={selectedAllFilesRows}
        setSelectedAllFilesRows={setSelectedAllFilesRows}
        selectedDomesticTruckingRows={selectedDomesticTruckingRows}
        setSelectedDomesticTruckingRows={setSelectedDomesticTruckingRows}
        updateRecord={updateRecord}
        updateImportRecord={updateImportRecord}
        updateAllFilesRecord={updateAllFilesRecord}
        updateDomesticTruckingRecord={updateDomesticTruckingRecord}
        deleteRecord={deleteExportItem}
        deleteImportRecord={deleteImportItem}
        deleteAllFilesRecord={deleteAllFilesItem}
        deleteDomesticTruckingRecord={deleteDomesticTruckingItem}
        onFileClick={handleFileClick}
        onCalendarEventClick={handleCalendarEventClick}
        highlightedRowId={highlightedRowId}
      />
    </div>
  );
};

export default FreightTracker;
