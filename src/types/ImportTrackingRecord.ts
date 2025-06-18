
export interface ImportTrackingRecord {
  id: string;
  customer: string;
  ref: string;
  file: string;
  workOrder: string;
  bookingConfirmed: boolean;
  bookingDate: string;
  docsReceived: boolean;
  customsCleared: boolean;
  containerReleased: boolean;
  deliveryScheduled: boolean;
  deliveryDate: string;
  etaFinalProd: string;
  cargoInspected: boolean;
  invoiceSent: boolean;
  paymentReceived: boolean;
  docsForwarded: boolean;
  fileComplete: boolean;
  notes: string;
}
