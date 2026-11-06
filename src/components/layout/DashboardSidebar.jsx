import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  BookOpen,
  Inbox,
  Calendar,
  MessageSquare,
  TrendingUp,
  Star,
  User,
  Settings,
  LogOut,
  Sparkles,
  Repeat,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";

export const DashboardSidebar = ({ isCollapsed, toggleCollapsed }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, requests } = useSkills();
  const navigate = useNavigate();

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingRequests = requests.filter(
    (r) => r.teacherId === currentUser?.id && r.status === "Pending"
  ).length;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard", exact: true },
    { label: "Discover Skills", icon: Compass, path: "/discover" },
    { label: "Skill Exchange", icon: Repeat, path: "/dashboard/exchange", highlight: true },
    { label: "My Teaching", icon: GraduationCap, path: "/dashboard/teaching", badge: pendingRequests },
    { label: "My Learning", icon: BookOpen, path: "/dashboard/learning" },
    { label: "Learning Requests", icon: Inbox, path: "/dashboard/requests" },
    { label: "My Sessions", icon: Calendar, path: "/dashboard/sessions" },
    { label: "Messages", icon: MessageSquare, path: "/dashboard/messages" },
    { label: "My Progress", icon: TrendingUp, path: "/dashboard/progress" },
    { label: "Reviews", icon: Star, path: "/dashboard/reviews" },
    { label: "My Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 sm:h-20 flex items-center justify-between px-4 border-b border-slate-100">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate block">
                SkillConnect
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
                Community Portal
              </span>
            </div>
          )}
        </NavLink>

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors hidden lg:block cursor-pointer"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-indigo-50/90 text-indigo-700 font-semibold shadow-xs"
                    : item.highlight
                    ? "text-purple-700 hover:bg-purple-50/60 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  item.highlight ? "text-purple-600" : ""
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!isCollapsed && item.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-lg">
                  {item.label}
                  {item.badge > 0 && ` (${item.badge})`}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom User info & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        {currentUser && (
          <div className={`flex items-center gap-3 mb-2 px-2 py-1.5 ${isCollapsed ? "justify-center" : ""}`}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

