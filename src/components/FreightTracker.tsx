import React, { useState, useEffect, useCallback } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import FreightTrackerTabs from './FreightTrackerTabs';

const FreightTracker = () => {
  const userId = 'demo-user'; // Simplified for demo
  const [exportData, setExportData] = useState<TrackingRecord[]>([]);
  const [importData, setImportData] = useState<ImportTrackingRecord[]>([]);
  const [domesticData, setDomesticData] = useState<DomesticTruckingRecord[]>([]);
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('allfiles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      const storedExportData = localStorage.getItem(`exportData-${userId}`);
      const storedImportData = localStorage.getItem(`importData-${userId}`);
      const storedDomesticData = localStorage.getItem(`domesticData-${userId}`);
      const storedAllFilesData = localStorage.getItem(`allFilesData-${userId}`);

      if (storedExportData) setExportData(JSON.parse(storedExportData));
      if (storedImportData) setImportData(JSON.parse(storedImportData));
      if (storedDomesticData) setDomesticData(JSON.parse(storedDomesticData));
      if (storedAllFilesData) setAllFilesData(JSON.parse(storedAllFilesData));
    }
  }, [userId]);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`exportData-${userId}`, JSON.stringify(exportData));
      localStorage.setItem(`importData-${userId}`, JSON.stringify(importData));
      localStorage.setItem(`domesticData-${userId}`, JSON.stringify(domesticData));
      localStorage.setItem(`allFilesData-${userId}`, JSON.stringify(allFilesData));
    }
  }, [exportData, importData, domesticData, allFilesData, userId]);

  const updateExportRecord = (id: string, field: keyof TrackingRecord, value: string | boolean) => {
    setExportData(prevData =>
      prevData.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const updateImportRecord = (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => {
    setImportData(prevData =>
      prevData.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const updateDomesticRecord = (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => {
    setDomesticData(prevData =>
      prevData.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const updateAllFilesRecord = (id: string, field: keyof AllFilesRecord, value: string | boolean) => {
    setAllFilesData(prevData =>
      prevData.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const deleteExportRecord = (id: string) => {
    setExportData(prevData => prevData.filter(record => record.id !== id));
  };

  const deleteImportRecord = (id: string) => {
    setImportData(prevData => prevData.filter(record => record.id !== id));
  };

  const deleteDomesticRecord = (id: string) => {
    setDomesticData(prevData => prevData.filter(record => record.id !== id));
  };

  const deleteAllFilesRecord = (id: string) => {
    setAllFilesData(prevData => prevData.filter(record => record.id !== id));
  };

  const addExportRecord = () => {
    const newRecord: TrackingRecord = {
      id: crypto.randomUUID(),
      customer: '',
      file: '',
      container: '',
      seal: '',
      voyage: '',
      portOfLoading: '',
      portOfDischarge: '',
      eta: '',
      pickupA: '',
      dropA: '',
      pickupB: '',
      dropB: '',
      pickupC: '',
      dropC: '',
      dropDone: 'Select',
      docsSent: '',
      docsReceived: '',
      aesMblVgmSent: '',
      titlesDispatched: 'Select',
      validatedFwd: '',
      titlesReturned: 'Select',
      sslDraftInvRec: '',
      draftInvApproved: '',
      transphereInvSent: '',
      paymentRec: '',
      sslPaid: '',
      insured: '',
      released: '',
      docsSentToCustomer: '',
      notes: '',
      archived: false,
      createdAt: new Date().toLocaleDateString(),
      userId: userId || ''
    };
    setExportData(prev => [...prev, newRecord]);
    setHighlightedRowId(newRecord.id);
    setTimeout(() => setHighlightedRowId(null), 3000);
  };

  const addImportRecord = () => {
    const newRecord: ImportTrackingRecord = {
      id: crypto.randomUUID(),
      customer: '',
      booking: '',
      file: '',
      etaFinalPod: '',
      bond: 'Select',
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
      createdAt: new Date().toLocaleDateString(),
      userId: userId || ''
    };
    
    setImportData(prev => [...prev, newRecord]);
    setHighlightedRowId(newRecord.id);
    setTimeout(() => setHighlightedRowId(null), 3000);
  };

  const addDomesticRecord = () => {
    const newRecord: DomesticTruckingRecord = {
      id: crypto.randomUUID(),
      customer: '',
      file: '',
      puLocation: '',
      delLocation: '',
      carrier: '',
      trailer: '',
      driverName: '',
      driverCell: '',
      woSent: '',
      insurance: '',
      pickDate: '',
      deliveryDate: '',
      delivered: '',
      paymentReceived: '',
      paymentMade: '',
      notes: '',
      archived: false,
      createdAt: new Date().toLocaleDateString(),
      userId: userId || ''
    };
    setDomesticData(prev => [...prev, newRecord]);
    setHighlightedRowId(newRecord.id);
    setTimeout(() => setHighlightedRowId(null), 3000);
  };

  const addAllFilesRecord = () => {
    const newRecord: AllFilesRecord = {
      id: crypto.randomUUID(),
      file: '',
      fileType: '',
      customer: '',
      notes: '',
      archived: false,
      createdAt: new Date().toLocaleDateString(),
      userId: userId || ''
    };
    setAllFilesData(prev => [...prev, newRecord]);
    setHighlightedRowId(newRecord.id);
    setTimeout(() => setHighlightedRowId(null), 3000);
  };

  const handleFileClick = useCallback((fileNumber: string, fileType: string) => {
    console.log('fileNumber:', fileNumber, 'fileType:', fileType);
    setSearchTerm(fileNumber);
    setActiveTab('allfiles');
  }, []);

  const filteredExportData = exportData.filter(record =>
    Object.values(record).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredImportData = importData.filter(record =>
    Object.values(record).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredDomesticTruckingData = domesticData.filter(record =>
    Object.values(record).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const filteredAllFilesData = allFilesData.filter(record =>
    Object.values(record).some(value =>
      typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FreightTrackerTabs
          exportData={exportData}
          importData={importData}
          domesticData={domesticData}
          allFilesData={allFilesData}
          updateExportRecord={updateExportRecord}
          updateImportRecord={updateImportRecord}
          updateDomesticRecord={updateDomesticRecord}
          updateAllFilesRecord={updateAllFilesRecord}
          deleteExportRecord={deleteExportRecord}
          deleteImportRecord={deleteImportRecord}
          deleteDomesticRecord={deleteDomesticRecord}
          deleteAllFilesRecord={deleteAllFilesRecord}
          addExportRecord={addExportRecord}
          addImportRecord={addImportRecord}
          addDomesticRecord={addDomesticRecord}
          addAllFilesRecord={addAllFilesRecord}
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
