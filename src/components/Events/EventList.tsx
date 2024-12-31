// components/EventList.tsx
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import EditEvent from "./EditEvent";
import DeleteEvent from "./DeleteEvent";  // Importing the new DeleteEvent component

interface EventListProps {
  selectedDate: Date | null;
  handleDateChange: (date: Date | null) => void;
}

interface Event {
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  category: string; // Added category for color coding
}

const categoryColors: { [key: string]: string } = {
  work: "bg-blue-500 text-white",
  personal: "bg-green-500 text-white",
  others: "bg-yellow-500 text-black",
};

const EventList: React.FC<EventListProps> = ({ selectedDate, handleDateChange }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filterKeyword, setFilterKeyword] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventIndex, setEventIndex] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const date = selectedDate.getDate();

      const storedEvents = JSON.parse(localStorage.getItem("events") || "{}");

      if (storedEvents[year]?.[month]?.[date]) {
        setEvents(storedEvents[year][month][date]);
        setFilteredEvents(storedEvents[year][month][date]);
      } else {
        setEvents([]);
        setFilteredEvents([]);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    if (filterKeyword.trim()) {
      const keyword = filterKeyword.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(keyword) ||
          event.description.toLowerCase().includes(keyword)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events); // Reset to all events if no keyword is entered
    }
  }, [filterKeyword, events]);

  const handleEditClick = (index: number) => {
    setEventIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventIndex(null);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDate && deleteIndex !== null) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const date = selectedDate.getDate();

      const storedEvents = JSON.parse(localStorage.getItem("events") || "{}");

      if (storedEvents[year]?.[month]?.[date]) {
        // Remove the event
        storedEvents[year][month][date].splice(deleteIndex, 1);

        // Save updated events back to localStorage
        localStorage.setItem("events", JSON.stringify(storedEvents));

        // Update local state
        setEvents(storedEvents[year][month][date]);
        setFilteredEvents(storedEvents[year][month][date]); // Update filtered events
      }

      // Reset delete state
      setDeleteIndex(null);
      handleDateChange(selectedDate);
      setIsDeleteDialogOpen(false);
    }
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${selectedDate?.toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ["Title", "Start Time", "End Time", "Description", "Category"];
    const csvRows = [
      headers.join(","),
      ...events.map((event) =>
        [
          event.title,
          event.startTime,
          event.endTime,
          `"${event.description}"`, // Wrap description in quotes to handle commas
          event.category,
        ].join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${selectedDate?.toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Events for {selectedDate?.toDateString() || "No Date Selected"}
      </h2>
      <div className="flex space-x-4">
        <Button onClick={exportAsJSON}>Export as JSON</Button>
        <Button onClick={exportAsCSV}>Export as CSV</Button>
      </div>
      <div className="mt-4">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Search events by keyword..."
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
        />
      </div>
      {filteredEvents.length > 0 ? (
        <ul className="space-y-4 mt-4">
          {filteredEvents.map((event, index) => (
            <li
              key={index}
              className={`border p-4 rounded-md shadow-md flex justify-between items-center ${
                categoryColors[event.category] || "bg-gray-100 text-black"
              }`}
            >
              <div>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm">
                  {event.startTime} - {event.endTime}
                </p>
                <p className="text-sm">{event.description}</p>
                <span className="text-xs font-medium capitalize mt-2 inline-block">
                  {event.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleEditClick(index)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(index)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No events match your search.</p>
      )}

      {/* Edit Event Modal */}
      {isModalOpen && eventIndex !== null && (
        <EditEvent
          selectedDate={selectedDate}
          eventIndex={eventIndex}
          closeModal={closeModal}
        />
      )}

      {/* Delete Event Component */}
      <DeleteEvent
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default EventList;
