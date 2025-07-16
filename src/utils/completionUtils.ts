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
  // Key completion criteria for import records
  console.log('Checking import record completion for:', record.customer, record.file);
  console.log('Bond:', record.bond, 'Bond !== Pending:', record.bond !== 'Pending');
  console.log('POA:', record.poa, 'POA === Yes:', record.poa === 'Yes');
  console.log('ISF:', record.isf, 'ISF === Yes:', record.isf === 'Yes');
  console.log('Packing List:', record.packingListCommercialInvoice, 'Packing List === Yes:', record.packingListCommercialInvoice === 'Yes');
  console.log('Bill of Lading:', record.billOfLading, 'Bill of Lading === Yes:', record.billOfLading === 'Yes');
  console.log('Arrival Notice:', record.arrivalNotice, 'Arrival Notice === Yes:', record.arrivalNotice === 'Yes');
  console.log('ISF Filed:', record.isfFiled, 'ISF Filed === Yes:', record.isfFiled === 'Yes');
  console.log('Entry Filed:', record.entryFiled, 'Entry Filed === Yes:', record.entryFiled === 'Yes');
  console.log('BL Release:', record.blRelease, 'BL Release === Yes:', record.blRelease === 'Yes');
  console.log('Customs Release:', record.customsRelease, 'Customs Release === Yes:', record.customsRelease === 'Yes');
  console.log('Invoice Sent:', record.invoiceSent, 'Invoice Sent === Yes:', record.invoiceSent === 'Yes');
  console.log('Payment Received:', record.paymentReceived, 'Payment Received === Yes:', record.paymentReceived === 'Yes');
  console.log('Work Order Setup:', record.workOrderSetup, 'Work Order Setup === Yes:', record.workOrderSetup === 'Yes');
  console.log('Return Date:', record.returnDate, 'Return Date !== "":', record.returnDate !== "");
  console.log('Return Date Status:', record.returnDateStatus, 'Return Date Status === green:', record.returnDateStatus === 'green');
  console.log('Delivery Date Status:', record.deliveryDateStatus, 'Delivery Date Status === green:', record.deliveryDateStatus === 'green');
  
  const isComplete = !!(
    record.customer &&
    record.file &&
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
    record.returnDate !== "" &&
    record.returnDateStatus === 'green' &&
    record.deliveryDateStatus === 'green'
  );
  
  console.log('Is complete:', isComplete);
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
