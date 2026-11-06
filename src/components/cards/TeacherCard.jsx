import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Award, ArrowRight, MessageSquare, Repeat } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const TeacherCard = ({ teacher, onDirectExchange, onMessage }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start gap-4">
          <Link to={`/profile/${teacher.id}`} className="relative flex-shrink-0">
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <Link
                to={`/profile/${teacher.id}`}
                className="text-base font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate"
              >
                {teacher.name}
              </Link>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{teacher.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({teacher.reviewCount})</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{teacher.headline}</p>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{teacher.location}</span>
            </div>
          </div>
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-600 mt-3.5 line-clamp-2 leading-relaxed">
          {teacher.bio}
        </p>

        {/* Badges */}
        {teacher.badges && teacher.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {teacher.badges.slice(0, 2).map((b, i) => (
              <Badge key={i} variant="purple" size="sm">
                <Award className="w-3 h-3 mr-0.5" />
                {b}
              </Badge>
            ))}
          </div>
        )}

        {/* Skills Offered vs Wanted */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Teaches:</span>
            <div className="flex flex-wrap gap-1">
              {teacher.skillsOffered?.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Wants to learn:</span>
            <div className="flex flex-wrap gap-1">
              {teacher.skillsWanted?.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <Link to={`/profile/${teacher.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Profile
          </Button>
        </Link>
        {onDirectExchange && (
          <Button
            variant="accent"
            size="sm"
            icon={Repeat}
            className="flex-1"
            onClick={() => onDirectExchange(teacher)}
          >
            Exchange
          </Button>
        )}
      </div>
    </div>
  );
};

