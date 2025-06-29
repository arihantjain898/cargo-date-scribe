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

  // Store previous state for undo/redo
  const [undoStack, setUndoStack] = useState<Array<{
    recordId: string;
    field: string;
    oldValue: string | boolean;
    newValue: string | boolean;
    recordType: 'export' | 'import' | 'all-files' | 'domestic-trucking';
  }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{
    recordId: string;
    field: string;
    oldValue: string | boolean;
    newValue: string | boolean;
    recordType: 'export' | 'import' | 'all-files' | 'domestic-trucking';
  }>>([]);

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

  useEffect(() => {
    localStorage.setItem('freight-tracker-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!loading && !sampleDataAdded) {
      // Automatically add sample data on first load
      addSampleData();
    }
  }, [loading, sampleDataAdded]);

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
    if (sampleDataAdded) return;

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

  // Enhanced update functions that track changes for undo/redo
  const updateRecordWithHistory = async (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => {
    const record = exportData.find(r => r.id === id);
    if (!record) return;

    const oldValue = record[field];
    
    // Add to undo stack
    setUndoStack(prev => [...prev, {
      recordId: id,
      field: field as string,
      oldValue,
      newValue: value,
      recordType: 'export'
    }]);
    
    // Clear redo stack
    setRedoStack([]);

    try {
      await updateRecord(id, field, value);
    } catch (error) {
      console.error('Error updating export record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateImportRecordWithHistory = async (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => {
    const record = importData.find(r => r.id === id);
    if (!record) return;

    const oldValue = record[field];
    
    setUndoStack(prev => [...prev, {
      recordId: id,
      field: field as string,
      oldValue,
      newValue: value,
      recordType: 'import'
    }]);
    
    setRedoStack([]);

    try {
      await updateImportRecord(id, field, value);
    } catch (error) {
      console.error('Error updating import record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateAllFilesRecordWithHistory = async (
    id: string,
    field: keyof AllFilesRecord,
    value: string
  ) => {
    const record = allFilesData.find(r => r.id === id);
    if (!record) return;

    const oldValue = record[field];
    
    setUndoStack(prev => [...prev, {
      recordId: id,
      field: field as string,
      oldValue,
      newValue: value,
      recordType: 'all-files'
    }]);
    
    setRedoStack([]);

    try {
      await updateAllFilesRecord(id, field, value);
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateDomesticTruckingRecordWithHistory = async (
    id: string,
    field: keyof DomesticTruckingRecord,
    value: string | boolean
  ) => {
    const record = domesticTruckingData.find(r => r.id === id);
    if (!record) return;

    const oldValue = record[field];
    
    setUndoStack(prev => [...prev, {
      recordId: id,
      field: field as string,
      oldValue,
      newValue: value,
      recordType: 'domestic-trucking'
    }]);
    
    setRedoStack([]);

    try {
      await updateDomesticTruckingRecord(id, field, value);
    } catch (error) {
      console.error('Error updating domestic trucking record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;

    const lastChange = undoStack[undoStack.length - 1];
    
    // Move to redo stack
    setRedoStack(prev => [...prev, lastChange]);
    setUndoStack(prev => prev.slice(0, -1));

    // Apply the old value
    try {
      switch (lastChange.recordType) {
        case 'export':
          await updateRecord(lastChange.recordId, lastChange.field as keyof TrackingRecord, lastChange.oldValue);
          break;
        case 'import':
          await updateImportRecord(lastChange.recordId, lastChange.field as keyof ImportTrackingRecord, lastChange.oldValue);
          break;
        case 'all-files':
          await updateAllFilesRecord(lastChange.recordId, lastChange.field as keyof AllFilesRecord, lastChange.oldValue as string);
          break;
        case 'domestic-trucking':
          await updateDomesticTruckingRecord(lastChange.recordId, lastChange.field as keyof DomesticTruckingRecord, lastChange.oldValue);
          break;
      }
      addNotification('Success', 'Change undone', 'success');
    } catch (error) {
      console.error('Error during undo:', error);
      addNotification('Error', 'Failed to undo change', 'error');
    }
  };

  const handleRedo = async () => {
    if (redoStack.length === 0) return;

    const lastUndone = redoStack[redoStack.length - 1];
    
    // Move back to undo stack
    setUndoStack(prev => [...prev, lastUndone]);
    setRedoStack(prev => prev.slice(0, -1));

    // Apply the new value
    try {
      switch (lastUndone.recordType) {
        case 'export':
          await updateRecord(lastUndone.recordId, lastUndone.field as keyof TrackingRecord, lastUndone.newValue);
          break;
        case 'import':
          await updateImportRecord(lastUndone.recordId, lastUndone.field as keyof ImportTrackingRecord, lastUndone.newValue);
          break;
        case 'all-files':
          await updateAllFilesRecord(lastUndone.recordId, lastUndone.field as keyof AllFilesRecord, lastUndone.newValue as string);
          break;
        case 'domestic-trucking':
          await updateDomesticTruckingRecord(lastUndone.recordId, lastUndone.field as keyof DomesticTruckingRecord, lastUndone.newValue);
          break;
      }
      addNotification('Success', 'Change redone', 'success');
    } catch (error) {
      console.error('Error during redo:', error);
      addNotification('Error', 'Failed to redo change', 'error');
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
      const matchingExport = exportData.find(record => record.file === fileType + fileNumber);
      if (matchingExport) {
        setActiveTab('export-table');
        addNotification('Success', `Opened Export Checklist for file ${fileType}${fileNumber}`, 'success');
      } else {
        addNotification('Info', `No matching export record found for ${fileType}${fileNumber}`, 'info');
      }
    } else if (fileType === 'IS') {
      const matchingImport = importData.find(record => record.file === fileType + fileNumber);
      if (matchingImport) {
        setActiveTab('import-table');
        addNotification('Success', `Opened Import Checklist for file ${fileType}${fileNumber}`, 'success');
      } else {
        addNotification('Info', `No matching import record found for ${fileType}${fileNumber}`, 'info');
      }
    } else if (fileType === 'DT') {
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

  const archiveBulkRecords = async () => {
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
          await Promise.all(selectedRows.map(id => updateRecord(id, 'archived' as keyof TrackingRecord, 'true')));
          setSelectedRows([]);
          break;
        case 'import-table':
          await Promise.all(selectedImportRows.map(id => updateImportRecord(id, 'archived' as keyof ImportTrackingRecord, 'true')));
          setSelectedImportRows([]);
          break;
        case 'all-files':
          await Promise.all(selectedAllFilesRows.map(id => updateAllFilesRecord(id, 'archived' as keyof AllFilesRecord, 'true')));
          setSelectedAllFilesRows([]);
          break;
        case 'domestic-trucking':
          await Promise.all(selectedDomesticTruckingRows.map(id => updateDomesticTruckingRecord(id, 'archived' as keyof DomesticTruckingRecord, 'true')));
          setSelectedDomesticTruckingRows([]);
          break;
      }
      addNotification('Success', `Archived ${selected.length} records`, 'success');
    } catch (error) {
      addNotification('Error', 'Failed to archive some records', 'error');
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
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onAddRecord={handleAddRecord}
            onImportClick={handleImportClick}
            onDeleteBulkRecords={deleteBulkRecords}
            onArchiveBulkRecords={archiveBulkRecords}
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
            updateRecord={updateRecordWithHistory}
            updateImportRecord={updateImportRecordWithHistory}
            updateAllFilesRecord={updateAllFilesRecordWithHistory}
            updateDomesticTruckingRecord={updateDomesticTruckingRecordWithHistory}
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
