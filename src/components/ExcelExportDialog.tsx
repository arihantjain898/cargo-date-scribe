import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrackingRecord } from '../types/TrackingRecord';

interface ExcelExportDialogProps {
  data: TrackingRecord[];
  selectedRows: string[];
  children: React.ReactNode;
}

const ExcelExportDialog: React.FC<ExcelExportDialogProps> = ({ data, selectedRows, children }) => {
  const handleExport = () => {
    const exportData = selectedRows.length > 0
      ? data.filter(item => selectedRows.includes(item.id))
      : data;

    if (exportData.length === 0) {
      alert('No records selected or available to export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracking Data');
    XLSX.writeFile(workbook, 'tracking_data.xlsx');
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
          <p>
            {selectedRows.length > 0
              ? `Exporting ${selectedRows.length} selected records.`
              : 'Exporting all records.'}
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExportDialog;
