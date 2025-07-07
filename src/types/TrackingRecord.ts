
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
  docsSent: string | boolean;
  docsReceived: string | boolean;
  aesMblVgmSent: string | boolean;
  docCutoffDate: string;
  titlesDispatched: string;
  validatedFwd: string | boolean;
  titlesReturned: string;
  sslDraftInvRec: string | boolean;
  draftInvApproved: string | boolean;
  transphereInvSent: string | boolean;
  paymentRec: string | boolean;
  sslPaid: string | boolean;
  insured: string | boolean;
  released: string | boolean;
  docsSentToCustomer: boolean;
  notes: string;
  archived?: boolean;
  userId?: string;
}
