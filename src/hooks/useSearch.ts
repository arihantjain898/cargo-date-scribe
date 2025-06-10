
import { useState, useMemo } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';

export const useSearch = (data: TrackingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      record.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.workOrder.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};
