
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
  workOrder?: string;
  originPort?: string;
  destinationPort?: string;
  ssl?: string;
  nvo?: string;
  bond?: string;
  notes?: string;
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
            <div>
              <div className="font-medium text-gray-600">Reference</div>
              <div className="text-gray-900">{event.ref}</div>
            </div>
            <div>
              <div className="font-medium text-gray-600">Date</div>
              <div className="text-gray-900">{new Date(event.date + 'T00:00:00').toLocaleDateString()}</div>
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
          workOrder: record.workOrder,
          notes: record.notes
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
          workOrder: record.workOrder,
          notes: record.notes
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
          workOrder: record.workOrder,
          notes: record.notes
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
          bond: record.bond,
          notes: record.notes
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
          bond: record.bond,
          notes: record.notes
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
          ref: record.customer,
          file: record.file,
          source: 'domestic',
          recordId: record.id,
          notes: record.notes
        });
      }
      
      if (record.delivered) {
        domesticEventList.push({
          date: record.delivered,
          type: 'delivered',
          customer: record.customer,
          ref: record.customer,
          file: record.file,
          source: 'domestic',
          recordId: record.id,
          notes: record.notes
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

  const getFilteredEventsForUpcoming = () => {
    const events = calendarFilter === 'all' ? allEvents :
                  calendarFilter === 'export' ? exportEvents : 
                  calendarFilter === 'import' ? importEvents : domesticEvents;
    
    return events
      .filter(event => new Date(event.date + 'T00:00:00') >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 12);
  };

  const renderEventsBySource = (events: CalendarEvent[]) => {
    // Organize events by source in the correct order: Import, Export, Domestic
    const importEvts = events.filter(e => e.source === 'import');
    const exportEvts = events.filter(e => e.source === 'export');
    const domesticEvts = events.filter(e => e.source === 'domestic');

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Import Events - First */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <h4 className="font-medium text-indigo-700 text-xs">Import Events</h4>
          </div>
          {importEvts.length > 0 ? importEvts.map((event, index) => (
            <div 
              key={`import-${index}`} 
              className="p-2 border border-indigo-200 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant="outline" 
                  className={`${getEventTypeColor(event.type, event.source)} text-xs`}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900 text-xs">{event.customer}</div>
                <div className="text-xs text-gray-600">{event.ref} • {event.file}</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-2 text-gray-500 text-xs">
              No import events
            </div>
          )}
        </div>

        {/* Export Events - Second */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
            <h4 className="font-medium text-slate-700 text-xs">Export Events</h4>
          </div>
          {exportEvts.length > 0 ? exportEvts.map((event, index) => (
            <div 
              key={`export-${index}`} 
              className="p-2 border border-slate-200 rounded bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant="outline" 
                  className={`${getEventTypeColor(event.type, event.source)} text-xs`}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900 text-xs">{event.customer}</div>
                <div className="text-xs text-gray-600">{event.ref} • {event.file}</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-2 text-gray-500 text-xs">
              No export events
            </div>
          )}
        </div>

        {/* Domestic Events - Third */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <h4 className="font-medium text-yellow-700 text-xs">Domestic Trucking Events</h4>
          </div>
          {domesticEvts.length > 0 ? domesticEvts.map((event, index) => (
            <div 
              key={`domestic-${index}`} 
              className="p-2 border border-yellow-200 rounded bg-yellow-50 hover:bg-yellow-100 transition-colors cursor-pointer"
              onClick={() => handleEventClick(event)}
            >
              <div className="flex items-center justify-between mb-1">
                <Badge 
                  variant="outline" 
                  className={`${getEventTypeColor(event.type, event.source)} text-xs`}
                >
                  {getEventTypeLabel(event.type)}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-gray-900 text-xs">{event.customer}</div>
                <div className="text-xs text-gray-600">{event.ref} • {event.file}</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-2 text-gray-500 text-xs">
              No domestic events
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1 shadow-sm border border-gray-200">
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
            <CardContent className="p-3 pt-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border border-gray-200 bg-white p-2 mb-3"
              />
              
              {/* Compact Legend */}
              <div className="space-y-1 text-xs">
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

          <Card className="lg:col-span-2 shadow-sm border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <ScrollArea className="h-64">
                {selectedDate ? renderEventsBySource(getEventsForDate(selectedDate, calendarFilter)) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="text-gray-500">Select a date to view events</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <ScrollArea className="h-48">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {getFilteredEventsForUpcoming().map((event, index) => (
                  <div 
                    key={index} 
                    className="p-2 border border-gray-200 rounded bg-white hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={`${getEventTypeColor(event.type, event.source)} text-xs font-medium`}
                        >
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${
                            event.source === 'export' ? 'bg-slate-100 text-slate-700 border-slate-300' : 
                            event.source === 'import' ? 'bg-indigo-100 text-indigo-700 border-indigo-300' :
                            'bg-yellow-100 text-yellow-700 border-yellow-300'
                          }`}
                        >
                          {event.source === 'export' ? 'EXP' : event.source === 'import' ? 'IMP' : 'D-TRK'}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 text-xs">{event.customer}</div>
                      <div className="text-xs text-gray-600">{event.ref} • {event.file}</div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {getFilteredEventsForUpcoming().length === 0 && (
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
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onEventClick={onCalendarEventClick}
      />
    </ScrollArea>
  );
};

export default CalendarView;
