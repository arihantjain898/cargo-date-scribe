
import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackingRecord } from '../types/TrackingRecord';
import { ImportTrackingRecord } from '../types/ImportTrackingRecord';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';

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
}

const CalendarView = ({ data, importData = [] }: CalendarViewProps) => {
  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];
    
    // Export events
    data.forEach(record => {
      if (record.dropDate) {
        eventList.push({
          date: record.dropDate,
          type: 'drop',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export'
        });
      }
      
      if (record.returnDate) {
        eventList.push({
          date: record.returnDate,
          type: 'return',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export'
        });
      }
      
      if (record.docCutoffDate) {
        eventList.push({
          date: record.docCutoffDate,
          type: 'cutoff',
          customer: record.customer,
          ref: record.ref,
          file: record.file,
          source: 'export'
        });
      }
    });

    // Import events
    importData.forEach(record => {
      if (record.etaFinalPod) {
        eventList.push({
          date: record.etaFinalPod,
          type: 'eta',
          customer: record.reference,
          ref: record.reference,
          file: record.file,
          source: 'import'
        });
      }
      
      if (record.deliveryDate) {
        eventList.push({
          date: record.deliveryDate,
          type: 'delivery',
          customer: record.reference,
          ref: record.reference,
          file: record.file,
          source: 'import'
        });
      }
    });
    
    return eventList;
  }, [data, importData]);

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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

  const eventDates = useMemo(() => {
    const dates = new Set<string>();
    events.forEach(event => {
      dates.add(event.date);
    });
    return dates;
  }, [events]);

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
      borderRadius: '6px',
      fontWeight: '500'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <Card className="lg:col-span-1 shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-gray-900">
            Calendar Overview
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
          />
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
          <ScrollArea className="h-96">
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((event, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-500">
                  No events scheduled for this date
                </p>
              </div>
            )}
          </ScrollArea>
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
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 9)
                .map((event, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition-shadow">
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
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
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
  );
};

export default CalendarView;
