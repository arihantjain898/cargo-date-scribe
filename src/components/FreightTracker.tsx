import React, { useState, useEffect, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import FreightTrackerTabs from './FreightTrackerTabs';
import { useSearch } from '@/hooks/useSearch';
import { useAllFilesSearch } from '@/hooks/useAllFilesSearch';
import { useDomesticTruckingSearch } from '@/hooks/useDomesticTruckingSearch';

const FreightTracker = () => {
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('allfiles');

  const {
    exportData,
    importData,
    allFilesData,
    domesticTruckingData,
    loading,
    addExportItem,
    addImportItem, // Fixed: this function doesn't take parameters
    addAllFilesItem,
    addDomesticTruckingItem,
    updateRecord,
    deleteRecord
  } = useFreightTrackerData();

  // Search hooks
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useSearch(importData);
  const { filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);
  const { filteredData: filteredDomesticTruckingData } = useDomesticTruckingSearch(domesticTruckingData);

  // Mock user ID
  const currentUserId = 'user-123';

  useEffect(() => {
    console.log('Export data loaded:', exportData?.length || 0, 'records');
    console.log('Import data loaded:', importData?.length || 0, 'records');
    console.log('All files data loaded:', allFilesData?.length || 0, 'records');
    console.log('Domestic trucking data loaded:', domesticTruckingData?.length || 0, 'records');
  }, [exportData, importData, allFilesData, domesticTruckingData]);

  const handleFileClick = useCallback((fileNumber: string, fileType: string) => {
    console.log('File click received:', { fileNumber, fileType });
    
    if (!fileNumber || !fileType) {
      console.log('Missing file number or type');
      return;
    }

    // Switch to All Files tab
    setActiveTab('allfiles');
    
    // Find matching record in All Files
    const matchingRecord = allFilesData?.find(record => {
      const recordFileNumber = record.file?.replace(/[^0-9]/g, '');
      const recordFileType = record.file?.replace(/[0-9]/g, '').toUpperCase();
      
      console.log('Comparing:', {
        searchFor: { fileNumber, fileType: fileType.toUpperCase() },
        recordData: { recordFileNumber, recordFileType, originalFile: record.file }
      });
      
      return recordFileNumber === fileNumber && recordFileType === fileType.toUpperCase();
    });

    if (matchingRecord) {
      console.log('Found matching record:', matchingRecord.id);
      setHighlightedRowId(matchingRecord.id);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedRowId(null);
      }, 3000);
    } else {
      console.log('No matching record found in All Files');
    }
  }, [allFilesData]);

  const addNewExportRecord = () => {
    const newRecord: Omit<TrackingRecord, 'id'> = {
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
      aesMblVgmSent: false,
      docCutoffDate: '',
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
      archived: false,
      userId: currentUserId
    };
    
    addExportItem(newRecord);
  };

  const addNewImportRecord = () => {
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: '',
      booking: '',
      bookingUrl: '',
      file: '',
      etaFinalPod: '',
      bond: 'Continuous',
      poa: 'Select',
      isf: 'Select',
      packingListCommercialInvoice: 'Select',
      billOfLading: 'Select',
      arrivalNotice: 'Select',
      isfFiled: 'Select',
      entryFiled: 'Select',
      blRelease: 'Select',
      customsRelease: 'Select',
      invoiceSent: 'Select',
      paymentReceived: 'Select',
      workOrderSetup: 'Select',
      delivered: 'Select',
      returned: 'Select',
      deliveryDate: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
      userId: currentUserId
    };
    
    addImportItem(newRecord);
  };

  const addNewDomesticRecord = () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: '',
      file: '',
      workOrder: '',
      carrier: '',
      driver: '',
      phone: '',
      truckerEta: '',
      timeWindow: '',
      actualPickupTime: '',
      actualDeliveryTime: '',
      notes: '',
      archived: false,
      userId: currentUserId
    };
    
    addDomesticTruckingItem(newRecord);
  };

  const addNewAllFilesRecord = () => {
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      file: '',
      customer: '',
      exportOrImport: 'Export',
      notes: '',
      archived: false,
      userId: currentUserId
    };
    
    addAllFilesItem(newRecord);
  };

  const updateExportRecord = (id: string, field: keyof TrackingRecord, value: string | boolean) => {
    updateRecord('export', id, field, value);
  };

  const updateImportRecord = (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => {
    updateRecord('import', id, field, value);
  };

  const updateDomesticRecord = (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => {
    updateRecord('domestic', id, field, value);
  };

  const updateAllFilesRecord = (id: string, field: keyof AllFilesRecord, value: string | boolean) => {
    updateRecord('allfiles', id, field, value);
  };

  const deleteExportRecord = (id: string) => {
    deleteRecord('export', id);
  };

  const deleteImportRecord = (id: string) => {
    deleteRecord('import', id);
  };

  const deleteDomesticRecord = (id: string) => {
    deleteRecord('domestic', id);
  };

  const deleteAllFilesRecord = (id: string) => {
    deleteRecord('allfiles', id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading freight tracking data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <FreightTrackerTabs
        exportData={exportData || []}
        importData={importData || []}
        domesticData={domesticTruckingData || []}
        allFilesData={allFilesData || []}
        updateExportRecord={updateExportRecord}
        updateImportRecord={updateImportRecord}
        updateDomesticRecord={updateDomesticRecord}
        updateAllFilesRecord={updateAllFilesRecord}
        deleteExportRecord={deleteExportRecord}
        deleteImportRecord={deleteImportRecord}
        deleteDomesticRecord={deleteDomesticRecord}
        deleteAllFilesRecord={deleteAllFilesRecord}
        addExportRecord={addNewExportRecord}
        addImportRecord={addNewImportRecord}
        addDomesticRecord={addNewDomesticRecord}
        addAllFilesRecord={addNewAllFilesRecord}
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
  );
};

export default FreightTracker;
