
import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { DomesticTruckingRecord } from '../types/DomesticTruckingRecord';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, X } from 'lucide-react';

interface CalendarViewProps {
  data: TrackingRecord[];
  importData?: ImportTrackingRecord[];
  domesticData?: DomesticTruckingRecord[];
  onCalendarEventClick?: (fileId: string, source: string) => void;
}

interface CalendarEvent {
  date: string;
  type: 'drop' | 'return' | 'cutoff' | 'eta' | 'delivery' | 'pickup' | 'delivered';
  customer: string;
  ref: string;
  file: string;
  source: 'export' | 'import' | 'domestic';
  recordId: string;
  booking?: string;
  uniqueId: string;
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
    console.log('EventDetailModal: Navigating to record:', event.recordId, event.source);
    if (onEventClick) {
      onEventClick(event.recordId, event.source);
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
  } else {
    // domestic
    switch (type) {
      case 'pickup':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
    case 'pickup':
      return 'Pick Date';
    case 'delivered':
      return 'Delivered';
    default:
      return type;
  }
};

const CalendarView = ({ data, importData = [], domesticData = [], onCalendarEventClick }: CalendarViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'export' | 'import' | 'domestic'>('all');

  const { exportEvents, importEvents, domesticEvents, allEvents } = useMemo(() => {
    const exportEventList: CalendarEvent[] = [];
    const importEventList: CalendarEvent[] = [];
    const domesticEventList: CalendarEvent[] = [];
    
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
    
    return {
      exportEvents: exportEventList,
      importEvents: importEventList,
      domesticEvents: domesticEventList,
      allEvents: [...importEventList, ...exportEventList, ...domesticEventList]
    };
  }, [data, importData, domesticData]);

  const getEventsForDate = (date: Date, eventSource: 'all' | 'export' | 'import' | 'domestic' = 'all') => {
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
    console.log('CalendarView: Event clicked, navigating to:', event.recordId, event.source);
    if (onCalendarEventClick) {
      onCalendarEventClick(event.recordId, event.source);
    }
  };

  const getUpcomingEventsGroupedByDate = () => {
    const events = calendarFilter === 'all' ? allEvents :
                  calendarFilter === 'export' ? exportEvents : 
                  calendarFilter === 'import' ? importEvents : domesticEvents;
    
    // Get events for the next 7 days only
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date + 'T00:00:00');
      return eventDate >= today && eventDate <= nextWeek;
    });
    
    // Group by date
    const groupedEvents = upcomingEvents.reduce((acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
    
    // Sort dates
    const sortedDates = Object.keys(groupedEvents).sort();
    
    return sortedDates.map(date => ({
      date,
      events: groupedEvents[date].sort((a, b) => {
        const sourceOrder = { import: 0, export: 1, domestic: 2 };
        return sourceOrder[a.source] - sourceOrder[b.source];
      })
    }));
  };

  const renderEventsBySource = (events: CalendarEvent[]) => {
    if (events.length === 0) {
      return (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <div className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-gray-500">No events for this date</p>
          </div>
        </div>
      );
    }

    // Group events by source
    const importEvents = events.filter(e => e.source === 'import');
    const exportEvents = events.filter(e => e.source === 'export');
    const domesticEvents = events.filter(e => e.source === 'domestic');

    return (
      <div className="grid grid-cols-3 gap-3 h-full min-h-[400px]">
        {/* Import Events */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 pb-2 border-b mb-2 flex-shrink-0">
            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs font-medium">
              Import
            </Badge>
            <span className="text-xs text-gray-500">({importEvents.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {importEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-gray-400 text-xs text-center">No import events</p>
                </div>
              ) : (
                importEvents.map((event) => (
                  <div 
                    key={event.uniqueId} 
                    className="p-2 border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium w-full justify-center`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <div className="font-semibold text-gray-900 text-xs truncate">{event.customer}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {event.booking && `Booking: ${event.booking}`}
                      </div>
                      <div className="text-xs text-gray-600 truncate">File: {event.file}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Export Events */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 pb-2 border-b mb-2 flex-shrink-0">
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300 text-xs font-medium">
              Export
            </Badge>
            <span className="text-xs text-gray-500">({exportEvents.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {exportEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-gray-400 text-xs text-center">No export events</p>
                </div>
              ) : (
                exportEvents.map((event) => (
                  <div 
                    key={event.uniqueId} 
                    className="p-2 border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium w-full justify-center`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <div className="font-semibold text-gray-900 text-xs truncate">{event.customer}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {event.ref && `Ref: ${event.ref}`}
                      </div>
                      <div className="text-xs text-gray-600 truncate">File: {event.file}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Domestic Events */}
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 pb-2 border-b mb-2 flex-shrink-0">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs font-medium">
              Domestic
            </Badge>
            <span className="text-xs text-gray-500">({domesticEvents.length})</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {domesticEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-gray-400 text-xs text-center">No domestic events</p>
                </div>
              ) : (
                domesticEvents.map((event) => (
                  <div 
                    key={event.uniqueId} 
                    className="p-2 border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="space-y-1">
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium w-full justify-center`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
                      <div className="font-semibold text-gray-900 text-xs truncate">{event.customer}</div>
                      <div className="text-xs text-gray-600 truncate">File: {event.file}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          <Card className="lg:col-span-1 shadow-sm border border-gray-200 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center justify-between">
                Calendar Overview
                <div className="flex items-center gap-1">
                  <Button
                    variant={calendarFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarFilter('all')}
                    className="text-xs px-2 py-1 h-6"
                  >
                    All
                  </Button>
                  <Button
                    variant={calendarFilter === 'import' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarFilter('import')}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Import
                  </Button>
                  <Button
                    variant={calendarFilter === 'export' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarFilter('export')}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Export
                  </Button>
                  <Button
                    variant={calendarFilter === 'domestic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCalendarFilter('domestic')}
                    className="text-xs px-2 py-1 h-6"
                  >
                    D-Trucking
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-1 flex flex-col">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border border-gray-200 bg-white p-2 mb-3"
              />
              
              {/* Compact Legend */}
              <div className="space-y-1 text-xs flex-1">
                <h4 className="font-medium text-gray-800 text-xs">Event Types:</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <div className="font-semibold text-gray-600 mb-1 text-xs">Import:</div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 text-xs block w-fit">ETA</Badge>
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs block w-fit">Delivery</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 mb-1 text-xs">Export:</div>
                    <div className="space-y-1">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 text-xs block w-fit">Drop</Badge>
                      <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300 text-xs block w-fit">Return</Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 text-xs block w-fit">Cutoff</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-600 mb-1 text-xs">Domestic:</div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">Pick</Badge>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">Delivered</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span className="text-gray-500 text-xs">Days with events</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-sm border border-gray-200 flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-sm font-medium text-gray-900">
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 flex-1 flex flex-col min-h-0">
              {selectedDate ? renderEventsBySource(getEventsForDate(selectedDate, calendarFilter)) : (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-gray-500">Select a date to view events</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Upcoming Events (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ScrollArea className="h-64">
              <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
                {getUpcomingEventsGroupedByDate().map(({ date, events }) => (
                  <div key={date} className="flex-shrink-0 w-64 space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="text-sm font-semibold text-gray-700 text-center border-b border-gray-200 pb-2">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="space-y-2">
                      {events.map((event) => (
                        <div 
                          key={event.uniqueId} 
                          className="p-2 border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow cursor-pointer"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 mb-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-medium ${event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : event.source === 'import' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-yellow-100 text-yellow-700 border-yellow-300'}`}
                              >
                                {event.source === 'export' ? 'Export' : event.source === 'import' ? 'Import' : 'Domestic'}
                              </Badge>
                            </div>
                            <div className="font-semibold text-gray-900 text-xs leading-tight truncate">{event.customer}</div>
                            <Badge 
                              variant="outline" 
                              className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium w-full justify-center`}
                            >
                              {getEventTypeLabel(event.type)}
                            </Badge>
                            <div className="text-xs text-gray-600 truncate">
                              {event.source === 'import' && event.booking ? event.booking : 
                               event.source === 'export' ? event.ref : 
                               event.file}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {getUpcomingEventsGroupedByDate().length === 0 && (
                  <div className="w-full text-center py-8">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-gray-500">
                      No upcoming events in the next 7 days
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

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
