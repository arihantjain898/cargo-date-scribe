import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Archive, ArchiveRestore, ExternalLink } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { useAllFilesSearch } from '../hooks/useAllFilesSearch';
import { getContainerVolumeColor } from '../utils/dateUtils';
import AllFilesTableHeader from './AllFilesTableHeader';
import AllFilesTableRow from './AllFilesTableRow';

interface AllFilesTableProps {
  data: AllFilesRecord[];
  updateRecord: (
    id: string,
    field: keyof AllFilesRecord,
    value: string
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  onFileClick?: (fileNumber: string, fileType: string) => void;
  highlightedRowId?: string | null;
  onCreateCorrespondingRow?: (record: AllFilesRecord) => void;
  onArchiveCorrespondingRecord?: (record: AllFilesRecord, archiveStatus: boolean) => void;
  importData?: any[];
  exportData?: any[];
  domesticData?: any[];
}

const AllFilesTable = ({ 
  data, 
  updateRecord, 
  deleteRecord, 
  selectedRows, 
  setSelectedRows, 
  onFileClick,
  highlightedRowId,
  onCreateCorrespondingRow,
  onArchiveCorrespondingRecord,
  importData = [],
  exportData = [],
  domesticData = []
}: AllFilesTableProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const { searchTerm, setSearchTerm, filteredData } = useAllFilesSearch(data);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [data.length]);

  // Scroll to highlighted row when highlightedRowId changes
  useEffect(() => {
    if (highlightedRowId && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      const highlightedRow = scrollAreaRef.current.querySelector(`[data-row-id="${highlightedRowId}"]`);
      
      if (viewport && highlightedRow) {
        const rowElement = highlightedRow as HTMLElement;
        const viewportElement = viewport as HTMLElement;
        
        // Calculate the position to scroll to center the row
        const rowTop = rowElement.offsetTop;
        const rowHeight = rowElement.offsetHeight;
        const viewportHeight = viewportElement.clientHeight;
        const scrollTop = rowTop - (viewportHeight / 2) + (rowHeight / 2);
        
        viewportElement.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedRowId]);

  // Helper function to find corresponding record
  const findCorrespondingRecord = (record: AllFilesRecord) => {
    const targetFileIdentifier = `${record.file}${record.number}`;
    const filePrefix = record.file.trim().toUpperCase();
    
    if (filePrefix === 'EA' || filePrefix === 'ES' || filePrefix === 'ET') {
      return exportData.find(r => r.customer === record.customer && r.file === targetFileIdentifier);
    } else if (filePrefix === 'IA' || filePrefix === 'IS') {
      return importData.find(r => r.customer === record.customer && r.file === targetFileIdentifier);
    } else if (filePrefix === 'DT') {
      return domesticData.find(r => r.customer === record.customer && r.file === targetFileIdentifier);
    }
    return null;
  };

  const handleArchiveRecord = (id: string) => {
    updateRecord(id, 'archived', 'true');
  };

  const handleUnarchiveRecord = (id: string) => {
    updateRecord(id, 'archived', 'false');
  };

  const handleArchiveAllRecord = (id: string) => {
    updateRecord(id, 'archived', 'true');
    // Find the record and archive corresponding record
    const record = data.find(r => r.id === id);
    if (record && onArchiveCorrespondingRecord) {
      onArchiveCorrespondingRecord(record, true);
    }
  };

  const handleUnarchiveAllRecord = (id: string) => {
    updateRecord(id, 'archived', 'false');
    // Find the record and unarchive corresponding record
    const record = data.find(r => r.id === id);
    if (record && onArchiveCorrespondingRecord) {
      onArchiveCorrespondingRecord(record, false);
    }
  };

  const finalFilteredData = React.useMemo(() => {
    return showArchived ? filteredData : filteredData.filter(record => !record.archived);
  }, [filteredData, showArchived]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Files</h2>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2"
          >
            {showArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </Button>
        </div>
      </div>
      
      <div className="p-4 border-b bg-white sticky top-0 z-40">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer, file, number, comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>
      
      <ScrollArea className="h-[69vh] w-full" ref={scrollAreaRef}>
        <div className="min-w-[1400px]">
          <table className="w-full border-collapse text-xs">
            <AllFilesTableHeader 
              selectedRows={selectedRows} 
              data={filteredData} 
              setSelectedRows={setSelectedRows}
            />
            <tbody>
              {finalFilteredData.map((record, index) => (
                 <AllFilesTableRow
                   key={record.id}
                   record={record}
                   index={index}
                   updateRecord={updateRecord}
                   deleteRecord={deleteRecord}
                   onArchive={handleArchiveRecord}
                   onUnarchive={handleUnarchiveRecord}
                   onArchiveAll={handleArchiveAllRecord}
                   onUnarchiveAll={handleUnarchiveAllRecord}
                   selectedRows={selectedRows}
                   setSelectedRows={setSelectedRows}
                   showArchived={showArchived}
                   onFileClick={onFileClick}
                   highlightedRowId={highlightedRowId}
                   onCreateCorrespondingRow={onCreateCorrespondingRow}
                   hasCorrespondingRecord={!!findCorrespondingRecord(record)}
                 />
              ))}
              <tr>
                <td colSpan={21} className="h-16"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AllFilesTable;
