import React, { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import CalendarHeader from "./CalendarHeader";
import DaysOfWeek from "./DaysOfWeek";
import DatesGrid from "./DatesGrid";

interface CalendarProps {
  updateDate: (date: Date | null) => void;
  selectedDate: Date | null
}

const Calendar: React.FC<CalendarProps> = ({ updateDate, selectedDate }) => {
  const handleDateChange = (date: Date | null) => {
    
    updateDate(date);
  };

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handlePreviousMonth = (): void => {
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(prevMonth);
  };
  const handleNextMonth = (): void => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextMonth);
  };

  return (
    <div className="flex space-x-4">
      
      <Card className="w-full mx-auto flex-1">
        <CalendarHeader
          currentDate={currentDate}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
        />
        <CardContent>
          <DaysOfWeek />
          <DatesGrid currentDate={currentDate} handleDateChange = {handleDateChange} selectedDate={selectedDate }/>
        </CardContent>
      </Card>
      
    </div>
  );

};

export default Calendar;
