
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
  onFileClick?: (fileNumber: string, fileType: string) => void;
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

  useEffect(() => {
    if (highlightedRowId && scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      const highlightedRow = scrollAreaRef.current.querySelector(`[data-row-id="${highlightedRowId}"]`);
      
      if (viewport && highlightedRow) {
        const rowElement = highlightedRow as HTMLElement;
        const viewportElement = viewport as HTMLElement;
        
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
      
      <ScrollArea className="h-[66vh] w-full" ref={scrollAreaRef}>
        <div className="w-full">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-30 bg-white">
              <TrackingTableHeader selectedRows={selectedRows} data={data} setSelectedRows={setSelectedRows} />
              <tr className="h-1">
                <td colSpan={25} className="border-b-4 border-black bg-white"></td>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <React.Fragment key={record.id}>
                  <TrackingTableRow
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
                  {index === 0 && (
                    <tr className="sticky top-12 z-20 h-1">
                      <td colSpan={25} className="border-b-4 border-gray-600 bg-white"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan={25} className="h-16"></td>
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
