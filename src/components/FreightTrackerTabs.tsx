
import React from 'react';
import { Calendar, Package, Truck, FileText, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import AllFilesTable from './AllFilesTable';
import DomesticTruckingTable from './DomesticTruckingTable';
import CalendarView from './CalendarView';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

interface FreightTrackerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredExportData: TrackingRecord[];
  filteredImportData: ImportTrackingRecord[];
  filteredAllFilesData: AllFilesRecord[];
  filteredDomesticTruckingData: DomesticTruckingRecord[];
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedImportRows: string[];
  setSelectedImportRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAllFilesRows: string[];
  setSelectedAllFilesRows: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDomesticTruckingRows: string[];
  setSelectedDomesticTruckingRows: React.Dispatch<React.SetStateAction<string[]>>;
  updateRecord: (id: string, field: keyof TrackingRecord, value: string | boolean) => void;
  updateImportRecord: (id: string, field: keyof ImportTrackingRecord, value: string | boolean) => void;
  updateAllFilesRecord: (id: string, field: keyof AllFilesRecord, value: string) => void;
  updateDomesticTruckingRecord: (id: string, field: keyof DomesticTruckingRecord, value: string | boolean) => void;
  deleteRecord: (id: string) => void;
  deleteImportRecord: (id: string) => void;
  deleteAllFilesRecord: (id: string) => void;
  deleteDomesticTruckingRecord: (id: string) => void;
  onFileClick: (fileNumber: string, fileType: string) => void;
}

const FreightTrackerTabs = ({
  activeTab,
  setActiveTab,
  filteredExportData,
  filteredImportData,
  filteredAllFilesData,
  filteredDomesticTruckingData,
  selectedRows,
  setSelectedRows,
  selectedImportRows,
  setSelectedImportRows,
  selectedAllFilesRows,
  setSelectedAllFilesRows,
  selectedDomesticTruckingRows,
  setSelectedDomesticTruckingRows,
  updateRecord,
  updateImportRecord,
  updateAllFilesRecord,
  updateDomesticTruckingRecord,
  deleteRecord,
  deleteImportRecord,
  deleteAllFilesRecord,
  deleteDomesticTruckingRecord,
  onFileClick
}: FreightTrackerTabsProps) => {
  return (
    <div className="flex-1 overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="mx-4 md:mx-6 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
          <TabsTrigger 
            value="all-files" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
          >
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            All Files
          </TabsTrigger>
          <TabsTrigger 
            value="export-table" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
          >
            <Package className="w-3 h-3 md:w-4 md:h-4" />
            Export Checklist
          </TabsTrigger>
          <TabsTrigger 
            value="import-table" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
          >
            <Truck className="w-3 h-3 md:w-4 md:h-4" />
            Import Checklist
          </TabsTrigger>
          <TabsTrigger 
            value="domestic-trucking" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
          >
            <Home className="w-3 h-3 md:w-4 md:h-4" />
            Domestic Trucking
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
          >
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-files" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
          <AllFilesTable 
            data={filteredAllFilesData} 
            updateRecord={updateAllFilesRecord} 
            deleteRecord={deleteAllFilesRecord}
            selectedRows={selectedAllFilesRows}
            setSelectedRows={setSelectedAllFilesRows}
            onFileClick={onFileClick}
          />
        </TabsContent>

        <TabsContent value="export-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
          <TrackingTable 
            data={filteredExportData} 
            updateRecord={updateRecord} 
            deleteRecord={deleteRecord}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </TabsContent>

        <TabsContent value="import-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
          <ImportTrackingTable 
            data={filteredImportData} 
            updateRecord={updateImportRecord} 
            deleteRecord={deleteImportRecord}
            selectedRows={selectedImportRows}
            setSelectedRows={setSelectedImportRows}
          />
        </TabsContent>

        <TabsContent value="domestic-trucking" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
          <DomesticTruckingTable 
            data={filteredDomesticTruckingData} 
            updateRecord={updateDomesticTruckingRecord} 
            deleteRecord={deleteDomesticTruckingRecord}
            selectedRows={selectedDomesticTruckingRows}
            setSelectedRows={setSelectedDomesticTruckingRows}
          />
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
          <CalendarView 
            data={filteredExportData} 
            importData={filteredImportData}
            domesticData={filteredDomesticTruckingData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTrackerTabs;
