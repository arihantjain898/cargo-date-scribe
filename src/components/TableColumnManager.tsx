
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ColumnConfig } from '../hooks/useTableColumns';

interface TableColumnManagerProps {
  columns: ColumnConfig[];
  collapsedGroups: Set<string>;
  onToggleColumn: (columnId: string) => void;
  onToggleGroup: (group: string) => void;
}

const TableColumnManager = ({
  columns,
  collapsedGroups,
  onToggleColumn,
  onToggleGroup
}: TableColumnManagerProps) => {
  const groups = [...new Set(columns.map(col => col.group).filter(Boolean))];
  const ungroupedColumns = columns.filter(col => !col.group);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7">
          <Settings className="h-3 w-3 mr-1" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Manage Columns</h4>
          
          {/* Ungrouped columns */}
          {ungroupedColumns.map(column => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox
                id={column.id}
                checked={column.visible}
                onCheckedChange={() => onToggleColumn(column.id)}
              />
              <label htmlFor={column.id} className="text-xs cursor-pointer">
                {column.label}
              </label>
            </div>
          ))}

          {/* Grouped columns */}
          {groups.map(group => {
            const groupColumns = columns.filter(col => col.group === group);
            const isCollapsed = collapsedGroups.has(group);
            
            return (
              <div key={group} className="space-y-2">
                <div 
                  className="flex items-center space-x-1 cursor-pointer"
                  onClick={() => onToggleGroup(group)}
                >
                  {isCollapsed ? 
                    <ChevronRight className="h-3 w-3" /> : 
                    <ChevronDown className="h-3 w-3" />
                  }
                  <span className="text-xs font-medium">{group}</span>
                </div>
                
                {!isCollapsed && (
                  <div className="ml-4 space-y-2">
                    {groupColumns.map(column => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={column.id}
                          checked={column.visible}
                          onCheckedChange={() => onToggleColumn(column.id)}
                        />
                        <label htmlFor={column.id} className="text-xs cursor-pointer">
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TableColumnManager;
