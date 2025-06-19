
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import AllFilesTable from './AllFilesTable';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import CalendarView from './CalendarView';
import ExcelExportDialog from './ExcelExportDialog';
import ExcelImportDialog from './ExcelImportDialog';

const FreightTracker = () => {
  const [exportData, setExportData] = useState<TrackingRecord[]>([]);
  const [importData, setImportData] = useState<ImportTrackingRecord[]>([]);
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const [activeTab, setActiveTab] = useState("export");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [exportZoom, setExportZoom] = useState(1);
  const [importZoom, setImportZoom] = useState(1);
  const [allFilesZoom, setAllFilesZoom] = useState(1);

  const filterData = useCallback((data: any[], term: string) => {
    if (!term) return data;
    const lowerCaseTerm = term.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(lowerCaseTerm)
      )
    );
  }, []);

  const filteredExportData = React.useMemo(() => filterData(exportData, searchTerm), [exportData, searchTerm, filterData]);
  const filteredImportData = React.useMemo(() => filterData(importData, searchTerm), [importData, searchTerm, filterData]);
  const filteredAllFilesData = React.useMemo(() => filterData(allFilesData, searchTerm), [allFilesData, searchTerm, filterData]);

  const updateExportRecord = (id: string, field: keyof TrackingRecord, value: any) => {
    setExportData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const updateImportRecord = (id: string, field: keyof ImportTrackingRecord, value: any) => {
    setImportData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const updateAllFilesRecord = (id: string, field: keyof AllFilesRecord, value: any) => {
    setAllFilesData(prev => prev.map(record => 
      record.id === id ? { ...record, [field]: value } : record
    ));
  };

  const deleteExportRecord = (id: string) => {
    setExportData(prev => prev.filter(record => record.id !== id));
    setSelectedExportRows(prev => prev.filter(rowId => rowId !== id));
  };

  const deleteImportRecord = (id: string) => {
    setImportData(prev => prev.filter(record => record.id !== id));
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));
  };

  const deleteAllFilesRecord = (id: string) => {
    setAllFilesData(prev => prev.filter(record => record.id !== id));
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));
  };

  useEffect(() => {
    // Load data from local storage on component mount
    const storedExportData = localStorage.getItem('exportData');
    if (storedExportData) {
      setExportData(JSON.parse(storedExportData));
    }

    const storedImportData = localStorage.getItem('importData');
    if (storedImportData) {
      setImportData(JSON.parse(storedImportData));
    }

    const storedAllFilesData = localStorage.getItem('allFilesData');
    if (storedAllFilesData) {
      setAllFilesData(JSON.parse(storedAllFilesData));
    }
  }, []);

  useEffect(() => {
    // Save data to local storage whenever it changes
    localStorage.setItem('exportData', JSON.stringify(exportData));
    localStorage.setItem('importData', JSON.stringify(importData));
    localStorage.setItem('allFilesData', JSON.stringify(allFilesData));
  }, [exportData, importData, allFilesData]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="w-1/2">
          <Label htmlFor="search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Search
          </Label>
          <Input
            type="search"
            id="search"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1"
          />
        </div>
        <CalendarView data={exportData} importData={importData} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Tracking</TabsTrigger>
          <TabsTrigger value="import">Import Tracking</TabsTrigger>
          <TabsTrigger value="all-files">All Files</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ExcelExportDialog
                exportData={filteredExportData}
                importData={filteredImportData}
                allFilesData={filteredAllFilesData}
                selectedExportRows={selectedExportRows}
                selectedImportRows={selectedImportRows}
                selectedAllFilesRows={selectedAllFilesRows}
                currentTab="export"
              >
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </ExcelExportDialog>
              <ExcelImportDialog
                setExportData={setExportData}
                setImportData={setImportData}
                setAllFilesData={setAllFilesData}
                currentTab="export"
              >
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </ExcelImportDialog>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportZoom(Math.max(0.5, exportZoom - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(exportZoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportZoom(Math.min(2, exportZoom + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div style={{ transform: `scale(${exportZoom})`, transformOrigin: 'top left', width: `${100 / exportZoom}%` }}>
            <TrackingTable
              data={filteredExportData}
              updateRecord={updateExportRecord}
              deleteRecord={deleteExportRecord}
              selectedRows={selectedExportRows}
              setSelectedRows={setSelectedExportRows}
            />
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ExcelExportDialog
                exportData={filteredExportData}
                importData={filteredImportData}
                allFilesData={filteredAllFilesData}
                selectedExportRows={selectedExportRows}
                selectedImportRows={selectedImportRows}
                selectedAllFilesRows={selectedAllFilesRows}
                currentTab="import"
              >
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </ExcelExportDialog>
              <ExcelImportDialog
                setExportData={setExportData}
                setImportData={setImportData}
                setAllFilesData={setAllFilesData}
                currentTab="import"
              >
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </ExcelImportDialog>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportZoom(Math.max(0.5, importZoom - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(importZoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportZoom(Math.min(2, importZoom + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div style={{ transform: `scale(${importZoom})`, transformOrigin: 'top left', width: `${100 / importZoom}%` }}>
            <ImportTrackingTable
              data={filteredImportData}
              updateRecord={updateImportRecord}
              deleteRecord={deleteImportRecord}
              selectedRows={selectedImportRows}
              setSelectedRows={setSelectedImportRows}
            />
          </div>
        </TabsContent>

        <TabsContent value="all-files" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ExcelExportDialog
                exportData={filteredExportData}
                importData={filteredImportData}
                allFilesData={filteredAllFilesData}
                selectedExportRows={selectedExportRows}
                selectedImportRows={selectedImportRows}
                selectedAllFilesRows={selectedAllFilesRows}
                currentTab="all-files"
              >
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </ExcelExportDialog>
              <ExcelImportDialog
                setExportData={setExportData}
                setImportData={setImportData}
                setAllFilesData={setAllFilesData}
                currentTab="all-files"
              >
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Excel
                </Button>
              </ExcelImportDialog>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAllFilesZoom(Math.max(0.5, allFilesZoom - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(allFilesZoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAllFilesZoom(Math.min(2, allFilesZoom + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div style={{ transform: `scale(${allFilesZoom})`, transformOrigin: 'top left', width: `${100 / allFilesZoom}%` }}>
            <AllFilesTable
              data={filteredAllFilesData}
              updateRecord={updateAllFilesRecord}
              deleteRecord={deleteAllFilesRecord}
              selectedRows={selectedAllFilesRows}
              setSelectedRows={setSelectedAllFilesRows}
            />
          </div>
        </TabsContent>
      </Tabs>

    </div>
  );
};

export default FreightTracker;
