
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

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `freight-tracking-export-${timestamp}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Export Successful",
        description: `File exported as ${fileName}`,
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
            Export all tracking records to Excel format.
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
