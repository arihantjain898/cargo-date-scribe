
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AllFilesTableFileCellProps {
  fileValue: string;
  numberValue: string;
  onSave: (value: string) => void;
  className?: string;
}

const AllFilesTableFileCell = ({
  fileValue,
  onSave,
  className
}: AllFilesTableFileCellProps) => {
  const fileOptions = ['EA', 'ES', 'IS', 'IA', 'DT', 'ET'];

  return (
    <Select value={fileValue} onValueChange={onSave}>
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
