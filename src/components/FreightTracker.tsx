
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, CheckCircle, XCircle, Clock, Search, Filter, Plus } from 'lucide-react';

interface TrackingRecord {
  customer: string;
  refNumber: string;
  fileNumber: string;
  workOrder: string;
  dropDone: boolean;
  dropDate: string;
  returnNeeded: boolean;
  returnDate: string;
  docsSent: boolean;
  docsReceived: boolean;
  aesMblVgmSent: boolean;
  docCutoffDate: string;
  titlesDispatched: boolean;
  validatedForwarded: boolean;
  titlesReturned: boolean;
  sslDraftInvReceived: boolean;
  draftInvApproved: boolean;
  transphereInvSent: boolean;
  paymentReceived: boolean;
  sslPaid: boolean;
  insured: boolean;
  released: boolean;
  docsSentToCustomer: boolean;
  notes: string;
}

const FreightTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const sampleData: TrackingRecord[] = [
    {
      customer: "ACME Corp",
      refNumber: "EX91500",
      fileNumber: "F-1000",
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
      validatedForwarded: true,
      titlesReturned: false,
      sslDraftInvReceived: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentReceived: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Globex",
      refNumber: "EX91501",
      fileNumber: "F-1001",
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
      validatedForwarded: false,
      titlesReturned: false,
      sslDraftInvReceived: false,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentReceived: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Initech",
      refNumber: "EX91502",
      fileNumber: "F-1002",
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
      validatedForwarded: true,
      titlesReturned: false,
      sslDraftInvReceived: true,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentReceived: false,
      sslPaid: false,
      insured: false,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Umbrella",
      refNumber: "EX91503",
      fileNumber: "F-1003",
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
      validatedForwarded: true,
      titlesReturned: false,
      sslDraftInvReceived: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentReceived: false,
      sslPaid: false,
      insured: true,
      released: true,
      docsSentToCustomer: false,
      notes: ""
    },
    {
      customer: "Wayne Ent.",
      refNumber: "EX91504",
      fileNumber: "F-1004",
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
      validatedForwarded: false,
      titlesReturned: false,
      sslDraftInvReceived: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentReceived: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: ""
    }
  ];

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const ProgressBar = ({ record }: { record: TrackingRecord }) => {
    const totalSteps = 22; // Total number of boolean fields
    const completedSteps = [
      record.dropDone,
      record.returnNeeded,
      record.docsSent,
      record.docsReceived,
      record.aesMblVgmSent,
      record.titlesDispatched,
      record.validatedForwarded,
      record.titlesReturned,
      record.sslDraftInvReceived,
      record.draftInvApproved,
      record.transphereInvSent,
      record.paymentReceived,
      record.sslPaid,
      record.insured,
      record.released,
      record.docsSentToCustomer
    ].filter(Boolean).length;

    const percentage = (completedSteps / 16) * 100; // Using 16 main checkpoints

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
        <span className="text-xs text-gray-500 mt-1">{Math.round(percentage)}% Complete</span>
      </div>
    );
  };

  const getStatusBadge = (record: TrackingRecord) => {
    const totalSteps = 16;
    const completedSteps = [
      record.dropDone,
      record.returnNeeded,
      record.docsSent,
      record.docsReceived,
      record.aesMblVgmSent,
      record.titlesDispatched,
      record.validatedForwarded,
      record.titlesReturned,
      record.sslDraftInvReceived,
      record.draftInvApproved,
      record.transphereInvSent,
      record.paymentReceived,
      record.sslPaid,
      record.insured,
      record.released,
      record.docsSentToCustomer
    ].filter(Boolean).length;

    if (completedSteps === totalSteps) {
      return <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>;
    } else if (completedSteps > totalSteps * 0.7) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    } else if (completedSteps > totalSteps * 0.3) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Started</Badge>;
    } else {
      return <Badge variant="outline">Pending</Badge>;
    }
  };

  const filteredData = sampleData.filter(record => {
    const matchesSearch = record.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.fileNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    // Add more filter logic here based on status
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Freight Forwarding Tracker</h1>
          <p className="text-gray-600">Internal customer tracking system for freight forwarding operations</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers, ref numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Add New Record
          </Button>
        </div>

        {/* Records Grid */}
        <div className="grid gap-6">
          {filteredData.map((record, index) => (
            <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-800">{record.customer}</h3>
                  {getStatusBadge(record)}
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span><strong>REF:</strong> {record.refNumber}</span>
                  <span><strong>File:</strong> {record.fileNumber}</span>
                  <span><strong>WO:</strong> {record.workOrder}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <ProgressBar record={record} />
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* INFO Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">DROP / RETURN</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Drop Done</span>
                      <StatusIcon status={record.dropDone} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Return Needed</span>
                      <StatusIcon status={record.returnNeeded} />
                    </div>
                    {record.dropDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Drop: {record.dropDate}
                      </div>
                    )}
                    {record.returnDate && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Return: {record.returnDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* DOCUMENTS Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">DOCUMENTS</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Docs Sent</span>
                      <StatusIcon status={record.docsSent} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Docs Received</span>
                      <StatusIcon status={record.docsReceived} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AES/MBL/VGM</span>
                      <StatusIcon status={record.aesMblVgmSent} />
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Cutoff: {record.docCutoffDate}
                    </div>
                  </div>
                </div>

                {/* TITLES & INVOICING Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">TITLES & INVOICING</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Titles Dispatched</span>
                      <StatusIcon status={record.titlesDispatched} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Validated & FWD'd</span>
                      <StatusIcon status={record.validatedForwarded} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Titles Returned</span>
                      <StatusIcon status={record.titlesReturned} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Draft Inv.</span>
                      <StatusIcon status={record.sslDraftInvReceived} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Draft Approved</span>
                      <StatusIcon status={record.draftInvApproved} />
                    </div>
                  </div>
                </div>

                {/* PAYMENT & FINAL Section */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 border-b pb-2">PAYMENT & FINAL</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transphere Inv.</span>
                      <StatusIcon status={record.transphereInvSent} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Rec'd</span>
                      <StatusIcon status={record.paymentReceived} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Paid</span>
                      <StatusIcon status={record.sslPaid} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Insured</span>
                      <StatusIcon status={record.insured} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Released</span>
                      <StatusIcon status={record.released} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Docs to Customer</span>
                      <StatusIcon status={record.docsSentToCustomer} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {record.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                  <p className="text-sm text-gray-600">{record.notes}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <h3 className="text-2xl font-bold text-blue-600">{filteredData.length}</h3>
            <p className="text-gray-600">Total Records</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-2xl font-bold text-green-600">
              {filteredData.filter(r => getStatusBadge(r).props.className?.includes('green')).length}
            </h3>
            <p className="text-gray-600">Completed</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-2xl font-bold text-yellow-600">
              {filteredData.filter(r => getStatusBadge(r).props.className?.includes('blue') || getStatusBadge(r).props.className?.includes('yellow')).length}
            </h3>
            <p className="text-gray-600">In Progress</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-2xl font-bold text-gray-600">
              {filteredData.filter(r => getStatusBadge(r).props.variant === 'outline').length}
            </h3>
            <p className="text-gray-600">Pending</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
