import React, { useState, useRef } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import ExcelExportDialog from './ExcelExportDialog';
import * as XLSX from 'xlsx';

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
      dropDate: "2025-06-10",
      returnNeeded: true,
      returnDate: "2025-06-15",
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
      notes: "Urgent shipment"
    },
    {
      id: "2",
      customer: "Globex Industries",
      ref: "EX91501",
      file: "F-1001",
      workOrder: "WO-2001",
      dropDone: true,
      dropDate: "2025-06-12",
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
      notes: "Special handling required"
    },
    {
      id: "3",
      customer: "Initech Systems",
      ref: "EX91502",
      file: "F-1002",
      workOrder: "WO-2002",
      dropDone: true,
      dropDate: "2025-06-05",
      returnNeeded: true,
      returnDate: "2025-06-18",
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
      notes: "High value cargo"
    },
    {
      id: "4",
      customer: "Umbrella Corp",
      ref: "EX91503",
      file: "F-1003",
      workOrder: "WO-2003",
      dropDone: true,
      dropDate: "2025-06-08",
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
      notes: "Temperature controlled"
    },
    {
      id: "5",
      customer: "Wayne Enterprises",
      ref: "EX91504",
      file: "F-1004",
      workOrder: "WO-2004",
      dropDone: true,
      dropDate: "2025-06-11",
      returnNeeded: true,
      returnDate: "2025-06-20",
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
      notes: "Expedited delivery"
    },
    {
      id: "6",
      customer: "Stark Industries",
      ref: "EX91505",
      file: "F-1005",
      workOrder: "WO-2005",
      dropDone: false,
      dropDate: "2025-06-20",
      returnNeeded: true,
      returnDate: "2025-06-25",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-18",
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
      notes: "Pending documentation"
    },
    {
      id: "7",
      customer: "Oscorp Ltd",
      ref: "EX91506",
      file: "F-1006",
      workOrder: "WO-2006",
      dropDone: false,
      dropDate: "2025-06-22",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-19",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: true,
      transphereInvSent: true,
      paymentRec: true,
      sslPaid: true,
      insured: true,
      released: false,
      docsSentToCustomer: true,
      notes: "Ready for pickup"
    },
    {
      id: "8",
      customer: "LexCorp",
      ref: "EX91507",
      file: "F-1007",
      workOrder: "WO-2007",
      dropDone: true,
      dropDate: "2025-06-09",
      returnNeeded: true,
      returnDate: "2025-06-24",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-21",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: true,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: true,
      paymentRec: true,
      sslPaid: true,
      insured: true,
      released: true,
      docsSentToCustomer: true,
      notes: "Completed successfully"
    },
    {
      id: "9",
      customer: "Daily Planet",
      ref: "EX91508",
      file: "F-1008",
      workOrder: "WO-2008",
      dropDone: false,
      dropDate: "2025-06-25",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-23",
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
      notes: "Awaiting customer confirmation"
    },
    {
      id: "10",
      customer: "S.H.I.E.L.D.",
      ref: "EX91509",
      file: "F-1009",
      workOrder: "WO-2009",
      dropDone: true,
      dropDate: "2025-06-13",
      returnNeeded: true,
      returnDate: "2025-06-28",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-26",
      titlesDispatched: false,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Classified shipment"
    },
    {
      id: "11",
      customer: "Cyberdyne Systems",
      ref: "EX91510",
      file: "F-1010",
      workOrder: "WO-2010",
      dropDone: true,
      dropDate: "2025-06-14",
      returnNeeded: true,
      returnDate: "2025-06-29",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-27",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "AI research materials"
    },
    {
      id: "12",
      customer: "Aperture Science",
      ref: "EX91511",
      file: "F-1011",
      workOrder: "WO-2011",
      dropDone: false,
      dropDate: "2025-06-30",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-28",
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
      notes: "Portal testing equipment"
    },
    {
      id: "13",
      customer: "Black Mesa",
      ref: "EX91512",
      file: "F-1012",
      workOrder: "WO-2012",
      dropDone: true,
      dropDate: "2025-06-07",
      returnNeeded: true,
      returnDate: "2025-06-21",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-19",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: true,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: true,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: true,
      notes: "Research samples"
    },
    {
      id: "14",
      customer: "Vault-Tec",
      ref: "EX91513",
      file: "F-1013",
      workOrder: "WO-2013",
      dropDone: true,
      dropDate: "2025-06-16",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-06-30",
      titlesDispatched: false,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Survival equipment"
    },
    {
      id: "15",
      customer: "Weyland Corp",
      ref: "EX91514",
      file: "F-1014",
      workOrder: "WO-2014",
      dropDone: false,
      dropDate: "2025-07-01",
      returnNeeded: true,
      returnDate: "2025-07-15",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-29",
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
      notes: "Xenomorph containment units"
    },
    {
      id: "16",
      customer: "InGen Corporation",
      ref: "EX91515",
      file: "F-1015",
      workOrder: "WO-2015",
      dropDone: true,
      dropDate: "2025-06-18",
      returnNeeded: true,
      returnDate: "2025-07-02",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: false,
      docCutoffDate: "2025-06-30",
      titlesDispatched: true,
      validatedFwd: false,
      titlesReturned: false,
      sslDraftInvRec: false,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Genetic research materials"
    },
    {
      id: "17",
      customer: "Tyrell Corporation",
      ref: "EX91516",
      file: "F-1016",
      workOrder: "WO-2016",
      dropDone: true,
      dropDate: "2025-06-19",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-07-01",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: true,
      paymentRec: true,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: true,
      notes: "Replicant components"
    },
    {
      id: "18",
      customer: "Soylent Corporation",
      ref: "EX91517",
      file: "F-1017",
      workOrder: "WO-2017",
      dropDone: false,
      dropDate: "2025-07-03",
      returnNeeded: true,
      returnDate: "2025-07-17",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "2025-07-01",
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
      notes: "Food processing equipment"
    },
    {
      id: "19",
      customer: "Omni Consumer Products",
      ref: "EX91518",
      file: "F-1018",
      workOrder: "WO-2018",
      dropDone: true,
      dropDate: "2025-06-21",
      returnNeeded: false,
      returnDate: "",
      docsSent: true,
      docsReceived: false,
      aesMblVgmSent: true,
      docCutoffDate: "2025-07-02",
      titlesDispatched: false,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: false,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Law enforcement robotics"
    },
    {
      id: "20",
      customer: "Massive Dynamic",
      ref: "EX91519",
      file: "F-1019",
      workOrder: "WO-2019",
      dropDone: true,
      dropDate: "2025-06-23",
      returnNeeded: true,
      returnDate: "2025-07-07",
      docsSent: true,
      docsReceived: true,
      aesMblVgmSent: true,
      docCutoffDate: "2025-07-05",
      titlesDispatched: true,
      validatedFwd: true,
      titlesReturned: false,
      sslDraftInvRec: true,
      draftInvApproved: true,
      transphereInvSent: false,
      paymentRec: false,
      sslPaid: false,
      insured: true,
      released: false,
      docsSentToCustomer: false,
      notes: "Fringe science equipment"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));
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

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedRecords: TrackingRecord[] = jsonData.map((row: any, index: number) => ({
          id: row.id || Date.now().toString() + index,
          customer: row.customer || '',
          ref: row.ref || '',
          file: row.file || '',
          workOrder: row.workOrder || '',
          dropDone: Boolean(row.dropDone),
          dropDate: row.dropDate || '',
          returnNeeded: Boolean(row.returnNeeded),
          returnDate: row.returnDate || '',
          docsSent: Boolean(row.docsSent),
          docsReceived: Boolean(row.docsReceived),
          aesMblVgmSent: Boolean(row.aesMblVgmSent),
          docCutoffDate: row.docCutoffDate || '',
          titlesDispatched: Boolean(row.titlesDispatched),
          validatedFwd: Boolean(row.validatedFwd),
          titlesReturned: Boolean(row.titlesReturned),
          sslDraftInvRec: Boolean(row.sslDraftInvRec),
          draftInvApproved: Boolean(row.draftInvApproved),
          transphereInvSent: Boolean(row.transphereInvSent),
          paymentRec: Boolean(row.paymentRec),
          sslPaid: Boolean(row.sslPaid),
          insured: Boolean(row.insured),
          released: Boolean(row.released),
          docsSentToCustomer: Boolean(row.docsSentToCustomer),
          notes: row.notes || ''
        }));

        setData(importedRecords);
        console.log('Successfully imported', importedRecords.length, 'records');
      } catch (error) {
        console.error('Error importing Excel file:', error);
        alert('Error importing Excel file. Please check the file format.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              <ExcelExportDialog data={filteredData} selectedRows={selectedRows}>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </ExcelExportDialog>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </Button>
              <NotificationSettings>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </NotificationSettings>
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={importFromExcel}
            className="hidden"
          />
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
              <TrackingTable 
                data={filteredData} 
                updateRecord={updateRecord} 
                deleteRecord={deleteRecord}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
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
