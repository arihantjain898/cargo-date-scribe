
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExcelImport } from '../hooks/useExcelImport';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';

interface ExcelImportDialogProps {
  setExportData: React.Dispatch<React.SetStateAction<TrackingRecord[]>>;
  setImportData: React.Dispatch<React.SetStateAction<ImportTrackingRecord[]>>;
  setAllFilesData: React.Dispatch<React.SetStateAction<AllFilesRecord[]>>;
  currentTab: string;
  children: React.ReactNode;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  setExportData,
  setImportData,
  setAllFilesData,
  currentTab,
  children
}) => {
  const { fileInputRef, importFromExcel } = useExcelImport(setExportData, setImportData, setAllFilesData);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataType = currentTab as 'export' | 'import' | 'all-files';
    importFromExcel(event, dataType);
  };

  const getTabLabel = () => {
    switch (currentTab) {
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
          <DialogTitle>Import {getTabLabel()} from Excel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600">
            Select an Excel file to import {getTabLabel()} data. This will replace the current data in this tab.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
          />
        </div>
        <Button onClick={handleFileSelect}>
          <Upload className="w-4 h-4 mr-2" />
          Select Excel File
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;
