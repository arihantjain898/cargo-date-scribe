
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TrackingRecord } from './FreightTracker';
import * as XLSX from 'xlsx';

interface ExcelExportDialogProps {
  data: TrackingRecord[];
  children: React.ReactNode;
}

const ExcelExportDialog = ({ data, children }: ExcelExportDialogProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    try {
      // Prepare data for export with proper formatting
      const exportData = data.map(record => ({
        'Customer': record.customer,
        'Reference': record.ref,
        'File': record.file,
        'Work Order': record.workOrder,
        'Drop Date': record.dropDate || 'Not Set',
        'Return Date': record.returnDate || 'Not Set',
        'Doc Cutoff Date': record.docCutoffDate || 'Not Set',
        'Drop Done': record.dropDone ? 'Yes' : 'No',
        'Return Needed': record.returnNeeded ? 'Yes' : 'No',
        'Docs Sent': record.docsSent ? 'Yes' : 'No',
        'Docs Received': record.docsReceived ? 'Yes' : 'No',
        'AES/MBL/VGM Sent': record.aesMblVgmSent ? 'Yes' : 'No',
        'Titles Dispatched': record.titlesDispatched ? 'Yes' : 'No',
        'Validated Fwd': record.validatedFwd ? 'Yes' : 'No',
        'Titles Returned': record.titlesReturned ? 'Yes' : 'No',
        'SSL Draft Inv Rec': record.sslDraftInvRec ? 'Yes' : 'No',
        'Draft Inv Approved': record.draftInvApproved ? 'Yes' : 'No',
        'Transphere Inv Sent': record.transphereInvSent ? 'Yes' : 'No',
        'Payment Received': record.paymentRec ? 'Yes' : 'No',
        'SSL Paid': record.sslPaid ? 'Yes' : 'No',
        'Insured': record.insured ? 'Yes' : 'No',
        'Released': record.released ? 'Yes' : 'No',
        'Docs Sent to Customer': record.docsSentToCustomer ? 'Yes' : 'No',
        'Notes': record.notes || ''
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better formatting
      const columnWidths = [
        { wch: 15 }, // Customer
        { wch: 12 }, // Reference
        { wch: 10 }, // File
        { wch: 12 }, // Work Order
        { wch: 12 }, // Drop Date
        { wch: 12 }, // Return Date
        { wch: 15 }, // Doc Cutoff Date
        { wch: 10 }, // Drop Done
        { wch: 12 }, // Return Needed
        { wch: 10 }, // Docs Sent
        { wch: 12 }, // Docs Received
        { wch: 15 }, // AES/MBL/VGM Sent
        { wch: 15 }, // Titles Dispatched
        { wch: 12 }, // Validated Fwd
        { wch: 12 }, // Titles Returned
        { wch: 15 }, // SSL Draft Inv Rec
        { wch: 15 }, // Draft Inv Approved
        { wch: 15 }, // Transphere Inv Sent
        { wch: 15 }, // Payment Received
        { wch: 10 }, // SSL Paid
        { wch: 10 }, // Insured
        { wch: 10 }, // Released
        { wch: 18 }, // Docs Sent to Customer
        { wch: 30 }  // Notes
      ];
      worksheet['!cols'] = columnWidths;

      // Style the header row
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
            fill: { fgColor: { rgb: "366092" } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } }
            }
          };
        }
      }

      // Style data cells with alternating row colors
      for (let row = 1; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
              alignment: { horizontal: "left", vertical: "center" },
              fill: { fgColor: { rgb: row % 2 === 0 ? "F8F9FA" : "FFFFFF" } },
              border: {
                top: { style: "thin", color: { rgb: "E0E0E0" } },
                bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                left: { style: "thin", color: { rgb: "E0E0E0" } },
                right: { style: "thin", color: { rgb: "E0E0E0" } }
              }
            };
          }
        }
      }

      // Add summary sheet
      const summary = [
        ['Summary Report', ''],
        ['', ''],
        ['Total Records', data.length],
        ['Completed Drops', data.filter(r => r.dropDone).length],
        ['Pending Returns', data.filter(r => r.returnNeeded && !r.titlesReturned).length],
        ['Docs Sent', data.filter(r => r.docsSent).length],
        ['Payment Received', data.filter(r => r.paymentRec).length],
        ['Released', data.filter(r => r.released).length],
        ['', ''],
        ['Export Date', new Date().toLocaleString()]
      ];

      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summary);
      summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];

      // Style summary sheet
      summaryWorksheet['A1'].s = {
        font: { bold: true, sz: 16, color: { rgb: "366092" } },
        alignment: { horizontal: "left" }
      };

      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracking Records');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `freight-tracking-export-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Export Successful",
        description: `File exported as ${fileName} with professional formatting`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Export to Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Export all tracking records to a professionally formatted Excel file with summary sheet.
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Export includes:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All tracking data and dates</li>
              <li>• Formatted columns and styling</li>
              <li>• Summary statistics sheet</li>
              <li>• Professional layout</li>
            </ul>
          </div>

          <Button onClick={handleExport} className="w-full" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Excel File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelExportDialog;
