import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Globe,
  Heart,
  MessageSquare,
  Repeat,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Send
} from "lucide-react";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { RequestLearnModal } from "../../components/forms/RequestLearnModal";
import { ExchangeRequestModal } from "../../components/forms/ExchangeRequestModal";
import { SkillCard } from "../../components/cards/SkillCard";
import { useSkills } from "../../context/SkillContext";
import { useAuth } from "../../context/AuthContext";
import { initialUsers } from "../../data/mockData";

export const SkillDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { skills, wishlist, toggleWishlist, reviews, sendLearningRequest, sendExchangeRequest } = useSkills();
  const { currentUser } = useAuth();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [targetModalSkill, setTargetModalSkill] = useState(null);
  const [targetModalTeacher, setTargetModalTeacher] = useState(null);

  const skill = skills.find((s) => s.id === id);
  const teacher = initialUsers.find((u) => u.id === skill?.teacherId);
  const skillReviews = reviews.filter((r) => r.skillId === id || r.teacherId === skill?.teacherId);
  const isSaved = wishlist.includes(id);
  const isMySkill = currentUser?.id === skill?.teacherId;

  // Similar skills in the same category
  const similarSkills = skills
    .filter((s) => s.category === skill?.category && s.id !== id)
    .slice(0, 3);

  if (!skill) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Skill Listing Not Found</h2>
        <p className="text-sm text-slate-500">The skill you are looking for might have been moved or removed.</p>
        <Link to="/discover">
          <Button variant="primary">Browse Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>
      </div>

      {/* Hero Banner: Title, Badges, and Cover */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <img
            src={skill.coverImage}
            alt={skill.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

          {/* Top category & wishlist */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-full bg-white/90 text-slate-900 backdrop-blur-md text-xs font-bold shadow-sm">
              {skill.category}
            </span>
            <button
              onClick={() => toggleWishlist(skill.id)}
              className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isSaved
                  ? "bg-rose-500 text-white shadow-lg"
                  : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500"
              }`}
              title={isSaved ? "Saved" : "Save to Wishlist"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Bottom Title Info */}
          <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" size="sm">
                {skill.level}
              </Badge>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {skill.duration}
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {skill.format}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {skill.title}
            </h1>
          </div>
        </div>

        {/* CTA Bar right below image */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {teacher && (
              <Link to={`/profile/${teacher.id}`} className="flex items-center gap-3 group">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {teacher.name}
                  </h4>
                  <p className="text-xs text-slate-500">{teacher.headline}</p>
                </div>
              </Link>
            )}
            <div className="hidden sm:block h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              <span>{skill.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-xs font-normal">
                ({skill.reviewCount} community reviews)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isMySkill ? (
              <>
                <Link
                  to={`/dashboard/messages?chat=${teacher?.id}`}
                  className="flex-1 sm:flex-initial"
                >
                  <Button variant="outline" size="md" icon={MessageSquare} className="w-full">
                    Chat
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="md"
                  icon={Send}
                  className="flex-1 sm:flex-initial shadow-md"
                  onClick={() => setIsRequestModalOpen(true)}
                >
                  Request to Learn
                </Button>
                <Button
                  variant="accent"
                  size="md"
                  icon={Repeat}
                  className="flex-1 sm:flex-initial"
                  onClick={() => setIsExchangeModalOpen(true)}
                >
                  Propose Swap
                </Button>
              </>
            ) : (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl">
                This is your published listing
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description, Topics, Outcomes */}
        <div className="lg:col-span-2 space-y-8">
          {/* About This Skill */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900">About This Skill Listing</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {skill.description}
            </p>

            {/* Preferred Exchange Arrangement */}
            {skill.exchangeArrangement && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Repeat className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Teacher's Exchange Wishlist:
                  </h4>
                  <p className="text-xs text-indigo-800 mt-0.5">
                    {skill.exchangeArrangement}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Learning Outcomes */}
          {skill.outcomes && skill.outcomes.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900">What You Will Achieve</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {skill.outcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum / Topics Covered */}
          {skill.topics && skill.topics.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900">Topics & Session Plan</h3>
              <div className="space-y-3 pt-1">
                {skill.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70"
                  >
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-2 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Prerequisites</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {skill.prerequisites || "No special prerequisites required. Complete beginners welcome!"}
            </p>
          </div>

          {/* Reviews & Ratings */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Learner Reviews & Ratings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified peer feedback from completed learning sessions
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-lg">
                <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                <span>{skill.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {skillReviews.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No written reviews yet for this listing. Be the first to learn and review!
                </p>
              ) : (
                skillReviews.map((rev) => (
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
        </div>

        {/* Right Col: Teacher Profile & Schedule Card */}
        <div className="space-y-6">
          {/* Teacher Profile Box */}
          {teacher && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Instructor Details
              </h3>
              <div className="flex items-start gap-4">
                <Link to={`/profile/${teacher.id}`}>
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                </Link>
                <div>
                  <Link
                    to={`/profile/${teacher.id}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    {teacher.name}
                  </Link>
                  <p className="text-xs text-slate-500">{teacher.headline}</p>
                  <p className="text-xs text-slate-400 mt-1">{teacher.location}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{teacher.bio}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total Taught: <strong>{teacher.hoursTaught}h</strong></span>
                <span>Rating: <strong className="text-amber-500">{teacher.rating.toFixed(1)} ★</strong></span>
              </div>

              <Link to={`/profile/${teacher.id}`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Profile
                </Button>
              </Link>
            </div>
          )}

          {/* Schedule Info Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Schedule Availability
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>{skill.schedule || "Flexible based on agreement"}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Once your request is approved, you and the teacher can pick exact time slots directly via the session calendar.
            </p>
          </div>
        </div>
      </div>

      {/* Similar Skills Section */}
      {similarSkills.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-5">
          <h3 className="text-xl font-bold text-slate-900">
            Similar Skills in {skill.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarSkills.map((simSkill) => {
              const simTeacher = initialUsers.find((u) => u.id === simSkill.teacherId);
              return (
                <SkillCard
                  key={simSkill.id}
                  skill={simSkill}
                  teacher={simTeacher}
                  onRequestLearn={(s, t) => {
                    setTargetModalSkill(s);
                    setTargetModalTeacher(t);
                    setIsRequestModalOpen(true);
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Request Learn Modal */}
      <RequestLearnModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setTargetModalSkill(null);
          setTargetModalTeacher(null);
        }}
        skill={targetModalSkill || skill}
        teacher={targetModalTeacher || teacher}
        onSubmit={sendLearningRequest}
      />

      {/* Exchange Request Modal */}
      {teacher && (
        <ExchangeRequestModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          targetUser={teacher}
          matchData={{ matchScore: "Skill Exchange Proposal" }}
          onSubmit={sendExchangeRequest}
        />
      )}
    </div>
  );
};
