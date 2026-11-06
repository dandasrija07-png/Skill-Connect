import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Compass,
  Calendar,
  CheckCircle,
  XCircle,
  Heart,
  Star,
  ExternalLink,
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { ReviewModal } from "../../components/forms/ReviewModal";
import { SkillCard } from "../../components/cards/SkillCard";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { initialUsers } from "../../data/mockData";

export const LearnerPortalPage = () => {
  const { currentUser } = useAuth();
  const {
    skills,
    wishlist,
    requests,
    sessions,
    handleRequestStatus,
    updateSessionStatus,
    submitReview
  } = useSkills();

  const [activeTab, setActiveTab] = useState("learning"); // "learning" | "requests" | "completed" | "wishlist"
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetSessionForReview, setTargetSessionForReview] = useState(null);

  // Filter user's learning data
  const mySentRequests = requests.filter((r) => r.learnerId === currentUser?.id);
  const pendingRequests = mySentRequests.filter((r) => r.status === "Pending");
  const acceptedRequests = mySentRequests.filter((r) => r.status === "Accepted");

  const myLearningSessions = sessions.filter(
    (s) => s.learnerId === currentUser?.id
  );
  const activeSessions = myLearningSessions.filter((s) => s.status === "Upcoming");
  const completedLearningSessions = myLearningSessions.filter(
    (s) => s.status === "Completed"
  );

  const wishlistSkills = skills.filter((s) => wishlist.includes(s.id));

  const handleCancelRequest = async (reqId) => {
    await handleRequestStatus(reqId, "Cancelled");
  };

  const handleOpenReview = (sess) => {
    setTargetSessionForReview(sess);
    setReviewModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Learning Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your ongoing courses, upcoming sessions, proposals, and saved wishlist items.
          </p>
        </div>

        <Link to="/discover">
          <Button variant="primary" icon={Compass} size="md">
            Find New Skills
          </Button>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Currently Learning
          </span>
          <p className="text-3xl font-extrabold text-slate-900">
            {acceptedRequests.length || 2}
          </p>
          <span className="text-xs text-purple-600 font-medium">Active subjects</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Upcoming Sessions
          </span>
          <p className="text-3xl font-extrabold text-indigo-600">
            {activeSessions.length}
          </p>
          <span className="text-xs text-slate-500 font-medium">On your calendar</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Completed Sessions
          </span>
          <p className="text-3xl font-extrabold text-emerald-600">
            {completedLearningSessions.length}
          </p>
          <span className="text-xs text-emerald-600 font-medium">Verified completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Saved to Wishlist
          </span>
          <p className="text-3xl font-extrabold text-rose-500">{wishlist.length}</p>
          <span className="text-xs text-slate-500 font-medium">Future goals</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("learning")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "learning"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Learning ({acceptedRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "requests"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>My Requests</span>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-semibold">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "completed"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Completed ({completedLearningSessions.length})
        </button>
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "wishlist"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Wishlist ({wishlistSkills.length})</span>
        </button>
      </div>

      {/* Tab 1: Active Learning */}
      {activeTab === "learning" && (
        <div className="space-y-4">
          {acceptedRequests.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No active learning courses yet"
              description="Discover skills in our community marketplace and connect with teachers to get started."
              actionLabel="Explore Skills"
              onAction={() => (window.location.href = "/discover")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {acceptedRequests.map((req) => {
                const targetSkill = skills.find((s) => s.id === req.skillId);
                const teacher = initialUsers.find((u) => u.id === req.teacherId);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="emerald" size="sm" dot>
                          Enrolled / Active
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          Joined on {req.date}
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-slate-900">
                        {req.skillTitle}
                      </h4>

                      {teacher && (
                        <div className="flex items-center gap-3 mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{teacher.name}</p>
                            <p className="text-[11px] text-slate-400">{teacher.headline}</p>
                          </div>
                        </div>
                      )}

                      {/* Progress bar visual */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-slate-600">Learning Progress</span>
                          <span className="text-indigo-600 font-bold">60%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full w-3/5" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link to="/dashboard/sessions">
                        <Button variant="outline" size="sm" icon={Calendar}>
                          View Sessions
                        </Button>
                      </Link>
                      <Link to={`/dashboard/messages?chat=${req.teacherId}`}>
                        <Button variant="primary" size="sm">
                          Chat with Mentor
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Sent Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {mySentRequests.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="You haven't requested any skills yet"
              description="Explore the skill marketplace and send proposals to teachers you'd love to learn from."
            />
          ) : (
            <div className="space-y-3">
              {mySentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
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
                        onClick={() => handleCancelRequest(req.id)}
                      >
                        Cancel Proposal
                      </Button>
                    )}
                    {req.status === "Accepted" && (
                      <Link to="/dashboard/sessions">
                        <Button variant="primary" size="sm">
                          Go to Sessions
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Completed Learning */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedLearningSessions.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No completed learning sessions yet"
              description="As you attend and complete scheduled sessions with your mentors, they will be archived here."
            />
          ) : (
            <div className="space-y-3">
              {completedLearningSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <Badge variant="emerald" size="sm" dot>
                      Completed on {sess.date}
                    </Badge>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{sess.title}</h4>
                    <p className="text-xs text-slate-500">
                      Instructor: {sess.teacherName} • Time: {sess.time}
                    </p>
                  </div>

                  <Button
                    variant="soft"
                    size="sm"
                    icon={Star}
                    onClick={() => handleOpenReview(sess)}
                  >
                    Leave Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Wishlist */}
      {activeTab === "wishlist" && (
        <div className="space-y-4">
          {wishlistSkills.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Click the heart icon on any skill card to bookmark skills you want to learn later."
              actionLabel="Discover Skills"
              onAction={() => (window.location.href = "/discover")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistSkills.map((skill) => {
                const teacher = initialUsers.find((u) => u.id === skill.teacherId);
                return (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    teacher={teacher}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {targetSessionForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setTargetSessionForReview(null);
          }}
          session={targetSessionForReview}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
};

