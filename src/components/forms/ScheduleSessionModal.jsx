import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { Calendar, Clock, Video } from "lucide-react";

export const ScheduleSessionModal = ({
  isOpen,
  onClose,
  initialData = null,
  isRescheduling = false,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: "",
    teacherName: "",
    learnerName: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:00 - 20:30 IST",
    format: "Online (Video Call)",
    meetingLink: "https://meet.google.com/xyz-skillconnect-room",
    notes: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "Learning Session",
        teacherName: initialData.teacherName || "",
        learnerName: initialData.learnerName || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        time: initialData.time || "19:00 - 20:30 IST",
        format: initialData.format || "Online (Video Call)",
        meetingLink: initialData.meetingLink || "https://meet.google.com/xyz-skillconnect-room",
        notes: initialData.notes || ""
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRescheduling ? "Reschedule Session" : "Schedule a Learning Session"}
      subtitle="Set up date, time, and meeting details"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isRescheduling && (
          <Input
            label="Session Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. React Component Architecture Review"
            required
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            icon={Calendar}
            required
          />

          <Select
            label="Time Slot"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            icon={Clock}
            options={[
              "10:00 - 11:30 AM",
              "02:00 - 03:30 PM",
              "05:00 - 06:30 PM",
              "07:00 - 08:30 PM",
              "08:30 - 10:00 PM"
            ]}
          />
        </div>

        {!isRescheduling && (
          <>
            <Select
              label="Format"
              value={formData.format}
              onChange={(e) => setFormData({ ...formData, format: e.target.value })}
              options={[
                "Online (Video Call)",
                "In-Person",
                "Hybrid"
              ]}
            />

            <Input
              label="Meeting Link (Placeholder)"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              icon={Video}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Session Agenda / Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Key topics to discuss or prepare beforehand..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isRescheduling ? "Update Schedule" : "Confirm Schedule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

