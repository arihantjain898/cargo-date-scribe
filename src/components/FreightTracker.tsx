
import React, { useState } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import ExcelExportDialog from './ExcelExportDialog';
import { TrackingRecord } from '../types/TrackingRecord';
import { sampleTrackingData } from '../data/sampleData';
import { useExcelImport } from '../hooks/useExcelImport';
import { useSearch } from '../hooks/useSearch';

const FreightTracker = () => {
  const [data, setData] = useState<TrackingRecord[]>(sampleTrackingData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { fileInputRef, importFromExcel } = useExcelImport(setData);
  const { searchTerm, setSearchTerm, filteredData } = useSearch(data);

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

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Freight Forwarding Tracker</h1>
                <p className="text-sm md:text-base text-gray-600">Comprehensive shipment tracking and management system</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <ExcelExportDialog data={filteredData} selectedRows={selectedRows}>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Export Excel
                  </Button>
                </ExcelExportDialog>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs md:text-sm"
                >
                  <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Import Excel
                </Button>
                <NotificationSettings>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Notifications
                  </Button>
                </NotificationSettings>
                <Button 
                  onClick={addNewRecord} 
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
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
                  className="pl-10 text-sm"
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
              <TabsList className="mx-4 md:mx-6 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
                <TabsTrigger 
                  value="table" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Edit3 className="w-3 h-3 md:w-4 md:h-4" />
                  Table View
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <TrackingTable 
                  data={filteredData} 
                  updateRecord={updateRecord} 
                  deleteRecord={deleteRecord}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </TabsContent>

              <TabsContent value="calendar" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <CalendarView data={filteredData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
