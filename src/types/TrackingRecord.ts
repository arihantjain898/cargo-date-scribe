
export interface TrackingRecord {
  id: string;
  customer: string;
  ref: string;
  file: string;
  workOrder: string;
  dropDone: string;
  dropDate: string;
  returnNeeded: string;
  returnDate: string;
  docsSent: boolean;
  docsReceived: boolean;
  aesMblVgmSent: boolean;
  docCutoffDate: string;
  titlesDispatched: string;
  validatedFwd: boolean | string; // Now supports N/A as string
  titlesReturned: string;
  sslDraftInvRec: boolean;
  draftInvApproved: boolean;
  transphereInvSent: boolean;
  paymentRec: boolean;
  sslPaid: boolean;
  insured: boolean | string; // Now supports N/A as string
  released: boolean;
  docsSentToCustomer: boolean;
  notes: string;
  archived?: boolean;
  userId?: string;
}
