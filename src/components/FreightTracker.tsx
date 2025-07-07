
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useNotifications } from '../hooks/useNotifications';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
  const { addNotification } = useNotifications();
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('allfiles');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  // Selected rows state for each tab
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);

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

  // Filter data based on search and archive status
  const filteredExportData = useMemo(() => {
    if (!exportData) return [];
    
    let filtered = exportData;
    
    // Filter by archive status
    if (!showArchived) {
      filtered = filtered.filter(record => !record.archived);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
        (record.ref || '').toLowerCase().includes(lowercaseSearch) ||
        (record.file || '').toLowerCase().includes(lowercaseSearch) ||
        (record.workOrder || '').toLowerCase().includes(lowercaseSearch) ||
        (record.notes || '').toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  }, [exportData, searchTerm, showArchived]);

  const filteredImportData = useMemo(() => {
    if (!importData) return [];
    
    let filtered = importData;
    
    // Filter by archive status
    if (!showArchived) {
      filtered = filtered.filter(record => !record.archived);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
        (record.booking || '').toLowerCase().includes(lowercaseSearch) ||
        (record.file || '').toLowerCase().includes(lowercaseSearch) ||
        (record.notes || '').toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  }, [importData, searchTerm, showArchived]);

  const filteredAllFilesData = useMemo(() => {
    if (!allFilesData) return [];
    
    let filtered = allFilesData;
    
    // Filter by archive status
    if (!showArchived) {
      filtered = filtered.filter(record => !record.archived);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
        (record.file || '').toLowerCase().includes(lowercaseSearch) ||
        (record.number || '').toLowerCase().includes(lowercaseSearch) ||
        (record.originPort || '').toLowerCase().includes(lowercaseSearch) ||
        (record.destinationPort || '').toLowerCase().includes(lowercaseSearch) ||
        (record.destinationCountry || '').toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  }, [allFilesData, searchTerm, showArchived]);

  const filteredDomesticTruckingData = useMemo(() => {
    if (!domesticTruckingData) return [];
    
    let filtered = domesticTruckingData;
    
    // Filter by archive status
    if (!showArchived) {
      filtered = filtered.filter(record => !record.archived);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
        (record.file || '').toLowerCase().includes(lowercaseSearch) ||
        (record.notes || '').toLowerCase().includes(lowercaseSearch)
      );
    }
    
    return filtered;
  }, [domesticTruckingData, searchTerm, showArchived]);

  const handleAddRecord = useCallback(async () => {
    try {
      await addExportItem();
      addNotification('Success', 'New export record added', 'success');
    } catch (error) {
      console.error('Error adding export record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  }, [addExportItem, addNotification]);

  const handleAddImportRecord = useCallback(async () => {
    try {
      await addImportItem();
      addNotification('Success', 'New import record added', 'success');
    } catch (error) {
      console.error('Error adding import record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  }, [addImportItem, addNotification]);

  const handleAddAllFilesRecord = useCallback(async () => {
    try {
      await addAllFilesItem();
      addNotification('Success', 'New file record added', 'success');
    } catch (error) {
      console.error('Error adding file record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  }, [addAllFilesItem, addNotification]);

  const handleAddDomesticRecord = useCallback(async () => {
    try {
      await addDomesticTruckingItem();
      addNotification('Success', 'New domestic trucking record added', 'success');
    } catch (error) {
      console.error('Error adding domestic trucking record:', error);
      addNotification('Error', 'Failed to add record', 'error');
    }
  }, [addDomesticTruckingItem, addNotification]);

  const handleFileClick = useCallback((fileNumber: string, fileType: string) => {
    console.log('File clicked from tab, switching to All Files with file:', fileNumber, fileType);
    
    if (activeTab !== 'allfiles') {
      setActiveTab('allfiles');
    }
    
    // Find matching record in All Files
    const matchingRecord = allFilesData?.find(record => {
      const recordNumber = record.file.replace(/[^0-9]/g, '');
      const recordType = record.file.replace(/[0-9]/g, '');
      return recordNumber === fileNumber && (!fileType || recordType === fileType);
    });
    
    if (matchingRecord) {
      console.log('Found matching record:', matchingRecord.id);
      setHighlightedRowId(matchingRecord.id);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      console.log('No matching record found for:', fileNumber, fileType);
      addNotification('Info', `File ${fileType}${fileNumber} not found in All Files`, 'info');
    }
  }, [activeTab, allFilesData, addNotification]);

  // Get the add function based on active tab
  const getAddRecordFunction = () => {
    switch (activeTab) {
      case 'export':
        return handleAddRecord;
      case 'import':
        return handleAddImportRecord;
      case 'domestic':
        return handleAddDomesticRecord;
      case 'allfiles':
      default:
        return handleAddAllFilesRecord;
    }
  };

  // Dummy undo/redo functions for now
  const handleUndo = () => {};
  const handleRedo = () => {};
  const handleDeleteBulkRecords = () => {};
  const handleArchiveBulkRecords = () => {};

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100">
      <FreightTrackerHeader
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRows={selectedExportRows}
        selectedImportRows={selectedImportRows}
        selectedAllFilesRows={selectedAllFilesRows}
        selectedDomesticTruckingRows={selectedDomesticRows}
        filteredExportData={filteredExportData}
        filteredImportData={filteredImportData}
        filteredAllFilesData={filteredAllFilesData}
        filteredDomesticTruckingData={filteredDomesticTruckingData}
        canUndo={false}
        canRedo={false}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddRecord={getAddRecordFunction()}
        onDeleteBulkRecords={handleDeleteBulkRecords}
        onArchiveBulkRecords={handleArchiveBulkRecords}
      />
      
      <div className="max-w-full mx-auto px-4 py-6">
        <FreightTrackerTabs
          exportData={exportData || []}
          importData={importData || []}
          domesticData={domesticTruckingData || []}
          allFilesData={allFilesData || []}
          updateExportRecord={updateRecord}
          updateImportRecord={updateImportRecord}
          updateDomesticRecord={updateDomesticTruckingRecord}
          updateAllFilesRecord={updateAllFilesRecord}
          deleteExportRecord={deleteExportItem}
          deleteImportRecord={deleteImportItem}
          deleteDomesticRecord={deleteDomesticTruckingItem}
          deleteAllFilesRecord={deleteAllFilesItem}
          addExportRecord={handleAddRecord}
          addImportRecord={handleAddImportRecord}
          addDomesticRecord={handleAddDomesticRecord}
          addAllFilesRecord={handleAddAllFilesRecord}
          selectedExportRows={selectedExportRows}
          setSelectedExportRows={setSelectedExportRows}
          selectedImportRows={selectedImportRows}
          setSelectedImportRows={setSelectedImportRows}
          selectedDomesticRows={selectedDomesticRows}
          setSelectedDomesticRows={setSelectedDomesticRows}
          selectedAllFilesRows={selectedAllFilesRows}
          setSelectedAllFilesRows={setSelectedAllFilesRows}
          highlightedRowId={highlightedRowId}
          onFileClick={handleFileClick}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredExportData={filteredExportData}
          filteredImportData={filteredImportData}
          filteredAllFilesData={filteredAllFilesData}
          filteredDomesticTruckingData={filteredDomesticTruckingData}
        />
      </div>
    </div>
  );
};

export default FreightTracker;
