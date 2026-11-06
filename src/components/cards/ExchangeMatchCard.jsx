import React from "react";
import { Link } from "react-router-dom";
import { Repeat, Star, MapPin, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const ExchangeMatchCard = ({ match, onInitiateExchange }) => {
  const { user, matchScore, mutual, offeredMatched, wantedMatched } = match;

  return (
    <div className={`relative bg-white rounded-2xl border p-5 transition-all duration-300 shadow-xs hover:shadow-xl ${
      mutual ? "border-indigo-300 ring-2 ring-indigo-500/10" : "border-slate-200"
    }`}>
      {/* Top Match Badge */}
      <div className="flex items-center justify-between mb-4">
        <Badge
          variant={mutual ? "indigo" : "teal"}
          size="sm"
          className="font-semibold shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          {matchScore}
        </Badge>
        <span className="text-xs text-slate-400 font-medium">
          Joined {user.joinedDate}
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-start gap-3.5 mb-4">
        <Link to={`/profile/${user.id}`}>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${user.id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 truncate transition-colors"
            >
              {user.name}
            </Link>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span>{user.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{user.headline}</p>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>
        </div>
      </div>

      {/* Match Explanation Box */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block mb-1">
              They Offer You:
            </span>
            <div className="flex flex-wrap gap-1">
              {(offeredMatched.length > 0 ? offeredMatched : user.skillsOffered.slice(0, 2)).map(
                (s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-white border border-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {s}
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block mb-1">
              They Want From You:
            </span>
            <div className="flex flex-wrap gap-1">
              {(wantedMatched.length > 0 ? wantedMatched : user.skillsWanted.slice(0, 2)).map(
                (s, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-white border border-purple-200 text-purple-900 px-2 py-0.5 rounded-md text-[11px] font-medium"
                  >
                    <Repeat className="w-3 h-3 text-purple-600" />
                    {s}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-slate-500 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Available: <strong className="text-slate-700">{user.availability}</strong></span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Link to={`/profile/${user.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
        <Button
          variant="primary"
          size="sm"
          icon={Repeat}
          className="flex-1 shadow-sm"
          onClick={() => onInitiateExchange(user, match)}
        >
          Exchange Request
        </Button>
      </div>
    </div>
  );
};

