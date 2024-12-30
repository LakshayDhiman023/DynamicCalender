// components/CalendarHeader.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

const CalendarHeader: React.FC<{ currentDate: Date; handlePreviousMonth: () => void; handleNextMonth: () => void }> = ({ currentDate, handlePreviousMonth, handleNextMonth }) => (
    <CardHeader className="flex justify-between items-center">
        <div className='flex'>
            <Button variant="ghost" onClick={handlePreviousMonth}>&lt;</Button>
            <CardTitle className="text-lg">
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </CardTitle>
            <Button variant="ghost" onClick={handleNextMonth}>&gt;</Button>
        </div>
    </CardHeader>
);

export default CalendarHeader;