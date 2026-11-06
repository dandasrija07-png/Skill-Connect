import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Star } from "lucide-react";

export const ReviewModal = ({
  isOpen,
  onClose,
  session,
  onSubmit
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!session) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a few words about your learning experience.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        sessionId: session.id,
        skillId: session.skillId || "skill-1",
        skillTitle: session.title,
        teacherId: session.teacherId,
        rating,
        comment: comment.trim()
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Learning Session"
      subtitle={`Share feedback for ${session.teacherName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Session details */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <p className="font-semibold text-slate-800">{session.title}</p>
          <p className="text-slate-500 mt-0.5">
            Teacher: {session.teacherName} • Completed on {session.date}
          </p>
        </div>

        {/* Interactive Star Rating */}
        <div className="text-center py-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-amber-600 font-semibold mt-1 block">
            {rating === 5 && "Outstanding (5/5)"}
            {rating === 4 && "Very Good (4/5)"}
            {rating === 3 && "Good (3/5)"}
            {rating === 2 && "Fair (2/5)"}
            {rating === 1 && "Needs Improvement (1/5)"}
          </span>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Your Feedback
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError(null);
            }}
            placeholder="What went well? How was the teaching style, pacing, and practical exercises?"
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
          />
          {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};

