import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddEventProps {
  selectedDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
  handleDateChange: (date: Date | null) => void;
  
}

const AddEvent: React.FC<AddEventProps> = ({
  selectedDate,
  isOpen,
  onClose,
  handleDateChange
}) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("work"); // Default category

  // Helper function to check if two time ranges overlap
  const timesOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ) => {
    return (
      (start1 >= start2 && start1 < end2) || (start2 >= start1 && start2 < end1)
    );
  };

  const saveEvent = () => {
    if (!selectedDate) {
      alert("No date selected to save the event.");
      return;
    }

    // Extract year, month, and date
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // Months are 0-indexed
    const date = selectedDate.getDate();

    // Retrieve existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem("events") || "{}");

    // Ensure the structure is in place for the year, month, and date
    if (!existingEvents[year]) existingEvents[year] = {};
    if (!existingEvents[year][month]) existingEvents[year][month] = {};
    if (!existingEvents[year][month][date])
      existingEvents[year][month][date] = [];

    // Check for overlapping events
    const overlappingEvent = existingEvents[year][month][date].find(
      (event: { startTime: string; endTime: string }) =>
        timesOverlap(startTime, endTime, event.startTime, event.endTime)
    );

    if (overlappingEvent) {
      alert("The event time overlaps with an existing event.");
      return;
    }

    // Add the new event to the list
    existingEvents[year][month][date].push({
      title,
      startTime,
      endTime,
      description,
      category,
    });

    // Save the updated events back to localStorage
    localStorage.setItem("events", JSON.stringify(existingEvents));

    // Clear input fields
    setTitle("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setCategory("work");

    alert("Event saved successfully!");
    handleDateChange(selectedDate)
    location.reload();
    onClose();
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="max-w-md w-full bg-white shadow-2xl border border-gray-300 rounded-lg">
        <CardHeader>
          <CardTitle>Add Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Selected Date: {selectedDate?.toDateString() || "No Date Selected"}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEvent();
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
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setEndTime(""); // Reset end time when start time changes
                }}
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
                min={startTime} // Ensure end time is after start time
                required
              />
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
            <div>
              <Label htmlFor="category">Event Category</Label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-md">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button type="button" onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                Save Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEvent;
