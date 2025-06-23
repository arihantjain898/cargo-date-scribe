
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';

export const useExcelImport = (
  setExportData: React.Dispatch<React.SetStateAction<TrackingRecord[]>>,
  setImportData: React.Dispatch<React.SetStateAction<ImportTrackingRecord[]>>,
  setAllFilesData: React.Dispatch<React.SetStateAction<AllFilesRecord[]>>
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>, dataType: 'export' | 'import' | 'all-files') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
          worksheet
        );

        if (dataType === 'export') {
          const importedRecords: TrackingRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
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
          setExportData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'export tracking records');
        } else if (dataType === 'import') {
          const importedRecords: ImportTrackingRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
            id: row.id || Date.now().toString() + index,
            reference: row.reference || '',
            file: row.file || '',
            etaFinalPod: row.etaFinalPod || '',
            bond: row.bond || '',
            poa: Boolean(row.poa),
            isf: Boolean(row.isf),
            packingListCommercialInvoice: Boolean(row.packingListCommercialInvoice),
            billOfLading: Boolean(row.billOfLading),
            arrivalNotice: Boolean(row.arrivalNotice),
            isfFiled: Boolean(row.isfFiled),
            entryFiled: Boolean(row.entryFiled),
            blRelease: Boolean(row.blRelease),
            customsRelease: Boolean(row.customsRelease),
            invoiceSent: Boolean(row.invoiceSent),
            paymentReceived: Boolean(row.paymentReceived),
            workOrderSetup: Boolean(row.workOrderSetup),
            deliveryDate: row.deliveryDate || '',
            notes: row.notes || ''
          }));
          setImportData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'import tracking records');
        } else if (dataType === 'all-files') {
          const importedRecords: AllFilesRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
            id: row.id || Date.now().toString() + index,
            file: row.file || 'ES',
            number: row.number || '',
            customer: row.customer || '',
            originPort: row.originPort || '',
            originState: row.originState || '',
            destinationPort: row.destinationPort || '',
            destinationCountry: row.destinationCountry || '',
            container20: row.container20 || '',
            container40: row.container40 || '',
            roro: row.roro || '',
            lcl: row.lcl || '',
            air: row.air || '',
            truck: row.truck || '',
            ssl: row.ssl || '',
            nvo: row.nvo || '',
            comments: row.comments || '',
            salesContact: row.salesContact || ''
          }));
          setAllFilesData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'all files records');
        }

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
