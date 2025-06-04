
import React, { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingRecord } from './FreightTracker';

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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'return':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cutoff':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  // Create a map of dates with events for calendar highlighting
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
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Calendar Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border pointer-events-auto"
          />
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-sm">Legend:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Drop Date
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Return Date
              </Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                Doc Cutoff
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className={getEventTypeColor(event.type)}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><strong>Customer:</strong> {event.customer}</div>
                    <div><strong>REF:</strong> {event.ref}</div>
                    <div><strong>File:</strong> {event.file}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No events scheduled for this date
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 6)
              .map((event, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className={getEventTypeColor(event.type)}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div><strong>{event.customer}</strong></div>
                    <div className="text-gray-600">{event.ref} • {event.file}</div>
                  </div>
                </div>
              ))}
          </div>
          {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No upcoming events
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
