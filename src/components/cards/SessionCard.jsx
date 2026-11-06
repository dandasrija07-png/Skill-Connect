import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Video, CheckCircle, XCircle, RotateCcw, ExternalLink } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const SessionCard = ({
  session,
  isTeacher,
  onComplete,
  onCancel,
  onReschedule,
  onReview
}) => {
  const statusVariants = {
    Upcoming: "indigo",
    Completed: "emerald",
    Cancelled: "rose"
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Status & Date */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariants[session.status] || "slate"} size="sm" dot>
            {session.status}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{session.date}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-slate-900 text-base mb-1">
          {session.title}
        </h4>

        {/* Time and Format */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{session.time}</span>
          </div>
          <div className="flex items-center gap-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-medium">
            <Video className="w-3.5 h-3.5" />
            <span>{session.format}</span>
          </div>
        </div>

        {/* Roles details */}
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-3 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Teacher</span>
            <span className="font-semibold text-slate-800">{session.teacherName}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Learner</span>
            <span className="font-semibold text-slate-800">{session.learnerName}</span>
          </div>
        </div>

        {/* Notes */}
        {session.notes && (
          <p className="text-xs text-slate-500 italic mb-3 line-clamp-2">
            "{session.notes}"
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {session.status === "Upcoming" && (
          <>
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Join Meeting Room</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </a>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 text-[11px] px-2 py-1.5"
                onClick={() => onComplete && onComplete(session)}
              >
                <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                Done
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-[11px] px-2 py-1.5"
                onClick={() => onReschedule && onReschedule(session)}
              >
                <RotateCcw className="w-3 h-3 mr-1 text-slate-500" />
                Reschedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 hover:bg-rose-50 text-[11px] px-2 py-1.5"
                onClick={() => onCancel && onCancel(session)}
              >
                <XCircle className="w-3 h-3 mr-1 text-rose-500" />
                Cancel
              </Button>
            </div>
          </>
        )}

        {session.status === "Completed" && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Session Completed
            </span>
            {onReview && (
              <Button
                variant="soft"
                size="sm"
                className="text-xs"
                onClick={() => onReview(session)}
              >
                Leave Review
              </Button>
            )}
          </div>
        )}

        {session.status === "Cancelled" && (
          <div className="text-xs text-rose-500 font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Session was cancelled
          </div>
        )}
      </div>
    </div>
  );
};

