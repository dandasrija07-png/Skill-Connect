import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { getItem, setItem, STORAGE_KEYS } from "../../utils/storage";

export const ProgressPage = () => {
  const { currentUser } = useAuth();
  const { sessions, requests } = useSkills();

  // Persistent user personal goals in LocalStorage
  const [goals, setGoals] = useState(() => {
    return (
      getItem(STORAGE_KEYS.USER_GOALS) || [
        { id: "g-1", text: "Complete 4 React & Tailwind interactive sessions", completed: true },
        { id: "g-2", text: "Master Figma design token variables export", completed: true },
        { id: "g-3", text: "Hold a 20-minute Spanish conversation without English", completed: false },
        { id: "g-4", text: "Bake a crisp sourdough loaf in a Dutch oven", completed: false },
        { id: "g-5", text: "Teach at least 2 other community members Python basics", completed: true }
      ]
    );
  });

  const [newGoalText, setNewGoalText] = useState("");

  const completedLearningSessions = sessions.filter(
    (s) => s.learnerId === currentUser?.id && s.status === "Completed"
  );
  const totalLearningHours = (completedLearningSessions.length * 1.5) + (currentUser?.hoursLearned || 45);

  const toggleGoal = (id) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g));
    setGoals(updated);
    setItem(STORAGE_KEYS.USER_GOALS, updated);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal = {
      id: `g-${Date.now()}`,
      text: newGoalText.trim(),
      completed: false
    };
    const updated = [newGoal, ...goals];
    setGoals(updated);
    setItem(STORAGE_KEYS.USER_GOALS, updated);
    setNewGoalText("");
  };

  const handleDeleteGoal = (id) => {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    setItem(STORAGE_KEYS.USER_GOALS, updated);
  };

  const completedGoalsCount = goals.filter((g) => g.completed).length;
  const goalPercent = goals.length ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Skill Mastery Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Learning Progress & Milestones
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track your hours, monitor completed subjects, and accomplish personal skill milestones.
        </p>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Learning Hours
          </span>
          <p className="text-3xl font-extrabold text-slate-900">{totalLearningHours}h</p>
          <span className="text-xs text-indigo-600 font-semibold">+6h logged this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Goals Achieved
          </span>
          <p className="text-3xl font-extrabold text-emerald-600">
            {completedGoalsCount} / {goals.length}
          </p>
          <span className="text-xs text-slate-500 font-medium">{goalPercent}% completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Verified Sessions
          </span>
          <p className="text-3xl font-extrabold text-purple-600">
            {completedLearningSessions.length + 8}
          </p>
          <span className="text-xs text-purple-600 font-medium">1-on-1 calls</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Community Badges
          </span>
          <p className="text-3xl font-extrabold text-amber-500">4</p>
          <span className="text-xs text-slate-500 font-medium">Earned credentials</span>
        </div>
      </div>

      {/* Goals Checklist & Milestone System */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Personal Learning Goals */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Personal Learning Goals</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set milestones for yourself and check them off as you advance
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {completedGoalsCount} of {goals.length} Done
            </span>
          </div>

          {/* Goal Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          {/* Add Goal Input */}
          <form onSubmit={handleAddGoal} className="flex gap-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="Add a new learning goal (e.g. Master React hooks, learn fingerpicking)..."
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl text-xs sm:text-sm px-4 py-2.5 outline-none transition-all"
            />
            <Button type="submit" variant="primary" icon={Plus}>
              Add
            </Button>
          </form>

          {/* Goals List */}
          <div className="space-y-2 pt-2">
            {goals.map((g) => (
              <div
                key={g.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  g.completed
                    ? "bg-emerald-50/50 border-emerald-200 text-slate-500"
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleGoal(g.id)}
                >
                  {g.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      g.completed ? "line-through text-slate-400" : ""
                    }`}
                  >
                    {g.text}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteGoal(g.id)}
                  className="text-slate-300 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Badges & Credentials */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Earned Community Badges</span>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { title: "Top Rated Teacher", desc: "Maintained 4.9+ mentor rating across 30+ hours", icon: "⭐" },
                { title: "Super Exchanger", desc: "Completed 5+ mutual skill swaps", icon: "🔄" },
                { title: "Community Mentor", desc: "Helped 10+ students learn a new skill", icon: "🎓" },
                { title: "Fast Responder", desc: "Replies to proposals within 2 hours", icon: "⚡" }
              ].map((badge, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{badge.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

