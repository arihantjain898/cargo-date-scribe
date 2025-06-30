
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';

export const sampleImportData: ImportTrackingRecord[] = [
  {
    id: 'imp-001',
    customer: 'Global Trade Co',
    booking: 'GTI2025001',
    file: 'IMP001',
    bond: 'B12345',
    etaFinalPod: '2025-07-12',
    deliveryDate: '2025-07-18',
    entryFiled: true,
    customsRelease: false,
    notes: 'Customs pending',
    archived: false,
    userId: 'demo-user'
  },
  {
    id: 'imp-002',
    customer: 'Continental Express',
    booking: 'CE2025002',
    file: 'IMP002',
    bond: 'B67890',
    etaFinalPod: '2025-07-20',
    deliveryDate: '2025-07-25',
    entryFiled: true,
    customsRelease: true,
    notes: 'Ready for pickup',
    archived: false,
    userId: 'demo-user'
  }
];
