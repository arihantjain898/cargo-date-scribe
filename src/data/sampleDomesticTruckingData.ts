
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const generateSampleDomesticTruckingData = (): DomesticTruckingRecord[] => [
  {
    id: 'dt-001',
    customer: 'Sunrise Commerce',
    file: 'DT0003',
    woSent: true,
    insurance: true,
    pickDate: '2025-07-05',
    delivered: '2025-07-15',
    paymentReceived: true,
    paymentMade: true,
    notes: 'Domestic freight complete',
    archived: false,
    userId: 'demo-user'
  },
  {
    id: 'dt-002',
    customer: 'Global Trade Co',
    file: 'DT0001',
    woSent: true,
    insurance: false,
    pickDate: '2025-07-10',
    delivered: '2025-07-20',
    paymentReceived: false,
    paymentMade: true,
    notes: 'Pending payment',
    archived: false,
    userId: 'demo-user'
  },
  {
    id: 'dt-003',
    customer: 'Continental Express',
    file: 'DT0002',
    woSent: false,
    insurance: true,
    pickDate: '2025-07-15',
    delivered: '',
    paymentReceived: false,
    paymentMade: false,
    notes: 'In transit',
    archived: false,
    userId: 'demo-user'
  }
];
