
import { useState, useMemo } from 'react';
import { AllFilesRecord } from '../types/AllFilesRecord';

export const useAllFilesSearch = (data: AllFilesRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return data.filter(record => 
      (record.customer || '').toLowerCase().includes(lowercaseSearch) ||
      (record.file || '').toLowerCase().includes(lowercaseSearch) ||
      (record.number || '').toLowerCase().includes(lowercaseSearch) ||
      (record.originPort || '').toLowerCase().includes(lowercaseSearch) ||
      (record.originState || '').toLowerCase().includes(lowercaseSearch) ||
      (record.destinationPort || '').toLowerCase().includes(lowercaseSearch) ||
      (record.destinationCountry || '').toLowerCase().includes(lowercaseSearch) ||
      (record.truck || '').toLowerCase().includes(lowercaseSearch) ||
      (record.ssl || '').toLowerCase().includes(lowercaseSearch) ||
      (record.nvo || '').toLowerCase().includes(lowercaseSearch) ||
      (record.comments || '').toLowerCase().includes(lowercaseSearch) ||
      (record.salesContact || '').toLowerCase().includes(lowercaseSearch)
    );
  }, [data, searchTerm]);

  return { searchTerm, setSearchTerm, filteredData };
};
