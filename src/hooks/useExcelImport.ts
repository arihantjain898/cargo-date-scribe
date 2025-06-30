import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

// This hook is deprecated - Excel import functionality has been removed
// Keeping only for legacy compatibility - use export functionality only
export const useExcelImport = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importFromExcel = () => {
    console.log('Excel import functionality has been removed');
  };

  return { fileInputRef, importFromExcel };
};
