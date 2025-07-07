
import React, { useState, useEffect, useCallback } from 'react';
import { useFreightTrackerData } from '@/hooks/useFreightTrackerData';
import { TrackingRecord } from '@/types/TrackingRecord';
import { ImportTrackingRecord } from '@/types/ImportTrackingRecord';
import { AllFilesRecord } from '@/types/AllFilesRecord';
import { DomesticTruckingRecord } from '@/types/DomesticTruckingRecord';
import FreightTrackerTabs from '@/components/FreightTrackerTabs';
import CalendarView from '@/components/CalendarView';
import NotificationSettings from '@/components/NotificationSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearch, useImportSearch, useAllFilesSearch, useDomesticTruckingSearch } from '@/hooks/useSearch';
import { useUndoRedo } from '@/hooks/useUndoRedo';

const FreightTracker: React.FC = () => {
  const currentUserId = 'test-user-123'; // Mock user ID
  const { toast } = useToast();
  
  const {
    exportData,
    importData,
    allFilesData,
    domesticTruckingData,
    loading,
    addExportItem,
    addImportItem, // Fixed: this function doesn't take parameters
    addAllFilesItem,
    addDomesticTruckingItem,
    updateRecord,
    updateImportRecord,
    updateAllFilesRecord,
    updateDomesticTruckingRecord,
    deleteExportItem,
    deleteImportItem,
    deleteAllFilesItem,
    deleteDomesticTruckingItem
  } = useFreightTrackerData(currentUserId);

  // Search hooks
  const { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm, filteredData: filteredExportData } = useSearch(exportData);
  const { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm, filteredData: filteredImportData } = useImportSearch(importData);
  const { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm, filteredData: filteredAllFilesData } = useAllFilesSearch(allFilesData);
  const { searchTerm: domesticSearchTerm, setSearchTerm: setDomesticSearchTerm, filteredData: filteredDomesticData } = useDomesticTruckingSearch(domesticTruckingData);

  // Undo/Redo functionality
  const { canUndo, canRedo, undo, redo } = useUndoRedo([]);

  const [showArchivedExport, setShowArchivedExport] = useState(false);
  const [showArchivedImport, setShowArchivedImport] = useState(false);
  const [showArchivedAllFiles, setShowArchivedAllFiles] = useState(false);
  const [showArchivedDomesticTrucking, setShowArchivedDomesticTrucking] = useState(false);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  
  // Initialize activeTab and mainActiveTab from localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('freightTracker_activeTab') || 'allfiles';
  });
  const [mainActiveTab, setMainActiveTab] = useState(() => {
    return localStorage.getItem('freightTracker_mainActiveTab') || 'tracking';
  });

  // Save tab states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('freightTracker_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('freightTracker_mainActiveTab', mainActiveTab);
  }, [mainActiveTab]);

  // Selected rows state for bulk operations
  const [selectedExportRows, setSelectedExportRows] = useState<string[]>([]);
  const [selectedImportRows, setSelectedImportRows] = useState<string[]>([]);
  const [selectedDomesticRows, setSelectedDomesticRows] = useState<string[]>([]);
  const [selectedAllFilesRows, setSelectedAllFilesRows] = useState<string[]>([]);

  const getCurrentSearchProps = () => {
    switch (activeTab) {
      case 'export':
        return { searchTerm: exportSearchTerm, setSearchTerm: setExportSearchTerm };
      case 'import':
        return { searchTerm: importSearchTerm, setSearchTerm: setImportSearchTerm };
      case 'allfiles':
        return { searchTerm: allFilesSearchTerm, setSearchTerm: setAllFilesSearchTerm };
      case 'domestic':
        return { searchTerm: domesticSearchTerm, setSearchTerm: setDomesticSearchTerm };
      default:
        return { searchTerm: '', setSearchTerm: () => {} };
    }
  };

  const addNewExportRecord = () => {
    addExportItem();
  };

  const addNewImportRecord = () => {
    addImportItem();
  };

  const addNewDomesticRecord = () => {
    const newRecord: Omit<DomesticTruckingRecord, 'id'> = {
      customer: '',
      file: '',
      woSent: false,
      insurance: false,
      pickDate: '',
      delivered: '',
      paymentReceived: false,
      paymentMade: false,
      notes: '',
      archived: false,
      userId: currentUserId
    };
    
    addDomesticTruckingItem(newRecord);
  };

  const addNewAllFilesRecord = () => {
    const newRecord: Omit<AllFilesRecord, 'id'> = {
      customer: '',
      file: '',
      number: '',
      originPort: '',
      originState: '',
      destinationPort: '',
      destinationCountry: '',
      container20: '',
      container40: '',
      roro: '',
      lcl: '',
      air: '',
      truck: '',
      ssl: '',
      nvo: '',
      comments: '',
      salesContact: '',
      archived: false,
      userId: currentUserId
    };
    
    addAllFilesItem(newRecord);
  };

  const handleAddRecord = () => {
    switch (activeTab) {
      case 'export':
        addNewExportRecord();
        break;
      case 'import':
        addNewImportRecord();
        break;
      case 'domestic':
        addNewDomesticRecord();
        break;
      case 'allfiles':
        addNewAllFilesRecord();
        break;
    }
  };

  const handleDeleteBulkRecords = () => {
    // Implementation for bulk delete
    console.log('Bulk delete not yet implemented');
  };

  const handleArchiveBulkRecords = () => {
    // Implementation for bulk archive
    console.log('Bulk archive not yet implemented');
  };

  const handleFileClick = useCallback((fileNumber: string, fileType: string) => {
    console.log('File clicked - fileNumber:', fileNumber, 'fileType:', fileType);
    
    let targetRecord = null;
    let targetTab = 'allfiles';
    
    // Check if we're doing reverse linking (from other tabs to All Files)
    if (activeTab !== 'allfiles') {
      console.log('Reverse linking from', activeTab, 'to All Files');
      // Find matching record in All Files where file column matches fileType and number column matches fileNumber
      targetRecord = allFilesData.find(record => {
        const recordFile = record.file?.toLowerCase() || '';
        const recordNumber = record.number?.toLowerCase() || '';
        
        return recordFile === fileType.toLowerCase() && recordNumber === fileNumber.toLowerCase();
      });
      
      if (targetRecord) {
        setActiveTab('allfiles');
        setTimeout(() => {
          console.log('Setting highlighted row ID for All Files:', targetRecord.id);
          setHighlightedRowId(targetRecord.id);
          setTimeout(() => {
            setHighlightedRowId(null);
          }, 3000);
        }, 200);
        
        toast({
          title: "Record Found",
          description: `Found matching record in All Files tab`,
        });
        return;
      } else {
        toast({
          title: "Record Not Found",
          description: `No matching record found in All Files for ${fileType}${fileNumber}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Original forward linking (from All Files to other tabs)
    // Determine target tab based on file type first letter
    const firstLetter = fileType?.charAt(0)?.toUpperCase();
    console.log('First letter:', firstLetter, 'Full fileType:', fileType);
    
    // Create search strings for matching
    const searchStrings = [
      `${fileType}${fileNumber}`.toLowerCase(),
      `${fileType.toLowerCase()}${fileNumber}`,
      fileNumber.toLowerCase(),
      `${firstLetter?.toLowerCase()}${fileNumber}`,
      `${firstLetter?.toLowerCase()}s${fileNumber}`,
      `${firstLetter?.toLowerCase()}t${fileNumber}`
    ];
    
    switch (firstLetter) {
      case 'E':
        targetTab = 'export';
        targetRecord = exportData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      case 'I':
        targetTab = 'import';
        targetRecord = importData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      case 'D':
        targetTab = 'domestic';
        targetRecord = domesticTruckingData.find(record => {
          const recordFile = record.file?.toLowerCase() || '';
          return searchStrings.some(search => recordFile === search);
        });
        break;
      default:
        // Stay on all files tab, try to find by number
        targetRecord = allFilesData.find(record => {
          const recordNumber = record.number?.toLowerCase() || '';
          const recordFile = record.file?.toLowerCase() || '';
          return recordNumber === fileNumber.toLowerCase() || 
                 recordFile === fileType.toLowerCase();
        });
    }
    
    console.log('Target tab:', targetTab, 'Target record found:', !!targetRecord, targetRecord?.id);
    
    if (targetRecord) {
      // Switch to the appropriate tab
      setActiveTab(targetTab);
      
      // Set the highlighted row ID after a small delay to ensure tab is switched
      setTimeout(() => {
        console.log('Setting highlighted row ID:', targetRecord.id);
        setHighlightedRowId(targetRecord.id);
        
        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedRowId(null);
        }, 3000);
      }, 200);
      
      toast({
        title: "Record Found",
        description: `Switched to ${targetTab} tab and highlighted matching record`,
      });
    } else {
      toast({
        title: "Record Not Found",
        description: `No matching record found for ${fileType}${fileNumber} in ${targetTab} tab`,
        variant: "destructive"
      });
    }
  }, [exportData, importData, domesticTruckingData, allFilesData, toast, activeTab]);

  const handleCalendarEventClick = useCallback((recordId: string, source: string) => {
    console.log('FreightTracker: Calendar event clicked with recordId:', recordId, 'source:', source);
    
    // Switch to the tracking tables tab first
    setMainActiveTab('tracking');
    
    // Determine which tab to switch to based on source
    let targetTab = 'allfiles';
    let targetData: any[] = allFilesData;
    
    switch (source) {
      case 'export':
        targetTab = 'export';
        targetData = exportData;
        break;
      case 'import':
        targetTab = 'import';
        targetData = importData;
        break;
      case 'domestic':
        targetTab = 'domestic';
        targetData = domesticTruckingData;
        break;
    }
    
    // Find the record to ensure it exists
    const targetRecord = targetData.find(record => record.id === recordId);
    
    console.log('FreightTracker: Target tab:', targetTab, 'Target record found:', !!targetRecord, recordId);
    
    if (targetRecord) {
      // Switch to the appropriate tab
      setTimeout(() => {
        setActiveTab(targetTab);
        
        // Set the highlighted row ID after a delay to ensure tab is switched
        setTimeout(() => {
          console.log('FreightTracker: Setting highlighted row ID:', recordId);
          setHighlightedRowId(recordId);
          
          // Clear highlight after 3 seconds
          setTimeout(() => {
            setHighlightedRowId(null);
          }, 3000);
        }, 300);
      }, 100);
      
      toast({
        title: "Navigating to Record",
        description: `Switching to ${targetTab} tab and highlighting record`,
      });
    } else {
      toast({
        title: "Record Not Found",
        description: `Could not find record with ID ${recordId} in ${targetTab} tab`,
        variant: "destructive"
      });
    }
  }, [toast, exportData, importData, domesticTruckingData, allFilesData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { searchTerm, setSearchTerm } = getCurrentSearchProps();

  return (
    <div className="w-full h-[95vh] px-2 py-4 max-w-[98vw] mx-auto flex flex-col">
      <Tabs value={mainActiveTab} onValueChange={setMainActiveTab} className="w-full flex flex-col flex-1">
        {/* Main tabs with enhanced styling */}
        <TabsList className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
          <TabsTrigger 
            value="tracking" 
            className="px-8 py-3 text-base font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-300 hover:bg-blue-100/50"
          >
            📊 Tracking Tables
          </TabsTrigger>
          <TabsTrigger 
            value="calendar" 
            className="px-8 py-3 text-base font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-300 hover:bg-blue-100/50"
          >
            📅 Calendar View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking" className="flex-1 overflow-hidden">
          <FreightTrackerTabs
            exportData={exportData}
            importData={importData}
            domesticData={domesticTruckingData}
            allFilesData={allFilesData}
            updateExportRecord={updateRecord}
            updateImportRecord={updateImportRecord}
            updateDomesticRecord={updateDomesticTruckingRecord}
            updateAllFilesRecord={updateAllFilesRecord}
            deleteExportRecord={deleteExportItem}
            deleteImportRecord={deleteImportItem}
            deleteDomesticRecord={deleteDomesticTruckingItem}
            deleteAllFilesRecord={deleteAllFilesItem}
            addExportRecord={addNewExportRecord}
            addImportRecord={addNewImportRecord}
            addDomesticRecord={addNewDomesticRecord}
            addAllFilesRecord={addNewAllFilesRecord}
            selectedExportRows={selectedExportRows}
            setSelectedExportRows={setSelectedExportRows}
            selectedImportRows={selectedImportRows}
            setSelectedImportRows={setSelectedImportRows}
            selectedDomesticRows={selectedDomesticRows}
            setSelectedDomesticRows={setSelectedDomesticRows}
            selectedAllFilesRows={selectedAllFilesRows}
            setSelectedAllFilesRows={setSelectedAllFilesRows}
            highlightedRowId={highlightedRowId}
            onFileClick={handleFileClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredExportData={filteredExportData}
            filteredImportData={filteredImportData}
            filteredAllFilesData={filteredAllFilesData}
            filteredDomesticTruckingData={filteredDomesticData}
          />
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 overflow-hidden">
          <CalendarView
            data={exportData}
            importData={importData}
            domesticData={domesticTruckingData}
            onCalendarEventClick={handleCalendarEventClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightTracker;
