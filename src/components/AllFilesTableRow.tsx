import React, { memo, useMemo, useCallback } from 'react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import InlineEditCell from './InlineEditCell';
import AllFilesTableFileCell from './AllFilesTableFileCell';
import AllFilesTableRowActions from './AllFilesTableRowActions';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AllFilesTableRowProps {
  record: AllFilesRecord;
  index: number;
  updateRecord: (id: string, field: keyof AllFilesRecord, value: string) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onArchiveAll?: (id: string) => void;
  onUnarchiveAll?: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  onFileClick?: (fileNumber: string, fileType: string) => void;
  highlightedRowId?: string | null;
  onCreateCorrespondingRow?: (record: AllFilesRecord) => void;
  hasCorrespondingRecord?: boolean;
}

// Memoize the color calculations to avoid recalculating on every render
const getRowClassName = (isHighlighted: boolean, isArchived: boolean, index: number) => {
  if (isHighlighted) return 'border-b-2 border-gray-500 bg-yellow-200';
  if (isArchived) return 'border-b-2 border-gray-500 bg-gray-200 opacity-60';
  return index % 2 === 0 
    ? 'border-b-2 border-gray-500 bg-white hover:bg-blue-50' 
    : 'border-b-2 border-gray-500 bg-blue-50 hover:bg-blue-100';
};

const getTextStyling = (value: string) => {
  return (!value || value.trim() === '') ? 'text-gray-400 italic' : 'text-gray-900 font-medium';
};

const AllFilesTableRow = memo(({
  record,
  index,
  updateRecord,
  deleteRecord,
  onArchive,
  onUnarchive,
  onArchiveAll,
  onUnarchiveAll,
  selectedRows,
  setSelectedRows,
  showArchived,
  onFileClick,
  highlightedRowId,
  onCreateCorrespondingRow,
  hasCorrespondingRecord
}: AllFilesTableRowProps) => {
  const isSelected = useMemo(() => selectedRows.includes(record.id), [selectedRows, record.id]);
  const isArchived = record.archived === 'true' || record.archived === true;
  const isHighlighted = highlightedRowId === record.id;

  // Define the order of editable fields for tab navigation
  const editableFields = useMemo(() => [
    'customer', 'file', 'number', 'originPort', 'originState', 
    'destinationPort', 'destinationCountry', 'container20', 'container40', 
    'roro', 'lcl', 'air', 'truck', 'ssl', 'nvo', 'comments', 'salesContact'
  ], []);

  // Optimized focus function that uses direct DOM manipulation
  const focusNextCell = useCallback((currentField: string) => {
    const currentIndex = editableFields.indexOf(currentField);
    const nextIndex = (currentIndex + 1) % editableFields.length;
    const nextField = editableFields[nextIndex];
    
    // Use a more efficient approach with a single query
    requestAnimationFrame(() => {
      const nextCell = document.querySelector(`[data-row-id="${record.id}"] [data-field="${nextField}"] [title="Click to edit"]`);
      if (nextCell) {
        (nextCell as HTMLElement).click();
      }
    });
  }, [record.id, editableFields]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleCheckboxChange = useCallback((checked: boolean) => {
    setSelectedRows(prev => 
      checked 
        ? [...prev, record.id]
        : prev.filter(id => id !== record.id)
    );
  }, [record.id, setSelectedRows]);

  const handleFileClick = useCallback(() => {
    if (onFileClick && record.number && record.file) {
      const targetFileIdentifier = record.file.trim() + record.number.trim();
      const filePrefix = record.file.trim().toUpperCase();
      
      let targetTab = '';
      if (filePrefix === 'EA' || filePrefix === 'ES' || filePrefix === 'ET') {
        targetTab = 'export';
      } else if (filePrefix === 'IA' || filePrefix === 'IS') {
        targetTab = 'import';
      } else if (filePrefix === 'DT') {
        targetTab = 'domestic';
      }
      
      onFileClick(targetFileIdentifier, targetTab);
    }
  }, [onFileClick, record.number, record.file]);

  const handleCreateCorrespondingRow = useCallback(() => {
    if (onCreateCorrespondingRow) {
      const filePrefix = record.file.trim().toUpperCase();
      let targetTab = '';
      
      if (filePrefix === 'EA' || filePrefix === 'ES' || filePrefix === 'ET') {
        targetTab = 'Export';
      } else if (filePrefix === 'IA' || filePrefix === 'IS') {
        targetTab = 'Import';
      } else if (filePrefix === 'DT') {
        targetTab = 'Domestic Trucking';
      }
      
      if (window.confirm(
        `Create a corresponding record in the ${targetTab} table for customer "${record.customer}" with file "${record.file}${record.number}"?`
      )) {
        onCreateCorrespondingRow(record);
      }
    }
  }, [onCreateCorrespondingRow, record]);

  // Memoize row className for performance
  const rowClassName = useMemo(() => 
    getRowClassName(isHighlighted, isArchived, index),
    [isHighlighted, isArchived, index]
  );

  // Memoize color calculations for container fields
  const containerColors = useMemo(() => ({
    container20: getContainerVolumeColor(record.container20),
    container40: getContainerVolumeColor(record.container40),
    roro: getContainerVolumeColor(record.roro),
    lcl: getContainerVolumeColor(record.lcl),
    air: getContainerVolumeColor(record.air),
    truck: getContainerVolumeColor(record.truck)
  }), [record.container20, record.container40, record.roro, record.lcl, record.air, record.truck]);

  // Memoize update functions
  const updateFunctions = useMemo(() => ({
    customer: (value: string) => updateRecord(record.id, 'customer', value),
    file: (value: string) => updateRecord(record.id, 'file', value),
    number: (value: string) => updateRecord(record.id, 'number', value),
    originPort: (value: string) => updateRecord(record.id, 'originPort', value),
    originState: (value: string) => updateRecord(record.id, 'originState', value),
    destinationPort: (value: string) => updateRecord(record.id, 'destinationPort', value),
    destinationCountry: (value: string) => updateRecord(record.id, 'destinationCountry', value),
    container20: (value: string) => updateRecord(record.id, 'container20', value),
    container40: (value: string) => updateRecord(record.id, 'container40', value),
    roro: (value: string) => updateRecord(record.id, 'roro', value),
    lcl: (value: string) => updateRecord(record.id, 'lcl', value),
    air: (value: string) => updateRecord(record.id, 'air', value),
    truck: (value: string) => updateRecord(record.id, 'truck', value),
    ssl: (value: string) => updateRecord(record.id, 'ssl', value),
    nvo: (value: string) => updateRecord(record.id, 'nvo', value),
    comments: (value: string) => updateRecord(record.id, 'comments', value),
    salesContact: (value: string) => updateRecord(record.id, 'salesContact', value)
  }), [record.id, updateRecord]);

  return (
    <tr className={rowClassName} data-row-id={record.id}>
      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
        <div className="flex items-center justify-between w-full">
          <div data-field="customer" className="flex-1 min-w-0">
            <InlineEditCell
              value={record.customer}
              onSave={updateFunctions.customer}
              placeholder="Enter customer"
              className={getTextStyling(record.customer)}
              isTextColumn={true}
              onNextCell={() => focusNextCell('customer')}
            />
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {record.customer && record.file && record.number && onCreateCorrespondingRow && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateCorrespondingRow}
                className="h-6 w-6 p-0 hover:bg-green-100"
                title="Create corresponding row in import/export/domestic tab"
              >
                <Plus className="h-3 w-3 text-green-600" />
              </Button>
            )}
            {record.number && record.file && onFileClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileClick}
                className="h-6 w-6 p-0 hover:bg-blue-100"
                title={`Open ${record.file}${record.number} in corresponding tab`}
              >
                <ExternalLink className="h-3 w-3 text-blue-600" />
              </Button>
            )}
          </div>
        </div>
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="file">
        <AllFilesTableFileCell
          fileValue={record.file}
          numberValue={record.number}
          onSave={updateFunctions.file}
          className={getTextStyling(record.file)}
          onNextCell={() => focusNextCell('file')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="number">
        <InlineEditCell
          value={record.number}
          onSave={updateFunctions.number}
          placeholder="Enter number"
          className={getTextStyling(record.number)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('number')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="originPort">
        <InlineEditCell
          value={record.originPort}
          onSave={updateFunctions.originPort}
          placeholder="Enter origin port"
          className={getTextStyling(record.originPort)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('originPort')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="originState">
        <InlineEditCell
          value={record.originState}
          onSave={updateFunctions.originState}
          placeholder="Enter origin state"
          className={getTextStyling(record.originState)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('originState')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="destinationPort">
        <InlineEditCell
          value={record.destinationPort}
          onSave={updateFunctions.destinationPort}
          placeholder="Enter destination port"
          className={getTextStyling(record.destinationPort)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('destinationPort')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="destinationCountry">
        <InlineEditCell
          value={record.destinationCountry}
          onSave={updateFunctions.destinationCountry}
          placeholder="Enter destination country"
          className={getTextStyling(record.destinationCountry)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('destinationCountry')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${containerColors.container20}`} data-field="container20">
        <InlineEditCell
          value={record.container20}
          onSave={updateFunctions.container20}
          placeholder="20'"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('container20')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${containerColors.container40}`} data-field="container40">
        <InlineEditCell
          value={record.container40}
          onSave={updateFunctions.container40}
          placeholder="40'"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('container40')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${containerColors.roro}`} data-field="roro">
        <InlineEditCell
          value={record.roro}
          onSave={updateFunctions.roro}
          placeholder="RoRo"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('roro')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${containerColors.lcl}`} data-field="lcl">
        <InlineEditCell
          value={record.lcl}
          onSave={updateFunctions.lcl}
          placeholder="LCL"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('lcl')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${containerColors.air}`} data-field="air">
        <InlineEditCell
          value={record.air}
          onSave={updateFunctions.air}
          placeholder="Air"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('air')}
        />
      </td>
      
      <td className={`border-r-4 border-black p-1 ${containerColors.truck}`} data-field="truck">
        <InlineEditCell
          value={record.truck}
          onSave={updateFunctions.truck}
          placeholder="Truck"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('truck')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="ssl">
        <InlineEditCell
          value={record.ssl}
          onSave={updateFunctions.ssl}
          placeholder="SSL or Trucker"
          className={getTextStyling(record.ssl)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('ssl')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="nvo">
        <InlineEditCell
          value={record.nvo}
          onSave={updateFunctions.nvo}
          placeholder="NVO"
          className={getTextStyling(record.nvo)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('nvo')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="comments">
        <InlineEditCell
          value={record.comments}
          onSave={updateFunctions.comments}
          placeholder="Enter comments"
          className={getTextStyling(record.comments)}
          isTextColumn={true}
          isNotesColumn={true}
          onNextCell={() => focusNextCell('comments')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="salesContact">
        <InlineEditCell
          value={record.salesContact}
          onSave={updateFunctions.salesContact}
          placeholder="Enter sales contact"
          className={getTextStyling(record.salesContact)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('salesContact')}
        />
      </td>
      
      <AllFilesTableRowActions
        recordId={record.id}
        customerName={record.customer}
        isSelected={isSelected}
        isArchived={isArchived}
        onCheckboxChange={handleCheckboxChange}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onArchiveAll={onArchiveAll}
        onUnarchiveAll={onUnarchiveAll}
        onDelete={deleteRecord}
        hasCorrespondingRecord={hasCorrespondingRecord}
      />
    </tr>
  );
});

AllFilesTableRow.displayName = 'AllFilesTableRow';

export default AllFilesTableRow;