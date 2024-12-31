import React, { useState, useEffect } from 'react';
import EventDetails from '../Events/EventDetails'; // Import the EventDetails component
import { Button } from '../ui/button'; // Using shadcn UI button component

interface Events {
  [year: string]: {
    [month: string]: {
      [day: string]: { title: string; description: string; start: string; end: string; category: string }[]; 
    };
  };
}

const DatesGrid: React.FC<{ currentDate: Date; today: Date }> = ({ currentDate, today }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Events>({});
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  const getFirstDayOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
  const getLastDayOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const firstDay = getFirstDayOfMonth(currentDate);
  const lastDay = getLastDayOfMonth(currentDate);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const todayDate = today.getDate();

  // Fetch events from localStorage
  const fetchEvents = () => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  // Save events to localStorage
  const saveEventsToLocalStorage = (updatedEvents: Events) => {
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  // Initialize events from localStorage on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle date click
  const handleDateClick = (day: number) => {
    if (day >= 1 && day <= daysInMonth) {
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(selectedDate);
      setIsEventDetailsOpen(true); // Open event details modal
    }
  };

  // Check if a specific date has events
  const hasEntry = (events: Events, year: string, month: string, day: string): boolean => {
    return (
      events[year] &&
      events[year][month] &&
      events[year][month][day] &&
      events[year][month][day].length > 0
    );
  };

  // Generate the grid of dates
  const dates = [];
  for (let i = 0; i < totalCells; i++) {
    const day = i - startDay + 1;
    const isToday =
      i >= startDay &&
      day === todayDate &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    const hasEvents =
      i >= startDay &&
      day > 0 &&
      hasEntry(events, currentDate.getFullYear().toString(), (currentDate.getMonth() + 1).toString(), day.toString());

    // Check if the day is a weekend (Saturday or Sunday)
    const isWeekend = i >= startDay && (new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 6 || new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0);

    dates.push(
      <div
        key={i}
        className={`h-10 flex items-center justify-center cursor-pointer ${
          i >= startDay && day <= daysInMonth
            ? `rounded-md ${isWeekend ? 'bg-gray-200' : ''} ${
                isToday
                  ? 'bg-blue-600 text-white'
                  : hasEvents
                  ? 'bg-green-500 text-white'
                  : 'bg-primary/10'
              }`
            : 'text-muted-foreground'
        }`}
        onClick={() => handleDateClick(day)}
      >
        {i >= startDay && day <= daysInMonth ? day : ''}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Grid of dates */}
      <div className="grid grid-cols-7 gap-1">{dates}</div>

      {/* Background blur when event details modal is open */}
      {isEventDetailsOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsEventDetailsOpen(false)} // Close modal when background is clicked
        ></div>
      )}

      {/* EventDetails Modal */}
      {selectedDate && isEventDetailsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <EventDetails
            date={selectedDate}
            events={events}
            setEvents={setEvents}
            saveEventsToLocalStorage={saveEventsToLocalStorage}
            closeEventDetails={() => setIsEventDetailsOpen(false)} // Close event details on save
          />
        </div>
      )}
    </div>
  );
};

export default DatesGrid;
