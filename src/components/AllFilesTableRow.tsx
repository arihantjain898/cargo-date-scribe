import React, { memo, useMemo, useCallback } from 'react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import InlineEditCell from './InlineEditCell';
import AllFilesTableFileCell from './AllFilesTableFileCell';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AllFilesTableRowProps {
  record: AllFilesRecord;
  index: number;
  updateRecord: (id: string, field: keyof AllFilesRecord, value: string) => void;
  deleteRecord: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  showArchived: boolean;
  onFileClick?: (fileNumber: string, fileType: string) => void;
  highlightedRowId?: string | null;
  onCreateCorrespondingRow?: (record: AllFilesRecord) => void;
}

const AllFilesTableRow = memo(({
  record,
  index,
  updateRecord,
  deleteRecord,
  onArchive,
  onUnarchive,
  selectedRows,
  setSelectedRows,
  showArchived,
  onFileClick,
  highlightedRowId,
  onCreateCorrespondingRow
}: AllFilesTableRowProps) => {
  const isSelected = useMemo(() => selectedRows.includes(record.id), [selectedRows, record.id]);
  const isArchived = record.archived === 'true' || record.archived === true;
  const isHighlighted = highlightedRowId === record.id;

  // Define the order of editable fields for tab navigation
  const editableFields = [
    'customer', 'file', 'number', 'originPort', 'originState', 
    'destinationPort', 'destinationCountry', 'container20', 'container40', 
    'roro', 'lcl', 'air', 'truck', 'ssl', 'nvo', 'comments', 'salesContact'
  ];

  const focusNextCell = useCallback((currentField: string) => {
    console.log('focusNextCell called with:', currentField);
    const currentIndex = editableFields.indexOf(currentField);
    const nextIndex = (currentIndex + 1) % editableFields.length;
    const nextField = editableFields[nextIndex];
    console.log('Next field:', nextField);
    
    // Find the next cell and focus it
    const currentRow = document.querySelector(`[data-row-id="${record.id}"]`);
    if (currentRow) {
      const nextCell = currentRow.querySelector(`[data-field="${nextField}"]`);
      console.log('Next cell found:', !!nextCell);
      if (nextCell) {
        const clickableElement = nextCell.querySelector('[title="Click to edit"]');
        console.log('Clickable element found:', !!clickableElement);
        if (clickableElement) {
          (clickableElement as HTMLElement).click();
        }
      }
    }
  }, [record.id]);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, record.id]);
    } else {
      setSelectedRows(prev => prev.filter(id => id !== record.id));
    }
  }, [record.id, setSelectedRows]);

  const handleFileClick = useCallback(() => {
    if (onFileClick && record.number && record.file) {
      // Combine file + number to create the target file identifier (e.g., "ET" + "1028" = "ET1028")
      const targetFileIdentifier = record.file.trim() + record.number.trim();
      
      // Determine target tab based on file prefix
      let targetTab = '';
      const filePrefix = record.file.trim().toUpperCase();
      
      if (filePrefix === 'EA' || filePrefix === 'ES' || filePrefix === 'ET') {
        targetTab = 'export';
      } else if (filePrefix === 'IA' || filePrefix === 'IS') {
        targetTab = 'import';
      } else if (filePrefix === 'DT') {
        targetTab = 'domestic';
      }
      
      console.log('AllFiles row clicked - file:', record.file, 'number:', record.number, 'targetIdentifier:', targetFileIdentifier, 'targetTab:', targetTab);
      onFileClick(targetFileIdentifier, targetTab);
    }
  }, [onFileClick, record.number, record.file]);

  const handleCreateCorrespondingRow = useCallback(() => {
    console.log('Plus button clicked for record:', record);
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
      
      // Show confirmation dialog
      const confirmed = window.confirm(
        `Create a corresponding record in the ${targetTab} table for customer "${record.customer}" with file "${record.file}${record.number}"?`
      );
      
      if (confirmed) {
        onCreateCorrespondingRow(record);
      }
    }
  }, [onCreateCorrespondingRow, record]);

  // Memoized row className for performance
  const rowClassName = useMemo(() => 
    `border-b-2 border-gray-500 ${
      isHighlighted ? 'bg-yellow-200' :
      isArchived ? 'bg-gray-200 opacity-60' : 
      index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-blue-50 hover:bg-blue-100'
    }`,
    [isHighlighted, isArchived, index]
  );

  // Helper function to get text styling based on content
  const getTextStyling = useCallback((value: string, placeholder?: string) => {
    if (!value || value.trim() === '') {
      return 'text-gray-400 italic';
    }
    return 'text-gray-900 font-medium';
  }, []);

  return (
    <tr className={rowClassName} data-row-id={record.id}>
      <td className="border-r-4 border-black p-1 sticky left-0 z-20 bg-inherit">
        <div className="flex items-center justify-between w-full">
          <div data-field="customer" className="flex-1 min-w-0">
            <InlineEditCell
              value={record.customer}
              onSave={(value) => updateRecord(record.id, 'customer', value as string)}
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
          onSave={(value) => updateRecord(record.id, 'file', value as string)}
          className={getTextStyling(record.file)}
          onNextCell={() => focusNextCell('file')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="number">
        <InlineEditCell
          value={record.number}
          onSave={(value) => updateRecord(record.id, 'number', value as string)}
          placeholder="Enter number"
          className={getTextStyling(record.number)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('number')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="originPort">
        <InlineEditCell
          value={record.originPort}
          onSave={(value) => updateRecord(record.id, 'originPort', value as string)}
          placeholder="Enter origin port"
          className={getTextStyling(record.originPort)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('originPort')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="originState">
        <InlineEditCell
          value={record.originState}
          onSave={(value) => updateRecord(record.id, 'originState', value as string)}
          placeholder="Enter origin state"
          className={getTextStyling(record.originState)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('originState')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="destinationPort">
        <InlineEditCell
          value={record.destinationPort}
          onSave={(value) => updateRecord(record.id, 'destinationPort', value as string)}
          placeholder="Enter destination port"
          className={getTextStyling(record.destinationPort)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('destinationPort')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="destinationCountry">
        <InlineEditCell
          value={record.destinationCountry}
          onSave={(value) => updateRecord(record.id, 'destinationCountry', value as string)}
          placeholder="Enter destination country"
          className={getTextStyling(record.destinationCountry)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('destinationCountry')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container20)}`} data-field="container20">
        <InlineEditCell
          value={record.container20}
          onSave={(value) => updateRecord(record.id, 'container20', value as string)}
          placeholder="20'"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('container20')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.container40)}`} data-field="container40">
        <InlineEditCell
          value={record.container40}
          onSave={(value) => updateRecord(record.id, 'container40', value as string)}
          placeholder="40'"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('container40')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.roro)}`} data-field="roro">
        <InlineEditCell
          value={record.roro}
          onSave={(value) => updateRecord(record.id, 'roro', value as string)}
          placeholder="RoRo"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('roro')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.lcl)}`} data-field="lcl">
        <InlineEditCell
          value={record.lcl}
          onSave={(value) => updateRecord(record.id, 'lcl', value as string)}
          placeholder="LCL"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('lcl')}
        />
      </td>
      
      <td className={`border-r border-gray-500 p-1 ${getContainerVolumeColor(record.air)}`} data-field="air">
        <InlineEditCell
          value={record.air}
          onSave={(value) => updateRecord(record.id, 'air', value as string)}
          placeholder="Air"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('air')}
        />
      </td>
      
      <td className={`border-r-4 border-black p-1 ${getContainerVolumeColor(record.truck)}`} data-field="truck">
        <InlineEditCell
          value={record.truck}
          onSave={(value) => updateRecord(record.id, 'truck', value as string)}
          placeholder="Truck"
          className="font-medium"
          isTextColumn={true}
          onNextCell={() => focusNextCell('truck')}
        />
      </td>
      
      <td className="border-r border-gray-500 p-1" data-field="ssl">
        <InlineEditCell
          value={record.ssl}
          onSave={(value) => updateRecord(record.id, 'ssl', value as string)}
          placeholder="SSL or Trucker"
          className={getTextStyling(record.ssl)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('ssl')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="nvo">
        <InlineEditCell
          value={record.nvo}
          onSave={(value) => updateRecord(record.id, 'nvo', value as string)}
          placeholder="NVO"
          className={getTextStyling(record.nvo)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('nvo')}
        />
      </td>
      
      <td className="border-r-4 border-black p-1" data-field="comments">
        <InlineEditCell
          value={record.comments}
          onSave={(value) => updateRecord(record.id, 'comments', value as string)}
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
          onSave={(value) => updateRecord(record.id, 'salesContact', value as string)}
          placeholder="Enter sales contact"
          className={getTextStyling(record.salesContact)}
          isTextColumn={true}
          onNextCell={() => focusNextCell('salesContact')}
        />
      </td>
      
      <td className="p-1 text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleCheckboxChange}
          className="h-3 w-3 border"
        />
      </td>
    </tr>
  );
});

export default AllFilesTableRow;
