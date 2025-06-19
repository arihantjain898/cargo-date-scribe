
import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface ExcelExportDialogProps {
  exportData: TrackingRecord[];
  importData: ImportTrackingRecord[];
  allFilesData: AllFilesRecord[];
  selectedExportRows: string[];
  selectedImportRows: string[];
  selectedAllFilesRows: string[];
  children: React.ReactNode;
}

const ExcelExportDialog: React.FC<ExcelExportDialogProps> = ({ 
  exportData, 
  importData, 
  allFilesData,
  selectedExportRows, 
  selectedImportRows,
  selectedAllFilesRows,
  children 
}) => {
  const [selectedTab, setSelectedTab] = React.useState<string>('export');

  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = '';
    let selectedRows: string[] = [];

    switch (selectedTab) {
      case 'export':
        selectedRows = selectedExportRows;
        dataToExport = selectedRows.length > 0
          ? exportData.filter(item => selectedRows.includes(item.id))
          : exportData;
        filename = 'export_tracking_data.xlsx';
        break;
      case 'import':
        selectedRows = selectedImportRows;
        dataToExport = selectedRows.length > 0
          ? importData.filter(item => selectedRows.includes(item.id))
          : importData;
        filename = 'import_tracking_data.xlsx';
        break;
      case 'all-files':
        selectedRows = selectedAllFilesRows;
        dataToExport = selectedRows.length > 0
          ? allFilesData.filter(item => selectedRows.includes(item.id))
          : allFilesData;
        filename = 'all_files_data.xlsx';
        break;
    }

    if (dataToExport.length === 0) {
      alert('No records selected or available to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, filename);
  };

  const getRecordCount = () => {
    switch (selectedTab) {
      case 'export':
        return selectedExportRows.length > 0 ? selectedExportRows.length : exportData.length;
      case 'import':
        return selectedImportRows.length > 0 ? selectedImportRows.length : importData.length;
      case 'all-files':
        return selectedAllFilesRows.length > 0 ? selectedAllFilesRows.length : allFilesData.length;
      default:
        return 0;
    }
  };

  const getTabLabel = () => {
    switch (selectedTab) {
      case 'export':
        return 'Export Tracking';
      case 'import':
        return 'Import Tracking';
      case 'all-files':
        return 'All Files';
      default:
        return '';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export to Excel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Data Type:</label>
            <Select value={selectedTab} onValueChange={setSelectedTab}>
              <SelectTrigger>
                <SelectValue placeholder="Choose data type to export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="export">Export Tracking Data</SelectItem>
                <SelectItem value="import">Import Tracking Data</SelectItem>
                <SelectItem value="all-files">All Files Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-600">
            Exporting {getRecordCount()} records from {getTabLabel()}.
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export {getTabLabel()}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExportDialog;
