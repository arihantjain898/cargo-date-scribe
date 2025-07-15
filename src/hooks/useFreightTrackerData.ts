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
      etaFinalPod: 'Select ETA date',
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
      returnDate: '',
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
    } catch (error) {
      console.error('Error updating all files record:', error);
      addNotification('Error', 'Failed to save changes', 'error');
    }
  };

  const createCorrespondingRecord = async (allFilesRecord: AllFilesRecord) => {
    console.log('Creating corresponding record for:', allFilesRecord);
    const fileType = allFilesRecord.file.toUpperCase();
    console.log('File type detected:', fileType);
    
    try {
      if (fileType === 'IS' || fileType === 'IA') {
        console.log('Processing Import record...');
        // Import Sea or Import Air -> Create Import record
        const existingImport = importData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        console.log('Existing import found:', !!existingImport);
        
        if (!existingImport) {
          console.log('Creating new import record...');
          const newImportRecord: Omit<ImportTrackingRecord, 'id'> = {
            customer: allFilesRecord.customer,
            booking: '',
            bookingUrl: '',
            file: `${allFilesRecord.file}${allFilesRecord.number}`,
      etaFinalPod: 'Select ETA date',
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
            returnDate: '',
            deliveryDate: '',
            notes: '',
            archived: false,
            createdAt: new Date().toISOString(),
            userId: currentUserId
          };
          
          await addImportItemBase(newImportRecord);
          console.log('Import record created successfully');
          addNotification('Success', `Import record created for ${allFilesRecord.customer}`, 'success');
        } else {
          console.log('Duplicate import record found');
          addNotification('Duplicate Found', `Import record for customer "${allFilesRecord.customer}" with file "${allFilesRecord.file}${allFilesRecord.number}" already exists`, 'error');
        }
      } else if (fileType === 'ES' || fileType === 'EA' || fileType === 'ET') {
        console.log('Processing Export record...');
        // Export Sea, Export Air, or Export Truck -> Create Export record
        const existingExport = exportData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        console.log('Existing export found:', !!existingExport);
        
        if (!existingExport) {
          console.log('Creating new export record...');
          const newExportRecord: Omit<TrackingRecord, 'id'> = {
            customer: allFilesRecord.customer,
            ref: '',
            file: `${allFilesRecord.file}${allFilesRecord.number}`,
            workOrder: '',
            dropDate: '',
            returnDate: '',
            docsSent: 'Select Docs Sent',
            docsReceived: 'Select Docs Rec\'d',
            aesMblVgmSent: 'Select AES/MBL/VGM',
            docCutoffDate: '',
            titlesDispatched: 'Select Titles Dispatched',
            validatedFwd: 'Select Validated Fwd',
            titlesReturned: 'Select Titles Returned',
            sslDraftInvRec: 'Select SSL Draft Inv',
            draftInvApproved: 'Select Draft Inv Approved',
            transphereInvSent: 'Select Trans Inv Sent',
            paymentRec: 'Select Payment Rec\'d',
            sslPaid: 'Select SSL Paid',
            insured: 'Select Insured',
            released: 'Select Released',
            docsSentToCustomer: false,
            notes: '',
            archived: false,
            userId: currentUserId
          };
          
          await addExportItem(newExportRecord);
          console.log('Export record created successfully');
          addNotification('Success', `Export record created for ${allFilesRecord.customer}`, 'success');
        } else {
          console.log('Duplicate export record found');
          addNotification('Duplicate Found', `Export record for customer "${allFilesRecord.customer}" with file "${allFilesRecord.file}${allFilesRecord.number}" already exists`, 'error');
        }
      } else if (fileType === 'DT' || fileType === 'TRUCK') {
        console.log('Processing Domestic Trucking record...');
        // Domestic Trucking -> Create Domestic Trucking record
        const existingDomestic = domesticTruckingData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === `${allFilesRecord.file}${allFilesRecord.number}`
        );
        
        console.log('Existing domestic found:', !!existingDomestic);
        
        if (!existingDomestic) {
          console.log('Creating new domestic trucking record...');
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
          console.log('Domestic trucking record created successfully');
          addNotification('Success', `Domestic Trucking record created for ${allFilesRecord.customer}`, 'success');
        } else {
          console.log('Duplicate domestic trucking record found');
          addNotification('Duplicate Found', `Domestic Trucking record for customer "${allFilesRecord.customer}" with file "${allFilesRecord.file}${allFilesRecord.number}" already exists`, 'error');
        }
      } else {
        console.log('Unrecognized file type:', fileType);
        addNotification('Error', `Unrecognized file type "${fileType}". Expected IS/IA for Import, ES/EA/ET for Export, or DT for Domestic Trucking.`, 'error');
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

  const archiveCorrespondingRecord = async (allFilesRecord: AllFilesRecord, archiveStatus: boolean) => {
    console.log('Archiving corresponding record for:', allFilesRecord);
    const fileType = allFilesRecord.file.toUpperCase();
    const targetFile = `${allFilesRecord.file}${allFilesRecord.number}`;
    
    try {
      if (fileType === 'IS' || fileType === 'IA') {
        // Import Sea or Import Air -> Archive/Unarchive Import record
        const correspondingImport = importData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === targetFile
        );
        
        if (correspondingImport) {
          await updateImportItem(correspondingImport.id, { archived: archiveStatus });
          console.log(`Import record ${archiveStatus ? 'archived' : 'unarchived'} successfully`);
          addNotification('Success', `Import record ${archiveStatus ? 'archived' : 'unarchived'} for ${allFilesRecord.customer}`, 'success');
        }
      } else if (fileType === 'ES' || fileType === 'EA' || fileType === 'ET') {
        // Export Sea, Export Air, or Export Truck -> Archive/Unarchive Export record
        const correspondingExport = exportData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === targetFile
        );
        
        if (correspondingExport) {
          await updateExportItem(correspondingExport.id, { archived: archiveStatus });
          console.log(`Export record ${archiveStatus ? 'archived' : 'unarchived'} successfully`);
          addNotification('Success', `Export record ${archiveStatus ? 'archived' : 'unarchived'} for ${allFilesRecord.customer}`, 'success');
        }
      } else if (fileType === 'DT' || fileType === 'TRUCK') {
        // Domestic Trucking -> Archive/Unarchive Domestic Trucking record
        const correspondingDomestic = domesticTruckingData.find(record => 
          record.customer === allFilesRecord.customer && 
          record.file === targetFile
        );
        
        if (correspondingDomestic) {
          await updateDomesticTruckingItem(correspondingDomestic.id, { archived: archiveStatus });
          console.log(`Domestic trucking record ${archiveStatus ? 'archived' : 'unarchived'} successfully`);
          addNotification('Success', `Domestic Trucking record ${archiveStatus ? 'archived' : 'unarchived'} for ${allFilesRecord.customer}`, 'success');
        }
      }
    } catch (error) {
      console.error('Error archiving corresponding record:', error);
      addNotification('Error', 'Failed to archive corresponding record', 'error');
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
    createCorrespondingRecord,
    archiveCorrespondingRecord
  };
};
