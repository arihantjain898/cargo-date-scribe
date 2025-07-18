
import React, { useMemo, useState } from 'react';
import { format, parseISO, startOfWeek, addDays, endOfWeek } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { Task } from '../types/Task';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, X, ChevronLeft, ChevronRight, Plus, Check, Trash2, CalendarIcon } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  data: TrackingRecord[];
  importData?: ImportTrackingRecord[];
  domesticData?: DomesticTruckingRecord[];
  onCalendarEventClick?: (fileId: string, source: string) => void;
  userId?: string;
}

interface CalendarEvent {
  date: string;
  type: 'drop' | 'return' | 'cutoff' | 'eta' | 'delivery' | 'pickup' | 'delivered' | 'task';
  customer: string;
  ref: string;
  file: string;
  source: 'export' | 'import' | 'domestic' | 'task';
  recordId: string;
  booking?: string;
  uniqueId: string;
  description?: string;
  assignedTo?: string;
  completed?: boolean;
}

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEventClick?: (fileId: string, source: string) => void;
}

const EventDetailModal = ({ event, isOpen, onClose, onEventClick }: EventDetailModalProps) => {
  if (!event) return null;

  const handleEventClick = () => {
    console.log('EventDetailModal: Navigating to file:', event.file, event.source);
    if (onEventClick) {
      // Pass the file identifier and the correct tab type for linking
      let tabType = '';
      if (event.source === 'export') {
        tabType = 'export';
      } else if (event.source === 'import') {
        tabType = 'import';
      } else if (event.source === 'domestic') {
        tabType = 'domestic';
      }
      onEventClick(event.file, tabType);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Event Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
            >
              {getEventTypeLabel(event.type)}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : event.source === 'import' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}
            >
              {event.source === 'export' ? 'Export' : event.source === 'import' ? 'Import' : 'Domestic Trucking'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium text-gray-600">Customer</div>
              <div className="text-gray-900">{event.customer}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">File #</div>
              <div className="text-gray-900 cursor-pointer text-blue-600 hover:underline" onClick={handleEventClick}>
                {event.file}
              </div>
            </div>
            
            {event.source === 'import' && event.booking && (
              <div>
                <div className="font-medium text-gray-600">Booking</div>
                <div className="text-gray-900">{event.booking}</div>
              </div>
            )}
            
            {event.source === 'export' && event.ref && (
              <div>
                <div className="font-medium text-gray-600">Reference</div>
                <div className="text-gray-900">{event.ref}</div>
              </div>
            )}
            
            <div>
              <div className="font-medium text-gray-600">Date</div>
              <div className="text-gray-900">{new Date(event.date + 'T00:00:00').toLocaleDateString()}</div>
            </div>
          </div>
          
          {onEventClick && (
            <Button 
              onClick={handleEventClick}
              className="w-full mt-4"
            >
              Go to {event.source === 'export' ? 'Export' : event.source === 'import' ? 'Import' : 'Domestic Trucking'} Table
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getEventTypeColor = (type: string, source: string) => {
  if (source === 'export') {
    switch (type) {
      case 'drop':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'return':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'cutoff':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  } else if (source === 'import') {
    switch (type) {
      case 'eta':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    }
  } else if (source === 'domestic') {
    switch (type) {
      case 'pickup':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  } else if (source === 'task') {
    return 'bg-pink-100 text-pink-800 border-pink-300';
  }
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'drop':
      return 'Drop Date';
    case 'return':
      return 'Return Date';
    case 'cutoff':
      return 'Doc Cutoff';
    case 'eta':
      return 'ETA Final POD';
    case 'delivery':
      return 'Delivery Date';
    case 'pickup':
      return 'Pick Date';
    case 'delivered':
      return 'Delivered';
    case 'task':
      return 'Task';
    default:
      return type;
  }
};

const CalendarView = ({ data, importData = [], domesticData = [], onCalendarEventClick, userId = 'test-user-123' }: CalendarViewProps) => {
  const { data: tasks, addItem: addTask, updateItem: updateTask, deleteItem: deleteTask } = useFirestore<Task>('tasks', userId);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'export' | 'import' | 'domestic' | 'task'>('all');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ description: '', assignedTo: '' });

  const { exportEvents, importEvents, domesticEvents, allEvents } = useMemo(() => {
    const exportEventList: CalendarEvent[] = [];
    const importEventList: CalendarEvent[] = [];
    const domesticEventList: CalendarEvent[] = [];
    const taskEventList: CalendarEvent[] = [];
    
    // Export events
    data.forEach(record => {
      if (record.dropDate) {
        exportEventList.push({
          date: record.dropDate,
          type: 'drop',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export',
          recordId: record.id,
          uniqueId: `${record.id}-drop-${record.dropDate}`
        });
      }
      
      if (record.returnDate) {
        exportEventList.push({
          date: record.returnDate,
          type: 'return',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export',
          recordId: record.id,
          uniqueId: `${record.id}-return-${record.returnDate}`
        });
      }
      
      if (record.docCutoffDate) {
        exportEventList.push({
          date: record.docCutoffDate,
          type: 'cutoff',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export',
          recordId: record.id,
          uniqueId: `${record.id}-cutoff-${record.docCutoffDate}`
        });
      }
    });

    // Import events
    importData.forEach(record => {
      if (record.etaFinalPod) {
        importEventList.push({
          date: record.etaFinalPod,
          type: 'eta',
          customer: record.customer,
          ref: record.booking,
          file: record.file,
          source: 'import',
          recordId: record.id,
          booking: record.booking,
          uniqueId: `${record.id}-eta-${record.etaFinalPod}`
        });
      }
      
      if (record.deliveryDate) {
        importEventList.push({
          date: record.deliveryDate,
          type: 'delivery',
          customer: record.customer,
          ref: record.booking,
          file: record.file,
          source: 'import',
          recordId: record.id,
          booking: record.booking,
          uniqueId: `${record.id}-delivery-${record.deliveryDate}`
        });
      }
    });

    // Domestic events
    domesticData.forEach(record => {
      if (record.pickDate) {
        domesticEventList.push({
          date: record.pickDate,
          type: 'pickup',
          customer: record.customer,
          ref: '',
          file: record.file,
          source: 'domestic',
          recordId: record.id,
          uniqueId: `${record.id}-pickup-${record.pickDate}`
        });
      }
      
      if (record.delivered) {
        domesticEventList.push({
          date: record.delivered,
          type: 'delivered',
          customer: record.customer,
          ref: '',
          file: record.file,
          source: 'domestic',
          recordId: record.id,
          uniqueId: `${record.id}-delivered-${record.delivered}`
        });
      }
    });

    // Task events
    tasks.forEach(task => {
      if (task.dueDate) {
        taskEventList.push({
          date: task.dueDate,
          type: 'task',
          customer: task.assignedTo,
          ref: '',
          file: task.description,
          source: 'task',
          recordId: task.id,
          uniqueId: `${task.id}-task-${task.dueDate}`,
          description: task.description,
          assignedTo: task.assignedTo,
          completed: task.completed
        });
      }
    });
    
    return {
      exportEvents: exportEventList,
      importEvents: importEventList,
      domesticEvents: domesticEventList,
      allEvents: [...importEventList, ...exportEventList, ...domesticEventList, ...taskEventList]
    };
  }, [data, importData, domesticData, tasks]);

  // Task-related functions
  const getCurrentWeekStart = () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    return addDays(weekStart, currentWeekOffset * 7);
  };

  const getWeekDays = () => {
    const weekStart = getCurrentWeekStart();
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const handleAddTask = async (dateStr: string) => {
    if (!newTask.description || !newTask.assignedTo) return;

    try {
      await addTask({
        description: newTask.description,
        dueDate: dateStr,
        assignedTo: newTask.assignedTo,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setNewTask({ description: '', assignedTo: '' });
      setShowAddTask(null);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed: !completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getEventsForDate = (date: Date, eventSource: 'all' | 'export' | 'import' | 'domestic' | 'task' = 'all') => {
    const dateString = date.toISOString().split('T')[0];
    const events = eventSource === 'export' ? exportEvents : 
                  eventSource === 'import' ? importEvents :
                  eventSource === 'domestic' ? domesticEvents : allEvents;
    
    return events.filter(event => event.date === dateString);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const eventDates = useMemo(() => {
    const dates = new Map<string, { export: number; import: number; domestic: number }>();
    const eventsToProcess = calendarFilter === 'all' ? allEvents :
                           calendarFilter === 'export' ? exportEvents : 
                           calendarFilter === 'import' ? importEvents : domesticEvents;
    
    eventsToProcess.forEach(event => {
      const date = event.date;
      if (!dates.has(date)) {
        dates.set(date, { export: 0, import: 0, domestic: 0 });
      }
      const counts = dates.get(date)!;
      if (event.source === 'export') {
        counts.export++;
      } else if (event.source === 'import') {
        counts.import++;
      } else {
        counts.domestic++;
      }
    });
    return dates;
  }, [allEvents, exportEvents, importEvents, domesticEvents, calendarFilter]);

  const modifiers = {
    hasEvents: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      return eventDates.has(dateString);
    }
  };

  const modifiersStyles = {
    hasEvents: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '500'
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('CalendarView: Event clicked, file:', event.file, 'source:', event.source);
    if (onCalendarEventClick) {
      // Pass the file identifier and the correct tab type for linking
      let tabType = '';
      if (event.source === 'export') {
        tabType = 'export';
      } else if (event.source === 'import') {
        tabType = 'import';
      } else if (event.source === 'domestic') {
        tabType = 'domestic';
      }
      onCalendarEventClick(event.file, tabType);
    }
  };

  const getWeeklyEventsGroupedByDate = () => {
    const events = calendarFilter === 'all' ? allEvents :
                  calendarFilter === 'export' ? exportEvents : 
                  calendarFilter === 'import' ? importEvents : 
                  calendarFilter === 'domestic' ? domesticEvents :
                  calendarFilter === 'task' ? allEvents.filter(e => e.source === 'task') : allEvents;
    
    // Calculate the start of the current week (Sunday) plus offset
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weeklyEvents = events.filter(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
    
    // Group by date
    const groupedEvents = weeklyEvents.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
    
    // Create array for all 7 days of the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      weekDays.push({
        date: dateString,
        dateObj: currentDate,
        events: groupedEvents[dateString] || []
      });
    }
    
    return weekDays;
  };

  const getCurrentWeekLabel = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startOfWeek.getDate();
    const endDay = endOfWeek.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const renderOptimizedEventsBySource = (events: CalendarEvent[]) => {
    if (events.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-3xl mb-2 opacity-50">📅</div>
            <p className="text-gray-400 text-sm">No events for this date</p>
          </div>
        </div>
      );
    }

    // Group events by source for better organization
    const importEvents = events.filter(e => e.source === 'import');
    const exportEvents = events.filter(e => e.source === 'export');
    const domesticEvents = events.filter(e => e.source === 'domestic');

    return (
      <div className="space-y-6">
        {/* Import Events */}
        {importEvents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-sm font-medium">
                Import Events ({importEvents.length})
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {importEvents.map((event) => (
                <div 
                  key={event.uniqueId} 
                  className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <div className="font-semibold text-gray-900 text-sm truncate">{event.customer}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {event.booking && <div><span className="font-medium">Booking:</span> {event.booking}</div>}
                      <div><span className="font-medium">File:</span> {event.file}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Events */}
        {exportEvents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-sm font-medium">
                Export Events ({exportEvents.length})
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {exportEvents.map((event) => (
                <div 
                  key={event.uniqueId} 
                  className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <div className="font-semibold text-gray-900 text-sm truncate">{event.customer}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {event.ref && <div><span className="font-medium">Ref:</span> {event.ref}</div>}
                      <div><span className="font-medium">File:</span> {event.file}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Domestic Events */}
        {domesticEvents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-sm font-medium">
                Domestic Events ({domesticEvents.length})
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {domesticEvents.map((event) => (
                <div 
                  key={event.uniqueId} 
                  className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="space-y-3">
                    <Badge 
                      variant="outline" 
                      className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <div className="font-semibold text-gray-900 text-sm truncate">{event.customer}</div>
                    <div className="text-xs text-gray-600">
                      <div><span className="font-medium">File:</span> {event.file}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'import':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs">Import</Badge>;
      case 'export':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-xs">Export</Badge>;
      case 'domestic':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">Domestic</Badge>;
      case 'task':
        return <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300 text-xs">Task</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6 flex-1 flex flex-col overflow-hidden">
        {/* Optimized Header with better spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Calendar Overview</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={calendarFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarFilter('all')}
              className="text-sm"
            >
              All Events
            </Button>
            <Button
              variant={calendarFilter === 'import' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarFilter('import')}
              className="text-sm"
            >
              Import
            </Button>
            <Button
              variant={calendarFilter === 'export' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarFilter('export')}
              className="text-sm"
            >
              Export
            </Button>
            <Button
              variant={calendarFilter === 'domestic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarFilter('domestic')}
              className="text-sm"
            >
              Domestic
            </Button>
            <Button
              variant={calendarFilter === 'task' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarFilter('task')}
              className="text-sm"
            >
              Tasks
            </Button>
          </div>
        </div>

        {/* Main Content - Single Row Layout */}
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Calendar Section - Fixed width, no extra space */}
          <div className="w-80 flex-shrink-0">
            <Card className="h-full shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-lg border border-gray-200 bg-white p-3 mb-6 shadow-sm w-full"
                />
                
                {/* Enhanced Legend with better spacing */}
                <div className="space-y-4 text-xs">
                  <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Event Types</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium text-indigo-700 mb-3 text-sm">Import Events:</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 text-xs">ETA Final POD</Badge>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs">Delivery Date</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700 mb-3 text-sm">Export Events:</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs">Drop Date</Badge>
                        <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300 text-xs">Return Date</Badge>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs">Doc Cutoff</Badge>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-yellow-700 mb-3 text-sm">Domestic Events:</div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">Pick Date</Badge>
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">Delivered</Badge>
                       </div>
                     </div>
                     <div>
                       <div className="font-medium text-pink-700 mb-3 text-sm">Task Events:</div>
                       <div className="flex flex-wrap gap-2">
                         <Badge variant="outline" className="bg-pink-100 text-pink-800 border-pink-300 text-xs">Task</Badge>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center gap-2 pt-3 border-t">
                     <div className="w-3 h-3 bg-blue-600 rounded"></div>
                     <span className="text-gray-500 text-sm">Days with events</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events for Selected Date - Takes remaining space */}
          <div className="flex-1 min-w-0">
            <Card className="h-full shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedDate ? `Events for ${selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}` : 'Select a date to view events'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 h-full">
                <ScrollArea className="h-full">
                  {selectedDate ? renderOptimizedEventsBySource(getEventsForDate(selectedDate, calendarFilter)) : (
                    <div className="flex items-center justify-center h-full min-h-[500px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="text-6xl mb-4 opacity-50">📅</div>
                        <p className="text-gray-500 text-lg font-medium">Select a date to view events</p>
                        <p className="text-gray-400 text-sm mt-2">Click on any date in the calendar to see scheduled events</p>
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Weekly View - Full width, proper height */}
        <div className="flex-shrink-0">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Weekly View: {getCurrentWeekLabel()}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                    className="px-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(0)}
                    disabled={currentWeekOffset === 0}
                    className="text-xs"
                  >
                    This Week
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                    className="px-3"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-7 gap-4">
                {getWeekDays().map((dateObj) => {
                  const date = format(dateObj, 'yyyy-MM-dd');
                  const events = getEventsForDate(dateObj, calendarFilter);
                  const dayTasks = getTasksForDate(dateObj);
                  
                  return (
                    <div key={date} className="space-y-3 min-h-0">
                      <div className="text-center p-3 bg-gray-50 rounded-lg border">
                        <div className="font-semibold text-gray-900 text-sm">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {dateObj.getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {events.length} event{events.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        <div className="space-y-2 pr-2">
                          {/* Regular Events */}
                          {events.map((event) => (
                            <div 
                              key={event.uniqueId} 
                              className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all cursor-pointer text-xs"
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {getSourceBadge(event.source)}
                                  <Badge 
                                    variant="outline" 
                                    className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                                  >
                                    {getEventTypeLabel(event.type)}
                                  </Badge>
                                </div>
                                <div className="font-semibold text-gray-900 text-xs truncate">
                                  {event.source === 'task' ? event.assignedTo : event.customer}
                                </div>
                                <div className="text-gray-600 text-xs">
                                  <div className="truncate">
                                    {event.source === 'task' ? event.description :
                                     event.source === 'import' && event.booking ? `Booking: ${event.booking}` : 
                                     event.source === 'export' && event.ref ? `Ref: ${event.ref}` : 
                                     `File: ${event.file}`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Task Management */}
                          {(calendarFilter === 'all' || calendarFilter === 'task') && dayTasks.map((task) => (
                            <div 
                              key={task.id} 
                              className={cn(
                                "p-3 border rounded-lg bg-pink-50 border-pink-200 text-xs",
                                task.completed && "opacity-60 line-through"
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300 text-xs">
                                      Task
                                    </Badge>
                                  </div>
                                  <div className="font-medium text-pink-900">
                                    {task.description}
                                  </div>
                                  <div className="text-xs text-pink-700 mt-1">
                                    Assigned to: {task.assignedTo}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleToggleTask(task.id, task.completed)}
                                    className="h-6 w-6 p-0 text-pink-600 hover:bg-pink-100"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Add Task Form */}
                          {showAddTask === date && (
                            <div className="p-3 border rounded-lg bg-pink-50 border-pink-200">
                              <div className="space-y-3">
                                <div className="text-xs font-medium text-pink-900 mb-2">Add New Task</div>
                                <div className="space-y-2">
                                  <div>
                                    <label className="text-xs text-pink-700 block mb-1">Description</label>
                                    <Textarea
                                      placeholder="e.g., call ZIM to renew quote#1235"
                                      value={newTask.description}
                                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                                      className="text-xs h-16 bg-white border-pink-200 focus:border-pink-300"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-pink-700 block mb-1">Assigned to</label>
                                    <Input
                                      placeholder="e.g., Pranadhi"
                                      value={newTask.assignedTo}
                                      onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                                      className="text-xs bg-white border-pink-200 focus:border-pink-300"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAddTask(date)}
                                    className="text-xs h-7 bg-pink-600 hover:bg-pink-700"
                                    disabled={!newTask.description || !newTask.assignedTo}
                                  >
                                    Add Task
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setShowAddTask(null)}
                                    className="text-xs h-7 border-pink-300 text-pink-700 hover:bg-pink-100"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Add Task Button */}
                          {showAddTask !== date && (calendarFilter === 'all' || calendarFilter === 'task') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowAddTask(date)}
                              className="w-full text-xs h-7 text-pink-600 hover:bg-pink-50 border border-dashed border-pink-300"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Task
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>


        <EventDetailModal
          event={selectedEvent}
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onEventClick={onCalendarEventClick}
        />
      </div>
    </div>
  );
};

export default CalendarView;
