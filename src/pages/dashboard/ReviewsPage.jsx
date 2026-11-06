import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle,
  CornerDownRight,
  Filter
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";

export const ReviewsPage = () => {
  const { currentUser } = useAuth();
  const { reviews, addTeacherResponse } = useSkills();

  const [filterRating, setFilterRating] = useState(0); // 0 = all
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // Reviews for skills taught by current user
  const myReviews = reviews.filter((r) => r.teacherId === currentUser?.id);

  const filteredReviews = myReviews.filter((r) => {
    if (filterRating === 0) return true;
    return r.rating === filterRating;
  });

  const averageRating = myReviews.length
    ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
    : "5.0";

  const handlePostReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      setSubmittingReply(true);
      await addTeacherResponse(reviewId, replyText.trim());
      setActiveReplyId(null);
      setReplyText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
          <span>Verified Peer Ratings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reviews & Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Inspect learner testimonials for your courses and post personalized teacher responses.
        </p>
      </div>

      {/* Rating Overview Summary Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/60 flex flex-col items-center justify-center shadow-xs">
            <span className="text-3xl font-black">{averageRating}</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Community Satisfaction Score
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Across {myReviews.length} learning session evaluations
            </p>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-slate-400 mr-1">Filter:</span>
          {[0, 5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                filterRating === star
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {star === 0 ? "All Ratings" : `${star} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews match your filter"
            description="When learners complete sessions with you, their ratings and testimonials will be listed here."
          />
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.reviewerAvatar}
                    alt={rev.reviewerName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {rev.reviewerName}
                    </h4>
                    <p className="text-xs text-indigo-600 font-medium">
                      Skill: {rev.skillTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                </div>
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                "{rev.comment}"
              </p>

              {/* Teacher Response Display */}
              {rev.teacherResponse ? (
                <div className="ml-4 sm:ml-8 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-indigo-600" />
                    Your Response
                  </span>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {rev.teacherResponse}
                  </p>
                </div>
              ) : (
                /* Write Response form */
                <div className="pt-2">
                  {activeReplyId === rev.id ? (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-700">
                        Write a response to {rev.reviewerName}:
                      </label>
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Thank the learner or share extra encouragement..."
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveReplyId(null);
                            setReplyText("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          loading={submittingReply}
                          onClick={() => handlePostReply(rev.id)}
                        >
                          Post Response
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyId(rev.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Reply to this review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

