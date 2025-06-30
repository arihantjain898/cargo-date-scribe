
import React, { useState, useEffect } from 'react';
import { useFreightTrackerData } from '../hooks/useFreightTrackerData';
import { useSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useDomesticTruckingSearch } from '../hooks/useDomesticTruckingSearch';
import FreightTrackerHeader from './FreightTrackerHeader';
import FreightTrackerTabs from './FreightTrackerTabs';

const FreightTracker = () => {
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
    deleteDomesticTruckingItem,
    addExportItem,
    addImportItem,
    addAllFilesItem,
    addDomesticTruckingItem
  } = useFreightTrackerData('demo-user');

  // Search functionality with proper typing
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

  // Handle file clicks from All Files tab - scroll to specific row
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
      // Find matching record by file number
      const matchingRecord = targetData.find(record => {
        const recordFile = record.file || '';
        console.log('Comparing:', recordFile, 'with target:', `${fileType} ${fileNumber}`);
        
        // Try different matching patterns
        return recordFile === `${fileType} ${fileNumber}` || 
               recordFile === `${fileType}${fileNumber}` || 
               recordFile === fileNumber ||
               recordFile.includes(fileNumber);
      });

      if (matchingRecord) {
        console.log('Found matching record:', matchingRecord);
        setActiveTab(targetTab);
        setHighlightedRowId(matchingRecord.id);
        
        // Scroll to the specific row after tab switch
        setTimeout(() => {
          const rowElement = document.querySelector(`[data-row-id="${matchingRecord.id}"]`);
          if (rowElement) {
            rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            console.log('Scrolled to row:', matchingRecord.id);
          } else {
            console.log('Row element not found for ID:', matchingRecord.id);
          }
        }, 300);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      } else {
        console.log('No matching record found in', targetTab, 'for file:', `${fileType} ${fileNumber}`);
        alert(`No matching record found for ${fileType} ${fileNumber} in ${targetTab.replace('-', ' ')}`);
      }
    } else {
      console.log('Invalid target tab or no data available');
      alert(`Cannot navigate to ${fileType} records - no data available`);
    }
  };

  // Add record handlers
  const handleAddRecord = async () => {
    try {
      switch (activeTab) {
        case 'export-table':
          const newExportRecord = {
            customer: '',
            ref: '',
            file: '',
            workOrder: '',
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
            notes: ''
          };
          await addExportItem(newExportRecord);
          break;
        case 'import-table':
          const newImportRecord = {
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
            delivered: '',
            returned: '',
            deliveryDate: '',
            notes: ''
          };
          await addImportItem(newImportRecord);
          break;
        case 'all-files':
          const newAllFilesRecord = {
            customer: '',
            file: 'ES',
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
            salesContact: ''
          };
          await addAllFilesItem(newAllFilesRecord);
          break;
        case 'domestic-trucking':
          const newDomesticRecord = {
            customer: '',
            file: '',
            woSent: false,
            insurance: false,
            pickDate: '',
            delivered: '',
            paymentReceived: false,
            paymentMade: false,
            notes: ''
          };
          await addDomesticTruckingItem(newDomesticRecord);
          break;
      }
    } catch (error) {
      console.error('Error adding record:', error);
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
        onAddRecord={handleAddRecord}
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
