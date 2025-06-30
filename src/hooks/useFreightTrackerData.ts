
import { useState, useEffect } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { useFirestore } from './useFirestore';
import { useNotifications } from './useNotifications';
import { generateSampleExportData } from '../data/generateSampleData';
import { sampleImportData } from '../data/sampleImportData';
import { sampleAllFilesData } from '../data/sampleAllFilesData';
import { sampleDomesticTruckingData } from '../data/sampleDomesticTruckingData';

export const useFreightTrackerData = (currentUserId: string) => {
  const { addNotification } = useNotifications();
  const [hasLoadedSample, setHasLoadedSample] = useState(false);

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

  const {
    data: domesticTruckingData,
    loading: domesticTruckingLoading,
    addItem: addDomesticTruckingItem,
    updateItem: updateDomesticTruckingItem,
    deleteItem: deleteDomesticTruckingItem
  } = useFirestore<DomesticTruckingRecord>('domestic_trucking', currentUserId);

  // Load sample data once when user is authenticated and collections are empty
  useEffect(() => {
    const loadSampleData = async () => {
      if (!currentUserId || hasLoadedSample) return;
      
      const allEmpty = exportData.length === 0 && 
                      importData.length === 0 && 
                      allFilesData.length === 0 && 
                      domesticTruckingData.length === 0;

      if (allEmpty && !exportLoading && !importLoading && !allFilesLoading && !domesticTruckingLoading) {
        try {
          console.log('Loading sample data...');
          
          // Add sample export data
          const sampleExportData = generateSampleExportData();
          for (const record of sampleExportData) {
            await addExportItem({ ...record, userId: currentUserId });
          }

          // Add sample import data
          for (const record of sampleImportData) {
            await addImportItem({ ...record, userId: currentUserId });
          }

          // Add sample all files data
          for (const record of sampleAllFilesData) {
            await addAllFilesItem({ ...record, userId: currentUserId });
          }

          // Add sample domestic trucking data
          for (const record of sampleDomesticTruckingData) {
            await addDomesticTruckingItem({ ...record, userId: currentUserId });
          }

          setHasLoadedSample(true);
          console.log('Sample data loaded successfully');
        } catch (error) {
          console.error('Error loading sample data:', error);
        }
      }
    };

    loadSampleData();
  }, [currentUserId, exportData.length, importData.length, allFilesData.length, domesticTruckingData.length, exportLoading, importLoading, allFilesLoading, domesticTruckingLoading, hasLoadedSample]);

  const updateRecord = async (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => {
    try {
      await updateExportItem(id, { [field]: value } as Partial<TrackingRecord>);
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

  const updateDomesticTruckingRecord = async (
    id: string,
    field: keyof DomesticTruckingRecord,
    value: string | boolean
  ) => {
    try {
      await updateDomesticTruckingItem(id, { [field]: value } as Partial<DomesticTruckingRecord>);
    } catch (error) {
      console.error('Error updating domestic trucking record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  return {
    exportData,
    importData,
    allFilesData,
    domesticTruckingData,
    loading: exportLoading || importLoading || allFilesLoading || domesticTruckingLoading,
    addExportItem,
    addImportItem,
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
  };
};
