
import React, { useState } from 'react';
import { Calendar, Edit3, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import CalendarView from './CalendarView';

export interface TrackingRecord {
  id: string;
  customer: string;
  ref: string;
  file: string;
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
  validatedFwd: boolean;
  titlesReturned: boolean;
  sslDraftInvRec: boolean;
  draftInvApproved: boolean;
  transphereInvSent: boolean;
  paymentRec: boolean;
  sslPaid: boolean;
  insured: boolean;
  released: boolean;
  docsSentToCustomer: boolean;
  notes: string;
}

const FreightTracker = () => {
  const [data, setData] = useState<TrackingRecord[]>([
    {
      id: "1",
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
      id: "2",
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
      id: "3",
      customer: "Initech",
      ref: "EX91502",
      file: "F-1002",
      workOrder: "WO-2002",
      dropDone: true,
      dropDate: "2025-06-05",
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
      id: "4",
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
      id: "5",
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
    }
  ]);

  const updateRecord = (id: string, field: keyof TrackingRecord, value: any) => {
    setData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const addNewRecord = () => {
    const newRecord: TrackingRecord = {
      id: Date.now().toString(),
      customer: "",
      ref: "",
      file: "",
      workOrder: "",
      dropDone: false,
      dropDate: "",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "",
      titlesDispatched: false,
      validatedFwd: false,
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
    };
    setData(prev => [...prev, newRecord]);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-full flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🚢 Freight Forwarding Tracker</h1>
              <p className="text-blue-100 text-lg">Comprehensive shipment tracking and management system</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                onClick={addNewRecord} 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Record
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="table" className="h-full flex flex-col">
            <TabsList className="mx-6 mt-6 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="table" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3 rounded-lg font-semibold"
              >
                <Edit3 className="w-5 h-5" />
                Tracking Table
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 py-3 rounded-lg font-semibold"
              >
                <Calendar className="w-5 h-5" />
                Calendar View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="flex-1 px-6 pb-6 mt-6">
              <TrackingTable data={data} updateRecord={updateRecord} />
            </TabsContent>

            <TabsContent value="calendar" className="flex-1 px-6 pb-6 mt-6">
              <CalendarView data={data} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
