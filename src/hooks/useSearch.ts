
import { useState, useMemo } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const useSearch = (data: TrackingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      (record.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.ref || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.file || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.workOrder || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};

export const useImportSearch = (data: ImportTrackingRecord[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => 
    data.filter(record => 
      (record.booking || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.file || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.bond || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  return { searchTerm, setSearchTerm, filteredData };
};
