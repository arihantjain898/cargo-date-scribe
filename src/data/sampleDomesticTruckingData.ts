
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const sampleDomesticTruckingData: DomesticTruckingRecord[] = [
  {
    id: '1',
    customer: 'ABC Logistics',
    file: 'DT24001',
    woSent: true,
    insurance: true,
    pickDate: '2024-01-15',
    delivered: '2024-01-20',
    paymentReceived: true,
    paymentMade: true,
    notes: 'Delivery completed successfully',
    archived: false,
    userId: ''
  },
  {
    id: '2',
    customer: 'XYZ Transport',
    file: 'DT24002',
    woSent: true,
    insurance: false,
    pickDate: '2024-01-18',
    delivered: '',
    paymentReceived: false,
    paymentMade: false,
    notes: 'Pending pickup',
    archived: false,
    userId: ''
  },
  {
    id: '3',
    customer: 'Global Freight',
    file: 'DT24003',
    woSent: true,
    insurance: true,
    pickDate: '2024-01-22',
    delivered: '2024-01-25',
    paymentReceived: true,
    paymentMade: true,
    notes: 'Express delivery completed',
    archived: false,
    userId: ''
  }
];
