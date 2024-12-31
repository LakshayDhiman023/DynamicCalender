import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface EditEventProps {
  selectedDate: Date | null;
  eventIndex: number;
  closeModal: () => void;
}

const EditEvent: React.FC<EditEventProps> = ({
  selectedDate,
  eventIndex,
  closeModal,
}) => {
  const [title, setTitle] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("work");

  useEffect(() => {
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const date = selectedDate.getDate();

      // Retrieve events from localStorage
      const storedEvents = JSON.parse(localStorage.getItem("events") || "{}");

      // Safely access the event to be edited
      const eventToEdit =
        storedEvents[year]?.[month]?.[date]?.[eventIndex] || null;

      if (eventToEdit) {
        setTitle(eventToEdit.title);
        setStartTime(eventToEdit.startTime);
        setEndTime(eventToEdit.endTime);
        setDescription(eventToEdit.description);
        setCategory(eventToEdit.category || "work");
      }
    }
  }, [selectedDate, eventIndex]);

  const handleSave = () => {
    if (!selectedDate) {
      alert("No date selected to edit the event.");
      return;
    }

    if (!title.trim()) {
      alert("Event title is required.");
      return;
    }

    if (!startTime.trim() || !endTime.trim()) {
      alert("Start and End times are required.");
      return;
    }

    if (startTime >= endTime) {
      alert("Start time must be earlier than end time.");
      return;
    }

    if (!description.trim()) {
      alert("Event description is required.");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const date = selectedDate.getDate();

    const storedEvents = JSON.parse(localStorage.getItem("events") || "{}");

    // Safely update the event structure
    if (!storedEvents[year]) storedEvents[year] = {};
    if (!storedEvents[year][month]) storedEvents[year][month] = {};
    if (!storedEvents[year][month][date]) storedEvents[year][month][date] = [];

    // Update the specific event
    storedEvents[year][month][date][eventIndex] = {
      title,
      startTime,
      endTime,
      description,
      category,
    };

    // Save the updated events back to localStorage
    localStorage.setItem("events", JSON.stringify(storedEvents));

    // Close the modal
    closeModal();
    alert("Event updated successfully!");
  };

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent
        className="w-[400px] bg-white shadow-lg rounded-lg p-6 border border-gray-200"
        style={{
          backgroundColor: "white", // Solid background color
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)", // Subtle shadow
          borderRadius: "0.5rem", // Rounded corners
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="end-time">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger id="category">
                <span>{category}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Event Description</Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit">Save Changes</Button>
            <Button variant="outline" type="button" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvent;