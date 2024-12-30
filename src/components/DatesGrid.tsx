// components/DatesGrid.tsx
import React, { useState } from 'react';

const DatesGrid: React.FC<{ currentDate: Date; today: Date }> = ({ currentDate, today }) => {
    const getFirstDayOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
    const getLastDayOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const todayDate = today.getDate();
    

    const dates = [];

    for (let i = 0; i < totalCells; i++) {
        const day = i - startDay + 1;
        const isToday = i >= startDay && day === todayDate && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

        dates.push(
            <div
                key={i}
                className={`h-10 flex items-center justify-center ${
                    i >= startDay && day <= daysInMonth
                        ? `bg-primary/10 rounded-md ${isToday ? 'bg-blue-500 text-white' : ''}`
                        : "text-muted-foreground"
                }`}
            >
                {i >= startDay && day <= daysInMonth ? day : ""}
            </div>
        );
    }

    return <div className="grid grid-cols-7 gap-1">{dates}</div>;
};

export default DatesGrid;