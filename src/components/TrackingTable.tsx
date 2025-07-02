
import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore } from 'lucide-react';
import { TrackingRecord } from '../types/TrackingRecord';
import TrackingTableHeader from './TrackingTableHeader';
import TrackingTableRow from './TrackingTableRow';

interface TrackingTableProps {
  data: TrackingRecord[];
  updateRecord: (
    id: string,
    field: keyof TrackingRecord,
    value: string | boolean
  ) => void;
  deleteRecord: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  highlightedRowId?: string | null;
  onFileClick?: (fullFileIdentifier: string) => void;
}

const TrackingTable = ({ 
  data, 
  updateRecord, 
  deleteRecord, 
  selectedRows, 
  setSelectedRows, 
  highlightedRowId,
  onFileClick
}: TrackingTableProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showArchived, setShowArchived] = React.useState(false);

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

  const filteredData = showArchived ? data : data.filter(record => !record.archived);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Export Tracking</h2>
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
      
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[2400px]">
          <table className="w-full border-collapse text-xs">
            <TrackingTableHeader selectedRows={selectedRows} data={data} setSelectedRows={setSelectedRows} />
            <tbody>
              {filteredData.map((record, index) => (
                <TrackingTableRow
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
                <td colSpan={24} className="h-16"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TrackingTable;
