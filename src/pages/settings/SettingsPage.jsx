import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  User,
  Shield,
  Bell,
  Sliders,
  LogOut,
  RefreshCw,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { ConfirmationModal } from "../../components/common/ConfirmationModal";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const SettingsPage = () => {
  const { currentUser, updateProfile, logout, resetAllData } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("account"); // "account" | "privacy" | "notifications" | "preferences"
  const [loading, setLoading] = useState(false);

  // Form states
  const [accountForm, setAccountForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    headline: currentUser?.headline || "",
    location: currentUser?.location || "",
    bio: currentUser?.bio || "",
    avatar: currentUser?.avatar || "",
    availability: currentUser?.availability || ""
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Privacy states
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showAvailability: true,
    allowDirectMessages: true
  });

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    sessionReminders: true,
    learningRequests: true,
    messages: true,
    exchangeUpdates: true
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    preferredFormat: currentUser?.learningMethod || "Online (Video Call)",
    language: "English (US)",
    theme: "Light Mode (Standard)"
  });

  // Reset confirmation modal
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(accountForm);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast("Password must be at least 6 characters.", "error");
      return;
    }
    addToast("Password updated successfully!", "success");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Account Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Profile Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal details, privacy controls, alerts, and platform preferences.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "account", label: "Account Profile", icon: User },
          { id: "privacy", label: "Privacy & Visibility", icon: Shield },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "preferences", label: "Preferences", icon: Sliders }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Account Profile */}
      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Personal Profile Information
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update how other community members see your presence on SkillConnect.
            </p>

            <form onSubmit={handleSaveAccount} className="space-y-4">
              <div className="flex items-center gap-4 pb-2">
                <img
                  src={accountForm.avatar}
                  alt={accountForm.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex-1">
                  <Input
                    label="Avatar URL"
                    value={accountForm.avatar}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, avatar: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={accountForm.name}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={accountForm.email}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Headline / Professional Title"
                  value={accountForm.headline}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, headline: e.target.value })
                  }
                />
                <Input
                  label="Location"
                  value={accountForm.location}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={accountForm.bio}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, bio: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
                />
              </div>

              <Input
                label="Weekly Schedule Availability"
                value={accountForm.availability}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, availability: e.target.value })
                }
                placeholder="e.g. Weekdays 6-8 PM, Weekends flexible"
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" icon={Save} loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Change Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ensure your account stays protected with a strong password.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="outline" size="sm">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Privacy */}
      {activeTab === "privacy" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Privacy & Profile Visibility
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Control how other community members discover and contact you.
          </p>

          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Public Profile Listing
                </h4>
                <p className="text-xs text-slate-500">
                  Allow your teacher and learner profile to appear in search results and marketplace cards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.publicProfile}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, publicProfile: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Show Availability Schedule
                </h4>
                <p className="text-xs text-slate-500">
                  Display your preferred times on your public profile cards.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showAvailability}
                onChange={(e) =>
                  setPrivacySettings({ ...privacySettings, showAvailability: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Direct Messaging Permissions
                </h4>
                <p className="text-xs text-slate-500">
                  Allow any verified member to send direct messages before formal proposals.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allowDirectMessages}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    allowDirectMessages: e.target.checked
                  })
                }
                className="w-5 h-5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => addToast("Privacy settings updated!", "success")}
            >
              Save Privacy Settings
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Notification Preferences
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Select what events trigger notification alerts in your center.
          </p>

          <div className="space-y-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Session Reminders</h4>
                <p className="text-xs text-slate-500">Receive alerts 1 hour before scheduled video sessions.</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.sessionReminders}
                onChange={(e) =>
                  setNotifSettings({ ...notifSettings, sessionReminders: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Learning Requests & Proposals</h4>
                <p className="text-xs text-slate-500">Alerts when new learners apply to your skill listings.</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.learningRequests}
                onChange={(e) =>
                  setNotifSettings({ ...notifSettings, learningRequests: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Direct Messages</h4>
                <p className="text-xs text-slate-500">Alerts when members send new chat messages.</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.messages}
                onChange={(e) =>
                  setNotifSettings({ ...notifSettings, messages: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Mutual Skill Exchange Updates</h4>
                <p className="text-xs text-slate-500">Alerts when mutual skill swap proposals are made or accepted.</p>
              </div>
              <input
                type="checkbox"
                checked={notifSettings.exchangeUpdates}
                onChange={(e) =>
                  setNotifSettings({ ...notifSettings, exchangeUpdates: e.target.checked })
                }
                className="w-5 h-5 rounded text-indigo-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => addToast("Notification preferences updated!", "success")}
            >
              Save Notification Settings
            </Button>
          </div>
        </div>
      )}

      {/* Tab 4: Preferences & Demo Admin */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Platform Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Learning Format"
                value={preferences.preferredFormat}
                onChange={(e) =>
                  setPreferences({ ...preferences, preferredFormat: e.target.value })
                }
                options={[
                  "Online (Video Call)",
                  "In-Person",
                  "Hybrid"
                ]}
              />

              <Select
                label="Language"
                value={preferences.language}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
                options={["English (US)", "English (UK)", "Hindi", "Spanish", "French", "German"]}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => addToast("Preferences saved!", "success")}
              >
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Danger Zone: Reset Demo Data & Logout */}
          <div className="bg-rose-50/40 rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-rose-950">
              Demo Administration & Account Actions
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              In frontend demo mode, all data is stored locally. You can reset to the default 12 users, 26 skill listings, and mock sessions at any time.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="danger"
                size="sm"
                icon={RefreshCw}
                onClick={() => setConfirmResetOpen(true)}
              >
                Reset All Demo Data
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
              >
                Sign Out of Current Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="Reset Demo Data?"
        message="This will reset all users, skills, sessions, messages, and requests back to initial factory demo seed data."
        confirmText="Reset Now"
        onConfirm={() => {
          resetAllData();
        }}
      />
    </div>
  );
};

