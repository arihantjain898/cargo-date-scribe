
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColumnGroup } from '../hooks/useTableColumnGroups';

interface GroupedTableHeaderProps {
  groups: ColumnGroup[];
  toggleGroup: (groupId: string) => void;
  pinnedColumns: React.ReactNode;
  children: React.ReactNode;
}

const GroupedTableHeader = ({ groups, toggleGroup, pinnedColumns, children }: GroupedTableHeaderProps) => {
  return (
    <thead className="bg-gray-50 sticky top-0 z-20">
      {/* Group header row */}
      <tr className="border-b-2 border-gray-300">
        {pinnedColumns}
        {groups.map((group) => (
          <th
            key={group.id}
            colSpan={group.isCollapsed ? 1 : group.columns.length}
            className={`p-2 text-center font-semibold text-sm border-r-4 border-white ${group.color}`}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleGroup(group.id)}
              className="flex items-center gap-1 text-white hover:bg-white/20"
            >
              {group.isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {group.title}
              {group.isCollapsed && <span className="text-xs">({group.columns.length})</span>}
            </Button>
          </th>
        ))}
      </tr>
      {/* Column header row */}
      <tr className="border-b-2 border-gray-400">
        {children}
      </tr>
    </thead>
  );
};

export default GroupedTableHeader;
