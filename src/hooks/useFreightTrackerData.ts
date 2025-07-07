
import { useState, useEffect } from 'react';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { useFirestore } from './useFirestore';
import { useNotifications } from './useNotifications';

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
    addItem: addImportItemBase,
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

  // Wrapper for adding import items with proper defaults
  const addImportRecord = async () => {
    const newImportRecord: Omit<ImportTrackingRecord, 'id'> = {
      customer: '',
      booking: '',
      bookingUrl: '',
      file: '',
      etaFinalPod: '',
      bond: 'Select',
      poa: 'Select',
      isf: 'Select',
      packingListCommercialInvoice: 'Select',
      billOfLading: 'Select',
      arrivalNotice: 'Select',
      isfFiled: 'Select',
      entryFiled: 'Select',
      blRelease: 'Select',
      customsRelease: 'Select',
      invoiceSent: 'Select',
      paymentReceived: 'Select',
      workOrderSetup: 'Select',
      delivered: 'Select',
      returned: 'Select',
      deliveryDate: '',
      notes: '',
      archived: false,
      createdAt: new Date().toISOString(),
      userId: currentUserId
    };
    
    return await addImportItemBase(newImportRecord);
  };

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
    addImportRecord,
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
