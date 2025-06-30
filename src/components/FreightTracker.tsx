
import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { useSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useDomesticTruckingSearch } from '../hooks/useDomesticTruckingSearch';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';

const FreightTracker = () => {
  const { user } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState('all-files');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  // Row selection states
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [selectedDomesticTruckingRows, setSelectedDomesticTruckingRows] = useState<string[]>([]);

  const {
    exportData,
    importData,
    allFilesData,
    domesticTruckingData,
    loading,
    updateRecord,
    updateImportRecord,
    updateAllFilesRecord,
    updateDomesticTruckingRecord,
    deleteExportItem,
    deleteImportItem,
    deleteAllFilesItem,
    deleteDomesticTruckingItem
  } = useFreightTrackerData(user?.uid || 'demo-user');

  // Search functionality - use correct data types for each hook
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);
  const { searchTerm: domesticTruckingSearchTerm, setSearchTerm: setDomesticTruckingSearchTerm, filteredData: filteredDomesticTruckingData } = useDomesticTruckingSearch(domesticTruckingData);

  // Get current search term and setter based on active tab
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
        return { searchTerm: '', setSearchTerm: () => {} };
    }
  };

  const { searchTerm, setSearchTerm } = getCurrentSearchProps();

  // Handle file clicks from All Files tab
  const handleFileClick = (fileNumber: string, fileType: string) => {
    console.log('Handling file click:', { fileNumber, fileType });
    
    let targetTab = '';
    let targetData: any[] = [];
    
    if (fileType === 'ES') {
      targetTab = 'export-table';
      targetData = exportData;
    } else if (fileType === 'IS') {
      targetTab = 'import-table';
      targetData = importData;
    } else if (fileType === 'DT') {
      targetTab = 'domestic-trucking';
      targetData = domesticTruckingData;
    }

    if (targetTab && targetData.length > 0) {
      // Find matching record by checking if the file number contains the number
      const matchingRecord = targetData.find(record => {
        const recordFileNumber = record.file || '';
        return recordFileNumber.includes(fileNumber);
      });

      if (matchingRecord) {
        console.log('Found matching record:', matchingRecord);
        setActiveTab(targetTab);
        setHighlightedRowId(matchingRecord.id);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      } else {
        console.log('No matching record found in', targetTab);
        // Still switch to the appropriate tab even if no exact match
        setActiveTab(targetTab);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading freight tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <FreightTrackerHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        selectedRows={selectedRows}
        selectedImportRows={selectedImportRows}
        selectedAllFilesRows={selectedAllFilesRows}
        selectedDomesticTruckingRows={selectedDomesticTruckingRows}
        filteredExportData={filteredExportData}
        filteredImportData={filteredImportData}
        filteredAllFilesData={filteredAllFilesData}
        filteredDomesticTruckingData={filteredDomesticTruckingData}
        canUndo={false}
        canRedo={false}
        onUndo={() => {}}
        onRedo={() => {}}
        onAddRecord={() => {}}
        onImportClick={() => {}}
        onDeleteBulkRecords={() => {}}
        onArchiveBulkRecords={() => {}}
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
        highlightedRowId={highlightedRowId}
      />
    </div>
  );
};

export default FreightTracker;
