// components/DeleteEvent.tsx
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

interface DeleteEventProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteEvent: React.FC<DeleteEventProps> = ({ isOpen, onClose, onConfirmDelete }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[400px] bg-white shadow-lg rounded-lg p-6 border border-gray-200"
        style={{
          backgroundColor: "white", // Solid background color
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)", // Subtle shadow
          borderRadius: "0.5rem", // Rounded corners
        }}
      >
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this event? This action cannot be undone.
        </p>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirmDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEvent;
