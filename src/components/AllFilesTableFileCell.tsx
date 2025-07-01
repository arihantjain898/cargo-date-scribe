
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AllFilesTableFileCellProps {
  fileValue: string;
  numberValue: string;
  onSave: (value: string) => void;
  onFileClick?: (fileNumber: string, fileType: string) => void;
  className?: string;
}

const AllFilesTableFileCell = ({
  fileValue,
  numberValue,
  onSave,
  onFileClick,
  className
}: AllFilesTableFileCellProps) => {
  const handleFileClick = () => {
    if (onFileClick && numberValue && fileValue) {
      onFileClick(numberValue, fileValue);
    }
  };

  const fileOptions = ['EA', 'ES', 'IS', 'IA', 'DT', 'ET'];

  return (
    <div className="flex items-center gap-2">
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
      {numberValue && fileValue && onFileClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileClick}
          className="h-6 w-6 p-0 hover:bg-blue-100"
          title={`Open ${fileValue} ${numberValue} in checklist`}
        >
          <ExternalLink className="h-3 w-3 text-blue-600" />
        </Button>
      )}
    </div>
  );
};

export default AllFilesTableFileCell;
