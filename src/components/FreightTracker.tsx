
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const FreightTracker = () => {
  const [exportTrackingData, setExportTrackingData] = useState<TrackingRecord[]>([]);
  const [importTrackingData, setImportTrackingData] = useState<ImportTrackingRecord[]>([]);
  const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const events = [
    ...exportTrackingData.map((record) => ({
      title: `${record.customer} - ${record.file}`,
      start: record.dropDate,
      end: record.returnDate || record.dropDate,
      allDay: true,
      color: record.returnNeeded ? 'red' : 'green',
      extendedProps: {
        type: 'export',
        ...record,
      },
    })),
    ...importTrackingData.map((record) => ({
      title: `${record.customer} - ${record.file}`,
      start: record.etaFinalPod,
      allDay: true,
      color: 'blue',
      extendedProps: {
        type: 'import',
        ...record,
      },
    })),
  ];

  const addSampleData = () => {
    setIsLoading(true);
    
    // Export tracking sample data
    const exportSampleData: TrackingRecord[] = [
      {
        id: '1',
        customer: "ACME Corp",
        ref: "EX91500",
        file: "F-1000",
        workOrder: "WO-2000",
        dropDone: true,
        dropDate: "2025-06-10",
        returnNeeded: true,
        returnDate: "2025-06-15",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: false,
        docCutoffDate: "2025-06-13",
        titlesDispatched: true,
        validatedFwd: true,
        titlesReturned: false,
        sslDraftInvRec: false,
        draftInvApproved: false,
        transphereInvSent: false,
        paymentRec: false,
        sslPaid: false,
        insured: false,
        released: false,
        docsSentToCustomer: false,
        notes: "Urgent shipment"
      },
      {
        id: '2',
        customer: "Global Traders",
        ref: "EX91501",
        file: "F-1001",
        workOrder: "WO-2001",
        dropDone: true,
        dropDate: "2025-06-25",
        returnNeeded: false,
        returnDate: "",
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: "2025-06-28",
        titlesDispatched: false,
        validatedFwd: false,
        titlesReturned: false,
        sslDraftInvRec: false,
        draftInvApproved: true,
        transphereInvSent: false,
        paymentRec: false,
        sslPaid: false,
        insured: true,
        released: false,
        docsSentToCustomer: false,
        notes: "Special handling required"
      }
    ];

    // Import tracking sample data
    const importSampleData: ImportTrackingRecord[] = [
      {
        id: '1',
        customer: 'ABC IMPORT',
        reference: 'ABC IMPORT',
        file: 'ES00525',
        etaFinalPod: '2025-07-02',
        bond: 'CONTINUOUS',
        poa: true,
        isf: true,
        packingListCommercialInvoice: true,
        billOfLading: true,
        arrivalNotice: true,
        isfFiled: true,
        entryFiled: true,
        blRelease: true,
        customsRelease: true,
        invoiceSent: true,
        paymentReceived: true,
        workOrderSetup: true,
        deliveryDate: '2025-07-05',
        notes: 'Complete shipment'
      },
      {
        id: '2',
        customer: 'DEF LOGISTICS',
        reference: 'DEF LOGISTICS',
        file: 'ES00526',
        etaFinalPod: '2025-07-15',
        bond: 'SINGLE ENTRY',
        poa: true,
        isf: false,
        packingListCommercialInvoice: true,
        billOfLading: true,
        arrivalNotice: false,
        isfFiled: false,
        entryFiled: false,
        blRelease: false,
        customsRelease: false,
        invoiceSent: false,
        paymentReceived: false,
        workOrderSetup: true,
        deliveryDate: '2025-07-20',
        notes: 'Pending ISF filing'
      }
    ];

    setExportTrackingData(exportSampleData);
    setImportTrackingData(importSampleData);
    setIsLoading(false);

    toast({
      title: "Sample data loaded",
      description: "Sample records have been loaded",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Freight Tracker</h1>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventColor="lightblue"
        eventClick={(info) => {
          console.log('Event clicked:', info.event);
        }}
        height="auto"
      />
      
      <Button onClick={addSampleData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Load Sample Data"}
      </Button>
    </div>
  );
};

export default FreightTracker;
