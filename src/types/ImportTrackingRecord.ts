
export interface ImportTrackingRecord {
  id: string;
  customer: string;
  booking: string;
  file: string;
  etaFinalPod: string;
  bond: string;
  poa: boolean;
  isf: boolean;
  packingListCommercialInvoice: boolean;
  billOfLading: boolean;
  arrivalNotice: boolean;
  isfFiled: boolean;
  entryFiled: boolean;
  blRelease: boolean;
  customsRelease: boolean;
  invoiceSent: boolean;
  paymentReceived: boolean;
  workOrderSetup: boolean;
  delivered: string;
  returned: string;
  deliveryDate: string;
  notes: string;
  archived?: boolean;
  userId?: string;
}
