import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { SkillFormModal } from "../../components/forms/SkillFormModal";
import { ScheduleSessionModal } from "../../components/forms/ScheduleSessionModal";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";

export const TeacherPortalPage = () => {
  const { currentUser } = useAuth();
  const {
    skills,
    requests,
    sessions,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleSkillStatus,
    handleRequestStatus,
    scheduleSession
  } = useSkills();

  const [activeTab, setActiveTab] = useState("skills"); // "skills" | "requests"
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Scheduling modal state for accepting a request
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [acceptedRequestData, setAcceptedRequestData] = useState(null);

  const mySkills = skills.filter((s) => s.teacherId === currentUser?.id);
  const myIncomingRequests = requests.filter((r) => r.teacherId === currentUser?.id);
  const pendingRequests = myIncomingRequests.filter((r) => r.status === "Pending");
  const myTeachingSessions = sessions.filter(
    (s) => s.teacherId === currentUser?.id && s.status === "Completed"
  );

  const totalLearners = mySkills.reduce((sum, s) => sum + (s.activeLearners || 0), 0);

  const handleOpenEdit = (skill) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (formData) => {
    if (editingSkill) {
      await updateSkill(editingSkill.id, formData);
    } else {
      await createSkill(formData);
    }
  };

  const handleAcceptRequest = async (req) => {
    await handleRequestStatus(req.id, "Accepted");
    setAcceptedRequestData(req);
    setIsScheduleModalOpen(true);
  };

  const handleRejectRequest = async (reqId) => {
    await handleRequestStatus(reqId, "Rejected");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Management Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Teaching Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish courses, manage learner proposals, and track active student sessions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          size="md"
          onClick={() => {
            setEditingSkill(null);
            setIsSkillModalOpen(true);
          }}
        >
          Add New Skill
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Published Skills
          </span>
          <p className="text-3xl font-extrabold text-slate-900">{mySkills.length}</p>
          <span className="text-xs text-indigo-600 font-medium">
            {mySkills.filter((s) => s.status === "Active").length} currently active
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Learners
          </span>
          <p className="text-3xl font-extrabold text-slate-900">{totalLearners || 12}</p>
          <span className="text-xs text-emerald-600 font-medium">Across your courses</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pending Proposals
          </span>
          <p className="text-3xl font-extrabold text-amber-600">{pendingRequests.length}</p>
          <span className="text-xs text-slate-500 font-medium">Needs your response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Completed Sessions
          </span>
          <p className="text-3xl font-extrabold text-slate-900">{myTeachingSessions.length}</p>
          <span className="text-xs text-purple-600 font-medium">100% completion rate</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "skills"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          My Skill Listings ({mySkills.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-semibold">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Skills Listings */}
      {activeTab === "skills" && (
        <div className="space-y-4">
          {mySkills.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="You haven't published any skills yet"
              description="Share what you know with the SkillConnect community. Publishing your first listing takes less than 2 minutes!"
              actionLabel="Add Your First Skill"
              onAction={() => {
                setEditingSkill(null);
                setIsSkillModalOpen(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Cover */}
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                      <img
                        src={skill.coverImage}
                        alt={skill.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge
                          variant={skill.status === "Active" ? "emerald" : "amber"}
                          size="sm"
                          dot
                        >
                          {skill.status}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-md bg-white/90 text-slate-800 text-[11px] font-bold">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2">
                      <h4 className="font-bold text-slate-900 text-base line-clamp-1">
                        <Link to={`/skills/${skill.id}`} className="hover:text-indigo-600">
                          {skill.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {skill.shortDesc || skill.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {skill.activeLearners || 0} active learners
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                          {skill.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleSkillStatus(skill.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                        skill.status === "Active"
                          ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                          : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      title={skill.status === "Active" ? "Pause Listing" : "Activate Listing"}
                    >
                      {skill.status === "Active" ? (
                        <>
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit2}
                        onClick={() => handleOpenEdit(skill)}
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => setDeleteTargetId(skill.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Learner Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {myIncomingRequests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No incoming requests yet"
              description="When learners discover your skills and want to learn, their proposals will appear here."
            />
          ) : (
            <div className="space-y-3">
              {myIncomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.learnerAvatar}
                        alt={req.learnerName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {req.learnerName}
                        </h4>
                        <p className="text-xs text-indigo-600 font-semibold">
                          Wants to learn: {req.skillTitle}
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

                  {/* Proposal notes */}
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 border border-slate-100">
                    <p className="text-slate-700">
                      <strong>Introduction:</strong> "{req.message}"
                    </p>
                    {req.goals && (
                      <p className="text-slate-700">
                        <strong>Learning Goals:</strong> {req.goals}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-1 text-slate-500">
                      <span>Schedule: <strong>{req.preferredSchedule}</strong></span>
                      <span>Format: <strong>{req.format}</strong></span>
                    </div>
                  </div>

                  {/* Actions for Pending */}
                  {req.status === "Pending" && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => handleRejectRequest(req.id)}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAcceptRequest(req)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Accept & Schedule
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <SkillFormModal
        isOpen={isSkillModalOpen}
        onClose={() => {
          setIsSkillModalOpen(false);
          setEditingSkill(null);
        }}
        initialSkill={editingSkill}
        onSubmit={handleSaveSkill}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Skill Listing"
        message="Are you sure you want to delete this listing? All active requests and reviews for this skill will be impacted."
        confirmText="Delete Skill"
        onConfirm={async () => {
          if (deleteTargetId) {
            await deleteSkill(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
      />

      {/* Schedule Session Modal on Accept */}
      {acceptedRequestData && (
        <ScheduleSessionModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setAcceptedRequestData(null);
          }}
          initialData={{
            title: `${acceptedRequestData.skillTitle} - Session 1`,
            teacherName: currentUser?.name,
            learnerName: acceptedRequestData.learnerName,
            date: new Date().toISOString().split("T")[0],
            time: "19:00 - 20:30 IST",
            format: acceptedRequestData.format
          }}
          onSubmit={async (sessionData) => {
            await scheduleSession({
              ...sessionData,
              teacherId: currentUser.id,
              learnerId: acceptedRequestData.learnerId,
              skillId: acceptedRequestData.skillId
            });
          }}
        />
      )}
    </div>
  );
};

