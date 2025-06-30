
import { addDays, format } from 'date-fns';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

export const generateSampleExportData = (): Omit<TrackingRecord, 'id'>[] => {
  const today = new Date();
  
  return [
    // Completed record example
    {
      customer: "ABC Manufacturing",
      ref: "REF-2024-001",
      file: "ES0025",
      workOrder: "WO-2024-001",
      dropDone: "Yes",
      dropDate: format(addDays(today, -5), 'yyyy-MM-dd'),
      returnNeeded: "Yes",
      returnDate: format(addDays(today, -3), 'yyyy-MM-dd'),
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: format(addDays(today, -7), 'yyyy-MM-dd'),
      titlesDispatched: "Yes",
      validatedFwd: true,
      titlesReturned: "Yes",
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: true,
      paymentRec: true,
      sslPaid: true,
      insured: true,
      released: true,
      docsSentToCustomer: true,
      notes: "Completed shipment to Germany"
    },
    // Partial record
    {
      customer: "XYZ Corp",
      ref: "REF-2024-002",
      file: "ES0026",
      workOrder: "WO-2024-002",
      dropDone: "No",
      dropDate: "",
      returnNeeded: "Yes",
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      titlesDispatched: "No",
      validatedFwd: false,
      titlesReturned: "No",
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Pending documentation"
    },
    // Future record
    {
      customer: "Global Traders Ltd",
      ref: "REF-2024-003",
      file: "ES0027",
      workOrder: "WO-2024-003",
      dropDone: "No",
      dropDate: "",
      returnNeeded: "No",
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: format(addDays(today, 15), 'yyyy-MM-dd'),
      titlesDispatched: "No",
      validatedFwd: false,
      titlesReturned: "No",
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: "Scheduled for next month"
    }
  ];
};

export const generateSampleImportData = (): Omit<ImportTrackingRecord, 'id'>[] => {
  const today = new Date();
  
  return [
    // Completed record
    {
      customer: "Import Solutions Inc",
      booking: "BOOK-2024-001",
      file: "IS0025",
      etaFinalPod: format(addDays(today, -2), 'yyyy-MM-dd'),
      bond: "BOND-2024-001",
      poa: true,
      isf: true,
      packingListCommercialInvoice: true,
      billOfLading: true,
      arrivalNotice: true,
      isfFiled: true,
      entryFiled: true,
      blRelease: true,
      customsRelease: true,
      invoiceSent: true,
      paymentReceived: true,
      workOrderSetup: true,
      delivered: "Yes",
      returned: "No",
      deliveryDate: format(addDays(today, -1), 'yyyy-MM-dd'),
      notes: "Successfully completed import from China"
    },
    // Partial record
    {
      customer: "Tech Imports LLC",
      booking: "BOOK-2024-002",
      file: "IS0026",
      etaFinalPod: format(addDays(today, 5), 'yyyy-MM-dd'),
      bond: "BOND-2024-002",
      poa: true,
      isf: true,
      packingListCommercialInvoice: false,
      billOfLading: false,
      arrivalNotice: false,
      isfFiled: true,
      entryFiled: false,
      blRelease: false,
      customsRelease: false,
      invoiceSent: false,
      paymentReceived: false,
      workOrderSetup: false,
      delivered: "No",
      returned: "No",
      deliveryDate: "",
      notes: "Awaiting documentation"
    },
    // Future record
    {
      customer: "Future Imports Co",
      booking: "BOOK-2024-003",
      file: "IS0027",
      etaFinalPod: format(addDays(today, 20), 'yyyy-MM-dd'),
      bond: "",
      poa: false,
      isf: false,
      packingListCommercialInvoice: false,
      billOfLading: false,
      arrivalNotice: false,
      isfFiled: false,
      entryFiled: false,
      blRelease: false,
      customsRelease: false,
      invoiceSent: false,
      paymentReceived: false,
      workOrderSetup: false,
      delivered: "No",
      returned: "No",
      deliveryDate: "",
      notes: "Scheduled for next month"
    }
  ];
};

export const generateSampleAllFilesData = (): Omit<AllFilesRecord, 'id'>[] => {
  return [
    {
      customer: "ABC Manufacturing",
      file: "ES",
      number: "0025",
      originPort: "Los Angeles",
      originState: "CA",
      destinationPort: "Hamburg",
      destinationCountry: "Germany",
      container20: "2",
      container40: "1",
      roro: "",
      lcl: "",
      air: "",
      truck: "",
      ssl: "Pacific Shipping",
      nvo: "Global Logistics",
      comments: "High priority shipment",
      salesContact: "John Smith"
    },
    {
      customer: "Import Solutions Inc",
      file: "IS",
      number: "0025",
      originPort: "Shanghai",
      originState: "",
      destinationPort: "Long Beach",
      destinationCountry: "USA",
      container20: "",
      container40: "3",
      roro: "",
      lcl: "500",
      air: "",
      truck: "",
      ssl: "China Shipping",
      nvo: "Import Masters",
      comments: "Electronics cargo",
      salesContact: "Sarah Johnson"
    },
    {
      customer: "Domestic Freight Co",
      file: "DT",
      number: "0025",
      originPort: "Chicago",
      originState: "IL",
      destinationPort: "Miami",
      destinationCountry: "USA",
      container20: "",
      container40: "",
      roro: "",
      lcl: "",
      air: "",
      truck: "2",
      ssl: "",
      nvo: "Highway Express",
      comments: "Domestic trucking service",
      salesContact: "Mike Wilson"
    },
    {
      customer: "XYZ Corp",
      file: "ES",
      number: "0026",
      originPort: "New York",
      originState: "NY",
      destinationPort: "Rotterdam",
      destinationCountry: "Netherlands",
      container20: "1",
      container40: "",
      roro: "",
      lcl: "",
      air: "",
      truck: "",
      ssl: "Atlantic Lines",
      nvo: "Euro Logistics",
      comments: "Machinery export",
      salesContact: "John Smith"
    },
    {
      customer: "Tech Imports LLC",
      file: "IS",
      number: "0026",
      originPort: "Tokyo",
      originState: "",
      destinationPort: "Seattle",
      destinationCountry: "USA",
      container20: "",
      container40: "2",
      roro: "",
      lcl: "",
      air: "100",
      truck: "",
      ssl: "Pacific Maritime",
      nvo: "Tech Logistics",
      comments: "Technology imports",
      salesContact: "Sarah Johnson"
    }
  ];
};

export const generateSampleDomesticTruckingData = (): Omit<DomesticTruckingRecord, 'id'>[] => {
  const today = new Date();
  
  return [
    // Completed record
    {
      customer: "Domestic Freight Co",
      file: "DT0025",
      woSent: true,
      insurance: true,
      pickDate: format(addDays(today, -3), 'yyyy-MM-dd'),
      delivered: format(addDays(today, -1), 'yyyy-MM-dd'),
      paymentReceived: true,
      paymentMade: true,
      notes: "Successfully completed domestic delivery"
    },
    // Partial record
    {
      customer: "Regional Transport Inc",
      file: "DT0026",
      woSent: true,
      insurance: true,
      pickDate: format(addDays(today, 1), 'yyyy-MM-dd'),
      delivered: "",
      paymentReceived: false,
      paymentMade: false,
      notes: "Scheduled for pickup tomorrow"
    },
    // Future record
    {
      customer: "Future Logistics LLC",
      file: "DT0027",
      woSent: false,
      insurance: false,
      pickDate: "",
      delivered: "",
      paymentReceived: false,
      paymentMade: false,
      notes: "Planning stage"
    }
  ];
};
