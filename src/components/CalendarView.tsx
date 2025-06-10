import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackingRecord } from '../types/TrackingRecord';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CalendarViewProps {
  data: TrackingRecord[];
}

interface CalendarEvent {
  date: string;
  type: 'drop' | 'return' | 'cutoff';
  customer: string;
  ref: string;
  file: string;
}

const CalendarView = ({ data }: CalendarViewProps) => {
  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];
    
    data.forEach(record => {
      if (record.dropDate) {
        eventList.push({
          date: record.dropDate,
          type: 'drop',
          customer: record.customer,
          ref: record.ref,
          file: record.file
        });
      }
      
      if (record.returnDate) {
        eventList.push({
          date: record.returnDate,
          type: 'return',
          customer: record.customer,
          ref: record.ref,
          file: record.file
        });
      }
      
      if (record.docCutoffDate) {
        eventList.push({
          date: record.docCutoffDate,
          type: 'cutoff',
          customer: record.customer,
          ref: record.ref,
          file: record.file
        });
      }
    });
    
    return eventList;
  }, [data]);

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'drop':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'return':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cutoff':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 justify-start text-xs">
                Drop Date
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 justify-start text-xs">
                Return Date
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 justify-start text-xs">
                Doc Cutoff
              </Badge>
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
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type)} text-xs`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
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
                      <Badge 
                        variant="outline" 
                        className={`${getEventTypeColor(event.type)} text-xs`}
                      >
                        {getEventTypeLabel(event.type)}
                      </Badge>
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
