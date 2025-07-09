
import { useState, useMemo } from 'react';
import { AllFilesRecord } from '../types/AllFilesRecord';

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
      (record.ssl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.truck || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.nvo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.salesContact || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};
