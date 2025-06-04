import React, { useState } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = data.filter(record => 
    record.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.workOrder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateRecord = (id: string, field: keyof TrackingRecord, value: any) => {
    setData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const deleteRecord = (id: string) => {
    setData(prev => prev.filter(record => record.id !== id));
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
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Freight Forwarding Tracker</h1>
              <p className="text-gray-600">Comprehensive shipment tracking and management system</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                onClick={addNewRecord} 
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, ref, file, or work order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="table" className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
              <TabsTrigger 
                value="table" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 rounded-md"
              >
                <Edit3 className="w-4 h-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger 
                value="calendar" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 rounded-md"
              >
                <Calendar className="w-4 h-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="flex-1 px-6 pb-6 mt-4">
              <TrackingTable data={filteredData} updateRecord={updateRecord} deleteRecord={deleteRecord} />
            </TabsContent>

            <TabsContent value="calendar" className="flex-1 px-6 pb-6 mt-4">
              <CalendarView data={filteredData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
