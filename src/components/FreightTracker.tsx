import React, { useState, useEffect } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const FreightTracker = () => {
  const [exportTrackingData, setExportTrackingData] = useState<TrackingRecord[]>([]);
  const [importTrackingData, setImportTrackingData] = useState<ImportTrackingRecord[]>([]);
    const [allFilesData, setAllFilesData] = useState<AllFilesRecord[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const unsubscribeExport = onSnapshot(
      collection(db, `users/${user.uid}/trackingRecords`),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TrackingRecord[];
        setExportTrackingData(data);
      },
      (error) => {
        console.error("Error fetching export tracking data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch export tracking data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    const unsubscribeImport = onSnapshot(
      collection(db, `users/${user.uid}/importRecords`),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ImportTrackingRecord[];
        setImportTrackingData(data);
      },
      (error) => {
        console.error("Error fetching import tracking data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch import tracking data",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

      const unsubscribeAllFiles = onSnapshot(
          collection(db, `users/${user.uid}/allFilesRecords`),
          (snapshot) => {
              const data = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
              })) as AllFilesRecord[];
              setAllFilesData(data);
          },
          (error) => {
              console.error("Error fetching all files data:", error);
              toast({
                  title: "Error",
                  description: "Failed to fetch all files data",
                  variant: "destructive",
              });
              setIsLoading(false);
          }
      );

    setIsLoading(false);

    return () => {
      unsubscribeExport();
      unsubscribeImport();
        unsubscribeAllFiles();
    };
  }, [user]);

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
      title: `${record.reference} - ${record.file}`,
      start: record.etaFinalPod,
      allDay: true,
      color: 'blue',
      extendedProps: {
        type: 'import',
        ...record,
      },
    })),
  ];

  const addSampleData = async () => {
    if (!user) return;

    try {
      // Check if data already exists
      const exportSnapshot = await getDocs(collection(db, `users/${user.uid}/trackingRecords`));
      const importSnapshot = await getDocs(collection(db, `users/${user.uid}/importRecords`));
      const allFilesSnapshot = await getDocs(collection(db, `users/${user.uid}/allFilesRecords`));
      
      if (exportSnapshot.empty) {
        // Add export tracking sample data
        const exportSampleData = [
          {
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
          },
          {
            customer: "Tech Systems",
            ref: "EX91502",
            file: "F-1002",
            workOrder: "WO-2002",
            dropDone: true,
            dropDate: "2025-07-05",
            returnNeeded: true,
            returnDate: "2025-07-18",
            docsSent: true,
            docsReceived: true,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-15",
            titlesDispatched: false,
            validatedFwd: true,
            titlesReturned: false,
            sslDraftInvRec: true,
            draftInvApproved: true,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: false,
            released: false,
            docsSentToCustomer: false,
            notes: "High value cargo"
          },
          {
            customer: "Blue Ocean Corp",
            ref: "EX91503",
            file: "F-1003",
            workOrder: "WO-2003",
            dropDone: true,
            dropDate: "2025-07-08",
            returnNeeded: false,
            returnDate: "",
            docsSent: true,
            docsReceived: false,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-16",
            titlesDispatched: false,
            validatedFwd: true,
            titlesReturned: false,
            sslDraftInvRec: true,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: true,
            released: true,
            docsSentToCustomer: false,
            notes: "Temperature controlled"
          },
          {
            customer: "Continental Freight",
            ref: "EX91504",
            file: "F-1004",
            workOrder: "WO-2004",
            dropDone: true,
            dropDate: "2025-06-11",
            returnNeeded: true,
            returnDate: "2025-07-20",
            docsSent: true,
            docsReceived: false,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-17",
            titlesDispatched: true,
            validatedFwd: false,
            titlesReturned: false,
            sslDraftInvRec: true,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: true,
            released: false,
            docsSentToCustomer: false,
            notes: "Expedited delivery"
          },
          {
            customer: "Metro Industries",
            ref: "EX91505",
            file: "F-1005",
            workOrder: "WO-2005",
            dropDone: false,
            dropDate: "2025-07-20",
            returnNeeded: true,
            returnDate: "2025-07-25",
            docsSent: false,
            docsReceived: false,
            aesMblVgmSent: false,
            docCutoffDate: "2025-07-18",
            titlesDispatched: false,
            validatedFwd: false,
            titlesReturned: false,
            sslDraftInvRec: false,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: false,
            released: false,
            docsSentToCustomer: false,
            notes: "Pending documentation"
          },
          {
            customer: "Pacific Solutions",
            ref: "EX91506",
            file: "F-1006",
            workOrder: "WO-2006",
            dropDone: false,
            dropDate: "2025-06-22",
            returnNeeded: false,
            returnDate: "",
            docsSent: true,
            docsReceived: true,
            aesMblVgmSent: false,
            docCutoffDate: "2025-06-19",
            titlesDispatched: true,
            validatedFwd: true,
            titlesReturned: false,
            sslDraftInvRec: false,
            draftInvApproved: true,
            transphereInvSent: true,
            paymentRec: true,
            sslPaid: true,
            insured: true,
            released: false,
            docsSentToCustomer: true,
            notes: "Ready for pickup"
          },
          {
            customer: "Atlantic Shipping",
            ref: "EX91507",
            file: "F-1007",
            workOrder: "WO-2007",
            dropDone: true,
            dropDate: "2025-06-09",
            returnNeeded: true,
            returnDate: "2025-07-24",
            docsSent: true,
            docsReceived: true,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-21",
            titlesDispatched: true,
            validatedFwd: true,
            titlesReturned: true,
            sslDraftInvRec: true,
            draftInvApproved: true,
            transphereInvSent: true,
            paymentRec: true,
            sslPaid: true,
            insured: true,
            released: true,
            docsSentToCustomer: true,
            notes: "Completed successfully"
          },
          {
            customer: "Northern Logistics",
            ref: "EX91508",
            file: "F-1008",
            workOrder: "WO-2008",
            dropDone: false,
            dropDate: "2025-07-25",
            returnNeeded: false,
            returnDate: "",
            docsSent: false,
            docsReceived: false,
            aesMblVgmSent: false,
            docCutoffDate: "2025-07-23",
            titlesDispatched: false,
            validatedFwd: false,
            titlesReturned: false,
            sslDraftInvRec: false,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: false,
            released: false,
            docsSentToCustomer: false,
            notes: "Awaiting customer confirmation"
          },
          {
            customer: "Coastal Express",
            ref: "EX91509",
            file: "F-1009",
            workOrder: "WO-2009",
            dropDone: true,
            dropDate: "2025-06-13",
            returnNeeded: true,
            returnDate: "2025-07-28",
            docsSent: true,
            docsReceived: false,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-26",
            titlesDispatched: false,
            validatedFwd: true,
            titlesReturned: false,
            sslDraftInvRec: true,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: true,
            released: false,
            docsSentToCustomer: false,
            notes: "Classified shipment"
          },
          {
            customer: "Eastern Trade Co",
            ref: "EX91510",
            file: "F-1010",
            workOrder: "WO-2010",
            dropDone: true,
            dropDate: "2025-06-14",
            returnNeeded: true,
            returnDate: "2025-07-29",
            docsSent: true,
            docsReceived: true,
            aesMblVgmSent: true,
            docCutoffDate: "2025-07-27",
            titlesDispatched: true,
            validatedFwd: true,
            titlesReturned: false,
            sslDraftInvRec: true,
            draftInvApproved: true,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: true,
            released: false,
            docsSentToCustomer: false,
            notes: "Ready for processing"
          },
          {
            customer: "Western Exports",
            ref: "EX91511",
            file: "F-1011",
            workOrder: "WO-2011",
            dropDone: false,
            dropDate: "2025-07-30",
            returnNeeded: false,
            returnDate: "",
            docsSent: false,
            docsReceived: false,
            aesMblVgmSent: false,
            docCutoffDate: "2025-07-28",
            titlesDispatched: false,
            validatedFwd: false,
            titlesReturned: false,
            sslDraftInvRec: false,
            draftInvApproved: false,
            transphereInvSent: false,
            paymentRec: false,
            sslPaid: false,
            insured: false,
            released: false,
            docsSentToCustomer: false,
            notes: "New booking"
          }
        ];

        for (const record of exportSampleData) {
          await addDoc(collection(db, `users/${user.uid}/trackingRecords`), record);
        }
      }

      if (importSnapshot.empty) {
        // Add import tracking sample data
        const importSampleData = [
          {
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
          },
          {
            reference: 'GHI TRADING',
            file: 'ES00527',
            etaFinalPod: '2025-06-28',
            bond: 'CONTINUOUS',
            poa: true,
            isf: true,
            packingListCommercialInvoice: false,
            billOfLading: false,
            arrivalNotice: false,
            isfFiled: true,
            entryFiled: false,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: false,
            deliveryDate: '2025-07-10',
            notes: 'Awaiting documents'
          },
          {
            reference: 'Pacific Imports',
            file: 'ES00528',
            etaFinalPod: '2025-06-10',
            bond: 'SINGLE ENTRY',
            poa: false,
            isf: false,
            packingListCommercialInvoice: false,
            billOfLading: false,
            arrivalNotice: false,
            isfFiled: false,
            entryFiled: false,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: false,
            deliveryDate: '2025-06-25',
            notes: 'New shipment - just received'
          },
          {
            reference: 'MNO CARGO',
            file: 'ES00529',
            etaFinalPod: '2025-07-05',
            bond: 'CONTINUOUS',
            poa: true,
            isf: true,
            packingListCommercialInvoice: true,
            billOfLading: true,
            arrivalNotice: true,
            isfFiled: true,
            entryFiled: true,
            blRelease: true,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: true,
            deliveryDate: '2025-07-18',
            notes: 'Customs examination required'
          },
          {
            reference: 'Global Connect',
            file: 'ES00530',
            etaFinalPod: '2025-06-20',
            bond: 'CONTINUOUS',
            poa: true,
            isf: true,
            packingListCommercialInvoice: true,
            billOfLading: true,
            arrivalNotice: true,
            isfFiled: true,
            entryFiled: true,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: true,
            deliveryDate: '2025-06-15',
            notes: 'Waiting for BL release'
          },
          {
            reference: 'Euro Trade',
            file: 'ES00531',
            etaFinalPod: '2025-07-01',
            bond: 'SINGLE ENTRY',
            poa: true,
            isf: true,
            packingListCommercialInvoice: true,
            billOfLading: false,
            arrivalNotice: false,
            isfFiled: true,
            entryFiled: false,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: false,
            deliveryDate: '2025-07-30',
            notes: 'Documents in transit'
          },
          {
            reference: 'ASIA CONNECT',
            file: 'ES00532',
            etaFinalPod: '2025-06-25',
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
            paymentReceived: false,
            workOrderSetup: true,
            deliveryDate: '2025-07-12',
            notes: 'Payment pending'
          },
          {
            reference: 'Atlantic Freight',
            file: 'ES00533',
            etaFinalPod: '2025-06-30',
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
            deliveryDate: '2025-07-15',
            notes: 'Ready for delivery'
          },
          {
            reference: 'Northern Express',
            file: 'ES00534',
            etaFinalPod: '2025-06-22',
            bond: 'SINGLE ENTRY',
            poa: true,
            isf: false,
            packingListCommercialInvoice: false,
            billOfLading: false,
            arrivalNotice: false,
            isfFiled: false,
            entryFiled: false,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: false,
            deliveryDate: '2025-07-08',
            notes: 'Urgent - missing documents'
          },
          {
            reference: 'Southern Logistics',
            file: 'ES00535',
            etaFinalPod: '2025-07-08',
            bond: 'CONTINUOUS',
            poa: true,
            isf: true,
            packingListCommercialInvoice: true,
            billOfLading: true,
            arrivalNotice: false,
            isfFiled: true,
            entryFiled: true,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: true,
            deliveryDate: '2025-07-25',
            notes: 'Processing customs'
          },
          {
            reference: 'Central Trade',
            file: 'ES00536',
            etaFinalPod: '2025-07-12',
            bond: 'SINGLE ENTRY',
            poa: true,
            isf: true,
            packingListCommercialInvoice: true,
            billOfLading: true,
            arrivalNotice: true,
            isfFiled: true,
            entryFiled: false,
            blRelease: false,
            customsRelease: false,
            invoiceSent: false,
            paymentReceived: false,
            workOrderSetup: false,
            deliveryDate: '2025-07-28',
            notes: 'Entry preparation'
          }
        ];

        for (const record of importSampleData) {
          await addDoc(collection(db, `users/${user.uid}/importRecords`), record);
        }
      }

      if (allFilesSnapshot.empty) {
        // Add all files sample data
        const allFilesSampleData = [
          {
            file: 'ES',
            number: '00126',
            customer: 'ABC LOGISTICS',
            originPort: 'Long Beach',
            originState: 'CA',
            destinationPort: 'Hamburg',
            destinationCountry: 'Germany',
            container20: '2',
            container40: '1',
            roro: '',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'HAPAG LLOYD',
            nvo: 'EXPEDITORS',
            comments: 'Priority shipment',
            salesContact: 'John Smith'
          },
          {
            file: 'ES',
            number: '00226',
            customer: 'ABC EXPORT',
            originPort: 'Detroit',
            originState: 'MI',
            destinationPort: 'Beirut',
            destinationCountry: 'Lebanon',
            container20: '',
            container40: '2',
            roro: '',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'MAERSK',
            nvo: 'TRANSEND',
            comments: '',
            salesContact: 'Sarah Johnson'
          },
          {
            file: 'ES',
            number: '00326',
            customer: 'GLOBAL TRADERS',
            originPort: 'Miami',
            originState: 'FL',
            destinationPort: 'Santos',
            destinationCountry: 'Brazil',
            container20: '1',
            container40: '',
            roro: '',
            lcl: '5',
            air: '',
            truck: '',
            ssl: 'MSC',
            nvo: 'KUEHNE NAGEL',
            comments: 'Temperature controlled',
            salesContact: 'Mike Davis'
          },
          {
            file: 'ES',
            number: '00426',
            customer: 'PACIFIC IMPORTS',
            originPort: 'Seattle',
            originState: 'WA',
            destinationPort: 'Yokohama',
            destinationCountry: 'Japan',
            container20: '',
            container40: '3',
            roro: '',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'NYK LINE',
            nvo: 'PANALPINA',
            comments: 'Hazmat cargo',
            salesContact: 'Lisa Chen'
          },
          {
            file: 'ES',
            number: '00526',
            customer: 'EURO CONNECTIONS',
            originPort: 'Norfolk',
            originState: 'VA',
            destinationPort: 'Rotterdam',
            destinationCountry: 'Netherlands',
            container20: '4',
            container40: '2',
            roro: '',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'CMA CGM',
            nvo: 'DB SCHENKER',
            comments: 'Weekly service',
            salesContact: 'Robert Wilson'
          },
          {
            file: 'ES',
            number: '00626',
            customer: 'ASIA TRADE CO',
            originPort: 'Oakland',
            originState: 'CA',
            destinationPort: 'Shanghai',
            destinationCountry: 'China',
            container20: '',
            container40: '1',
            roro: '',
            lcl: '',
            air: '2',
            truck: '',
            ssl: 'COSCO',
            nvo: 'GEODIS',
            comments: 'Express service',
            salesContact: 'Amanda Lee'
          },
          {
            file: 'ES',
            number: '00726',
            customer: 'MEDITERRANEAN SHIPPING',
            originPort: 'Charleston',
            originState: 'SC',
            destinationPort: 'Genoa',
            destinationCountry: 'Italy',
            container20: '6',
            container40: '4',
            roro: '',
            lcl: '2',
            air: '',
            truck: '',
            ssl: 'MSC',
            nvo: 'EXPEDITORS',
            comments: 'Auto parts shipment',
            salesContact: 'Tony Romano'
          },
          {
            file: 'ES',
            number: '00826',
            customer: 'NORDIC LOGISTICS',
            originPort: 'Tacoma',
            originState: 'WA',
            destinationPort: 'Gothenburg',
            destinationCountry: 'Sweden',
            container20: '1',
            container40: '1',
            roro: '3',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'WALLENIUS',
            nvo: 'DFDS',
            comments: 'Vehicle transport',
            salesContact: 'Erik Larsen'
          },
          {
            file: 'ES',
            number: '00926',
            customer: 'TROPICAL EXPORTS',
            originPort: 'Houston',
            originState: 'TX',
            destinationPort: 'Cartagena',
            destinationCountry: 'Colombia',
            container20: '3',
            container40: '2',
            roro: '',
            lcl: '1',
            air: '',
            truck: '2',
            ssl: 'HAPAG LLOYD',
            nvo: 'KUEHNE NAGEL',
            comments: 'Perishable goods',
            salesContact: 'Maria Gonzalez'
          },
          {
            file: 'ES',
            number: '01026',
            customer: 'BRITISH IMPORTS',
            originPort: 'Savannah',
            originState: 'GA',
            destinationPort: 'Southampton',
            destinationCountry: 'UK',
            container20: '2',
            container40: '3',
            roro: '',
            lcl: '4',
            air: '1',
            truck: '',
            ssl: 'MAERSK',
            nvo: 'PANALPINA',
            comments: 'Mixed cargo',
            salesContact: 'James Parker'
          },
          {
            file: 'ES',
            number: '01126',
            customer: 'AFRICAN TRADE CO',
            originPort: 'Baltimore',
            originState: 'MD',
            destinationPort: 'Lagos',
            destinationCountry: 'Nigeria',
            container20: '5',
            container40: '3',
            roro: '1',
            lcl: '',
            air: '',
            truck: '',
            ssl: 'CMA CGM',
            nvo: 'BOLLORE',
            comments: 'Construction materials',
            salesContact: 'David Okafor'
          },
          {
            file: 'ES',
            number: '01226',
            customer: 'AUSSIE EXPORTS',
            originPort: 'Los Angeles',
            originState: 'CA',
            destinationPort: 'Sydney',
            destinationCountry: 'Australia',
            container20: '8',
            container40: '6',
            roro: '',
            lcl: '3',
            air: '2',
            truck: '',
            ssl: 'ANL',
            nvo: 'GEODIS',
            comments: 'Large volume shipment',
            salesContact: 'Steve Matthews'
          }
        ];

        for (const record of allFilesSampleData) {
          await addDoc(collection(db, `users/${user.uid}/allFilesRecords`), record);
        }
      }

      toast({
        title: "Sample data added",
        description: "Sample records have been added to your database",
      });
    } catch (error) {
      console.error("Error adding sample data:", error);
      toast({
        title: "Error",
        description: "Failed to add sample data",
        variant: "destructive",
      });
    }
  };

  return (
    
      
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
        />
        <Button onClick={addSampleData} disabled={isLoading}>
          {isLoading ? "Loading..." : "Add Sample Data"}
        </Button>
      
    
  );
};

export default FreightTracker;
