import React, { useState } from "react";
import AddEvent from "./AddEvent";
import EventList from "./EventList";
import { Button } from "../ui/button";


interface EventMainProps {
  selectedDate: Date | null;
  updateDate: (date: Date | null) => void;
}

const EventMain: React.FC<EventMainProps> = ({ selectedDate, updateDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDateChange = (date: Date | null) => {
    
    updateDate(date);
  };

  return (
    <div>
      {/* <div>{selectedDate?.toDateString()}</div> */}
      <EventList selectedDate={selectedDate} handleDateChange = {handleDateChange}/>
      {selectedDate === null ? (
        <div>No date selected</div>
      ) : (
        <Button type="button" onClick={() => setIsModalOpen(true)}>
          Add Event
        </Button>
      )}

      {/* Conditionally render AddEvent modal */}
      {isModalOpen && selectedDate && (
        <AddEvent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          handleDateChange = {handleDateChange}
        />
      )}
    </div>
  );
};

export default EventMain;
