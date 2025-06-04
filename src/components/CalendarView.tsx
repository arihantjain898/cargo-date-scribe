
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
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'return':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'cutoff':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'drop':
        return '🚚 Drop Date';
      case 'return':
        return '↩️ Return Date';
      case 'cutoff':
        return '⏰ Doc Cutoff';
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
      borderRadius: '50%',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      <Card className="h-fit shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            📅 Calendar Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-lg border shadow-sm bg-white p-4"
          />
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-800 text-base">Legend:</h4>
            <div className="grid grid-cols-1 gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 justify-start p-3">
                🚚 Drop Date
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 justify-start p-3">
                ↩️ Return Date
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 justify-start p-3">
                ⏰ Doc Cutoff
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">
            {selectedDate ? `📋 Events for ${selectedDate.toLocaleDateString()}` : '📋 Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {selectedEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedEvents.map((event, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className={`${getEventTypeColor(event.type)} font-semibold px-3 py-1`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">Customer:</span>
                      <span className="font-bold text-gray-900">{event.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">REF:</span>
                      <span className="text-gray-800">{event.ref}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-600">File:</span>
                      <span className="text-gray-800">{event.file}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">
                No events scheduled for this date
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            ⏰ Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 6)
              .map((event, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-3">
                    <Badge 
                      variant="outline" 
                      className={`${getEventTypeColor(event.type)} font-semibold px-3 py-1`}
                    >
                      {getEventTypeLabel(event.type)}
                    </Badge>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-lg">{event.customer}</div>
                    <div className="text-gray-600 font-medium">{event.ref} • {event.file}</div>
                  </div>
                </div>
              ))}
          </div>
          {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 text-lg">
                No upcoming events
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
