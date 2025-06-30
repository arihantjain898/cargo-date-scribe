
import { useState, useEffect } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { useFirestore } from './useFirestore';
import { useNotifications } from './useNotifications';
import { generateSampleData } from '../data/generateSampleData';
import { generateSampleImportData } from '../data/sampleImportData';
import { generateSampleAllFilesData } from '../data/sampleAllFilesData';
import { generateSampleDomesticTruckingData } from '../data/sampleDomesticTruckingData';

export const useFreightTrackerData = (currentUserId: string) => {
  const { addNotification } = useNotifications();

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

  // Load sample data if no data exists
  useEffect(() => {
    const loadSampleData = async () => {
      if (exportData.length === 0) {
        const sampleExportData = generateSampleData();
        for (const record of sampleExportData) {
          await addExportItem(record);
        }
      }

      if (importData.length === 0) {
        const sampleImportData = generateSampleImportData();
        for (const record of sampleImportData) {
          await addImportItem(record);
        }
      }

      if (allFilesData.length === 0) {
        const sampleAllFilesData = generateSampleAllFilesData();
        for (const record of sampleAllFilesData) {
          await addAllFilesItem(record);
        }
      }

      if (domesticTruckingData.length === 0) {
        const sampleDomesticData = generateSampleDomesticTruckingData();
        for (const record of sampleDomesticData) {
          await addDomesticTruckingItem(record);
        }
      }
    };

    if (!exportLoading && !importLoading && !allFilesLoading && !domesticTruckingLoading) {
      loadSampleData();
    }
  }, [exportData.length, importData.length, allFilesData.length, domesticTruckingData.length, exportLoading, importLoading, allFilesLoading, domesticTruckingLoading]);

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
