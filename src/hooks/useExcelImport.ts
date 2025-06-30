
// This hook is completely deprecated - Excel import functionality has been removed
export const useExcelImport = () => {
  const fileInputRef = null;
  const importFromExcel = () => {
    console.log('Excel import functionality has been removed');
  };

  return { fileInputRef, importFromExcel };
};
