import { AllFilesRecord } from '../types/AllFilesRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { TrackingRecord } from '../types/TrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const generateAllFilesSampleData = (): Omit<AllFilesRecord, 'id'>[] => {
  const customers = ['ABC Corp', 'XYZ Ltd', 'Global Traders', 'Marine Solutions', 'Export Masters', 'Import Kings', 'Logistics Pro', 'Freight Forward', 'Ocean Express', 'Continental Cargo'];
  const originPorts = ['Los Angeles', 'Long Beach', 'Newark', 'Savannah', 'Houston', 'Seattle', 'Oakland', 'Miami', 'Charleston', 'Norfolk'];
  const destinationPorts = ['Hamburg', 'Rotterdam', 'Singapore', 'Hong Kong', 'Dubai', 'Tokyo', 'Busan', 'Shanghai', 'Felixstowe', 'Antwerp'];
  const fileTypes = ['EA', 'ES', 'IS', 'IA', 'DT', 'ET'];
  
  return Array.from({ length: 30 }, (_, index) => {
    const fileType = fileTypes[Math.floor(index / 5) % fileTypes.length];
    const baseNumber = String(1000 + index).padStart(4, '0');
    
    return {
      customer: customers[index % customers.length],
      file: fileType,
      number: baseNumber,
      originPort: originPorts[index % originPorts.length],
      originState: ['CA', 'NJ', 'GA', 'TX', 'WA', 'FL', 'SC', 'VA'][index % 8],
      destinationPort: destinationPorts[index % destinationPorts.length],
      destinationCountry: ['Germany', 'Netherlands', 'Singapore', 'Hong Kong', 'UAE', 'Japan', 'South Korea', 'China', 'UK', 'Belgium'][index % 10],
      container20: Math.random() > 0.7 ? String(Math.floor(Math.random() * 5) + 1) : '',
      container40: Math.random() > 0.7 ? String(Math.floor(Math.random() * 3) + 1) : '',
      roro: Math.random() > 0.8 ? String(Math.floor(Math.random() * 2) + 1) : '',
      lcl: Math.random() > 0.8 ? String(Math.floor(Math.random() * 500) + 100) + ' CBM' : '',
      air: Math.random() > 0.9 ? String(Math.floor(Math.random() * 1000) + 100) + ' KG' : '',
      truck: Math.random() > 0.8 ? String(Math.floor(Math.random() * 3) + 1) : '',
      ssl: ['SSL Maritime', 'Ocean Freight Co', 'Marine Transport', 'Global Shipping'][index % 4],
      nvo: ['NVO Partners', 'Freight Solutions', 'Logistics Network', 'Cargo Express'][index % 4],
      comments: index % 3 === 0 ? `Special handling required for shipment ${baseNumber}` : '',
      salesContact: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Anderson', 'David Brown'][index % 5],
      archived: false
    };
  });
};

export const generateImportRecords = (count: number = 10, userId: string): Omit<ImportTrackingRecord, 'id'>[] => {
  return Array.from({ length: count }, (_, index) => ({
    customer: `Customer ${index + 1}`,
    booking: `BK${String(index + 1).padStart(4, '0')}`,
    bookingUrl: Math.random() > 0.5 ? `https://booking-system.com/track/${index + 1}` : '',
    file: `IS${index + 1}`,
    etaFinalPod: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bond: Math.random() > 0.5 ? 'Continuous' : 'Single Entry',
    poa: 'Select',
    isf: 'Select', 
    packingListCommercialInvoice: 'Select',
    billOfLading: 'Select',
    arrivalNotice: 'Select',
    isfFiled: 'Select',
    entryFiled: 'Select',
    blRelease: 'Select',
    customsRelease: 'Select',
    invoiceSent: 'Select',
    paymentReceived: 'Select',
    workOrderSetup: 'Select',
    delivered: 'Select',
    returned: 'Select',
    deliveryDate: Math.random() > 0.5 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
    notes: Math.random() > 0.7 ? `Note for record ${index + 1}` : '',
    archived: false,
    createdAt: new Date().toISOString(),
    userId
  }));
};

export const generateExportSampleData = (): Omit<TrackingRecord, 'id'>[] => {
  const customers = ['Export Masters', 'Global Traders', 'Marine Solutions', 'ABC Corp', 'XYZ Ltd', 'Freight Forward', 'Ocean Express', 'Continental Cargo', 'Trade Solutions', 'Cargo Kings'];
  
  return Array.from({ length: 10 }, (_, index) => {
    const baseNumber = String(1001 + index * 3).padStart(4, '0'); // Use numbers that match some all_files records
    const randomBool = () => Math.random() > 0.5;
    
    return {
      customer: customers[index],
      ref: `REF${baseNumber}`,
      file: `ES${baseNumber}`,
      workOrder: `WO${baseNumber}`,
      dropDone: ['No', 'Yes', 'Pending'][index % 3],
      dropDate: index % 3 === 0 ? new Date(Date.now() - (index * 3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
      returnNeeded: ['No', 'Yes'][index % 2],
      returnDate: index % 4 === 0 ? new Date(Date.now() + (index * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
      docsSent: randomBool(),
      docsReceived: randomBool(),
      aesMblVgmSent: randomBool(),
      docCutoffDate: new Date(Date.now() + (index * 4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      titlesDispatched: ['N/A', 'Yes', 'Pending'][index % 3],
      validatedFwd: randomBool(),
      titlesReturned: ['N/A', 'Yes', 'Pending'][index % 3],
      sslDraftInvRec: randomBool(),
      draftInvApproved: randomBool(),
      transphereInvSent: randomBool(),
      paymentRec: randomBool(),
      sslPaid: randomBool(),
      insured: randomBool(),
      released: randomBool(),
      docsSentToCustomer: randomBool(),
      notes: index % 4 === 0 ? `Export notes for file ES${baseNumber}` : '',
      archived: false
    };
  });
};

export const generateDomesticSampleData = (): Omit<DomesticTruckingRecord, 'id'>[] => {
  const customers = ['Logistics Pro', 'Domestic Freight', 'Trucking Solutions', 'ABC Corp', 'XYZ Ltd', 'Local Transport', 'Highway Express', 'Continental Cargo', 'Regional Movers', 'Ground Logistics'];
  
  return Array.from({ length: 10 }, (_, index) => {
    const baseNumber = String(1002 + index * 3).padStart(4, '0'); // Use numbers that match some all_files records
    const randomBool = () => Math.random() > 0.5;
    
    return {
      customer: customers[index],
      file: `DT${baseNumber}`,
      woSent: randomBool(),
      insurance: randomBool(),
      pickDate: index % 3 === 0 ? new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : '',
      delivered: ['No', 'Yes', 'In Transit'][index % 3],
      paymentReceived: randomBool(),
      paymentMade: randomBool(),
      notes: index % 4 === 0 ? `Domestic trucking notes for file DT${baseNumber}` : '',
      archived: false
    };
  });
};
