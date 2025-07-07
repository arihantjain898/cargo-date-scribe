
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
      (record.bond || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      (record.destinationPort || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.destinationCountry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      (record.notes || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [data, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData
  };
};
