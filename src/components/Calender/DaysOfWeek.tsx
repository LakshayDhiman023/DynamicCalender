// components/DaysOfWeek.tsx
import React from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DaysOfWeek: React.FC = () => (
    <div className="grid grid-cols-7 text-center font-medium">
        {daysOfWeek.map((day, index) => (
            <div key={index} className="p-2">{day}</div>
        ))}
    </div>
);

export default DaysOfWeek;