
export interface ImportTrackingRecord {
  id: string;
  customer: string;
  booking: string;
  bookingUrl?: string; // Optional URL for the booking number
  file: string;
  etaFinalPod: string;
  bond: string;
  poa: boolean | null; // Allow null for unset state
  isf: boolean | null; // Allow null for unset state
  packingListCommercialInvoice: boolean | null; // Allow null for unset state
  billOfLading: boolean | null; // Allow null for unset state
  arrivalNotice: boolean | null; // Allow null for unset state
  isfFiled: boolean | null; // Allow null for unset state
  entryFiled: boolean | null; // Allow null for unset state
  blRelease: boolean | null; // Allow null for unset state
  customsRelease: boolean | null; // Allow null for unset state
  invoiceSent: boolean | null; // Allow null for unset state
  paymentReceived: boolean | null; // Allow null for unset state
  workOrderSetup: boolean | null; // Allow null for unset state
  delivered: string;
  returned: string;
  deliveryDate: string;
  notes: string;
  archived: boolean;
  createdAt: string;
  userId: string;
}
