
import { toast } from 'sonner';

export const getTargetTabFromFileType = (fileType: string): string => {
  const firstLetter = fileType.charAt(0).toUpperCase();
  
  switch (firstLetter) {
    case 'E':
      return 'export-table';
    case 'I':
      return 'import-table';
    case 'D':
      return 'domestic-trucking';
    default:
      return '';
  }
};

export const findMatchingRecord = (
  data: any[],
  fileNumber: string,
  fileFieldName: string = 'file'
): any | null => {
  return data.find(record => record[fileFieldName] === fileNumber) || null;
};

export const findAllFilesRecord = (
  allFilesData: any[],
  fileType: string,
  fileNumber: string
): any | null => {
  return allFilesData.find(record => 
    record.file === fileType && record.number === fileNumber
  ) || null;
};

export const handleFileNavigation = (
  fileNumber: string,
  fileType: string,
  setActiveTab: (tab: string) => void,
  setHighlightedRowId: (id: string | null) => void,
  exportData: any[],
  importData: any[],
  domesticData: any[],
  sourceAllFilesId?: string
) => {
  const targetTab = getTargetTabFromFileType(fileType);
  
  if (!targetTab) {
    toast.error(`Invalid file type: ${fileType}`);
    return;
  }

  let targetData: any[];
  switch (targetTab) {
    case 'export-table':
      targetData = exportData;
      break;
    case 'import-table':
      targetData = importData;
      break;
    case 'domestic-trucking':
      targetData = domesticData;
      break;
    default:
      toast.error('Unable to determine target tab');
      return;
  }

  const matchingRecord = findMatchingRecord(targetData, fileNumber);
  
  if (matchingRecord) {
    setActiveTab(targetTab);
    setHighlightedRowId(matchingRecord.id);
    
    // Store source all files ID for back navigation
    if (sourceAllFilesId) {
      sessionStorage.setItem('sourceAllFilesId', sourceAllFilesId);
    }
    
    toast.success(`Navigated to ${fileType} ${fileNumber}`);
  } else {
    toast.error(`File ${fileType} ${fileNumber} not found in ${targetTab}`);
  }
};

export const handleBackToAllFiles = (
  setActiveTab: (tab: string) => void,
  setHighlightedRowId: (id: string | null) => void
) => {
  const sourceAllFilesId = sessionStorage.getItem('sourceAllFilesId');
  
  setActiveTab('all-files');
  
  if (sourceAllFilesId) {
    setHighlightedRowId(sourceAllFilesId);
    sessionStorage.removeItem('sourceAllFilesId');
    toast.success('Returned to All Files');
  } else {
    setHighlightedRowId(null);
    toast.info('Navigated to All Files');
  }
};

export const handleCalendarToAllFiles = (
  fileNumber: string,
  setActiveTab: (tab: string) => void,
  setHighlightedRowId: (id: string | null) => void,
  allFilesData: any[]
) => {
  // Extract file type (first 2 letters) and number (remaining digits)
  const fileType = fileNumber.substring(0, 2);
  const number = fileNumber.substring(2);
  
  const matchingRecord = findAllFilesRecord(allFilesData, fileType, number);
  
  if (matchingRecord) {
    setActiveTab('all-files');
    setHighlightedRowId(matchingRecord.id);
    toast.success(`Found ${fileType} ${number} in All Files`);
  } else {
    toast.error(`File ${fileType} ${number} not found in All Files`);
  }
};
