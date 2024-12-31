import React, { useState } from "react";
import AddEvent from "./AddEvent";
import EventList from "./EventList";
import { Button } from "../ui/button";


interface EventMainProps {
  selectedDate: Date | null;
}

const EventMain: React.FC<EventMainProps> = ({ selectedDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* <div>{selectedDate?.toDateString()}</div> */}
      <EventList selectedDate={selectedDate}/>
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
        />
      )}
    </div>
  );
};

export default EventMain;
