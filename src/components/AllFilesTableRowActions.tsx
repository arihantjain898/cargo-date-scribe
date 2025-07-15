
import React from 'react';
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface AllFilesTableRowActionsProps {
  recordId: string;
  customerName: string;
  isSelected: boolean;
  isArchived: boolean;
  onCheckboxChange: (checked: boolean) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onArchiveAll?: (id: string) => void;
  onUnarchiveAll?: (id: string) => void;
  onDelete: (id: string) => void;
  hasCorrespondingRecord?: boolean;
}

const AllFilesTableRowActions = ({
  recordId,
  customerName,
  isSelected,
  isArchived,
  onCheckboxChange,
  onArchive,
  onUnarchive,
  onArchiveAll,
  onUnarchiveAll,
  onDelete,
  hasCorrespondingRecord
}: AllFilesTableRowActionsProps) => {
  return (
    <>
      <td className="p-1 text-center border-r border-gray-500">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onCheckboxChange}
          className="h-3 w-3 border"
        />
      </td>
      
      <td className="p-1 text-center border-r border-gray-500">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-yellow-50 rounded-full">
              {isArchived ? (
                <ArchiveRestore className="h-3 w-3 text-green-600" />
              ) : (
                <Archive className="h-3 w-3 text-yellow-600" />
              )}
            </Button>
          </AlertDialogTrigger>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>
                 {isArchived ? 'Unarchive Record' : 'Archive Record'}
               </AlertDialogTitle>
               <AlertDialogDescription>
                 {isArchived 
                   ? `Are you sure you want to unarchive this record for ${customerName}?`
                   : `Are you sure you want to archive this record for ${customerName}?`
                 }
                 {hasCorrespondingRecord && (
                   <div className="mt-2 text-sm text-gray-600">
                     {isArchived 
                       ? 'You can unarchive just this record or also unarchive the corresponding record in the import/export/domestic tab.'
                       : 'You can archive just this record or also archive the corresponding record in the import/export/domestic tab.'
                     }
                   </div>
                 )}
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter className="gap-2">
               <AlertDialogCancel>Cancel</AlertDialogCancel>
               <AlertDialogAction
                 onClick={() => isArchived ? onUnarchive(recordId) : onArchive(recordId)}
                 className={isArchived ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
               >
                 {isArchived ? 'Unarchive' : 'Archive'}
               </AlertDialogAction>
               {hasCorrespondingRecord && (onArchiveAll || onUnarchiveAll) && (
                 <AlertDialogAction
                   onClick={() => isArchived ? onUnarchiveAll?.(recordId) : onArchiveAll?.(recordId)}
                   className={isArchived ? "bg-green-700 hover:bg-green-800" : "bg-yellow-700 hover:bg-yellow-800"}
                 >
                   {isArchived ? 'Unarchive All' : 'Archive All'}
                 </AlertDialogAction>
               )}
             </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>
      </td>
      
      <td className="p-1 text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-red-50 rounded-full">
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this record for {customerName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(recordId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </>
  );
};

export default AllFilesTableRowActions;
