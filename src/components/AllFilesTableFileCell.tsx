
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InlineEditCell from './InlineEditCell';

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

  return (
    <div className="flex items-center gap-2">
      <InlineEditCell
        value={fileValue}
        onSave={onSave}
        options={['EA', 'ES', 'IS', 'IA', 'DT', 'ET']}
        placeholder="Select file type"
        className={className}
      />
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
