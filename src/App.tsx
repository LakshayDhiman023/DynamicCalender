import { useState } from 'react'

import EventList from './components/Events/EventMain'
import Calendar from './components/Calendar/Calendar'

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  console.log(selectedDate);

  const updateDate = (date: Date | null) => {
    setSelectedDate(date);
  }

  console.log(localStorage.getItem('events'));

  return (
    <>
      <div className="flex h-screen w-full">
        {/* Calendar takes up 60% of the width */}
        <div className="flex-6 p-4 border-r border-gray-300">
          <Calendar updateDate={updateDate} selectedDate={selectedDate} />
        </div>

        {/* Event List takes up 40% of the width */}
        <div className="flex-4 p-4">
          <EventList selectedDate={selectedDate} />
        </div>
      </div>
    </>
  )
}

export default App
