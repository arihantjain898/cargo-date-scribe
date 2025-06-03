
import React from 'react';

const FreightTracker = () => {
  const data = [
    {
      customer: "ACME Corp",
      ref: "EX91500",
      file: "F-1000",
      workOrder: "WO-2000",
      dropDone: true,
      dropDate: "",
      returnNeeded: true,
      returnDate: "",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-13",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Globex",
      ref: "EX91501",
      file: "F-1001",
      workOrder: "WO-2001",
      dropDone: true,
      dropDate: "",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-14",
      titlesDispatched: false,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Initech",
      ref: "EX91502",
      file: "F-1002",
      workOrder: "WO-2002",
      dropDone: true,
      dropDate: "",
      returnNeeded: false,
      returnDate: "2025-09-03",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-15",
      titlesDispatched: false,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Umbrella",
      ref: "EX91503",
      file: "F-1003",
      workOrder: "WO-2003",
      dropDone: true,
      dropDate: "2025-06-06",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-16",
      titlesDispatched: false,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: true,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Wayne Ent.",
      ref: "EX91504",
      file: "F-1004",
      workOrder: "WO-2004",
      dropDone: true,
      dropDate: "2025-06-07",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-17",
      titlesDispatched: true,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Stark Ind.",
      ref: "EX91505",
      file: "F-1005",
      workOrder: "WO-2005",
      dropDone: true,
      dropDate: "2025-06-08",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-18",
      titlesDispatched: true,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: true,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: true,
      notes: ""
    },
    {
      customer: "Wonka",
      ref: "EX91506",
      file: "F-1006",
      workOrder: "WO-2006",
      dropDone: true,
      dropDate: "",
      returnNeeded: true,
      returnDate: "",
      docsSent: false,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-19",
      titlesDispatched: false,
      validatedFwd: false,
      titlesReturned: true,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: true,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Hooli",
      ref: "EX91507",
      file: "F-1007",
      workOrder: "WO-2007",
      dropDone: true,
      dropDate: "2025-06-10",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-20",
      titlesDispatched: false,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: true,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Cyberdyne",
      ref: "EX91508",
      file: "F-1008",
      workOrder: "WO-2008",
      dropDone: true,
      dropDate: "",
      returnNeeded: true,
      returnDate: "2025-09-09",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-21",
      titlesDispatched: true,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: true,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Tyrell Corp",
      ref: "EX91509",
      file: "F-1009",
      workOrder: "WO-2009",
      dropDone: true,
      dropDate: "2025-06-12",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-22",
      titlesDispatched: false,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    }
  ];

  const renderCheckbox = (value: boolean) => (
    <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-gray-400'}`}>
      {value ? '✅' : '❌'}
    </span>
  );

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Freight Forwarding Tracker</h1>
      
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th colSpan={4} className="border-r border-gray-300 p-2 text-center font-semibold">INFO</th>
              <th colSpan={4} className="border-r border-gray-300 p-2 text-center font-semibold">DROP / RETURN</th>
              <th colSpan={4} className="border-r border-gray-300 p-2 text-center font-semibold">DOCUMENTS</th>
              <th colSpan={3} className="border-r border-gray-300 p-2 text-center font-semibold">TITLES</th>
              <th colSpan={3} className="border-r border-gray-300 p-2 text-center font-semibold">INVOICING</th>
              <th colSpan={2} className="border-r border-gray-300 p-2 text-center font-semibold">PAYMENT</th>
              <th colSpan={2} className="border-r border-gray-300 p-2 text-center font-semibold">FINAL</th>
              <th className="p-2 text-center font-semibold">NOTES</th>
            </tr>
            <tr className="bg-gray-50 border-b border-gray-300 text-xs">
              <th className="border-r border-gray-200 p-2 text-left">Customer</th>
              <th className="border-r border-gray-200 p-2 text-left">REF #</th>
              <th className="border-r border-gray-200 p-2 text-left">File #</th>
              <th className="border-r border-gray-300 p-2 text-left">Work Order #</th>
              <th className="border-r border-gray-200 p-2 text-center">Drop Done ✅</th>
              <th className="border-r border-gray-200 p-2 text-left">Drop Date</th>
              <th className="border-r border-gray-200 p-2 text-center">Return Needed ✅</th>
              <th className="border-r border-gray-300 p-2 text-left">Return Date</th>
              <th className="border-r border-gray-200 p-2 text-center">Docs Sent ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Docs Received ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">AES/MBL/VGM Sent ✅</th>
              <th className="border-r border-gray-300 p-2 text-left">Doc Cutoff Date</th>
              <th className="border-r border-gray-200 p-2 text-center">Titles Dispatched ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Validated & FWD'd ✅</th>
              <th className="border-r border-gray-300 p-2 text-center">Titles Returned ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">SSL Draft Inv. Rec'd ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Draft Inv. Approved ✅</th>
              <th className="border-r border-gray-300 p-2 text-center">Transphere Inv. Sent ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Payment Rec'd ✅</th>
              <th className="border-r border-gray-300 p-2 text-center">SSL Paid ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Insured ✅</th>
              <th className="border-r border-gray-300 p-2 text-center">Released ✅</th>
              <th className="border-r border-gray-200 p-2 text-center">Docs Sent to Customer ✅</th>
              <th className="p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={`border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="border-r border-gray-200 p-2 font-medium">{row.customer}</td>
                <td className="border-r border-gray-200 p-2">{row.ref}</td>
                <td className="border-r border-gray-200 p-2">{row.file}</td>
                <td className="border-r border-gray-300 p-2">{row.workOrder}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.dropDone)}</td>
                <td className="border-r border-gray-200 p-2">{row.dropDate}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.returnNeeded)}</td>
                <td className="border-r border-gray-300 p-2">{row.returnDate}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.docsSent)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.docsReceived)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.aesMblVgmSent)}</td>
                <td className="border-r border-gray-300 p-2">{row.docCutoffDate}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.titlesDispatched)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.validatedFwd)}</td>
                <td className="border-r border-gray-300 p-2 text-center">{renderCheckbox(row.titlesReturned)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.sslDraftInvRec)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.draftInvApproved)}</td>
                <td className="border-r border-gray-300 p-2 text-center">{renderCheckbox(row.transphereInvSent)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.paymentRec)}</td>
                <td className="border-r border-gray-300 p-2 text-center">{renderCheckbox(row.sslPaid)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.insured)}</td>
                <td className="border-r border-gray-300 p-2 text-center">{renderCheckbox(row.released)}</td>
                <td className="border-r border-gray-200 p-2 text-center">{renderCheckbox(row.docsSentToCustomer)}</td>
                <td className="p-2">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreightTracker;
