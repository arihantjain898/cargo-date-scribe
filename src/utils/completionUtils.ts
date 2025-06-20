
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const isExportRecordComplete = (record: TrackingRecord): boolean => {
  // Check if all boolean fields are true and required text fields are filled
  return record.dropDone &&
         record.docsSent &&
         record.docsReceived &&
         record.aesMblVgmSent &&
         record.titlesDispatched &&
         record.validatedFwd &&
         record.titlesReturned &&
         record.sslDraftInvRec &&
         record.draftInvApproved &&
         record.transphereInvSent &&
         record.paymentRec &&
         record.sslPaid &&
         record.insured &&
         record.released &&
         record.docsSentToCustomer &&
         Boolean(record.customer.trim()) &&
         Boolean(record.ref.trim()) &&
         Boolean(record.file.trim()) &&
         Boolean(record.workOrder.trim());
};

export const isImportRecordComplete = (record: ImportTrackingRecord): boolean => {
  // Check if all boolean fields are true and required text fields are filled
  return record.poa &&
         record.isf &&
         record.packingListCommercialInvoice &&
         record.billOfLading &&
         record.arrivalNotice &&
         record.isfFiled &&
         record.entryFiled &&
         record.blRelease &&
         record.customsRelease &&
         record.invoiceSent &&
         record.paymentReceived &&
         record.workOrderSetup &&
         Boolean(record.reference.trim()) &&
         Boolean(record.file.trim()) &&
         Boolean(record.etaFinalPod.trim()) &&
         Boolean(record.bond.trim());
};

// Remove the All Files completion function since it's not needed anymore
