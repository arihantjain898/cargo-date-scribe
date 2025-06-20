
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';

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

export const isAllFilesRecordComplete = (record: AllFilesRecord): boolean => {
  // Check if essential fields are filled
  return Boolean(record.file.trim()) &&
         Boolean(record.number.trim()) &&
         Boolean(record.customer.trim()) &&
         Boolean(record.originPort.trim()) &&
         Boolean(record.destinationPort.trim()) &&
         Boolean(record.destinationCountry.trim()) &&
         // At least one transport type should be filled
         (Boolean(record.container20.trim()) ||
          Boolean(record.container40.trim()) ||
          Boolean(record.roro.trim()) ||
          Boolean(record.lcl.trim()) ||
          Boolean(record.air.trim()) ||
          Boolean(record.truck.trim()));
};
