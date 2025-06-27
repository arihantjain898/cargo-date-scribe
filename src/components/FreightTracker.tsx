
import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from '@/components/ui/tabs';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { useExcelImport } from '../hooks/useExcelImport';
import { useSearch, useImportSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useDomesticTruckingSearch } from '../hooks/useDomesticTruckingSearch';
import { useNotifications } from '../hooks/useNotifications';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { 
  generateSampleExportData, 
  generateSampleImportData, 
  generateSampleAllFilesData, 
  generateSampleDomesticTruckingData 
} from '../data/generateSampleData';

const FreightTracker = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('freight-tracker-active-tab') || 'all-files';
  });

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);
  const [sampleDataAdded, setSampleDataAdded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = 'demo-user';

  const { addNotification } = useNotifications();
  const { fileInputRef: excelInputRef, importFromExcel } = useExcelImport(() => {}, () => {}, () => {}, () => {});

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

  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);
  const { searchTerm: domesticTruckingSearchTerm, setSearchTerm: setDomesticTruckingSearchTerm, filteredData: filteredDomesticTruckingData } = useDomesticTruckingSearch(domesticTruckingData);

  const undoRedoState = useUndoRedo({
    exportData,
    importData,
    allFilesData,
    domesticTruckingData
  });

  useEffect(() => {
    localStorage.setItem('freight-tracker-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!loading) {
      addNotification(
        'Welcome to Freight Tracker',
        'Your data is synced with Firebase. All changes will persist.',
        'success'
      );
    }
  }, [addNotification, loading]);

  useEffect(() => {
    if (!loading) {
      undoRedoState.set({
        exportData,
        importData,
        allFilesData,
        domesticTruckingData
      });
    }
  }, [exportData, importData, allFilesData, domesticTruckingData, loading]);

  const getCurrentSearchProps = () => {
    switch (activeTab) {
      case 'export-table':
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
      case 'import-table':
        return { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm };
      case 'all-files':
        return { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm };
      case 'domestic-trucking':
        return { searchTerm: domesticTruckingSearchTerm, setSearchTerm: setDomesticTruckingSearchTerm };
      default:
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
    }
  };

  const { searchTerm, setSearchTerm } = getCurrentSearchProps();

  const getImportDataType = (): 'export' | 'import' | 'all-files' | 'domestic-trucking' => {
    switch (activeTab) {
      case 'export-table': return 'export';
      case 'import-table': return 'import';
      case 'all-files': return 'all-files';
      case 'domestic-trucking': return 'domestic-trucking';
      default: return 'all-files';
    }
  };

  const addSampleData = async () => {
    try {
      const sampleExportData = generateSampleExportData();
      await Promise.all(sampleExportData.map(record => addExportItem(record)));

      const sampleImportData = generateSampleImportData();
      await Promise.all(sampleImportData.map(record => addImportItem(record)));

      const sampleAllFilesData = generateSampleAllFilesData();
      await Promise.all(sampleAllFilesData.map(record => addAllFilesItem(record)));

      const sampleDomesticData = generateSampleDomesticTruckingData();
      await Promise.all(sampleDomesticData.map(record => addDomesticTruckingItem(record)));

      setSampleDataAdded(true);
      addNotification(
        'Sample Data Added',
        'Added sample data across all tabs for this month and next month',
        'success'
      );
    } catch (error) {
      console.error('Error adding sample data:', error);
      addNotification('Error', 'Failed to add sample data', 'error');
    }
  };

  const addNewRecord = async () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: "", ref: "", file: "", workOrder: "", dropDone: "No", dropDate: "",
      returnNeeded: "No", returnDate: "", docsSent: false, docsReceived: false,
      aesMblVgmSent: false, docCutoffDate: "", titlesDispatched: "No", validatedFwd: false,
      titlesReturned: "No", sslDraftInvRec: false, draftInvApproved: false,
      transphereInvSent: false, paymentRec: false, sslPaid: false, insured: false,
      released: false, docsSentToCustomer: false, notes: ""
    };

    try {
      await addExportItem(newRecord);
      addNotification('Success', 'New export record added successfully', 'success');
    } catch (error) {
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewImportRecord = async () => {
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: "", booking: "", file: "", etaFinalPod: "", bond: "", poa: false,
      isf: false, packingListCommercialInvoice: false, billOfLading: false,
      arrivalNotice: false, isfFiled: false, entryFiled: false, blRelease: false,
      customsRelease: false, invoiceSent: false, paymentReceived: false,
      workOrderSetup: false, delivered: "No", returned: "No", deliveryDate: "", notes: ""
    };

    try {
      await addImportItem(newRecord);
      addNotification('Success', 'New import record added successfully', 'success');
    } catch (error) {
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewAllFilesRecord = async () => {
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      file: "ES", number: "", customer: "", originPort: "", originState: "",
      destinationPort: "", destinationCountry: "", container20: "", container40: "",
      roro: "", lcl: "", air: "", truck: "", ssl: "", nvo: "", comments: "", salesContact: ""
    };

    try {
      await addAllFilesItem(newRecord);
      addNotification('Success', 'New all files record added successfully', 'success');
    } catch (error) {
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewDomesticTruckingRecord = async () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: "", file: "", woSent: false, insurance: false,
      pickDate: "", delivered: "", paymentReceived: false, paymentMade: false, notes: ""
    };

    try {
      await addDomesticTruckingItem(newRecord);
      addNotification('Success', 'New domestic trucking record added successfully', 'success');
    } catch (error) {
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const handleAddRecord = () => {
    switch (activeTab) {
      case 'export-table': addNewRecord(); break;
      case 'import-table': addNewImportRecord(); break;
      case 'all-files': addNewAllFilesRecord(); break;
      case 'domestic-trucking': addNewDomesticTruckingRecord(); break;
      default: addNewRecord();
    }
  };

  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log('File clicked:', fileType + fileNumber);
    
    if (fileType === 'ES') {
      // Find matching export record
      const matchingExport = exportData.find(record => record.file === fileType + fileNumber);
      if (matchingExport) {
        setActiveTab('export-table');
        addNotification('Success', `Opened Export Checklist for file ${fileType}${fileNumber}`, 'success');
      } else {
        addNotification('Info', `No matching export record found for ${fileType}${fileNumber}`, 'info');
      }
    } else if (fileType === 'IS') {
      // Find matching import record
      const matchingImport = importData.find(record => record.file === fileType + fileNumber);
      if (matchingImport) {
        setActiveTab('import-table');
        addNotification('Success', `Opened Import Checklist for file ${fileType}${fileNumber}`, 'success');
      } else {
        addNotification('Info', `No matching import record found for ${fileType}${fileNumber}`, 'info');
      }
    } else if (fileType === 'DT') {
      // Find matching domestic trucking record
      const matchingDomestic = domesticTruckingData.find(record => record.file === fileType + fileNumber);
      if (matchingDomestic) {
        setActiveTab('domestic-trucking');
        addNotification('Success', `Opened Domestic Trucking for file ${fileType}${fileNumber}`, 'success');
      } else {
        addNotification('Info', `No matching domestic trucking record found for ${fileType}${fileNumber}`, 'info');
      }
    }
  };

  const deleteRecord = async (id: string) => {
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    try {
      await deleteExportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteImportRecord = async (id: string) => {
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));
    try {
      await deleteImportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteAllFilesRecord = async (id: string) => {
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));
    try {
      await deleteAllFilesItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteDomesticTruckingRecord = async (id: string) => {
    setSelectedDomesticTruckingRows(prev => prev.filter(rowId => rowId !== id));
    try {
      await deleteDomesticTruckingItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteBulkRecords = async () => {
    const getSelectedForActiveTab = () => {
      switch (activeTab) {
        case 'export-table': return selectedRows;
        case 'import-table': return selectedImportRows;
        case 'all-files': return selectedAllFilesRows;
        case 'domestic-trucking': return selectedDomesticTruckingRows;
        default: return [];
      }
    };

    const selected = getSelectedForActiveTab();
    if (selected.length === 0) return;

    try {
      switch (activeTab) {
        case 'export-table':
          await Promise.all(selectedRows.map(id => deleteExportItem(id)));
          setSelectedRows([]);
          break;
        case 'import-table':
          await Promise.all(selectedImportRows.map(id => deleteImportItem(id)));
          setSelectedImportRows([]);
          break;
        case 'all-files':
          await Promise.all(selectedAllFilesRows.map(id => deleteAllFilesItem(id)));
          setSelectedAllFilesRows([]);
          break;
        case 'domestic-trucking':
          await Promise.all(selectedDomesticTruckingRows.map(id => deleteDomesticTruckingItem(id)));
          setSelectedDomesticTruckingRows([]);
          break;
      }
      addNotification('Success', `Deleted ${selected.length} records`, 'success');
    } catch (error) {
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const handleImportClick = () => {
    excelInputRef.current?.click();
  };

  if (loading) {
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
          <FreightTrackerHeader
            activeTab={activeTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRows={selectedRows}
            selectedImportRows={selectedImportRows}
            selectedAllFilesRows={selectedAllFilesRows}
            selectedDomesticTruckingRows={selectedDomesticTruckingRows}
            filteredExportData={filteredExportData}
            filteredImportData={filteredImportData}
            filteredAllFilesData={filteredAllFilesData}
            filteredDomesticTruckingData={filteredDomesticTruckingData}
            sampleDataAdded={sampleDataAdded}
            canUndo={undoRedoState.canUndo}
            canRedo={undoRedoState.canRedo}
            onUndo={undoRedoState.undo}
            onRedo={undoRedoState.redo}
            onAddSampleData={addSampleData}
            onAddRecord={handleAddRecord}
            onImportClick={handleImportClick}
            onDeleteBulkRecords={deleteBulkRecords}
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
            deleteRecord={deleteRecord}
            deleteImportRecord={deleteImportRecord}
            deleteAllFilesRecord={deleteAllFilesRecord}
            deleteDomesticTruckingRecord={deleteDomesticTruckingRecord}
            onFileClick={handleFileClick}
          />

          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => importFromExcel(e, getImportDataType())}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
