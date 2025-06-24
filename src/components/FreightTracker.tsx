import React, { useState, useEffect } from 'react';
import { Calendar, Edit3, Plus, Bell, Search, Download, Upload, Package, Truck, FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingTable from './TrackingTable';
import ImportTrackingTable from './ImportTrackingTable';
import AllFilesTable from './AllFilesTable';
import CalendarView from './CalendarView';
import NotificationSettings from './NotificationSettings';
import ExcelExportDialog from './ExcelExportDialog';
import ExcelImportDialog from './ExcelImportDialog';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { useExcelImport } from '../hooks/useExcelImport';
import { useSearch, useImportSearch } from '../hooks/useSearch';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { useNotifications } from '../hooks/useNotifications';
import { useFirestore } from '../hooks/useFirestore';

const FreightTracker = () => {
  // Get active tab from localStorage or default to 'export-table'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('freight-tracker-active-tab') || 'export-table';
  });

  // Persist active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freight-tracker-active-tab', activeTab);
  }, [activeTab]);

  // Use Firebase for data persistence
  const currentUserId = 'demo-user';
  const {
    data: exportData,
    loading: exportLoading,
    addItem: addExportItem,
    updateItem: updateExportItem,
    deleteItem: deleteExportItem
  } = useFirestore<TrackingRecord>('export_tracking', currentUserId);

  const {
    data: importData,
    loading: importLoading,
    addItem: addImportItem,
    updateItem: updateImportItem,
    deleteItem: deleteImportItem
  } = useFirestore<ImportTrackingRecord>('import_tracking', currentUserId);

  const {
    data: allFilesData,
    loading: allFilesLoading,
    addItem: addAllFilesItem,
    updateItem: updateAllFilesItem,
    deleteItem: deleteAllFilesItem
  } = useFirestore<AllFilesRecord>('all_files', currentUserId);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);
  const [sampleDataAdded, setSampleDataAdded] = useState(false);

  const { notifications, addNotification } = useNotifications();
  const { fileInputRef, importFromExcel } = useExcelImport(() => {}, () => {}, () => {});
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);

  // Add sample data when component mounts and data is loaded
  useEffect(() => {
    if (!exportLoading && !importLoading && !allFilesLoading && !sampleDataAdded) {
      const shouldAddSampleData = exportData.length === 0 && importData.length === 0 && allFilesData.length === 0;
      
      if (shouldAddSampleData) {
        addSampleData();
        setSampleDataAdded(true);
      }
    }
  }, [exportLoading, importLoading, allFilesLoading, exportData.length, importData.length, allFilesData.length, sampleDataAdded]);

  const addSampleData = async () => {
    console.log('Adding sample data to Firebase...');
    
    // Sample Export Records
    const sampleExportRecords: Omit<TrackingRecord, 'id'>[] = [
      {
        customer: "ABC Manufacturing",
        ref: "EXP001",
        file: "ES24001",
        workOrder: "WO2024001",
        dropDone: true,
        dropDate: "2024-12-20",
        returnNeeded: true,
        returnDate: "2024-12-28",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: true,
        docCutoffDate: "2024-12-18",
        titlesDispatched: true,
        validatedFwd: true,
        titlesReturned: false,
        sslDraftInvRec: true,
        draftInvApproved: true,
        transphereInvSent: true,
        paymentRec: false,
        sslPaid: false,
        insured: true,
        released: false,
        docsSentToCustomer: false,
        notes: "Urgent shipment to Germany"
      },
      {
        customer: "XYZ Logistics",
        ref: "EXP002",
        file: "ES24002",
        workOrder: "WO2024002",
        dropDone: true,
        dropDate: "2024-12-22",
        returnNeeded: false,
        returnDate: "",
        docsSent: true,
        docsReceived: false,
        aesMblVgmSent: true,
        docCutoffDate: "2024-12-25",
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
        notes: "Container shipment to UK"
      },
      {
        customer: "Global Traders Inc",
        ref: "EXP003",
        file: "ES24003",
        workOrder: "WO2024003",
        dropDone: false,
        dropDate: "2025-01-05",
        returnNeeded: true,
        returnDate: "2025-01-12",
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: "2025-01-03",
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
        notes: "Heavy machinery to Japan"
      },
      {
        customer: "Ocean Freight Co",
        ref: "EXP004",
        file: "ES24004",
        workOrder: "WO2024004",
        dropDone: true,
        dropDate: "2024-12-15",
        returnNeeded: true,
        returnDate: "2024-12-30",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: true,
        docCutoffDate: "2024-12-12",
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
        notes: "Completed shipment to Australia"
      },
      {
        customer: "Pacific Imports",
        ref: "EXP005",
        file: "ES24005",
        workOrder: "WO2024005",
        dropDone: true,
        dropDate: "2025-01-08",
        returnNeeded: false,
        returnDate: "",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: false,
        docCutoffDate: "2025-01-15",
        titlesDispatched: false,
        validatedFwd: false,
        titlesReturned: false,
        sslDraftInvRec: false,
        draftInvApproved: false,
        transphereInvSent: false,
        paymentRec: false,
        sslPaid: false,
        insured: true,
        released: false,
        docsSentToCustomer: false,
        notes: "Electronics to Singapore"
      },
      {
        customer: "Euro Express",
        ref: "EXP006",
        file: "ES24006",
        workOrder: "WO2024006",
        dropDone: false,
        dropDate: "2025-01-20",
        returnNeeded: true,
        returnDate: "2025-01-25",
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: "2025-01-18",
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
        notes: "Automotive parts to Netherlands"
      },
      {
        customer: "Asian Trade Ltd",
        ref: "EXP007",
        file: "ES24007",
        workOrder: "WO2024007",
        dropDone: true,
        dropDate: "2024-12-18",
        returnNeeded: true,
        returnDate: "2025-01-02",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: true,
        docCutoffDate: "2024-12-20",
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
        notes: "Textiles to South Korea"
      },
      {
        customer: "North Star Shipping",
        ref: "EXP008",
        file: "ES24008",
        workOrder: "WO2024008",
        dropDone: true,
        dropDate: "2025-01-10",
        returnNeeded: false,
        returnDate: "",
        docsSent: true,
        docsReceived: false,
        aesMblVgmSent: true,
        docCutoffDate: "2025-01-12",
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
        notes: "Industrial equipment to Canada"
      },
      {
        customer: "Mediterranean Cargo",
        ref: "EXP009",
        file: "ES24009",
        workOrder: "WO2024009",
        dropDone: false,
        dropDate: "2025-01-15",
        returnNeeded: true,
        returnDate: "2025-01-22",
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: "2025-01-13",
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
        notes: "Food products to Italy"
      },
      {
        customer: "Arctic Logistics",
        ref: "EXP010",
        file: "ES24010",
        workOrder: "WO2024010",
        dropDone: true,
        dropDate: "2024-12-25",
        returnNeeded: true,
        returnDate: "2025-01-05",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: true,
        docCutoffDate: "2024-12-23",
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
        notes: "Mining equipment to Norway"
      },
      {
        customer: "Tropical Exports",
        ref: "EXP011",
        file: "ES24011",
        workOrder: "WO2024011",
        dropDone: true,
        dropDate: "2025-01-03",
        returnNeeded: false,
        returnDate: "",
        docsSent: true,
        docsReceived: true,
        aesMblVgmSent: true,
        docCutoffDate: "2025-01-01",
        titlesDispatched: true,
        validatedFwd: true,
        titlesReturned: false,
        sslDraftInvRec: true,
        draftInvApproved: true,
        transphereInvSent: true,
        paymentRec: false,
        sslPaid: false,
        insured: true,
        released: false,
        docsSentToCustomer: false,
        notes: "Agricultural products to Brazil"
      },
      {
        customer: "Desert Trade Co",
        ref: "EXP012",
        file: "ES24012",
        workOrder: "WO2024012",
        dropDone: false,
        dropDate: "2025-01-25",
        returnNeeded: true,
        returnDate: "2025-02-01",
        docsSent: false,
        docsReceived: false,
        aesMblVgmSent: false,
        docCutoffDate: "2025-01-23",
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
        notes: "Construction materials to UAE"
      }
    ];

    // Sample Import Records
    const sampleImportRecords: Omit<ImportTrackingRecord, 'id'>[] = [
      {
        reference: "IMP001",
        file: "IM24001",
        etaFinalPod: "2024-12-28",
        bond: "BOND001",
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
        workOrderSetup: false,
        deliveryDate: "2025-01-05",
        notes: "Electronics from China"
      },
      {
        reference: "IMP002",
        file: "IM24002",
        etaFinalPod: "2024-12-30",
        bond: "BOND002",
        poa: true,
        isf: true,
        packingListCommercialInvoice: true,
        billOfLading: true,
        arrivalNotice: false,
        isfFiled: true,
        entryFiled: false,
        blRelease: false,
        customsRelease: false,
        invoiceSent: false,
        paymentReceived: false,
        workOrderSetup: false,
        deliveryDate: "2025-01-08",
        notes: "Machinery from Germany"
      },
      {
        reference: "IMP003",
        file: "IM24003",
        etaFinalPod: "2025-01-10",
        bond: "BOND003",
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
        deliveryDate: "2025-01-15",
        notes: "Textiles from India"
      },
      {
        reference: "IMP004",
        file: "IM24004",
        etaFinalPod: "2024-12-22",
        bond: "BOND004",
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
        deliveryDate: "2024-12-25",
        notes: "Automotive parts from Japan - COMPLETED"
      },
      {
        reference: "IMP005",
        file: "IM24005",
        etaFinalPod: "2025-01-12",
        bond: "BOND005",
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
        deliveryDate: "2025-01-18",
        notes: "Furniture from Vietnam"
      },
      {
        reference: "IMP006",
        file: "IM24006",
        etaFinalPod: "2025-01-20",
        bond: "BOND006",
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
        deliveryDate: "2025-01-25",
        notes: "Chemicals from South Korea"
      },
      {
        reference: "IMP007",
        file: "IM24007",
        etaFinalPod: "2024-12-26",
        bond: "BOND007",
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
        workOrderSetup: false,
        deliveryDate: "2025-01-03",
        notes: "Food products from Mexico"
      },
      {
        reference: "IMP008",
        file: "IM24008",
        etaFinalPod: "2025-01-05",
        bond: "BOND008",
        poa: true,
        isf: false,
        packingListCommercialInvoice: true,
        billOfLading: false,
        arrivalNotice: false,
        isfFiled: false,
        entryFiled: false,
        blRelease: false,
        customsRelease: false,
        invoiceSent: false,
        paymentReceived: false,
        workOrderSetup: false,
        deliveryDate: "2025-01-12",
        notes: "Pharmaceuticals from Switzerland"
      },
      {
        reference: "IMP009",
        file: "IM24009",
        etaFinalPod: "2025-01-15",
        bond: "BOND009",
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
        deliveryDate: "2025-01-22",
        notes: "Sporting goods from Taiwan"
      },
      {
        reference: "IMP010",
        file: "IM24010",
        etaFinalPod: "2025-01-08",
        bond: "BOND010",
        poa: true,
        isf: true,
        packingListCommercialInvoice: true,
        billOfLading: true,
        arrivalNotice: false,
        isfFiled: true,
        entryFiled: false,
        blRelease: false,
        customsRelease: false,
        invoiceSent: false,
        paymentReceived: false,
        workOrderSetup: false,
        deliveryDate: "2025-01-14",
        notes: "Raw materials from Brazil"
      },
      {
        reference: "IMP011",
        file: "IM24011",
        etaFinalPod: "2025-01-18",
        bond: "BOND011",
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
        deliveryDate: "2025-01-26",
        notes: "Office equipment from Singapore"
      },
      {
        reference: "IMP012",
        file: "IM24012",
        etaFinalPod: "2025-01-22",
        bond: "BOND012",
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
        deliveryDate: "2025-01-30",
        notes: "Luxury goods from Italy"
      }
    ];

    // Sample All Files Records
    const sampleAllFilesRecords: Omit<AllFilesRecord, 'id'>[] = [
      {
        file: "ES",
        number: "24001",
        customer: "ABC Manufacturing",
        originPort: "Los Angeles",
        originState: "CA",
        destinationPort: "Hamburg",
        destinationCountry: "Germany",
        container20: "2",
        container40: "1",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Hamburg Sud",
        nvo: "Freight Forwarders Inc",
        comments: "Heavy machinery shipment",
        salesContact: "John Smith"
      },
      {
        file: "ES",
        number: "24002",
        customer: "XYZ Logistics",
        originPort: "New York",
        originState: "NY",
        destinationPort: "Southampton",
        destinationCountry: "UK",
        container20: "",
        container40: "3",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Maersk",
        nvo: "Global Shipping Co",
        comments: "Electronics export",
        salesContact: "Sarah Johnson"
      },
      {
        file: "ES",
        number: "24003",
        customer: "Global Traders Inc",
        originPort: "Long Beach",
        originState: "CA",
        destinationPort: "Tokyo",
        destinationCountry: "Japan",
        container20: "1",
        container40: "2",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "ONE",
        nvo: "Pacific Logistics",
        comments: "Automotive parts",
        salesContact: "Mike Chen"
      },
      {
        file: "ES",
        number: "24004",
        customer: "Ocean Freight Co",
        originPort: "Miami",
        originState: "FL",
        destinationPort: "Sydney",
        destinationCountry: "Australia",
        container20: "",
        container40: "1",
        roro: "2",
        lcl: "",
        air: "",
        truck: "",
        ssl: "CMA CGM",
        nvo: "Oceanic Express",
        comments: "Machinery and vehicles",
        salesContact: "Lisa Wong"
      },
      {
        file: "ES",
        number: "24005",
        customer: "Pacific Imports",
        originPort: "Seattle",
        originState: "WA",
        destinationPort: "Singapore",
        destinationCountry: "Singapore",
        container20: "3",
        container40: "",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Evergreen",
        nvo: "Trans-Pacific Shipping",
        comments: "Electronics and components",
        salesContact: "David Lee"
      },
      {
        file: "ES",
        number: "24006",
        customer: "Euro Express",
        originPort: "Houston",
        originState: "TX",
        destinationPort: "Rotterdam",
        destinationCountry: "Netherlands",
        container20: "1",
        container40: "1",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "MSC",
        nvo: "European Logistics",
        comments: "Chemical products",
        salesContact: "Anna Mueller"
      },
      {
        file: "ES",
        number: "24007",
        customer: "Asian Trade Ltd",
        originPort: "Savannah",
        originState: "GA",
        destinationPort: "Busan",
        destinationCountry: "South Korea",
        container20: "2",
        container40: "",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Hyundai MM",
        nvo: "Korea Express",
        comments: "Textile machinery",
        salesContact: "Tom Park"
      },
      {
        file: "ES",
        number: "24008",
        customer: "North Star Shipping",
        originPort: "Baltimore",
        originState: "MD",
        destinationPort: "Montreal",
        destinationCountry: "Canada",
        container20: "",
        container40: "2",
        roro: "",
        lcl: "",
        air: "",
        truck: "1",
        ssl: "COSCO",
        nvo: "North American Freight",
        comments: "Industrial equipment",
        salesContact: "Robert Taylor"
      },
      {
        file: "ES",
        number: "24009",
        customer: "Mediterranean Cargo",
        originPort: "Norfolk",
        originState: "VA",
        destinationPort: "Naples",
        destinationCountry: "Italy",
        container20: "1",
        container40: "",
        roro: "",
        lcl: "500kg",
        air: "",
        truck: "",
        ssl: "Hapag-Lloyd",
        nvo: "Mediterranean Express",
        comments: "Food products",
        salesContact: "Maria Rossi"
      },
      {
        file: "ES",
        number: "24010",
        customer: "Arctic Logistics",
        originPort: "Tacoma",
        originState: "WA",
        destinationPort: "Oslo",
        destinationCountry: "Norway",
        container20: "",
        container40: "1",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Yang Ming",
        nvo: "Nordic Shipping",
        comments: "Mining equipment",
        salesContact: "Erik Hansen"
      },
      {
        file: "ES",
        number: "24011",
        customer: "Tropical Exports",
        originPort: "Charleston",
        originState: "SC",
        destinationPort: "Santos",
        destinationCountry: "Brazil",
        container20: "3",
        container40: "",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "ZIM",
        nvo: "South American Lines",
        comments: "Agricultural machinery",
        salesContact: "Carlos Santos"
      },
      {
        file: "ES",
        number: "24012",
        customer: "Desert Trade Co",
        originPort: "Oakland",
        originState: "CA",
        destinationPort: "Dubai",
        destinationCountry: "UAE",
        container20: "1",
        container40: "2",
        roro: "",
        lcl: "",
        air: "",
        truck: "",
        ssl: "Emirates Shipping",
        nvo: "Middle East Express",
        comments: "Construction materials",
        salesContact: "Ahmed Al-Rashid"
      }
    ];

    try {
      // Add export records
      console.log('Adding export records...');
      for (const record of sampleExportRecords) {
        await addExportItem(record);
      }

      // Add import records
      console.log('Adding import records...');
      for (const record of sampleImportRecords) {
        await addImportItem(record);
      }

      // Add all files records
      console.log('Adding all files records...');
      for (const record of sampleAllFilesRecords) {
        await addAllFilesItem(record);
      }

      console.log('Sample data added successfully!');
      addNotification('Success', 'Sample data added to all tabs and Firebase!', 'success');
    } catch (error) {
      console.error('Error adding sample data:', error);
      addNotification('Error', 'Failed to add sample data', 'error');
    }
  };

  // Welcome notification on mount
  useEffect(() => {
    if (!exportLoading && !importLoading && !allFilesLoading) {
      addNotification(
        'Welcome to Freight Tracker',
        'Your data is synced with Firebase. All changes will persist.',
        'success'
      );
    }
  }, [addNotification, exportLoading, importLoading, allFilesLoading]);

  // Get current search term and setter based on active tab
  const getCurrentSearchProps = () => {
    switch (activeTab) {
      case 'export-table':
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
      case 'import-table':
        return { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm };
      case 'all-files':
        return { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm };
      default:
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
    }
  };

  const { searchTerm, setSearchTerm } = getCurrentSearchProps();

  const getImportDataType = (): 'export' | 'import' | 'all-files' => {
    switch (activeTab) {
      case 'export-table':
        return 'export';
      case 'import-table':
        return 'import';
      case 'all-files':
        return 'all-files';
      default:
        return 'export';
    }
  };

  const updateRecord = async (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => {
    console.log('Updating export record:', id, field, value);
    
    try {
      await updateExportItem(id, { [field]: value } as Partial<TrackingRecord>);
      console.log('Successfully updated export record in Firebase');
    } catch (error) {
      console.error('Error updating export record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateImportRecord = async (
    id: string,
    field: keyof ImportTrackingRecord,
    value: string | boolean
  ) => {
    try {
      await updateImportItem(id, { [field]: value } as Partial<ImportTrackingRecord>);
    } catch (error) {
      console.error('Error updating import record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const updateAllFilesRecord = async (
    id: string,
    field: keyof AllFilesRecord,
    value: string
  ) => {
    try {
      await updateAllFilesItem(id, { [field]: value } as Partial<AllFilesRecord>);
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const deleteRecord = async (id: string) => {
    setSelectedRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteExportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting export record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteImportRecord = async (id: string) => {
    setSelectedImportRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteImportItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting import record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteAllFilesRecord = async (id: string) => {
    setSelectedAllFilesRows(prev => prev.filter(rowId => rowId !== id));

    try {
      await deleteAllFilesItem(id);
      addNotification('Success', 'Record deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting all files record:', error);
      addNotification('Error', 'Failed to delete record', 'error');
    }
  };

  const deleteBulkExportRecords = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      await Promise.all(selectedRows.map(id => deleteExportItem(id)));
      setSelectedRows([]);
      addNotification('Success', `Deleted ${selectedRows.length} export records`, 'success');
    } catch (error) {
      console.error('Error deleting export records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const deleteBulkImportRecords = async () => {
    if (selectedImportRows.length === 0) return;
    
    try {
      await Promise.all(selectedImportRows.map(id => deleteImportItem(id)));
      setSelectedImportRows([]);
      addNotification('Success', `Deleted ${selectedImportRows.length} import records`, 'success');
    } catch (error) {
      console.error('Error deleting import records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const deleteBulkAllFilesRecords = async () => {
    if (selectedAllFilesRows.length === 0) return;
    
    try {
      await Promise.all(selectedAllFilesRows.map(id => deleteAllFilesItem(id)));
      setSelectedAllFilesRows([]);
      addNotification('Success', `Deleted ${selectedAllFilesRows.length} all files records`, 'success');
    } catch (error) {
      console.error('Error deleting all files records:', error);
      addNotification('Error', 'Failed to delete some records', 'error');
    }
  };

  const addNewRecord = async () => {
    console.log('=== STARTING TO ADD NEW EXPORT RECORD ===');
    
    const newRecord: Omit<TrackingRecord, 'id'> = {
      customer: "",
      ref: "",
      file: "",
      workOrder: "",
      dropDone: false,
      dropDate: "",
      returnNeeded: false,
      returnDate: "",
      docsSent: false,
      docsReceived: false,
      aesMblVgmSent: false,
      docCutoffDate: "",
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
      notes: ""
    };

    console.log('New record to add:', newRecord);
    console.log('Current user ID:', currentUserId);
    console.log('addExportItem function:', addExportItem);

    try {
      const id = await addExportItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED EXPORT RECORD ===', id);
      addNotification('Success', 'New export record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING EXPORT RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewImportRecord = async () => {
    console.log('=== STARTING TO ADD NEW IMPORT RECORD ===');
    
    const newRecord: Omit<ImportTrackingRecord, 'id'> = {
      reference: "",
      file: "",
      etaFinalPod: "",
      bond: "",
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
      deliveryDate: "",
      notes: ""
    };

    console.log('New import record to add:', newRecord);
    console.log('Current user ID:', currentUserId);

    try {
      const id = await addImportItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED IMPORT RECORD ===', id);
      addNotification('Success', 'New import record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING IMPORT RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  const addNewAllFilesRecord = async () => {
    console.log('=== STARTING TO ADD NEW ALL FILES RECORD ===');
    
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      file: "ES",
      number: "",
      customer: "",
      originPort: "",
      originState: "",
      destinationPort: "",
      destinationCountry: "",
      container20: "",
      container40: "",
      roro: "",
      lcl: "",
      air: "",
      truck: "",
      ssl: "",
      nvo: "",
      comments: "",
      salesContact: ""
    };

    console.log('New all files record to add:', newRecord);
    console.log('Current user ID:', currentUserId);

    try {
      const id = await addAllFilesItem(newRecord);
      console.log('=== SUCCESSFULLY ADDED ALL FILES RECORD ===', id);
      addNotification('Success', 'New all files record added successfully', 'success');
    } catch (error) {
      console.error('=== ERROR ADDING ALL FILES RECORD ===', error);
      addNotification('Error', `Failed to add record: ${error}`, 'error');
    }
  };

  // Universal add record function based on active tab
  const handleAddRecord = () => {
    console.log('=== ADD RECORD BUTTON CLICKED ===');
    console.log('Active tab:', activeTab);
    console.log('Export data length:', exportData.length);
    console.log('Import data length:', importData.length);
    console.log('All files data length:', allFilesData.length);
    
    switch (activeTab) {
      case 'export-table':
        addNewRecord();
        break;
      case 'import-table':
        addNewImportRecord();
        break;
      case 'all-files':
        addNewAllFilesRecord();
        break;
      default:
        console.log('Unknown tab, defaulting to export');
        addNewRecord();
    }
  };

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'export-table':
        return 'Search by customer, ref, file, or work order...';
      case 'import-table':
        return 'Search by reference, file, bond, or notes...';
      case 'all-files':
        return 'Search by customer, file, port, or destination...';
      default:
        return 'Search...';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  if (exportLoading || importLoading || allFilesLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Freight Forwarding Tracker</h1>
                <p className="text-sm md:text-base text-gray-600">Comprehensive shipment tracking and management system</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <ExcelExportDialog 
                  activeTab={activeTab}
                  exportData={filteredExportData} 
                  importData={filteredImportData}
                  allFilesData={filteredAllFilesData}
                  selectedExportRows={selectedRows}
                  selectedImportRows={selectedImportRows}
                  selectedAllFilesRows={selectedAllFilesRows}
                >
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Export Excel
                  </Button>
                </ExcelExportDialog>

                <ExcelImportDialog
                  activeTab={activeTab}
                  onImportClick={handleImportClick}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs md:text-sm"
                  >
                    <Upload className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Import Excel
                  </Button>
                </ExcelImportDialog>

                {/* Conditional bulk delete button */}
                {((activeTab === 'export-table' && selectedRows.length > 0) ||
                  (activeTab === 'import-table' && selectedImportRows.length > 0) ||
                  (activeTab === 'all-files' && selectedAllFilesRows.length > 0)) && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="text-xs md:text-sm"
                    onClick={() => {
                      if (activeTab === 'export-table') deleteBulkExportRecords();
                      else if (activeTab === 'import-table') deleteBulkImportRecords();
                      else if (activeTab === 'all-files') deleteBulkAllFilesRecords();
                    }}
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Delete Selected ({
                      activeTab === 'export-table' ? selectedRows.length :
                      activeTab === 'import-table' ? selectedImportRows.length :
                      selectedAllFilesRows.length
                    })
                  </Button>
                )}

                <NotificationSettings>
                  <Button variant="outline" size="sm" className="text-xs md:text-sm">
                    <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Notifications
                  </Button>
                </NotificationSettings>
                
                <Button 
                  onClick={handleAddRecord} 
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Add Record
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={getSearchPlaceholder()}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => importFromExcel(e, getImportDataType())}
              className="hidden"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="mx-4 md:mx-6 mt-4 bg-gray-100 p-1 rounded-lg w-fit">
                <TabsTrigger 
                  value="export-table" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Package className="w-3 h-3 md:w-4 md:h-4" />
                  Export Checklist
                </TabsTrigger>
                <TabsTrigger 
                  value="import-table" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Truck className="w-3 h-3 md:w-4 md:h-4" />
                  Import Checklist
                </TabsTrigger>
                <TabsTrigger 
                  value="all-files" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  All Files
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 md:px-4 py-2 rounded-md text-sm"
                >
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="export-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <TrackingTable 
                  data={filteredExportData} 
                  updateRecord={updateRecord} 
                  deleteRecord={deleteRecord}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              </TabsContent>

              <TabsContent value="import-table" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <ImportTrackingTable 
                  data={filteredImportData} 
                  updateRecord={updateImportRecord} 
                  deleteRecord={deleteImportRecord}
                  selectedRows={selectedImportRows}
                  setSelectedRows={setSelectedImportRows}
                />
              </TabsContent>

              <TabsContent value="all-files" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <AllFilesTable 
                  data={filteredAllFilesData} 
                  updateRecord={updateAllFilesRecord} 
                  deleteRecord={deleteAllFilesRecord}
                  selectedRows={selectedAllFilesRows}
                  setSelectedRows={setSelectedAllFilesRows}
                />
              </TabsContent>

              <TabsContent value="calendar" className="flex-1 px-4 md:px-6 pb-4 md:pb-6 mt-4">
                <CalendarView data={filteredExportData} importData={filteredImportData} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightTracker;
