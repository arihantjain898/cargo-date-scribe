
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const calculateTrackingCompletion = (record: TrackingRecord): number => {
  const totalFields = 13; // Number of boolean fields to check
  let completedFields = 0;

  // Check all boolean fields
  if (record.dropDone === 'Yes') completedFields++;
  if (record.returnNeeded === 'Yes' || record.returnNeeded === 'N/A') completedFields++;
  if (record.docsSent) completedFields++;
  if (record.docsReceived) completedFields++;
  if (record.aesMblVgmSent) completedFields++;
  if (record.titlesDispatched === 'Yes' || record.titlesDispatched === 'N/A') completedFields++;
  if (record.validatedFwd) completedFields++;
  if (record.titlesReturned === 'Yes' || record.titlesReturned === 'N/A') completedFields++;
  if (record.sslDraftInvRec) completedFields++;
  if (record.draftInvApproved) completedFields++;
  if (record.transphereInvSent) completedFields++;
  if (record.paymentRec) completedFields++;
  if (record.sslPaid) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

export const calculateImportCompletion = (record: ImportTrackingRecord): number => {
  const totalFields = 17; // Number of boolean fields to check
  let completedFields = 0;

  // Check all boolean fields
  if (record.poa) completedFields++;
  if (record.isf) completedFields++;
  if (record.packingListCommercialInvoice) completedFields++;
  if (record.billOfLading) completedFields++;
  if (record.arrivalNotice) completedFields++;
  if (record.isfFiled) completedFields++;
  if (record.entryFiled) completedFields++;
  if (record.blRelease) completedFields++;
  if (record.customsRelease) completedFields++;
  if (record.invoiceSent) completedFields++;
  if (record.paymentReceived) completedFields++;
  if (record.workOrderSetup) completedFields++;
  if (record.delivered === 'Yes') completedFields++;
  if (record.returned === 'Yes') completedFields++;
  
  // Check if important text fields are filled
  if (record.booking.trim()) completedFields++;
  if (record.file.trim()) completedFields++;
  if (record.etaFinalPod.trim()) completedFields++;

  return Math.round((completedFields / totalFields) * 100);
};

export const getCompletionColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600 bg-green-100';
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
  if (percentage >= 40) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export const getCompletionLabel = (percentage: number): string => {
  if (percentage >= 80) return 'Complete';
  if (percentage >= 60) return 'In Progress';
  if (percentage >= 40) return 'Started';
  return 'Not Started';
};
