import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EventDetailsProps {
  date: Date;
  events: any;
  setEvents: React.Dispatch<React.SetStateAction<any>>;
  saveEventsToLocalStorage: (updatedEvents: any) => void;
  closeEventDetails: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  date,
  events,
  setEvents,
  saveEventsToLocalStorage,
  closeEventDetails,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [category, setCategory] = useState("work");
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const currentEvents = events[year]?.[month]?.[day] || [];

  const isTimeConflict = (start: string, end: string) => {
    return currentEvents.some((event: any) => {
      const eventStart = new Date(`1970-01-01T${event.start}:00`).getTime();
      const eventEnd = new Date(`1970-01-01T${event.end}:00`).getTime();
      const newStart = new Date(`1970-01-01T${start}:00`).getTime();
      const newEnd = new Date(`1970-01-01T${end}:00`).getTime();

      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });
  };

  const saveEvent = () => {
    if (!title || !start || !end) {
      alert("Please fill all fields.");
      return;
    }

    if (isTimeConflict(start, end)) {
      alert("Event time conflicts with another event.");
      return;
    }

    const updatedEvents = { ...events };
    if (!updatedEvents[year]) updatedEvents[year] = {};
    if (!updatedEvents[year][month]) updatedEvents[year][month] = {};
    if (!updatedEvents[year][month][day]) updatedEvents[year][month][day] = [];

    updatedEvents[year][month][day].push({
      title,
      description,
      start,
      end,
      category,
    });
    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
    closeEventDetails();
  };

  const editEvent = (event: any) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setStart(event.start);
    setEnd(event.end);
    setCategory(event.category);
  };

  const saveEditedEvent = () => {
    if (!editingEvent) return;

    const updatedEvents = { ...events };
    const eventIndex = updatedEvents[year][month][day].indexOf(editingEvent);

    if (eventIndex > -1) {
      if (isTimeConflict(start, end)) {
        alert("Event time conflicts with another event.");
        return;
      }

      updatedEvents[year][month][day][eventIndex] = {
        ...editingEvent,
        title,
        description,
        start,
        end,
        category,
      };
    }

    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
    closeEventDetails();
  };

  const deleteEvent = (event: any) => {
    const updatedEvents = { ...events };
    const eventIndex = updatedEvents[year][month][day].indexOf(event);

    if (eventIndex > -1) {
      updatedEvents[year][month][day].splice(eventIndex, 1);
    }

    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-500";
      case "personal":
        return "bg-green-500";
      case "others":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => open || closeEventDetails()}>
      <DialogTrigger asChild>
        <Button>Add Event</Button>
      </DialogTrigger>

      <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogTitle className="text-lg font-bold text-center mb-4">
          {editingEvent ? "Edit Event" : "Add Event"} for {date.toDateString()}
        </DialogTitle>

        <div className="mb-4">
          <h4 className="font-semibold text-md">Existing Events:</h4>
          {currentEvents.length === 0 ? (
            <p className="text-gray-500">No events for this date</p>
          ) : (
            <ul>
              {currentEvents.map((event, index) => (
                <li
                  key={index}
                  className={`mt-2 flex justify-between items-center p-2 rounded ${getCategoryColor(
                    event.category
                  )}`}
                >
                  <div>
                    <strong>{event.title}</strong> ({event.start} - {event.end}):
                    {event.description}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => editEvent(event)}
                      className="bg-yellow-400 text-black"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => deleteEvent(event)}
                      className="bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <Input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <Textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <Input
            type="time"
            placeholder="Start Time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <Input
            type="time"
            placeholder="End Time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="flex justify-between">
          {editingEvent ? (
            <Button onClick={saveEditedEvent} className="bg-blue-600 text-white">
              Save Edited Event
            </Button>
          ) : (
            <Button onClick={saveEvent} className="bg-blue-600 text-white">
              Save Event
            </Button>
          )}
          <Button onClick={closeEventDetails} className="bg-gray-300 text-black">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
