
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { TrackingRecord } from '../types/TrackingRecord';

export const useExcelImport = (setData: React.Dispatch<React.SetStateAction<TrackingRecord[]>>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedRecords: TrackingRecord[] = jsonData.map((row: any, index: number) => ({
          id: row.id || Date.now().toString() + index,
          customer: row.customer || '',
          ref: row.ref || '',
          file: row.file || '',
          workOrder: row.workOrder || '',
          dropDone: Boolean(row.dropDone),
          dropDate: row.dropDate || '',
          returnNeeded: Boolean(row.returnNeeded),
          returnDate: row.returnDate || '',
          docsSent: Boolean(row.docsSent),
          docsReceived: Boolean(row.docsReceived),
          aesMblVgmSent: Boolean(row.aesMblVgmSent),
          docCutoffDate: row.docCutoffDate || '',
          titlesDispatched: Boolean(row.titlesDispatched),
          validatedFwd: Boolean(row.validatedFwd),
          titlesReturned: Boolean(row.titlesReturned),
          sslDraftInvRec: Boolean(row.sslDraftInvRec),
          draftInvApproved: Boolean(row.draftInvApproved),
          transphereInvSent: Boolean(row.transphereInvSent),
          paymentRec: Boolean(row.paymentRec),
          sslPaid: Boolean(row.sslPaid),
          insured: Boolean(row.insured),
          released: Boolean(row.released),
          docsSentToCustomer: Boolean(row.docsSentToCustomer),
          notes: row.notes || ''
        }));

        setData(importedRecords);
        console.log('Successfully imported', importedRecords.length, 'records');
      } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Error importing Excel file. Please check the file format.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return { fileInputRef, importFromExcel };
};
