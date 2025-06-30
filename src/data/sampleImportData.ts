
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const sampleImportData: ImportTrackingRecord[] = [
  {
    id: 'imp-001',
    customer: 'Global Trade Co',
    booking: 'GTI2025001',
    file: 'IMP001',
    bond: 'B12345',
    etaFinalPod: '2025-07-12',
    poa: true,
    isf: true,
    packingListCommercialInvoice: true,
    billOfLading: true,
    arrivalNotice: false,
    isfFiled: true,
    entryFiled: true,
    blRelease: true,
    customsRelease: false,
    invoiceSent: false,
    paymentReceived: false,
    workOrderSetup: false,
    delivered: '',
    returned: '',
    deliveryDate: '2025-07-18',
    notes: 'Customs pending',
    archived: false,
    userId: 'demo-user'
  }
];
