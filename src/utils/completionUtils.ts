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
    record.titlesDispatched === "Completed" &&
    record.validatedFwd &&
    record.titlesReturned === "Completed" &&
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
  // Key completion criteria for import records
  return !!(
    record.customer &&
    record.file &&
    record.bond &&
    record.poa &&
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
    record.delivered === "Yes"
  );
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
