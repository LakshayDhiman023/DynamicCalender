import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import CalendarHeader from "./CalendarHeader";
import DaysOfWeek from "./DaysOfWeek";
import DatesGrid from "./DatesGrid";
import EventSidebar from '../Events/EventSideBar'; // Import the EventSidebar component

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [today] = useState<Date>(new Date());

    const handlePreviousMonth = (): void => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = (): void => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
    };

    return (
        <div className="flex space-x-4">
            {/* Event Sidebar */}
            <div className="w-80">
                <EventSidebar month={currentDate.getMonth()} year={currentDate.getFullYear()} />
            </div>

            {/* Calendar */}
            <Card className="w-96 mx-auto flex-1">
                <CalendarHeader 
                    currentDate={currentDate} 
                    handlePreviousMonth={handlePreviousMonth} 
                    handleNextMonth={handleNextMonth} 
                />
                <CardContent>
                    <DaysOfWeek />
                    <DatesGrid currentDate={currentDate} today={today} />
                </CardContent>
            </Card>
        </div>
    );
};

export default Calendar;
