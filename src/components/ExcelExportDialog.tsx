
import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface ExcelExportDialogProps {
  activeTab: string;
  exportData: TrackingRecord[];
  importData: ImportTrackingRecord[];
  allFilesData: AllFilesRecord[];
  selectedExportRows: string[];
  selectedImportRows: string[];
  selectedAllFilesRows: string[];
  children: React.ReactNode;
}

const ExcelExportDialog: React.FC<ExcelExportDialogProps> = ({ 
  activeTab,
  exportData, 
  importData, 
  allFilesData,
  selectedExportRows, 
  selectedImportRows,
  selectedAllFilesRows,
  children 
}) => {
  const handleExport = () => {
    let dataToExport: Array<
      TrackingRecord | ImportTrackingRecord | AllFilesRecord
    > = [];
    let filename = '';
    let selectedRows: string[] = [];

    switch (activeTab) {
      case 'export-table':
        selectedRows = selectedExportRows;
        dataToExport = selectedRows.length > 0
          ? exportData.filter(item => selectedRows.includes(item.id))
          : exportData;
        filename = 'export_tracking_data.xlsx';
        break;
      case 'import-table':
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
      default:
        selectedRows = selectedExportRows;
        dataToExport = selectedRows.length > 0
          ? exportData.filter(item => selectedRows.includes(item.id))
          : exportData;
        filename = 'export_tracking_data.xlsx';
    }

    if (dataToExport.length === 0) {
      alert('No records available to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, filename);
  };

  const getRecordCount = () => {
    switch (activeTab) {
      case 'export-table':
        return selectedExportRows.length > 0 ? selectedExportRows.length : exportData.length;
      case 'import-table':
        return selectedImportRows.length > 0 ? selectedImportRows.length : importData.length;
      case 'all-files':
        return selectedAllFilesRows.length > 0 ? selectedAllFilesRows.length : allFilesData.length;
      default:
        return selectedExportRows.length > 0 ? selectedExportRows.length : exportData.length;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'export-table':
        return 'Export Tracking';
      case 'import-table':
        return 'Import Tracking';
      case 'all-files':
        return 'All Files';
      default:
        return 'Export Tracking';
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
