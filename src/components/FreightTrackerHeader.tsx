
import React from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload, Package, Truck, FileText, Trash2, Home, Undo, Redo, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ExcelExportDialog from './ExcelExportDialog';
import ExcelImportDialog from './ExcelImportDialog';
import NotificationSettings from './NotificationSettings';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

interface FreightTrackerHeaderProps {
  activeTab: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRows: string[];
  selectedImportRows: string[];
  selectedAllFilesRows: string[];
  selectedDomesticTruckingRows: string[];
  filteredExportData: TrackingRecord[];
  filteredImportData: ImportTrackingRecord[];
  filteredAllFilesData: AllFilesRecord[];
  filteredDomesticTruckingData: DomesticTruckingRecord[];
  sampleDataAdded: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddSampleData: () => void;
  onAddRecord: () => void;
  onImportClick: () => void;
  onDeleteBulkRecords: () => void;
}

const FreightTrackerHeader = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  selectedRows,
  selectedImportRows,
  selectedAllFilesRows,
  selectedDomesticTruckingRows,
  filteredExportData,
  filteredImportData,
  filteredAllFilesData,
  filteredDomesticTruckingData,
  sampleDataAdded,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddSampleData,
  onAddRecord,
  onImportClick,
  onDeleteBulkRecords
}: FreightTrackerHeaderProps) => {
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'export-table':
        return 'Search by customer, ref, file, or work order...';
      case 'import-table':
        return 'Search by reference, file, bond, or notes...';
      case 'all-files':
        return 'Search by customer, file, port, or destination...';
      case 'domestic-trucking':
        return 'Search by customer, file, or notes...';
      default:
        return 'Search...';
    }
  };

  const getSelectedCount = () => {
    switch (activeTab) {
      case 'export-table':
        return selectedRows.length;
      case 'import-table':
        return selectedImportRows.length;
      case 'all-files':
        return selectedAllFilesRows.length;
      case 'domestic-trucking':
        return selectedDomesticTruckingRows.length;
      default:
        return 0;
    }
  };

  const hasSelectedRows = getSelectedCount() > 0;

  return (
    <div className="bg-white border-b border-gray-200 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Freight Forwarding Tracker</h1>
          <p className="text-sm md:text-base text-gray-600">Comprehensive shipment tracking and management system</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs md:text-sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Undo
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs md:text-sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            Redo
          </Button>

          {!sampleDataAdded && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs md:text-sm"
              onClick={onAddSampleData}
            >
              <Database className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Add Sample Data
            </Button>
          )}

          <ExcelExportDialog 
            activeTab={activeTab}
            exportData={filteredExportData} 
            importData={filteredImportData}
            allFilesData={filteredAllFilesData}
            domesticTruckingData={filteredDomesticTruckingData}
            selectedExportRows={selectedRows}
            selectedImportRows={selectedImportRows}
            selectedAllFilesRows={selectedAllFilesRows}
            selectedDomesticTruckingRows={selectedDomesticTruckingRows}
          >
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Export Excel
            </Button>
          </ExcelExportDialog>

          <ExcelImportDialog
            activeTab={activeTab}
            onImportClick={onImportClick}
          >
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs md:text-sm"
            >
              <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Import Excel
            </Button>
          </ExcelImportDialog>

          {hasSelectedRows && (
            <Button 
              variant="destructive" 
              size="sm"
              className="text-xs md:text-sm"
              onClick={onDeleteBulkRecords}
            >
              <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Delete Selected ({getSelectedCount()})
            </Button>
          )}

          <NotificationSettings>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Notifications
            </Button>
          </NotificationSettings>
          
          <Button 
            onClick={onAddRecord} 
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
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default FreightTrackerHeader;
