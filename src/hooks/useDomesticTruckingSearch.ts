
import { useState, useMemo } from 'react';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const useDomesticTruckingSearch = (data: DomesticTruckingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowercaseSearch = searchTerm.toLowerCase();
    return data.filter(record =>
      record.customer.toLowerCase().includes(lowercaseSearch) ||
      record.file.toLowerCase().includes(lowercaseSearch) ||
      record.notes.toLowerCase().includes(lowercaseSearch)
    );
  }, [data, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData
  };
};
