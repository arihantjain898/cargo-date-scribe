
import { useState, useCallback } from 'react';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
  group?: string;
}

export const useTableColumns = (initialColumns: ColumnConfig[]) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  }, []);

  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, width: Math.max(width, col.minWidth) } : col
    ));
  }, []);

  const toggleGroup = useCallback((group: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  }, []);

  const getVisibleColumns = useCallback(() => {
    return columns.filter(col => {
      if (!col.visible) return false;
      if (col.group && collapsedGroups.has(col.group)) return false;
      return true;
    });
  }, [columns, collapsedGroups]);

  return {
    columns,
    collapsedGroups,
    toggleColumnVisibility,
    updateColumnWidth,
    toggleGroup,
    getVisibleColumns
  };
};
