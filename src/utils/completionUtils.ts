// completionUtils.tsx
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const isExportRecordComplete = (record: TrackingRecord): boolean => {
  // Key completion criteria for export records
  return !!(
    record.customer &&
    record.file &&
    record.docsSent &&
    record.docsReceived &&
    record.aesMblVgmSent &&
    record.titlesDispatched === "Yes" &&
    record.validatedFwd &&
    record.titlesReturned === "Yes" &&
    record.sslDraftInvRec &&
    record.draftInvApproved &&
    record.transphereInvSent &&
    record.paymentRec &&
    record.sslPaid &&
    record.insured &&
    record.released &&
    record.docsSentToCustomer
  );
};

export const isImportRecordComplete = (record: ImportTrackingRecord): boolean => {
  // Key completion criteria for import records (customer, file, booking no longer checked)
  console.log("--- Checking completion for record ID:", record.id); // Keep for debugging
  console.log("Bond:", record.bond, " (Not Pending:", record.bond !== 'Pending' , ")"); // Keep for debugging
  console.log("POA:", record.poa); // Keep for debugging
  // ... (other console.logs if you had them)

  const isComplete = !!(
    // record.customer && // Removed as per request
    // record.file &&     // Removed as per request
    // record.booking && // This was never explicitly checked in your original code, but implicitly part of "record" if used for completeness. Explicitly not needed now.
    record.bond &&
    record.bond !== 'Pending' &&
    record.poa === 'Yes' &&
    record.isf === 'Yes' &&
    record.packingListCommercialInvoice === 'Yes' &&
    record.billOfLading === 'Yes' &&
    record.arrivalNotice === 'Yes' &&
    record.isfFiled === 'Yes' &&
    record.entryFiled === 'Yes' &&
    record.blRelease === 'Yes' &&
    record.customsRelease === 'Yes' &&
    record.invoiceSent === 'Yes' &&
    record.paymentReceived === 'Yes' &&
    record.workOrderSetup === 'Yes' &&
    record.returnDateStatus === 'green' &&
    record.deliveryDateStatus === 'green'
  );
  console.log("FINAL isComplete result:", isComplete, "\n---"); // Keep for debugging
  return isComplete;
};

export const isDomesticTruckingRecordComplete = (record: DomesticTruckingRecord): boolean => {
  // Key completion criteria for domestic trucking records
  return !!(
    record.customer &&
    record.file &&
    record.woSent &&
    record.insurance &&
    record.pickDate &&
    record.delivered &&
    record.paymentReceived &&
    record.paymentMade
  );
};

export const getCompletionRowClasses = (isComplete: boolean, baseClasses: string = ''): string => {
  if (isComplete) {
    return `${baseClasses} border-2 border-green-500 bg-green-50 font-bold`;
  }
  return baseClasses;
};
