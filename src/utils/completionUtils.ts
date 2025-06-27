
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const calculateExportCompletion = (record: TrackingRecord): number => {
  const booleanFields = [
    'docsSent', 'docsReceived', 'aesMblVgmSent', 'validatedFwd', 
    'sslDraftInvRec', 'draftInvApproved', 'transphereInvSent', 
    'paymentRec', 'sslPaid', 'insured', 'released', 'docsSentToCustomer'
  ];
  
  const stringFields = ['dropDone', 'returnNeeded', 'titlesDispatched', 'titlesReturned'];
  
  let completed = 0;
  let total = booleanFields.length + stringFields.length;
  
  booleanFields.forEach(field => {
    if (record[field as keyof TrackingRecord]) completed++;
  });
  
  stringFields.forEach(field => {
    const value = record[field as keyof TrackingRecord] as string;
    if (value === 'Yes' || value === 'N/A') completed++;
  });
  
  return Math.round((completed / total) * 100);
};

export const calculateImportCompletion = (record: ImportTrackingRecord): number => {
  const booleanFields = [
    'poa', 'isf', 'packingListCommercialInvoice', 'billOfLading', 
    'arrivalNotice', 'isfFiled', 'entryFiled', 'blRelease', 
    'customsRelease', 'invoiceSent', 'paymentReceived', 'workOrderSetup'
  ];
  
  const stringFields = ['delivered', 'returned'];
  
  let completed = 0;
  let total = booleanFields.length + stringFields.length;
  
  booleanFields.forEach(field => {
    if (record[field as keyof ImportTrackingRecord]) completed++;
  });
  
  stringFields.forEach(field => {
    const value = record[field as keyof ImportTrackingRecord] as string;
    if (value === 'Yes' || value === 'N/A') completed++;
  });
  
  // Check if booking field has value
  if (record.booking) completed++;
  total++;
  
  return Math.round((completed / total) * 100);
};

export const calculateAllFilesCompletion = (record: AllFilesRecord): number => {
  const fields = [
    'customer', 'file', 'number', 'originPort', 'originState',
    'destinationPort', 'destinationCountry', 'ssl', 'nvo', 'salesContact'
  ];
  
  let completed = 0;
  
  fields.forEach(field => {
    if (record[field as keyof AllFilesRecord]) completed++;
  });
  
  // Check if at least one transport type is filled
  const transportTypes = ['container20', 'container40', 'roro', 'lcl', 'air', 'truck'];
  const hasTransport = transportTypes.some(type => record[type as keyof AllFilesRecord]);
  if (hasTransport) completed++;
  
  return Math.round((completed / (fields.length + 1)) * 100);
};

export const calculateDomesticTruckingCompletion = (record: DomesticTruckingRecord): number => {
  const booleanFields = ['woSent', 'insurance', 'paymentReceived', 'paymentMade'];
  const stringFields = ['customer', 'file', 'pickDate', 'delivered'];
  
  let completed = 0;
  let total = booleanFields.length + stringFields.length;
  
  booleanFields.forEach(field => {
    if (record[field as keyof DomesticTruckingRecord]) completed++;
  });
  
  stringFields.forEach(field => {
    if (record[field as keyof DomesticTruckingRecord]) completed++;
  });
  
  return Math.round((completed / total) * 100);
};
