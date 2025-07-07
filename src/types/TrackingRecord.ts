
export interface TrackingRecord {
  id: string;
  customer: string;
  ref: string;
  file: string;
  workOrder: string;
  dropDate: string;
  dropDateStatus?: 'gray' | 'yellow' | 'green' | 'red';
  returnDate: string;
  returnDateStatus?: 'gray' | 'yellow' | 'green' | 'red';
  dropDone: string;
  returnNeeded: string;
  docsSent: boolean;
  docsReceived: boolean;
  aesMblVgmSent: boolean;
  docCutoffDate: string;
  titlesDispatched: string;
  validatedFwd: boolean;
  titlesReturned: string;
  sslDraftInvRec: boolean;
  draftInvApproved: boolean;
  transphereInvSent: boolean;
  paymentRec: boolean;
  sslPaid: boolean;
  insured: boolean;
  released: boolean;
  docsSentToCustomer: boolean;
  notes: string;
  archived?: boolean;
  userId?: string;
}
