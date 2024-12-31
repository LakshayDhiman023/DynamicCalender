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
    
      <div className="flex ">

        <div className="w-7/12 p-4 border-r border-gray-300">
          <Calendar updateDate={updateDate} selectedDate={selectedDate} />
        </div>


        <div className="w-5/12 p-4">
          <EventList selectedDate={selectedDate} updateDate = {updateDate}/>
        </div>
      </div>
    </>
  )
}

export default App
