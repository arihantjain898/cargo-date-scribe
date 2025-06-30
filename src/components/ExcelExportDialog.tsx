
import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';

interface ExcelExportDialogProps {
  activeTab: string;
  exportData: TrackingRecord[];
  importData: ImportTrackingRecord[];
  allFilesData: AllFilesRecord[];
  domesticTruckingData: DomesticTruckingRecord[];
  selectedExportRows: string[];
  selectedImportRows: string[];
  selectedAllFilesRows: string[];
  selectedDomesticTruckingRows: string[];
  children: React.ReactNode;
}

const ExcelExportDialog: React.FC<ExcelExportDialogProps> = ({ 
  activeTab,
  exportData, 
  importData, 
  allFilesData,
  domesticTruckingData,
  selectedExportRows, 
  selectedImportRows,
  selectedAllFilesRows,
  selectedDomesticTruckingRows,
  children 
}) => {
  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = '';
    let selectedRows: string[] = [];

    switch (activeTab) {
      case 'export-table':
        selectedRows = selectedExportRows;
        const exportRecords = selectedRows.length > 0
          ? exportData.filter(item => selectedRows.includes(item.id))
          : exportData;
        
        // Reorder columns to match table layout
        dataToExport = exportRecords.map(record => ({
          Customer: record.customer,
          Ref: record.ref,
          File: record.file,
          'Work Order': record.workOrder,
          'Drop Done': record.dropDone,
          'Drop Date': record.dropDate,
          'Return Needed': record.returnNeeded,
          'Return Date': record.returnDate,
          'Docs Sent': record.docsSent,
          'Docs Received': record.docsReceived,
          'Doc Cutoff Date': record.docCutoffDate,
          'AES/MBL/VGM Sent': record.aesMblVgmSent,
          'Titles Dispatched': record.titlesDispatched,
          'Validated Fwd': record.validatedFwd,
          'Titles Returned': record.titlesReturned,
          'SSL Draft Inv Rec': record.sslDraftInvRec,
          'Draft Inv Approved': record.draftInvApproved,
          'Transphere Inv Sent': record.transphereInvSent,
          'Payment Rec': record.paymentRec,
          'SSL Paid': record.sslPaid,
          'Insured': record.insured,
          'Released': record.released,
          'Notes': record.notes
        }));
        filename = 'export_tracking_data.xlsx';
        break;
        
      case 'import-table':
        selectedRows = selectedImportRows;
        const importRecords = selectedRows.length > 0
          ? importData.filter(item => selectedRows.includes(item.id))
          : importData;
        
        dataToExport = importRecords.map(record => ({
          Customer: record.customer,
          Booking: record.booking,
          File: record.file,
          'ETA Final POD': record.etaFinalPod,
          Bond: record.bond,
          POA: record.poa,
          ISF: record.isf,
          'Packing List/Commercial Invoice': record.packingListCommercialInvoice,
          'Bill of Lading': record.billOfLading,
          'Arrival Notice': record.arrivalNotice,
          'ISF Filed': record.isfFiled,
          'Entry Filed': record.entryFiled,
          'BL Release': record.blRelease,
          'Customs Release': record.customsRelease,
          'Invoice Sent': record.invoiceSent,
          'Payment Received': record.paymentReceived,
          'Work Order Setup': record.workOrderSetup,
          Delivered: record.delivered,
          Returned: record.returned,
          'Delivery Date': record.deliveryDate,
          Notes: record.notes
        }));
        filename = 'import_tracking_data.xlsx';
        break;
        
      case 'all-files':
        selectedRows = selectedAllFilesRows;
        const allFilesRecords = selectedRows.length > 0
          ? allFilesData.filter(item => selectedRows.includes(item.id))
          : allFilesData;
        
        dataToExport = allFilesRecords.map(record => ({
          Customer: record.customer,
          File: record.file,
          Number: record.number,
          'Origin Port': record.originPort,
          'Origin State': record.originState,
          'Destination Port': record.destinationPort,
          'Destination Country': record.destinationCountry,
          '20\' Container': record.container20,
          '40\' Container': record.container40,
          'RoRo': record.roro,
          'LCL': record.lcl,
          'Air': record.air,
          'Truck': record.truck,
          'SSL': record.ssl,
          'NVO': record.nvo,
          'Comments': record.comments,
          'Sales Contact': record.salesContact
        }));
        filename = 'all_files_data.xlsx';
        break;
        
      case 'domestic-trucking':
        selectedRows = selectedDomesticTruckingRows;
        const domesticRecords = selectedRows.length > 0
          ? domesticTruckingData.filter(item => selectedRows.includes(item.id))
          : domesticTruckingData;
        
        dataToExport = domesticRecords.map(record => ({
          Customer: record.customer,
          File: record.file,
          'W/O Sent': record.woSent,
          Insurance: record.insurance,
          'Pick Date': record.pickDate,
          Delivered: record.delivered,
          'Payment Received': record.paymentReceived,
          'Payment Made': record.paymentMade,
          Notes: record.notes
        }));
        filename = 'domestic_trucking_data.xlsx';
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
      case 'domestic-trucking':
        return selectedDomesticTruckingRows.length > 0 ? selectedDomesticTruckingRows.length : domesticTruckingData.length;
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
