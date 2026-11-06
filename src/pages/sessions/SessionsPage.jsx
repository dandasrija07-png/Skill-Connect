import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Plus,
  CheckCircle,
  XCircle,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  List,
  CalendarDays
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { SessionCard } from "../../components/cards/SessionCard";
import { ScheduleSessionModal } from "../../components/forms/ScheduleSessionModal";
import { ReviewModal } from "../../components/forms/ReviewModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";

export const SessionsPage = () => {
  const { currentUser } = useAuth();
  const {
    sessions,
    scheduleSession,
    updateSessionStatus,
    rescheduleSession,
    submitReview
  } = useSkills();

  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"
  const [filterStatus, setFilterStatus] = useState("All"); // "All" | "Upcoming" | "Completed" | "Cancelled"

  // Modal states
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewSessionTarget, setReviewSessionTarget] = useState(null);

  // Filter user sessions
  const mySessions = sessions.filter(
    (s) => s.teacherId === currentUser?.id || s.learnerId === currentUser?.id
  );

  const filteredSessions = mySessions.filter((s) => {
    if (filterStatus === "All") return true;
    return s.status === filterStatus;
  });

  const handleComplete = async (sess) => {
    await updateSessionStatus(sess.id, "Completed");
    setReviewSessionTarget(sess);
    setReviewModalOpen(true);
  };

  const handleCancel = async (sess) => {
    await updateSessionStatus(sess.id, "Cancelled");
  };

  const handleReschedule = (sess) => {
    setTargetSession(sess);
    setIsRescheduling(true);
    setScheduleModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sessions & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your live 1-on-1 video call rooms, schedule new slots, and review completed sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === "calendar"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Calendar View"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            size="md"
            onClick={() => {
              setTargetSession(null);
              setIsRescheduling(false);
              setScheduleModalOpen(true);
            }}
          >
            New Session
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {["All", "Upcoming", "Completed", "Cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              filterStatus === st
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {st} ({st === "All" ? mySessions.length : mySessions.filter((s) => s.status === st).length})
          </button>
        ))}
      </div>

      {/* View Mode: List */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title={`No ${filterStatus.toLowerCase()} sessions found`}
              description="Coordinate with your teachers or learners to schedule upcoming interactive sessions."
              actionLabel="Schedule a Session"
              onAction={() => {
                setTargetSession(null);
                setIsRescheduling(false);
                setScheduleModalOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isTeacher={session.teacherId === currentUser?.id}
                  onComplete={handleComplete}
                  onCancel={handleCancel}
                  onReschedule={handleReschedule}
                  onReview={(sess) => {
                    setReviewSessionTarget(sess);
                    setReviewModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* View Mode: Calendar */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              November 2026
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-semibold">
                Interactive Schedule Grid
              </span>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-600"
              >
                {day}
              </div>
            ))}

            {/* Days 1 through 30 */}
            {[...Array(35)].map((_, i) => {
              const dayNum = i - 1; // Align Sunday start
              if (dayNum < 1 || dayNum > 30) {
                return (
                  <div key={i} className="bg-slate-50/50 min-h-[90px] p-2 text-slate-300 text-xs" />
                );
              }

              const dateString = `2026-11-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
              const daySessions = mySessions.filter((s) => s.date === dateString);

              return (
                <div
                  key={i}
                  className={`bg-white min-h-[90px] p-2 flex flex-col justify-between hover:bg-indigo-50/30 transition-colors ${
                    dayNum === 10 ? "ring-2 ring-indigo-500/30 bg-indigo-50/20" : ""
                  }`}
                >
                  <span className={`text-xs font-bold ${dayNum === 10 ? "text-indigo-600 font-black" : "text-slate-700"}`}>
                    {dayNum}
                  </span>

                  <div className="space-y-1 mt-1">
                    {daySessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleReschedule(s)}
                        className={`p-1 rounded text-[10px] font-semibold truncate cursor-pointer transition-transform hover:scale-102 ${
                          s.status === "Upcoming"
                            ? "bg-indigo-600 text-white"
                            : s.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                        title={`${s.title} (${s.time})`}
                      >
                        {s.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 text-center">
            Click on any session in the calendar to reschedule or edit its time slot.
          </p>
        </div>
      )}

      {/* Schedule / Reschedule Modal */}
      <ScheduleSessionModal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setTargetSession(null);
        }}
        initialData={targetSession}
        isRescheduling={isRescheduling}
        onSubmit={async (formData) => {
          if (isRescheduling && targetSession) {
            await rescheduleSession(targetSession.id, {
              date: formData.date,
              time: formData.time
            });
          } else {
            await scheduleSession({
              ...formData,
              teacherId: currentUser.id,
              teacherName: currentUser.name,
              learnerId: "user-2",
              learnerName: "Alex Chen"
            });
          }
        }}
      />

      {/* Review Modal */}
      {reviewSessionTarget && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewSessionTarget(null);
          }}
          session={reviewSessionTarget}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
};

