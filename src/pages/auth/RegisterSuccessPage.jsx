import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle2, ArrowRight, GraduationCap, Compass, BookOpen } from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export const RegisterSuccessPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-4 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to SkillConnect, {currentUser?.name || "Friend"}!
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your dual profile has been created. You can now publish skills you know, discover skills you love, and match for 1-on-1 peer exchanges.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recommended Next Steps:
          </h3>

          <Link
            to="/dashboard"
            className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                Explore Your Dashboard
              </h4>
              <p className="text-xs text-slate-500">
                Review your stats, notifications, and personalized match recommendations.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </Link>

          <Link
            to="/discover"
            className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600">
                Discover Skills & Mentors
              </h4>
              <p className="text-xs text-slate-500">
                Browse our marketplace of 25+ categories and find your first teacher.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
          </Link>

          <Link
            to="/dashboard/teaching"
            className="group flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600">
                Publish a Skill Listing
              </h4>
              <p className="text-xs text-slate-500">
                Share what you know and start receiving requests from curious learners.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
          </Link>

          <div className="pt-4">
            <Link to="/dashboard">
              <Button size="lg" variant="primary" className="w-full">
                Go to Overview
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

