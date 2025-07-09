import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Archive, ArchiveRestore } from 'lucide-react';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { useDomesticTruckingSearch } from '../hooks/useSearch';
import DomesticTruckingTableHeader from './DomesticTruckingTableHeader';
import DomesticTruckingTableRow from './DomesticTruckingTableRow';

interface DomesticTruckingTableProps {
  data: DomesticTruckingRecord[];
  updateRecord: (
    id: string,
    field: keyof DomesticTruckingRecord,
    value: string | boolean
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedRowId?: string | null;
  onFileClick?: (fileNumber: string, fileType: string) => void;
}

const DomesticTruckingTable = ({ 
  data, 
  updateRecord, 
  deleteRecord, 
  selectedRows, 
  setSelectedRows, 
  highlightedRowId,
  onFileClick
}: DomesticTruckingTableProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showArchived, setShowArchived] = React.useState(false);
  const { searchTerm, setSearchTerm, filteredData } = useDomesticTruckingSearch(data);

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

  const handleArchiveRecord = (id: string) => {
    updateRecord(id, 'archived', true);
  };

  const handleUnarchiveRecord = (id: string) => {
    updateRecord(id, 'archived', false);
  };

  const finalFilteredData = showArchived ? filteredData : filteredData.filter(record => !record.archived);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Domestic Trucking</h2>
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
            placeholder="Search by customer, file, pick date, delivered, notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </div>
      
      <ScrollArea className="h-[69vh] w-full" ref={scrollAreaRef}>
        <div className="min-w-[1100px]">
          <table className="w-full border-collapse text-xs">
            <DomesticTruckingTableHeader 
              selectedRows={selectedRows} 
              data={filteredData} 
              setSelectedRows={setSelectedRows}
            />
            <tbody>
              {finalFilteredData.map((record, index) => (
                <DomesticTruckingTableRow
                  key={record.id}
                  record={record}
                  index={index}
                  updateRecord={updateRecord}
                  deleteRecord={deleteRecord}
                  onArchive={handleArchiveRecord}
                  onUnarchive={handleUnarchiveRecord}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  showArchived={showArchived}
                  highlightedRowId={highlightedRowId}
                  onFileClick={onFileClick}
                />
              ))}
              <tr>
                <td colSpan={11} className="h-16"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default DomesticTruckingTable;
