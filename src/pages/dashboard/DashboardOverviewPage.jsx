import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Repeat,
  Star,
  ArrowRight,
  TrendingUp,
  Plus,
  Video,
  CheckCircle2,
  Users,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { SkillCard } from "../../components/cards/SkillCard";
import { SessionCard } from "../../components/cards/SessionCard";
import { SkillFormModal } from "../../components/forms/SkillFormModal";
import { RequestLearnModal } from "../../components/forms/RequestLearnModal";
import { ScheduleSessionModal } from "../../components/forms/ScheduleSessionModal";
import { ReviewModal } from "../../components/forms/ReviewModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { initialUsers } from "../../data/mockData";

export const DashboardOverviewPage = () => {
  const { currentUser } = useAuth();
  const {
    skills,
    sessions,
    requests,
    exchanges,
    notifications,
    createSkill,
    sendLearningRequest,
    updateSessionStatus,
    rescheduleSession,
    submitReview
  } = useSkills();

  // Modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Session management modal
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [targetSession, setTargetSession] = useState(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTargetSession, setReviewTargetSession] = useState(null);

  // Computed user statistics
  const myTeachingSkills = skills.filter((s) => s.teacherId === currentUser?.id);
  const mySessions = sessions.filter(
    (s) => s.teacherId === currentUser?.id || s.learnerId === currentUser?.id
  );
  const upcomingSessions = mySessions.filter((s) => s.status === "Upcoming");
  const completedSessions = mySessions.filter((s) => s.status === "Completed");
  const pendingRequests = requests.filter(
    (r) => r.teacherId === currentUser?.id && r.status === "Pending"
  );
  const activeExchanges = exchanges.filter(
    (e) => (e.requesterId === currentUser?.id || e.targetUserId === currentUser?.id) && e.status === "Active"
  );

  // Profile completion percentage
  const profileCompletion = Math.min(
    100,
    30 +
      (currentUser?.bio ? 20 : 0) +
      (myTeachingSkills.length > 0 ? 25 : 10) +
      (currentUser?.skillsWanted?.length > 0 ? 25 : 10)
  );

  // Recommended skills (not taught by me)
  const recommendedSkills = skills
    .filter((s) => s.teacherId !== currentUser?.id)
    .slice(0, 3);

  // Recommended mentors
  const recommendedMentors = initialUsers
    .filter((u) => u.id !== currentUser?.id)
    .slice(0, 3);

  // Handlers
  const handleOpenLearn = (skill, teacher) => {
    setSelectedSkill(skill);
    setSelectedTeacher(teacher);
    setIsRequestModalOpen(true);
  };

  const handleCompleteSession = async (sess) => {
    await updateSessionStatus(sess.id, "Completed");
    setReviewTargetSession(sess);
    setReviewModalOpen(true);
  };

  const handleReschedule = (sess) => {
    setTargetSession(sess);
    setIsRescheduling(true);
    setSessionModalOpen(true);
  };

  const handleCancelSession = async (sess) => {
    await updateSessionStatus(sess.id, "Cancelled");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkillConnect Member Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.name || "Friend"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              "Share what you know, learn what you love." You have{" "}
              <strong>{upcomingSessions.length} upcoming sessions</strong> and{" "}
              <strong>{pendingRequests.length} pending requests</strong> awaiting your response.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              icon={Plus}
              size="md"
              className="bg-white text-indigo-900 hover:bg-slate-100 shadow-md font-bold"
              onClick={() => setIsSkillModalOpen(true)}
            >
              Publish Skill
            </Button>
            <Link to="/discover">
              <Button
                variant="outline"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Discover Skills
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Completion Strip */}
        <div className="mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white/90">Profile Completion:</span>
            <span className="font-bold text-teal-300">{profileCompletion}%</span>
          </div>
          <div className="w-full sm:w-64 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. STATS KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Skills Taught
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{myTeachingSkills.length}</p>
          <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">
            {myTeachingSkills.filter((s) => s.status === "Active").length} active listings
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Skills Learning
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {currentUser?.skillsWanted?.length || 3}
          </p>
          <span className="text-xs text-purple-600 font-medium mt-1 inline-block">
            {activeExchanges.length} active exchanges
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sessions Done
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{completedSessions.length}</p>
          <span className="text-xs text-emerald-600 font-medium mt-1 inline-block">
            {completedSessions.length * 1.5} learning hours
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mentor Rating
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">
            {currentUser?.rating ? currentUser.rating.toFixed(1) : "5.0"}
          </p>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            Based on {currentUser?.reviewCount || 38} reviews
          </span>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT: Sessions + Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upcoming Sessions</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your scheduled 1-on-1 video & in-person exchanges
                </p>
              </div>
              <Link to="/dashboard/sessions">
                <Button variant="outline" size="sm" icon={Calendar}>
                  View All ({mySessions.length})
                </Button>
              </Link>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500">No upcoming sessions right now.</p>
                <Link to="/dashboard/exchange" className="mt-3 inline-block">
                  <Button size="sm" variant="primary">
                    Find Exchange Match
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingSessions.slice(0, 2).map((sess) => (
                  <SessionCard
                    key={sess.id}
                    session={sess}
                    isTeacher={sess.teacherId === currentUser?.id}
                    onComplete={handleCompleteSession}
                    onCancel={handleCancelSession}
                    onReschedule={handleReschedule}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Learning Progress Bar Chart Visual */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Weekly Learning Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hours engaged in teaching vs learning this month
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                +18% vs last week
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-4">
              <div className="flex items-end justify-between h-44 gap-3 px-2 border-b border-slate-100">
                {[
                  { day: "Mon", teaching: 1.5, learning: 1.0 },
                  { day: "Tue", teaching: 2.5, learning: 1.5 },
                  { day: "Wed", teaching: 0.5, learning: 2.0 },
                  { day: "Thu", teaching: 3.0, learning: 0.5 },
                  { day: "Fri", teaching: 1.0, learning: 2.5 },
                  { day: "Sat", teaching: 4.0, learning: 3.0 },
                  { day: "Sun", teaching: 2.0, learning: 1.5 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full max-w-[28px] flex items-end justify-center gap-1 h-36">
                      {/* Teaching Bar */}
                      <div
                        className="w-1/2 bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-700"
                        style={{ height: `${(item.teaching / 4.5) * 100}%` }}
                        title={`Teaching: ${item.teaching}h`}
                      />
                      {/* Learning Bar */}
                      <div
                        className="w-1/2 bg-purple-400 rounded-t-md transition-all group-hover:bg-purple-500"
                        style={{ height: `${(item.learning / 4.5) * 100}%` }}
                        title={`Learning: ${item.learning}h`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-700">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-indigo-600" />
                  Hours Taught (14.5 hrs)
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-sm bg-purple-400" />
                  Hours Learned (11.5 hrs)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity & Notifications */}
        <div className="space-y-6">
          {/* Notifications feed */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Notifications</h3>
              <Link to="/dashboard/notifications" className="text-xs text-indigo-600 font-semibold hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 4).map((notif) => (
                <Link
                  key={notif.id}
                  to={notif.link || "/dashboard"}
                  className="block p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{notif.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Skill Exchange Matching Widget */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-5 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-2">
              <Repeat className="w-4 h-4" />
              <span>Skill Exchange Ready</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Our matching algorithm found <strong>3 community members</strong> who want your skills and teach what you wish to learn!
            </p>
            <Link to="/dashboard/exchange" className="w-full block">
              <Button size="sm" variant="primary" className="w-full" icon={ArrowRight} iconPosition="right">
                Explore Matches
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. RECOMMENDED SKILLS FOR YOU */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recommended Skills For You</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Based on your stated learning interests
            </p>
          </div>
          <Link to="/discover">
            <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
              Explore More
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedSkills.map((skill) => {
            const teacher = initialUsers.find((u) => u.id === skill.teacherId);
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                teacher={teacher}
                onRequestLearn={handleOpenLearn}
              />
            );
          })}
        </div>
      </div>

      {/* Add Skill Modal */}
      <SkillFormModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSubmit={createSkill}
      />

      {/* Request Learn Modal */}
      {selectedSkill && (
        <RequestLearnModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          skill={selectedSkill}
          teacher={selectedTeacher}
          onSubmit={sendLearningRequest}
        />
      )}

      {/* Session Scheduling & Rescheduling Modal */}
      <ScheduleSessionModal
        isOpen={sessionModalOpen}
        onClose={() => {
          setSessionModalOpen(false);
          setTargetSession(null);
        }}
        initialData={targetSession}
        isRescheduling={isRescheduling}
        onSubmit={async (data) => {
          if (isRescheduling && targetSession) {
            await rescheduleSession(targetSession.id, {
              date: data.date,
              time: data.time
            });
          }
        }}
      />

      {/* Review Modal for Completed Session */}
      {reviewTargetSession && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewTargetSession(null);
          }}
          session={reviewTargetSession}
          onSubmit={submitReview}
        />
      )}
    </div>
  );
};

