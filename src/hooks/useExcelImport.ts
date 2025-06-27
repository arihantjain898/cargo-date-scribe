
import { useRef } from 'react';
import * as XLSX from 'xlsx';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const useExcelImport = (
  setExportData: React.Dispatch<React.SetStateAction<TrackingRecord[]>>,
  setImportData: React.Dispatch<React.SetStateAction<ImportTrackingRecord[]>>,
  setAllFilesData: React.Dispatch<React.SetStateAction<AllFilesRecord[]>>,
  setDomesticTruckingData: React.Dispatch<React.SetStateAction<DomesticTruckingRecord[]>>
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToDropdownValue = (value: unknown): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    const str = String(value || '');
    if (str.toLowerCase() === 'true' || str === '1') return 'Yes';
    if (str.toLowerCase() === 'false' || str === '0') return 'No';
    return str || 'No';
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>, dataType: 'export' | 'import' | 'all-files' | 'domestic-trucking') => {
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
            id: String(row.id || Date.now().toString() + index),
            customer: String(row.customer || ''),
            ref: String(row.ref || ''),
            file: String(row.file || ''),
            workOrder: String(row.workOrder || ''),
            dropDone: convertToDropdownValue(row.dropDone),
            dropDate: String(row.dropDate || ''),
            returnNeeded: convertToDropdownValue(row.returnNeeded),
            returnDate: String(row.returnDate || ''),
            docsSent: Boolean(row.docsSent),
            docsReceived: Boolean(row.docsReceived),
            aesMblVgmSent: Boolean(row.aesMblVgmSent),
            docCutoffDate: String(row.docCutoffDate || ''),
            titlesDispatched: convertToDropdownValue(row.titlesDispatched),
            validatedFwd: Boolean(row.validatedFwd),
            titlesReturned: convertToDropdownValue(row.titlesReturned),
            sslDraftInvRec: Boolean(row.sslDraftInvRec),
            draftInvApproved: Boolean(row.draftInvApproved),
            transphereInvSent: Boolean(row.transphereInvSent),
            paymentRec: Boolean(row.paymentRec),
            sslPaid: Boolean(row.sslPaid),
            insured: Boolean(row.insured),
            released: Boolean(row.released),
            docsSentToCustomer: Boolean(row.docsSentToCustomer),
            notes: String(row.notes || '')
          }));
          setExportData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'export tracking records');
        } else if (dataType === 'import') {
          const importedRecords: ImportTrackingRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
            id: String(row.id || Date.now().toString() + index),
            customer: String(row.customer || ''),
            booking: String(row.booking || row.reference || ''), // Handle both old and new field names
            file: String(row.file || ''),
            etaFinalPod: String(row.etaFinalPod || ''),
            bond: String(row.bond || ''),
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
            delivered: convertToDropdownValue(row.delivered),
            returned: convertToDropdownValue(row.returned),
            deliveryDate: String(row.deliveryDate || ''),
            notes: String(row.notes || '')
          }));
          setImportData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'import tracking records');
        } else if (dataType === 'all-files') {
          const importedRecords: AllFilesRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
            id: String(row.id || Date.now().toString() + index),
            file: String(row.file || 'ES'),
            number: String(row.number || ''),
            customer: String(row.customer || ''),
            originPort: String(row.originPort || ''),
            originState: String(row.originState || ''),
            destinationPort: String(row.destinationPort || ''),
            destinationCountry: String(row.destinationCountry || ''),
            container20: String(row.container20 || ''),
            container40: String(row.container40 || ''),
            roro: String(row.roro || ''),
            lcl: String(row.lcl || ''),
            air: String(row.air || ''),
            truck: String(row.truck || ''),
            ssl: String(row.ssl || ''),
            nvo: String(row.nvo || ''),
            comments: String(row.comments || ''),
            salesContact: String(row.salesContact || '')
          }));
          setAllFilesData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'all files records');
        } else if (dataType === 'domestic-trucking') {
          const importedRecords: DomesticTruckingRecord[] = jsonData.map(
            (row: Record<string, unknown>, index: number) => ({
            id: String(row.id || Date.now().toString() + index),
            customer: String(row.customer || ''),
            file: String(row.file || ''),
            woSent: Boolean(row.woSent),
            insurance: Boolean(row.insurance),
            pickDate: String(row.pickDate || ''),
            delivered: String(row.delivered || ''),
            paymentReceived: Boolean(row.paymentReceived),
            paymentMade: Boolean(row.paymentMade),
            notes: String(row.notes || '')
          }));
          setDomesticTruckingData(importedRecords);
          console.log('Successfully imported', importedRecords.length, 'domestic trucking records');
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
