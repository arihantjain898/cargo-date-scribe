
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ExcelImportDialogProps {
  activeTab: string;
  onImportClick: () => void;
  children: React.ReactNode;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ 
  activeTab,
  onImportClick,
  children 
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'export-table':
        return 'Export Tracking';
      case 'import-table':
        return 'Import Tracking';
      case 'all-files':
        return 'All Files';
      case 'domestic-trucking':
        return 'Domestic Trucking';
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
          <DialogTitle>Import from Excel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600">
            Import data to {getTabLabel()} tab.
          </p>
          <p className="text-xs text-gray-500">
            Select an Excel file (.xlsx or .xls) with data matching the current tab structure.
          </p>
        </div>
        <Button onClick={onImportClick}>
          <Upload className="w-4 h-4 mr-2" />
          Import to {getTabLabel()}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;
