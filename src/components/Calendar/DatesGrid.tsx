import React, { useState, useEffect } from "react";
// import EventDetails from '../Events/EventDetails'; // Import the EventDetails component
// import { toast } from '@/hooks/use-toast';
// import { Button } from '../ui/button'; // Using shadcn UI button component

interface Events {
  [year: string]: {
    [month: string]: {
      [day: string]: {
        title: string;
        description: string;
        start: string;
        end: string;
        category: string;
      }[];
    };
  };
}

interface DatesGridProps {
  currentDate: Date;
  handleDateChange: (date: Date | null) => void;
  selectedDate: Date | null
}

const DatesGrid: React.FC<DatesGridProps> = ({
  currentDate,
  handleDateChange,
  selectedDate
}) => {
  const [events, setEvents] = useState<Events>({});

  const getFirstDayOfMonth = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), 1);
  const getLastDayOfMonth = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const firstDay = getFirstDayOfMonth(currentDate);
  const lastDay = getLastDayOfMonth(currentDate);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const today = new Date();
  const todayDate = today.getDate();

  // Fetch events from localStorage
  const fetchEvents = () => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  // Save events to localStorage
  const saveEventsToLocalStorage = (updatedEvents: Events) => {
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  // Initialize events from localStorage on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle date click
  const handleDateClick = (day: number) => {
    if (day >= 1 && day <= daysInMonth) {
      const selectedDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      console.log(selectedDate);

      handleDateChange(selectedDate);
    }
  };

  // Check if a specific date has events
  const hasEntry = (
    events: Events,
    year: string,
    month: string,
    day: string
  ): boolean => {
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
    const isSelected = i >= startDay &&
    day === selectedDate?.getDate() &&
    selectedDate?.getMonth() === currentDate.getMonth() &&
    selectedDate?.getFullYear() === currentDate.getFullYear();

    const hasEvents =
      i >= startDay &&
      day > 0 &&
      hasEntry(
        events,
        currentDate.getFullYear().toString(),
        (currentDate.getMonth() + 1).toString(),
        day.toString()
      );

    // Check if the day is a weekend (Saturday or Sunday)
    const isWeekend =
      i >= startDay &&
      (new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      ).getDay() === 6 ||
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).getDay() === 0);

    dates.push(
      <div
        key={i}
        className={`h-10 flex items-center justify-center cursor-pointer ${
          i >= startDay && day <= daysInMonth
            ? `rounded-md ${
                hasEvents
                  ? "bg-green-500 text-white"
                  : isToday
                  ? "bg-blue-500": isSelected ? 'bg-lime-100'
                  : isWeekend
                  ? "bg-gray-300" // Weekends with no events will be white
                  : "bg-white" // Weekdays without events will be grey
              }`
            : "text-muted-foreground"
        }`}
        onClick={() => handleDateClick(day)}
      >
        {i >= startDay && day <= daysInMonth ? day : ""}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-7 gap-1">{dates}</div>
    </div>
  );
};

export default DatesGrid;
