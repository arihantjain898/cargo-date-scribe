
export interface ImportTrackingRecord {
  id: string;
  customer: string;
  booking: string;
  bookingUrl?: string; // Optional URL for the booking number
  file: string;
  etaFinalPod: string;
  bond: string;
  poa: string; // Changed from boolean to string to support "Select", "Pending", "Yes", "No"
  isf: string; // Changed from boolean to string
  packingListCommercialInvoice: string; // Changed from boolean to string
  billOfLading: string; // Changed from boolean to string
  arrivalNotice: string; // Changed from boolean to string
  isfFiled: string; // Changed from boolean to string
  entryFiled: string; // Changed from boolean to string
  blRelease: string; // Changed from boolean to string
  customsRelease: string; // Changed from boolean to string
  invoiceSent: string; // Changed from boolean to string
  paymentReceived: string; // Changed from boolean to string
  workOrderSetup: string; // Changed from boolean to string
  delivered: string;
  returned: string;
  deliveryDate: string;
  notes: string;
  archived: boolean;
  createdAt: string;
  userId: string;
}
