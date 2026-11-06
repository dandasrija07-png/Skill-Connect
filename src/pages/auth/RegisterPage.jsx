import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff, Mail, Lock, User, MapPin, Plus, X, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "Bengaluru, India",
    headline: "Full Stack Engineer & Mentor",
    bio: "Passionate about building software and exchanging knowledge with peers.",
    experienceLevel: "Intermediate",
    learningMethod: "Online (Video Call)",
    availability: "Evenings & Weekends",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces"
  });

  const [teachSkills, setTeachSkills] = useState(["React.js", "JavaScript"]);
  const [newTeachSkill, setNewTeachSkill] = useState("");

  const [learnSkills, setLearnSkills] = useState(["UI/UX Design", "Spanish"]);
  const [newLearnSkill, setNewLearnSkill] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultAvatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&h=240&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=faces"
  ];

  const handleAddTeachSkill = (e) => {
    e.preventDefault();
    if (newTeachSkill.trim() && !teachSkills.includes(newTeachSkill.trim())) {
      setTeachSkills([...teachSkills, newTeachSkill.trim()]);
      setNewTeachSkill("");
    }
  };

  const handleRemoveTeachSkill = (skill) => {
    setTeachSkills(teachSkills.filter((s) => s !== skill));
  };

  const handleAddLearnSkill = (e) => {
    e.preventDefault();
    if (newLearnSkill.trim() && !learnSkills.includes(newLearnSkill.trim())) {
      setLearnSkills([...learnSkills, newLearnSkill.trim()]);
      setNewLearnSkill("");
    }
  };

  const handleRemoveLearnSkill = (skill) => {
    setLearnSkills(learnSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (teachSkills.length === 0) {
      setError("Please add at least one skill you can teach.");
      return;
    }
    if (learnSkills.length === 0) {
      setError("Please add at least one skill you want to learn.");
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        skillsOffered: teachSkills,
        skillsWanted: learnSkills
      });
      navigate("/register-success");
    } catch (err) {
      setError(err.message || "Failed to register. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SkillConnect
          </span>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Create Your Dual Profile
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Join our community as both a <strong className="text-indigo-600">Teacher</strong> and a <strong className="text-purple-600">Learner</strong>.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={User}
                placeholder="e.g. Maya Krishnan"
                required
              />

              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={Mail}
                placeholder="maya@example.com"
                required
              />
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 chars"
                    className="block w-full rounded-xl border border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-indigo-500/20 text-sm py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2"
                    required
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Repeat password"
                    className="block w-full rounded-xl border border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-indigo-500/20 text-sm py-2.5 pl-10 pr-3.5 focus:outline-none focus:ring-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Avatar picker */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Choose Profile Avatar
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {defaultAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`relative w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                      formData.avatar === url
                        ? "border-indigo-600 ring-2 ring-indigo-500/30 scale-105"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                icon={MapPin}
                placeholder="e.g. Mumbai, India / London, UK"
              />

              <Input
                label="Headline / Profession"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g. Mobile Developer & Photographer"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Short Introduction / Bio
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="A couple of sentences about what drives your learning and teaching..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
              />
            </div>

            {/* Dual Skill Inputs */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-4">
              {/* Skills I Can Teach */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5">
                  1. Skills You Can Teach *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTeachSkill}
                    onChange={(e) => setNewTeachSkill(e.target.value)}
                    placeholder="e.g. Python, Graphic Design, Sourdough Baking"
                    className="flex-1 bg-white rounded-xl border border-indigo-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTeachSkill(e);
                      }
                    }}
                  />
                  <Button size="sm" variant="primary" onClick={handleAddTeachSkill} icon={Plus}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teachSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-white border border-indigo-300 text-indigo-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeachSkill(s)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills I Want to Learn */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900 mb-1.5">
                  2. Skills You Want to Learn *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newLearnSkill}
                    onChange={(e) => setNewLearnSkill(e.target.value)}
                    placeholder="e.g. Acoustic Guitar, Conversational Spanish, SEO"
                    className="flex-1 bg-white rounded-xl border border-purple-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-500/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddLearnSkill(e);
                      }
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={handleAddLearnSkill} icon={Plus}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {learnSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 bg-white border border-purple-300 text-purple-900 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-xs"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(s)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level & Learning Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Overall Experience Level"
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({ ...formData, experienceLevel: e.target.value })
                }
                options={["Beginner", "Intermediate", "Advanced"]}
              />

              <Select
                label="Preferred Learning Format"
                value={formData.learningMethod}
                onChange={(e) =>
                  setFormData({ ...formData, learningMethod: e.target.value })
                }
                options={[
                  "Online (Video Call)",
                  "In-Person",
                  "Hybrid"
                ]}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Complete Registration
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

