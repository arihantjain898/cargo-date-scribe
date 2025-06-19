
import { useState } from 'react';

export interface ColumnGroup {
  id: string;
  title: string;
  columns: string[];
  isCollapsed: boolean;
  color: string;
}

export const useTableColumnGroups = (initialGroups: ColumnGroup[]) => {
  const [groups, setGroups] = useState<ColumnGroup[]>(initialGroups);

  const toggleGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, isCollapsed: !group.isCollapsed }
        : group
    ));
  };

  const isColumnVisible = (columnId: string) => {
    const group = groups.find(g => g.columns.includes(columnId));
    return !group || !group.isCollapsed;
  };

  return { groups, toggleGroup, isColumnVisible };
};
