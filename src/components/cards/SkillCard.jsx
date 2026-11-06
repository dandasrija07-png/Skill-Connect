import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Globe, Heart, ArrowRight } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { useSkills } from "../../context/SkillContext";
import { useAuth } from "../../context/AuthContext";

export const SkillCard = ({ skill, teacher, onRequestLearn, onContactTeacher }) => {
  const { wishlist, toggleWishlist } = useSkills();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isSaved = wishlist.includes(skill.id);
  const isMySkill = currentUser?.id === skill.teacherId;

  // Level badge variants
  const levelVariantMap = {
    Beginner: "emerald",
    Intermediate: "indigo",
    Advanced: "purple",
    "All Levels": "teal"
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image & Category */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={skill.coverImage}
          alt={skill.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge variant={levelVariantMap[skill.level] || "indigo"} size="sm">
            {skill.level}
          </Badge>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(skill.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isSaved
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500"
            }`}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
            {skill.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Learners */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              <span>{skill.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({skill.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{skill.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
            <Link to={`/skills/${skill.id}`}>{skill.title}</Link>
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {skill.shortDesc || skill.description}
          </p>

          {/* Teacher preview */}
          {teacher && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/profile/${teacher.id}`}
                className="flex items-center gap-2.5 group/teacher"
              >
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 group-hover/teacher:text-indigo-600 transition-colors">
                    {teacher.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[130px]">
                    {teacher.location}
                  </p>
                </div>
              </Link>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-medium">
                  <Globe className="w-3 h-3" />
                  {skill.format.split(" ")[0]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link to={`/skills/${skill.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          {!isMySkill ? (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onRequestLearn && onRequestLearn(skill, teacher)}
            >
              Connect
            </Button>
          ) : (
            <span className="text-xs text-indigo-600 font-medium px-3 py-1.5 bg-indigo-50 rounded-xl">
              Your Listing
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

