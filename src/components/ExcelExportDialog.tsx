
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
    const workbook = XLSX.utils.book_new();

    // Tab 1: All Files Data
    const allFilesFormatted = allFilesData.map(record => ({
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
    const allFilesWorksheet = XLSX.utils.json_to_sheet(allFilesFormatted);
    XLSX.utils.book_append_sheet(workbook, allFilesWorksheet, 'All Files');

    // Tab 2: Import Tracking Data
    const importFormatted = importData.map(record => ({
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
    const importWorksheet = XLSX.utils.json_to_sheet(importFormatted);
    XLSX.utils.book_append_sheet(workbook, importWorksheet, 'Import Tracking');

    // Tab 3: Export Tracking Data
    const exportFormatted = exportData.map(record => ({
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
      'Docs Sent to Customer': record.docsSentToCustomer,
      'Notes': record.notes
    }));
    const exportWorksheet = XLSX.utils.json_to_sheet(exportFormatted);
    XLSX.utils.book_append_sheet(workbook, exportWorksheet, 'Export Tracking');

    // Tab 4: Domestic Trucking Data
    const domesticFormatted = domesticTruckingData.map(record => ({
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
    const domesticWorksheet = XLSX.utils.json_to_sheet(domesticFormatted);
    XLSX.utils.book_append_sheet(workbook, domesticWorksheet, 'Domestic Trucking');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `freight_tracking_data_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  const getTotalRecordCount = () => {
    return allFilesData.length + importData.length + exportData.length + domesticTruckingData.length;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export All Data to Excel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-600">
            Exporting all data from all tabs into a single Excel file with separate worksheets:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• All Files: {allFilesData.length} records</li>
            <li>• Import Tracking: {importData.length} records</li>
            <li>• Export Tracking: {exportData.length} records</li>
            <li>• Domestic Trucking: {domesticTruckingData.length} records</li>
          </ul>
          <p className="text-sm font-medium">
            Total: {getTotalRecordCount()} records
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export All Data
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExportDialog;
