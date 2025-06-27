
import React, { useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore } from 'lucide-react';
import { AllFilesRecord } from '../types/AllFilesRecord';
import { getContainerVolumeColor } from '../utils/dateUtils';
import AllFilesTableHeader from './AllFilesTableHeader';
import AllFilesTableRow from './AllFilesTableRow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
}

const AllFilesTable = ({ data, updateRecord, deleteRecord, selectedRows, setSelectedRows }: AllFilesTableProps) => {
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

  const handleArchiveRecord = (id: string) => {
    updateRecord(id, 'archived', 'true');
  };

  const handleUnarchiveRecord = (id: string) => {
    updateRecord(id, 'archived', 'false');
  };

  const filteredData = showArchived ? data : data.filter(record => !record.archived);

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
      
      <ScrollArea className="h-[600px] w-full" ref={scrollAreaRef}>
        <div className="min-w-[1800px]">
          <table className="w-full border-collapse text-xs">
            <AllFilesTableHeader selectedRows={selectedRows} data={data} setSelectedRows={setSelectedRows} />
            <tbody>
              {filteredData.map((record, index) => (
                <AllFilesTableRow
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
                />
              ))}
              <tr>
                <td colSpan={20} className="h-16"></td>
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
