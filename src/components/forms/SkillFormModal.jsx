import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { skillCategories } from "../../data/mockData";
import { Sparkles, Image as ImageIcon } from "lucide-react";

export const SkillFormModal = ({
  isOpen,
  onClose,
  initialSkill = null,
  onSubmit
}) => {
  const isEditing = !!initialSkill;

  const defaultImages = [
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=450&fit=crop"
  ];

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    level: "Intermediate",
    format: "Online (Video Call)",
    duration: "4 weeks (8 sessions)",
    coverImage: defaultImages[0],
    shortDesc: "",
    description: "",
    topics: "",
    outcomes: "",
    prerequisites: "Basic interest and openness to learn.",
    schedule: "Weekends & Evenings",
    exchangeArrangement: "Open to skill exchange with UI/UX, Languages, or Music"
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialSkill) {
      setFormData({
        title: initialSkill.title || "",
        category: initialSkill.category || "Web Development",
        level: initialSkill.level || "Intermediate",
        format: initialSkill.format || "Online (Video Call)",
        duration: initialSkill.duration || "4 weeks (8 sessions)",
        coverImage: initialSkill.coverImage || defaultImages[0],
        shortDesc: initialSkill.shortDesc || "",
        description: initialSkill.description || "",
        topics: Array.isArray(initialSkill.topics) ? initialSkill.topics.join("\n") : initialSkill.topics || "",
        outcomes: Array.isArray(initialSkill.outcomes) ? initialSkill.outcomes.join("\n") : initialSkill.outcomes || "",
        prerequisites: initialSkill.prerequisites || "",
        schedule: initialSkill.schedule || "",
        exchangeArrangement: initialSkill.exchangeArrangement || ""
      });
    } else {
      setFormData({
        title: "",
        category: "Web Development",
        level: "Intermediate",
        format: "Online (Video Call)",
        duration: "4 weeks (8 sessions)",
        coverImage: defaultImages[0],
        shortDesc: "",
        description: "",
        topics: "1. Core foundations & fundamentals\n2. Real-world practical applications\n3. Hands-on exercises and project work",
        outcomes: "Build confidence in this skill\nApply concepts directly in projects",
        prerequisites: "None required.",
        schedule: "Weekends & Evenings",
        exchangeArrangement: "Open to exchanging for other valuable skills"
      });
    }
  }, [initialSkill, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Skill title is required";
    if (!formData.description.trim()) newErrors.description = "Full description is required";
    if (!formData.shortDesc.trim()) newErrors.shortDesc = "Short description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
      title={isEditing ? "Edit Skill Listing" : "Add a New Skill to Teach"}
      subtitle="Share your expertise with fellow community members"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Skill Title *"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setErrors({ ...errors, title: null });
          }}
          placeholder="e.g. Modern React 19 & Next.js Architecture"
          error={errors.title}
        />

        {/* Category & Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category *"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={skillCategories.filter((c) => c !== "All Categories")}
          />

          <Select
            label="Skill Level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
          />
        </div>

        {/* Format, Duration & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Learning Format"
            value={formData.format}
            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
            options={[
              "Online (Video Call)",
              "In-Person",
              "Hybrid"
            ]}
          />

          <Input
            label="Expected Duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g. 4 weeks (8 sessions)"
          />

          <Input
            label="Availability / Schedule"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="e.g. Tue & Thu evenings"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Short Tagline / Summary *
          </label>
          <input
            type="text"
            value={formData.shortDesc}
            onChange={(e) => {
              setFormData({ ...formData, shortDesc: e.target.value });
              setErrors({ ...errors, shortDesc: null });
            }}
            placeholder="One punchy sentence that captures this listing..."
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
          />
          {errors.shortDesc && (
            <p className="text-xs text-rose-600 mt-1">{errors.shortDesc}</p>
          )}
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Description *
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: null });
            }}
            placeholder="Detailed description of what learners will study, your teaching philosophy, and real-world outcomes..."
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
          />
          {errors.description && (
            <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Topics & Learning Outcomes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Topics Covered (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Learning Outcomes (one per line)
            </label>
            <textarea
              rows={3}
              value={formData.outcomes}
              onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
              placeholder="Outcome 1&#10;Outcome 2&#10;Outcome 3"
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Prerequisites & Exchange Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Required Prerequisites"
            value={formData.prerequisites}
            onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
            placeholder="e.g. Basic HTML/CSS or None"
          />

          <Input
            label="Preferred Exchange Arrangement"
            value={formData.exchangeArrangement}
            onChange={(e) => setFormData({ ...formData, exchangeArrangement: e.target.value })}
            placeholder="What skills would you love to learn in return?"
          />
        </div>

        {/* Cover Image URL Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Cover Image URL
          </label>
          <div className="flex items-center gap-2 mb-2">
            <Input
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="Paste any image URL..."
              icon={ImageIcon}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-400 flex-shrink-0">Sample Presets:</span>
            {defaultImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: img })}
                className={`relative w-12 h-8 rounded-lg overflow-hidden border-2 flex-shrink-0 cursor-pointer ${
                  formData.coverImage === img ? "border-indigo-600 ring-2 ring-indigo-500/20" : "border-transparent"
                }`}
              >
                <img src={img} alt="preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? "Save Changes" : "Publish Skill"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

