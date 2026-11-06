import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Heart, RefreshCw, Globe, MessageCircle, Share2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Footer = () => {
  const { resetAllData } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">SkillConnect</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Share What You Know. Learn What You Love. A community-driven peer skill-exchange platform where everyone can be both teacher and learner.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#community"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Community"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#chat"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Discussions"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#share"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  All Skill Listings
                </Link>
              </li>
              <li>
                <Link to="/dashboard/exchange" className="hover:text-white transition-colors">
                  Skill Exchange Matches
                </Link>
              </li>
              <li>
                <Link to="/discover?category=Web+Development" className="hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/discover?category=UI%2FUX+Design" className="hover:text-white transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/discover?category=Languages" className="hover:text-white transition-colors">
                  Language Immersion
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Become a Learner
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Community Dashboard
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Dev Demo Controls */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Developer & Demo
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Frontend demo mode with persistent local state across users and listings.
            </p>
            <button
              onClick={resetAllData}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              Reset Demo Data
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillConnect. All rights reserved. Share What You Know, Learn What You Love.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for learning communities
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
