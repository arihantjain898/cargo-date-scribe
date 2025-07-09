
import { useState, useMemo } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const useSearch = (data: TrackingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      (record.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.ref || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.file || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.workOrder || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.dropDate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.returnDate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.docCutoffDate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.titlesDispatched || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.titlesReturned || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};

export const useImportSearch = (data: ImportTrackingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      (record.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.booking || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.file || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.etaFinalPod || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.bond || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.poa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.isf || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.delivered || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.returned || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.deliveryDate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};

export const useAllFilesSearch = (data: AllFilesRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      (record.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.file || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.originPort || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.originState || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.destinationPort || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.destinationCountry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.truck || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.ssl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.nvo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.comments || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.salesContact || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};

export const useDomesticTruckingSearch = (data: DomesticTruckingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowercaseSearch = searchTerm.toLowerCase();
    return data.filter(record =>
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.pickDate || '').toLowerCase().includes(lowercaseSearch) ||
      (record.delivered || '').toLowerCase().includes(lowercaseSearch) ||
      (record.notes || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [data, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData
  };
};
