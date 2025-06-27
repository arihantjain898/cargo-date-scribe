
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

const customers = [
  'ABC Manufacturing', 'XYZ Imports', 'Global Trade Co', 'Pacific Logistics',
  'Atlantic Shipping', 'Continental Express', 'Metro Freight', 'Ocean View Trading',
  'Mountain Peak Exports', 'Valley Industries', 'Sunrise Commerce', 'Sunset Logistics',
  'Northern Winds', 'Southern Cross', 'Eastern Gateway', 'Western Frontier'
];

const ports = [
  'Los Angeles', 'Long Beach', 'New York', 'Savannah', 'Seattle', 'Oakland',
  'Houston', 'Charleston', 'Norfolk', 'Miami', 'Tacoma', 'Baltimore'
];

const countries = [
  'China', 'Japan', 'South Korea', 'Germany', 'United Kingdom', 'France',
  'Italy', 'Netherlands', 'Belgium', 'Canada', 'Mexico', 'Brazil'
];

const states = [
  'CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA'
];

const getRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomBoolean = (): boolean => Math.random() > 0.5;

const getRandomNumber = (min: number, max: number): string => {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

export const generateSampleExportData = (): Omit<TrackingRecord, 'id'>[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  return Array.from({ length: 25 }, (_, i) => ({
    customer: getRandomElement(customers),
    ref: `REF${String(i + 1).padStart(4, '0')}`,
    file: `EX${String(i + 1).padStart(4, '0')}`,
    workOrder: `WO${String(i + 1).padStart(5, '0')}`,
    dropDone: getRandomElement(['Yes', 'No', 'Pending']),
    dropDate: getRandomDate(startOfMonth, endOfNextMonth),
    returnNeeded: getRandomElement(['Yes', 'No', 'TBD']),
    returnDate: getRandomDate(startOfMonth, endOfNextMonth),
    docsSent: getRandomBoolean(),
    docsReceived: getRandomBoolean(),
    aesMblVgmSent: getRandomBoolean(),
    docCutoffDate: getRandomDate(startOfMonth, endOfNextMonth),
    titlesDispatched: getRandomElement(['Yes', 'No', 'Pending']),
    validatedFwd: getRandomBoolean(),
    titlesReturned: getRandomElement(['Yes', 'No', 'Pending']),
    sslDraftInvRec: getRandomBoolean(),
    draftInvApproved: getRandomBoolean(),
    transphereInvSent: getRandomBoolean(),
    paymentRec: getRandomBoolean(),
    sslPaid: getRandomBoolean(),
    insured: getRandomBoolean(),
    released: getRandomBoolean(),
    docsSentToCustomer: getRandomBoolean(),
    notes: `Sample notes for export record ${i + 1}`
  }));
};

export const generateSampleImportData = (): Omit<ImportTrackingRecord, 'id'>[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  return Array.from({ length: 20 }, (_, i) => ({
    customer: getRandomElement(customers),
    booking: `BKG${String(i + 1).padStart(6, '0')}`,
    file: `IM${String(i + 1).padStart(4, '0')}`,
    etaFinalPod: getRandomDate(startOfMonth, endOfNextMonth),
    bond: `BD${String(i + 1).padStart(5, '0')}`,
    poa: getRandomBoolean(),
    isf: getRandomBoolean(),
    packingListCommercialInvoice: getRandomBoolean(),
    billOfLading: getRandomBoolean(),
    arrivalNotice: getRandomBoolean(),
    isfFiled: getRandomBoolean(),
    entryFiled: getRandomBoolean(),
    blRelease: getRandomBoolean(),
    customsRelease: getRandomBoolean(),
    invoiceSent: getRandomBoolean(),
    paymentReceived: getRandomBoolean(),
    workOrderSetup: getRandomBoolean(),
    delivered: getRandomElement(['Yes', 'No', 'Pending']),
    returned: getRandomElement(['Yes', 'No', 'N/A']),
    deliveryDate: getRandomDate(startOfMonth, endOfNextMonth),
    notes: `Sample import notes ${i + 1}`
  }));
};

export const generateSampleAllFilesData = (): Omit<AllFilesRecord, 'id'>[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    file: getRandomElement(['ES', 'IS', 'DT', 'LC']),
    number: String(i + 1).padStart(4, '0'),
    customer: getRandomElement(customers),
    originPort: getRandomElement(ports),
    originState: getRandomElement(states),
    destinationPort: getRandomElement(ports),
    destinationCountry: getRandomElement(countries),
    container20: getRandomNumber(0, 5),
    container40: getRandomNumber(0, 8),
    roro: getRandomNumber(0, 3),
    lcl: getRandomNumber(0, 2),
    air: getRandomNumber(0, 1),
    truck: getRandomNumber(0, 4),
    ssl: getRandomElement(['SSL1', 'SSL2', 'SSL3', '']),
    nvo: getRandomElement(['NVO-A', 'NVO-B', 'NVO-C', '']),
    comments: `Sample comment for file ${i + 1}`,
    salesContact: getRandomElement(['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson'])
  }));
};

export const generateSampleDomesticTruckingData = (): Omit<DomesticTruckingRecord, 'id'>[] => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  return Array.from({ length: 15 }, (_, i) => ({
    customer: getRandomElement(customers),
    file: `DT${String(i + 1).padStart(4, '0')}`,
    woSent: getRandomBoolean(),
    insurance: getRandomBoolean(),
    pickDate: getRandomDate(startOfMonth, endOfNextMonth),
    delivered: getRandomDate(startOfMonth, endOfNextMonth),
    paymentReceived: getRandomBoolean(),
    paymentMade: getRandomBoolean(),
    notes: `Domestic trucking notes ${i + 1}`
  }));
};
