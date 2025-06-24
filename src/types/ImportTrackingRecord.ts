
export interface ImportTrackingRecord {
  id: string;
  reference: string;
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
  deliveryDate: string;
  notes: string;
}
