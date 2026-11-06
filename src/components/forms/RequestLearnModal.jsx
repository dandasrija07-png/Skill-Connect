import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { Send, BookOpen } from "lucide-react";

export const RequestLearnModal = ({
  isOpen,
  onClose,
  skill,
  teacher,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    message: "",
    goals: "",
    preferredSchedule: "Weekday Evenings",
    format: "Online (Video Call)"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!skill) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = "Please introduce yourself to the teacher.";
    }
    if (!formData.goals.trim()) {
      newErrors.goals = "Please state your learning goals.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        skillId: skill.id,
        skillTitle: skill.title,
        teacherId: skill.teacherId,
        ...formData
      });
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
      title="Request to Learn"
      subtitle={`Send a learning proposal to ${teacher?.name || "the teacher"}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selected Skill Banner */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/70 border border-indigo-100">
          <img
            src={skill.coverImage}
            alt={skill.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-indigo-950 truncate">
              {skill.title}
            </h4>
            <p className="text-xs text-indigo-600">
              Instructor: {teacher?.name || "Teacher"} • {skill.level}
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Personal Introduction
          </label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
              setErrors({ ...errors, message: null });
            }}
            placeholder="Introduce yourself, your background, and why you want to learn this skill..."
            className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 ${
              errors.message
                ? "border-rose-300 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/20"
            }`}
          />
          {errors.message && (
            <p className="text-xs text-rose-600 mt-1">{errors.message}</p>
          )}
        </div>

        {/* Learning Goals */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Your Learning Goals & Outcome Expectations
          </label>
          <textarea
            rows={2}
            value={formData.goals}
            onChange={(e) => {
              setFormData({ ...formData, goals: e.target.value });
              setErrors({ ...errors, goals: null });
            }}
            placeholder="e.g. Build my first portfolio project, pass an interview, or develop a daily practice routine..."
            className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 ${
              errors.goals
                ? "border-rose-300 focus:ring-rose-500/20"
                : "border-slate-300 focus:border-indigo-600 focus:ring-indigo-500/20"
            }`}
          />
          {errors.goals && (
            <p className="text-xs text-rose-600 mt-1">{errors.goals}</p>
          )}
        </div>

        {/* Schedule & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Preferred Schedule"
            value={formData.preferredSchedule}
            onChange={(e) =>
              setFormData({ ...formData, preferredSchedule: e.target.value })
            }
            options={[
              "Weekday Evenings (6 PM - 9 PM)",
              "Weekend Mornings (9 AM - 12 PM)",
              "Weekend Afternoons (2 PM - 5 PM)",
              "Flexible / To Be Discussed"
            ]}
          />

          <Select
            label="Learning Format"
            value={formData.format}
            onChange={(e) =>
              setFormData({ ...formData, format: e.target.value })
            }
            options={[
              "Online (Video Call)",
              "In-Person (Local meetup)",
              "Hybrid (Online + In-Person)"
            ]}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Send}
            loading={loading}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

