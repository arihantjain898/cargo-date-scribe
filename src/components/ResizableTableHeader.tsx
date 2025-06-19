
import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResizableTableHeaderProps {
  children: React.ReactNode;
  width: number;
  minWidth: number;
  onResize: (width: number) => void;
  isGroupHeader?: boolean;
  isCollapsed?: boolean;
  onToggleGroup?: () => void;
  className?: string;
}

const ResizableTableHeader = ({
  children,
  width,
  minWidth,
  onResize,
  isGroupHeader = false,
  isCollapsed = false,
  onToggleGroup,
  className = ''
}: ResizableTableHeaderProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const headerRef = useRef<HTMLTableCellElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(startWidthRef.current + diff, minWidth);
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <th
      ref={headerRef}
      className={`relative select-none ${className}`}
      style={{ width: `${width}px`, minWidth: `${minWidth}px` }}
    >
      <div className="flex items-center h-full">
        {isGroupHeader && onToggleGroup && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 mr-1"
            onClick={onToggleGroup}
          >
            {isCollapsed ? 
              <ChevronRight className="h-2 w-2" /> : 
              <ChevronDown className="h-2 w-2" />
            }
          </Button>
        )}
        <div className="flex-1 truncate text-[10px]">{children}</div>
      </div>
      
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300 ${
          isResizing ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      />
    </th>
  );
};

export default ResizableTableHeader;
