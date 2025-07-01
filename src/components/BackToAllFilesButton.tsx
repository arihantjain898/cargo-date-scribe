
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackToAllFilesButtonProps {
  onBackToAllFiles: () => void;
  className?: string;
}

const BackToAllFilesButton = ({ onBackToAllFiles, className }: BackToAllFilesButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onBackToAllFiles}
      className={`h-6 w-6 p-0 hover:bg-blue-100 ${className}`}
      title="Go back to All Files"
    >
      <ArrowLeft className="h-3 w-3 text-blue-600" />
    </Button>
  );
};

export default BackToAllFilesButton;
