import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, X } from 'lucide-react';

interface CalendarViewProps {
  data: TrackingRecord[];
  importData?: ImportTrackingRecord[];
}

interface CalendarEvent {
  date: string;
  type: 'drop' | 'return' | 'cutoff' | 'eta' | 'delivery';
  customer: string;
  ref: string;
  file: string;
  source: 'export' | 'import';
  workOrder?: string;
  originPort?: string;
  destinationPort?: string;
  ssl?: string;
  nvo?: string;
  bond?: string;
}

interface EventDetailModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal = ({ event, isOpen, onClose }: EventDetailModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Event Details
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
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
              className={`text-xs font-medium ${event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-indigo-100 text-indigo-700 border-indigo-300'}`}
            >
              {event.source === 'export' ? 'Export' : 'Import'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="font-medium text-gray-600">Customer</div>
              <div className="text-gray-900">{event.customer}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">File #</div>
              <div className="text-gray-900">{event.file}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">Reference</div>
              <div className="text-gray-900">{event.ref}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">Date</div>
              <div className="text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
            </div>
            
            {event.originPort && (
              <div>
                <div className="font-medium text-gray-600">Origin</div>
                <div className="text-gray-900">{event.originPort}</div>
              </div>
            )}
            
            {event.destinationPort && (
              <div>
                <div className="font-medium text-gray-600">Destination</div>
                <div className="text-gray-900">{event.destinationPort}</div>
              </div>
            )}
            
            {event.ssl && (
              <div>
                <div className="font-medium text-gray-600">SSL</div>
                <div className="text-gray-900">{event.ssl}</div>
              </div>
            )}
            
            {event.nvo && (
              <div>
                <div className="font-medium text-gray-600">NVO</div>
                <div className="text-gray-900">{event.nvo}</div>
              </div>
            )}
            
            {event.bond && (
              <div>
                <div className="font-medium text-gray-600">Bond</div>
                <div className="text-gray-900">{event.bond}</div>
              </div>
            )}
          </div>
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
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cutoff':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  } else {
    switch (type) {
      case 'eta':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivery':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    }
  }
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
    default:
      return type;
  }
};

const CalendarView = ({ data, importData = [] }: CalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'export' | 'import'>('all');

  const { exportEvents, importEvents, allEvents } = useMemo(() => {
    const exportEventList: CalendarEvent[] = [];
    const importEventList: CalendarEvent[] = [];
    
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
          workOrder: record.workOrder
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
          workOrder: record.workOrder
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
          workOrder: record.workOrder
        });
      }
    });

    // Import events
    importData.forEach(record => {
      if (record.etaFinalPod) {
        importEventList.push({
          date: record.etaFinalPod,
          type: 'eta',
          customer: record.reference,
          ref: record.reference,
          file: record.file,
          source: 'import',
          bond: record.bond
        });
      }
      
      if (record.deliveryDate) {
        importEventList.push({
          date: record.deliveryDate,
          type: 'delivery',
          customer: record.reference,
          ref: record.reference,
          file: record.file,
          source: 'import',
          bond: record.bond
        });
      }
    });
    
    return {
      exportEvents: exportEventList,
      importEvents: importEventList,
      allEvents: [...exportEventList, ...importEventList]
    };
  }, [data, importData]);

  const getEventsForDate = (date: Date, eventSource: 'all' | 'export' | 'import' = 'all') => {
    const dateString = date.toISOString().split('T')[0];
    const events = eventSource === 'export' ? exportEvents : 
                  eventSource === 'import' ? importEvents : allEvents;
    return events.filter(event => event.date === dateString);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const eventDates = useMemo(() => {
    const dates = new Map<string, { export: number; import: number }>();
    const eventsToProcess = calendarFilter === 'all' ? allEvents :
                           calendarFilter === 'export' ? exportEvents : importEvents;
                           
    eventsToProcess.forEach(event => {
      const date = event.date;
      if (!dates.has(date)) {
        dates.set(date, { export: 0, import: 0 });
      }
      const counts = dates.get(date)!;
      if (event.source === 'export') {
        counts.export++;
      } else {
        counts.import++;
      }
    });
    return dates;
  }, [allEvents, exportEvents, importEvents, calendarFilter]);

  const modifiers = {
    hasEvents: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      return eventDates.has(dateString);
    }
  };

  const modifiersStyles = {
    hasEvents: {
      position: 'relative' as const,
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      borderBottom: '3px solid rgba(59, 130, 246, 0.8)',
      fontWeight: '600'
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const renderEventsList = (events: CalendarEvent[], title: string) => (
    <div className="space-y-3">
      {events.length > 0 ? (
        events.map((event, index) => (
          <div 
            key={index} 
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-medium ${event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-indigo-100 text-indigo-700 border-indigo-300'}`}
                >
                  {event.source === 'export' ? 'Export' : 'Import'}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-gray-900">{event.customer}</div>
              <div className="text-sm text-gray-600">{event.ref} • {event.file}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-500">
            No {title.toLowerCase()} scheduled for this date
          </p>
        </div>
      )}
    </div>
  );

  const DayContent = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const counts = eventDates.get(dateString);
    
    if (!counts) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5 z-0">
        {counts.export > 0 && (
          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90 shadow-sm"></div>
        )}
        {counts.import > 0 && (
          <div className="w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-90 shadow-sm"></div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <Card className="lg:col-span-1 shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900 flex items-center justify-between">
            Calendar Overview
            <div className="flex items-center gap-1">
              <Button
                variant={calendarFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalendarFilter('all')}
                className="text-xs px-2 py-1"
              >
                All
              </Button>
              <Button
                variant={calendarFilter === 'export' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalendarFilter('export')}
                className="text-xs px-2 py-1"
              >
                Export
              </Button>
              <Button
                variant={calendarFilter === 'import' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCalendarFilter('import')}
                className="text-xs px-2 py-1"
              >
                Import
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border border-gray-200 bg-white p-3"
            components={{
              DayContent: DayContent
            }}
          />
          
          {/* Legend */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-800 text-sm">Event Types:</h4>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 mb-1">Export Events:</div>
              <div className="space-y-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 justify-start text-xs block w-fit">
                  Drop Date
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 justify-start text-xs block w-fit">
                  Return Date
                </Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 justify-start text-xs block w-fit">
                  Doc Cutoff
                </Badge>
              </div>
              <div className="text-xs font-semibold text-gray-600 mb-1 mt-3">Import Events:</div>
              <div className="space-y-1">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 justify-start text-xs block w-fit">
                  ETA Final POD
                </Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 justify-start text-xs block w-fit">
                  Delivery Date
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-full h-1 bg-blue-400 rounded"></div>
                  <span>Days with events</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900">
            {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="export">Export Events</TabsTrigger>
              <TabsTrigger value="import">Import Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ScrollArea className="h-96">
                {renderEventsList(selectedDate ? getEventsForDate(selectedDate, 'all') : [], 'events')}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="export">
              <ScrollArea className="h-96">
                {renderEventsList(selectedDate ? getEventsForDate(selectedDate, 'export') : [], 'export events')}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="import">
              <ScrollArea className="h-96">
                {renderEventsList(selectedDate ? getEventsForDate(selectedDate, 'import') : [], 'import events')}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900">
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <ScrollArea className="h-64">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allEvents
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 9)
                .map((event, index) => (
                  <div 
                    key={index} 
                    className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-indigo-100 text-indigo-700 border-indigo-300'}`}
                        >
                          {event.source === 'export' ? 'EXP' : 'IMP'}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 text-sm">{event.customer}</div>
                      <div className="text-xs text-gray-600">{event.ref} • {event.file}</div>
                    </div>
                  </div>
                ))}
            </div>
            {allEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-500">
                  No upcoming events
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
    </div>
  );
};

export default CalendarView;
