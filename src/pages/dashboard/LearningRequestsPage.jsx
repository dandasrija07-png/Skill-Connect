import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, CheckCircle2, XCircle, Clock, BookOpen, User, Calendar } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { ScheduleSessionModal } from "../../components/forms/ScheduleSessionModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";

export const LearningRequestsPage = () => {
  const { currentUser } = useAuth();
  const { requests, handleRequestStatus, scheduleSession } = useSkills();

  const [activeTab, setActiveTab] = useState("incoming"); // "incoming" | "sent"
  const [scheduleTargetReq, setScheduleTargetReq] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const incomingRequests = requests.filter((r) => r.teacherId === currentUser?.id);
  const sentRequests = requests.filter((r) => r.learnerId === currentUser?.id);

  const handleAccept = async (req) => {
    await handleRequestStatus(req.id, "Accepted");
    setScheduleTargetReq(req);
    setScheduleModalOpen(true);
  };

  const handleReject = async (reqId) => {
    await handleRequestStatus(reqId, "Rejected");
  };

  const handleCancel = async (reqId) => {
    await handleRequestStatus(reqId, "Cancelled");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
          <Inbox className="w-3.5 h-3.5" />
          <span>Proposals & Requests</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Learning Requests Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming applications from curious learners and monitor the proposals you've sent.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "incoming"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Incoming Student Requests</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
            {incomingRequests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "sent"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Sent by You</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">
            {sentRequests.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "incoming" && (
          incomingRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No incoming requests yet"
              description="When community members apply to learn your skills, their proposals will appear here."
            />
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={req.learnerAvatar}
                      alt={req.learnerName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {req.learnerName}
                      </h4>
                      <p className="text-xs text-indigo-600 font-semibold">
                        Applied for: {req.skillTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        req.status === "Accepted"
                          ? "emerald"
                          : req.status === "Rejected"
                          ? "rose"
                          : "amber"
                      }
                      size="sm"
                      dot
                    >
                      {req.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{req.date}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100">
                  <p className="text-slate-700">
                    <strong>Message:</strong> "{req.message}"
                  </p>
                  {req.goals && (
                    <p className="text-slate-700">
                      <strong>Goals:</strong> {req.goals}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 pt-1 text-slate-500">
                    <span>Preferred Schedule: <strong>{req.preferredSchedule}</strong></span>
                    <span>Format: <strong>{req.format}</strong></span>
                  </div>
                </div>

                {req.status === "Pending" && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleReject(req.id)}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(req)}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Accept & Schedule
                    </Button>
                  </div>
                )}
              </div>
            ))
          )
        )}

        {activeTab === "sent" && (
          sentRequests.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="You haven't requested any skills"
              description="Explore the skill marketplace to connect with teachers."
              actionLabel="Discover Skills"
              onAction={() => (window.location.href = "/discover")}
            />
          ) : (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        req.status === "Accepted"
                          ? "emerald"
                          : req.status === "Rejected"
                          ? "rose"
                          : req.status === "Cancelled"
                          ? "slate"
                          : "amber"
                      }
                      size="sm"
                      dot
                    >
                      {req.status}
                    </Badge>
                    <span className="text-xs text-slate-400">{req.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{req.skillTitle}</h4>
                  <p className="text-xs text-slate-500 italic">"{req.message}"</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {req.status === "Pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      onClick={() => handleCancel(req.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                  {req.status === "Accepted" && (
                    <Link to="/dashboard/sessions">
                      <Button variant="primary" size="sm" icon={Calendar}>
                        View Sessions
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Schedule Modal */}
      {scheduleTargetReq && (
        <ScheduleSessionModal
          isOpen={scheduleModalOpen}
          onClose={() => {
            setScheduleModalOpen(false);
            setScheduleTargetReq(null);
          }}
          initialData={{
            title: `${scheduleTargetReq.skillTitle} - Kickoff Session`,
            teacherName: currentUser?.name,
            learnerName: scheduleTargetReq.learnerName,
            date: new Date().toISOString().split("T")[0],
            time: "19:00 - 20:30 IST",
            format: scheduleTargetReq.format
          }}
          onSubmit={async (sessionData) => {
            await scheduleSession({
              ...sessionData,
              teacherId: currentUser.id,
              learnerId: scheduleTargetReq.learnerId,
              skillId: scheduleTargetReq.skillId
            });
          }}
        />
      )}
    </div>
  );
};

