
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AllFilesTableFileCellProps {
  fileValue: string;
  numberValue: string;
  onSave: (value: string) => void;
  className?: string;
  onNextCell?: () => void;
}

const AllFilesTableFileCell = ({
  fileValue,
  onSave,
  className,
  onNextCell
}: AllFilesTableFileCellProps) => {
  const fileOptions = ['IA', 'IS', 'EA', 'ES', 'ET', 'DT'];

  const handleValueChange = (value: string) => {
    onSave(value);
    // Only trigger navigation if this was changed via keyboard navigation
    // For now, we'll disable auto-navigation for select dropdowns
    // since it's harder to track if it was changed via Enter key
  };

  return (
    <Select value={fileValue} onValueChange={handleValueChange}>
      <SelectTrigger className={`h-6 text-xs border-0 bg-transparent hover:bg-gray-50 focus:ring-0 focus:ring-offset-0 ${className}`}>
        <SelectValue placeholder="Select file type" />
      </SelectTrigger>
      <SelectContent className="bg-white border shadow-lg z-50">
        {fileOptions.map((option) => (
          <SelectItem key={option} value={option} className="text-xs">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AllFilesTableFileCell;
