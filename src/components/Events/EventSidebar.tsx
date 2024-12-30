import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Event {
  title: string;
  description: string;
  start: string;
  end: string;
  category: string;
}

interface EventSidebarProps {
  month: number;
  year: number;
}

interface Events {
  [year: string]: {
    [month: string]: {
      [day: string]: Event[];
    };
  };
}

const EventSidebar: React.FC<EventSidebarProps> = ({ month, year }) => {
  const [events, setEvents] = useState<Events>({});
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Fetch events from localStorage
  const fetchEvents = () => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  // Filter events for the selected month and year
  const filterEvents = () => {
    const eventsInMonth = [];
    const yearString = year.toString();
    const monthString = (month + 1).toString().padStart(2, '0'); // Month is 0-based in Date

    if (events[yearString] && events[yearString][monthString]) {
      Object.keys(events[yearString][monthString]).forEach(day => {
        eventsInMonth.push(...events[yearString][monthString][day]);
      });
    }

    setFilteredEvents(eventsInMonth);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, month, year]);

  // Export events as JSON
  const exportAsJson = () => {
    const blob = new Blob([JSON.stringify(filteredEvents, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `events_${month + 1}_${year}.json`;
    link.click();
  };

  // Export events as CSV
  const exportAsCsv = () => {
    const header = ['Title', 'Description', 'Start', 'End', 'Category'];
    const rows = filteredEvents.map(event => [
      event.title,
      event.description,
      event.start,
      event.end,
      event.category,
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += header.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `events_${month + 1}_${year}.csv`;
    link.click();
  };

  return (
    <div className="flex">
      <Card className="w-80 bg-white shadow-lg rounded-lg border">
        <CardContent className="p-4">
          <div className="text-xl font-semibold mb-4">Events for {month + 1}/{year}</div>

          <Separator className="mb-4" />

          <div className="mb-4">
            <Button variant="outline" className="mr-2" onClick={exportAsJson}>Export as JSON</Button>
            <Button variant="outline" onClick={exportAsCsv}>Export as CSV</Button>
          </div>

          {filteredEvents.length > 0 ? (
            <div
              className={`space-y-4 ${filteredEvents.length > 4 ? 'max-h-[400px] overflow-y-auto' : ''}`}
            >
                console.log(fil);
                
              {filteredEvents.map((event, index) => (
                
                
                <div key={index} className="p-2 border-b">
                  <div className="font-medium text-lg">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.description}</div>
                  <div className="text-sm text-gray-500">
                    {event.start} - {event.end}
                  </div>
                  <div className="text-xs text-gray-400">{event.category}</div>
                  {/* <Button variant="outline" className="mt-2 text-sm">View Details</Button> */}
                </div>
              ))}
            </div>
          ) : (
            <div>No events for this month.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventSidebar;
