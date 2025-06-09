
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TrackingRecord } from './FreightTracker';
import * as XLSX from 'xlsx';

interface ExcelExportDialogProps {
  data: TrackingRecord[];
  children: React.ReactNode;
}

const ExcelExportDialog = ({ data, children }: ExcelExportDialogProps) => {
  const [exportSettings, setExportSettings] = useState({
    includeCompletedTasks: true,
    includePendingTasks: true,
    includeNotes: true,
    includeDates: true,
    formatDates: true,
    addSummarySheet: true
  });
  const { toast } = useToast();

  const handleExport = () => {
    try {
      // Filter data based on settings
      let filteredData = [...data];
      
      if (!exportSettings.includeCompletedTasks && !exportSettings.includePendingTasks) {
        toast({
          title: "Export Error",
          description: "Please select at least one data type to export.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for export
      const exportData = filteredData.map(record => {
        const processedRecord: any = {
          'Customer': record.customer,
          'Reference': record.ref,
          'File': record.file,
          'Work Order': record.workOrder,
        };

        if (exportSettings.includeDates) {
          processedRecord['Drop Date'] = exportSettings.formatDates && record.dropDate 
            ? new Date(record.dropDate).toLocaleDateString() 
            : record.dropDate;
          processedRecord['Return Date'] = exportSettings.formatDates && record.returnDate 
            ? new Date(record.returnDate).toLocaleDateString() 
            : record.returnDate;
          processedRecord['Doc Cutoff Date'] = exportSettings.formatDates && record.docCutoffDate 
            ? new Date(record.docCutoffDate).toLocaleDateString() 
            : record.docCutoffDate;
        }

        // Add boolean fields
        processedRecord['Drop Done'] = record.dropDone ? 'Yes' : 'No';
        processedRecord['Return Needed'] = record.returnNeeded ? 'Yes' : 'No';
        processedRecord['Docs Sent'] = record.docsSent ? 'Yes' : 'No';
        processedRecord['Docs Received'] = record.docsReceived ? 'Yes' : 'No';
        processedRecord['AES/MBL/VGM Sent'] = record.aesMblVgmSent ? 'Yes' : 'No';
        processedRecord['Titles Dispatched'] = record.titlesDispatched ? 'Yes' : 'No';
        processedRecord['Validated Fwd'] = record.validatedFwd ? 'Yes' : 'No';
        processedRecord['Titles Returned'] = record.titlesReturned ? 'Yes' : 'No';
        processedRecord['SSL Draft Inv Rec'] = record.sslDraftInvRec ? 'Yes' : 'No';
        processedRecord['Draft Inv Approved'] = record.draftInvApproved ? 'Yes' : 'No';
        processedRecord['Transphere Inv Sent'] = record.transphereInvSent ? 'Yes' : 'No';
        processedRecord['Payment Received'] = record.paymentRec ? 'Yes' : 'No';
        processedRecord['SSL Paid'] = record.sslPaid ? 'Yes' : 'No';
        processedRecord['Insured'] = record.insured ? 'Yes' : 'No';
        processedRecord['Released'] = record.released ? 'Yes' : 'No';
        processedRecord['Docs Sent to Customer'] = record.docsSentToCustomer ? 'Yes' : 'No';

        if (exportSettings.includeNotes && record.notes) {
          processedRecord['Notes'] = record.notes;
        }

        return processedRecord;
      });

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Add main data sheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Style the header row
      const headerRange = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "366092" } }
        };
      }
      
      // Set column widths
      const colWidths = Object.keys(exportData[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tracking Records');

      // Add summary sheet if requested
      if (exportSettings.addSummarySheet) {
        const summary = [
          { 'Metric': 'Total Records', 'Value': data.length },
          { 'Metric': 'Completed Drops', 'Value': data.filter(r => r.dropDone).length },
          { 'Metric': 'Pending Returns', 'Value': data.filter(r => r.returnNeeded && !r.titlesReturned).length },
          { 'Metric': 'Docs Sent', 'Value': data.filter(r => r.docsSent).length },
          { 'Metric': 'Payment Received', 'Value': data.filter(r => r.paymentRec).length },
          { 'Metric': 'Released', 'Value': data.filter(r => r.released).length },
        ];
        
        const summaryWorksheet = XLSX.utils.json_to_sheet(summary);
        XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
      }
      
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Export to Excel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Data Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="completed">Include Completed Tasks</Label>
                <Switch
                  id="completed"
                  checked={exportSettings.includeCompletedTasks}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeCompletedTasks: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pending">Include Pending Tasks</Label>
                <Switch
                  id="pending"
                  checked={exportSettings.includePendingTasks}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includePendingTasks: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notes">Include Notes</Label>
                <Switch
                  id="notes"
                  checked={exportSettings.includeNotes}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeNotes: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Format Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dates">Include Dates</Label>
                <Switch
                  id="dates"
                  checked={exportSettings.includeDates}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, includeDates: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="format-dates">Format Dates</Label>
                <Switch
                  id="format-dates"
                  checked={exportSettings.formatDates}
                  disabled={!exportSettings.includeDates}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, formatDates: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="summary">Add Summary Sheet</Label>
                <Switch
                  id="summary"
                  checked={exportSettings.addSummarySheet}
                  onCheckedChange={(checked) => setExportSettings(prev => ({ ...prev, addSummarySheet: checked }))}
                />
              </div>
            </CardContent>
          </Card>

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
