
export interface DomesticTruckingRecord {
  id: string;
  customer: string;
  file: string;
  woSent: boolean;
  insurance: boolean;
  pickDate: string;
  pickDateStatus?: string;
  delivered: string;
  deliveredStatus?: string;
  paymentReceived: boolean;
  paymentMade: boolean;
  notes: string;
  archived?: boolean;
  userId?: string;
}
