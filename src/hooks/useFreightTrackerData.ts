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
  const addImportItem = async () => {
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

  // Persist data to localStorage for notification scheduler
  useEffect(() => {
    if (exportData.length > 0) {
      localStorage.setItem('exportData', JSON.stringify(exportData));
    }
  }, [exportData]);

  useEffect(() => {
    if (importData.length > 0) {
      localStorage.setItem('importData', JSON.stringify(importData));
    }
  }, [importData]);

  useEffect(() => {
    if (domesticTruckingData.length > 0) {
      localStorage.setItem('domesticTruckingData', JSON.stringify(domesticTruckingData));
    }
  }, [domesticTruckingData]);

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
      
      // Check if we need to create a corresponding record in another table
      const updatedRecord = allFilesData.find(record => record.id === id);
      if (updatedRecord) {
        // Create a new object with the updated field
        const recordWithUpdate = { ...updatedRecord, [field]: value };
        
        // Check if customer, file, and number are all filled
        if (recordWithUpdate.customer && recordWithUpdate.file && recordWithUpdate.number) {
          await createCorrespondingRecord(recordWithUpdate);
        }
      }
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const createCorrespondingRecord = async (allFilesRecord: AllFilesRecord) => {
    const fileType = allFilesRecord.file.toUpperCase();
    
    try {
      // Check if a corresponding record already exists to avoid duplicates
      const existingRecordId = `${allFilesRecord.customer}-${allFilesRecord.file}-${allFilesRecord.number}`;
      
      if (fileType === 'IS' || fileType === 'IA') {
        // Import Sea or Import Air -> Create Import record
        const existingImport = importData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        if (!existingImport) {
          const newImportRecord: Omit<ImportTrackingRecord, 'id'> = {
            customer: allFilesRecord.customer,
            booking: '',
            bookingUrl: '',
            file: `${allFilesRecord.file}${allFilesRecord.number}`,
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
          
          await addImportItemBase(newImportRecord);
          addNotification('Success', `Import record created for ${allFilesRecord.customer}`, 'success');
        }
      } else if (fileType === 'ES' || fileType === 'EA') {
        // Export Sea or Export Air -> Create Export record
        const existingExport = exportData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        if (!existingExport) {
          const newExportRecord: Omit<TrackingRecord, 'id'> = {
            customer: allFilesRecord.customer,
            ref: '',
            file: `${allFilesRecord.file}${allFilesRecord.number}`,
            workOrder: '',
            dropDate: '',
            returnDate: '',
            docsSent: 'Select',
            docsReceived: 'Select',
            aesMblVgmSent: 'Select',
            docCutoffDate: '',
            titlesDispatched: 'Select',
            validatedFwd: 'Select',
            titlesReturned: 'Select',
            sslDraftInvRec: 'Select',
            draftInvApproved: 'Select',
            transphereInvSent: 'Select',
            paymentRec: 'Select',
            sslPaid: 'Select',
            insured: 'Select',
            released: 'Select',
            docsSentToCustomer: false,
            notes: '',
            archived: false,
            userId: currentUserId
          };
          
          await addExportItem(newExportRecord);
          addNotification('Success', `Export record created for ${allFilesRecord.customer}`, 'success');
        }
      } else if (fileType === 'DT' || fileType === 'TRUCK') {
        // Domestic Trucking -> Create Domestic Trucking record
        const existingDomestic = domesticTruckingData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        if (!existingDomestic) {
          const newDomesticRecord: Omit<DomesticTruckingRecord, 'id'> = {
            customer: allFilesRecord.customer,
            file: `${allFilesRecord.file}${allFilesRecord.number}`,
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
          
          await addDomesticTruckingItem(newDomesticRecord);
          addNotification('Success', `Domestic Trucking record created for ${allFilesRecord.customer}`, 'success');
        }
      }
    } catch (error) {
      console.error('Error creating corresponding record:', error);
      addNotification('Error', 'Failed to create corresponding record', 'error');
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
    deleteDomesticTruckingItem,
    createCorrespondingRecord
  };
};
