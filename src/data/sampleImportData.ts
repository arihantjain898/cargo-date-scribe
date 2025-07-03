
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const sampleImportData: ImportTrackingRecord[] = [
  {
    id: 'imp-001',
    customer: 'Global Trade Co',
    booking: 'GTI2025001',
    file: 'IMP001',
    bond: 'B12345',
    etaFinalPod: '2025-07-12',
    poa: 'Yes',
    isf: 'Yes',
    packingListCommercialInvoice: 'Yes',
    billOfLading: 'Yes',
    arrivalNotice: 'No',
    isfFiled: 'Yes',
    entryFiled: 'Yes',
    blRelease: 'Yes',
    customsRelease: 'No',
    invoiceSent: 'No',
    paymentReceived: 'No',
    workOrderSetup: 'No',
    delivered: 'Select',
    returned: 'Select',
    deliveryDate: '2025-07-18',
    notes: 'Customs pending',
    archived: false,
    createdAt: new Date().toISOString(),
    userId: 'demo-user'
  }
];
