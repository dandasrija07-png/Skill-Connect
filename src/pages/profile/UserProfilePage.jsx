import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  MapPin,
  Star,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  Repeat,
  Award,
  Edit2,
  Clock,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { SkillCard } from "../../components/cards/SkillCard";
import { ExchangeRequestModal } from "../../components/forms/ExchangeRequestModal";
import { RequestLearnModal } from "../../components/forms/RequestLearnModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { userService } from "../../services/userService";
import { initialUsers } from "../../data/mockData";

export const UserProfilePage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { skills, reviews, sendExchangeRequest, sendLearningRequest } = useSkills();

  // If no param, default to logged in user
  const targetUserId = id || currentUser?.id;
  const isMe = targetUserId === currentUser?.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const found = await userService.getUserById(targetUserId);
      setUser(found || initialUsers[0]);
      setLoading(false);
    };
    fetchUser();
  }, [targetUserId]);

  if (loading || !user) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading profile...</div>;
  }

  const userSkills = skills.filter((s) => s.teacherId === user.id);
  const userReviews = reviews.filter((r) => r.teacherId === user.id);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Cover gradient */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl"
              />
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              {isMe ? (
                <Link to="/dashboard/settings">
                  <Button variant="outline" size="md" icon={Edit2}>
                    Edit Profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={`/dashboard/messages?chat=${user.id}`}>
                    <Button variant="outline" size="md" icon={MessageSquare}>
                      Message
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="md"
                    icon={Repeat}
                    onClick={() => setExchangeModalOpen(true)}
                  >
                    Request Exchange
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                  @{user.username} • {user.headline}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-base">
                <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                <span>{user.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-xs font-normal">
                  ({user.reviewCount} reviews)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {user.bio}
            </p>

            {/* Badges Strip */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 mr-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {user.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 mr-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {user.availability}
              </span>
              {user.badges?.map((b, i) => (
                <Badge key={i} variant="purple" size="sm">
                  <Award className="w-3 h-3 mr-1" />
                  {b}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dual Skills Grid: Offered vs Wanted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Skills {user.name} Teaches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/70 text-indigo-900 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Total hours mentored: <strong>{user.hoursTaught} hours</strong> across community sessions.
          </p>
        </div>

        {/* Skills Wanted */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span>Skills {user.name} Wants to Learn</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200/70 text-purple-900 text-xs font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">
            Preferred learning format: <strong>{user.learningMethod}</strong>
          </p>
        </div>
      </div>

      {/* Published Courses & Listings by this user */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          Published Listings ({userSkills.length})
        </h3>
        {userSkills.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No public skill listings currently published by this member.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                teacher={user}
                onRequestLearn={() => {
                  setSelectedSkill(skill);
                  setLearnModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Community Reviews for this user */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            Peer Reviews ({userReviews.length})
          </h3>
          <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" />
            {user.rating.toFixed(1)} Community Average
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {userReviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No reviews yet for this profile.</p>
          ) : (
            userReviews.map((rev) => (
              <div key={rev.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rev.reviewerName}</p>
                      <p className="text-[10px] text-slate-400">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                {rev.teacherResponse && (
                  <div className="ml-4 mt-2 p-3 rounded-xl bg-slate-50 border-l-2 border-indigo-500 text-xs text-slate-700">
                    <span className="font-semibold text-indigo-700 block text-[11px] mb-0.5">
                      Teacher Response:
                    </span>
                    {rev.teacherResponse}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Exchange Modal */}
      <ExchangeRequestModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        targetUser={user}
        matchData={{ matchScore: "Skill Exchange Proposal" }}
        onSubmit={sendExchangeRequest}
      />

      {/* Learn Modal */}
      {selectedSkill && (
        <RequestLearnModal
          isOpen={learnModalOpen}
          onClose={() => setLearnModalOpen(false)}
          skill={selectedSkill}
          teacher={user}
          onSubmit={sendLearningRequest}
        />
      )}
    </div>
  );
};

