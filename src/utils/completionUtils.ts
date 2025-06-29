
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const isExportRecordComplete = (record: TrackingRecord): boolean => {
  // Check if all critical fields are completed
  return !!(
    record.customer &&
    record.ref &&
    record.file &&
    record.dropDone === 'Yes' &&
    record.dropDate &&
    record.docsSent &&
    record.docsReceived &&
    record.aesMblVgmSent &&
    record.docCutoffDate &&
    record.released &&
    record.docsSentToCustomer
  );
};

export const isImportRecordComplete = (record: ImportTrackingRecord): boolean => {
  // Check if all critical fields are completed
  return !!(
    record.customer &&
    record.booking &&
    record.file &&
    record.etaFinalPod &&
    record.poa &&
    record.isf &&
    record.packingListCommercialInvoice &&
    record.billOfLading &&
    record.isfFiled &&
    record.entryFiled &&
    record.blRelease &&
    record.customsRelease &&
    record.delivered === 'Yes'
  );
};

export const isDomesticTruckingRecordComplete = (record: DomesticTruckingRecord): boolean => {
  // Check if all critical fields are completed
  return !!(
    record.customer &&
    record.file &&
    record.woSent &&
    record.pickDate &&
    record.delivered &&
    record.paymentReceived &&
    record.paymentMade
  );
};

export const getRowCompletionClasses = (isComplete: boolean): string => {
  return isComplete 
    ? 'ring-2 ring-green-500 bg-green-50 font-semibold' 
    : '';
};
