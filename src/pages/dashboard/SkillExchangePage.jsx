import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Repeat,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Send,
  Calendar,
  XCircle
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { EmptyState } from "../../components/common/EmptyState";
import { ExchangeMatchCard } from "../../components/cards/ExchangeMatchCard";
import { ExchangeRequestModal } from "../../components/forms/ExchangeRequestModal";
import { ScheduleSessionModal } from "../../components/forms/ScheduleSessionModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { exchangeService } from "../../services/exchangeService";

export const SkillExchangePage = () => {
  const { currentUser } = useAuth();
  const {
    exchanges,
    sendExchangeRequest,
    handleExchangeStatus,
    scheduleSession
  } = useSkills();

  const [activeTab, setActiveTab] = useState("discover"); // "discover" | "active" | "proposals"
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatchUser, setSelectedMatchUser] = useState(null);
  const [selectedMatchData, setSelectedMatchData] = useState(null);

  // Schedule modal after accepting exchange
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleExchangeTarget, setScheduleExchangeTarget] = useState(null);

  // Filter match types: All, Mutual only
  const [filterMutualOnly, setFilterMutualOnly] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      if (currentUser) {
        setLoadingMatches(true);
        const matches = await exchangeService.findPotentialMatches(currentUser);
        setPotentialMatches(matches);
        setLoadingMatches(false);
      }
    };
    loadMatches();
  }, [currentUser]);

  // User exchanges
  const myExchanges = exchanges.filter(
    (e) => e.requesterId === currentUser?.id || e.targetUserId === currentUser?.id
  );
  const activeExchanges = myExchanges.filter((e) => e.status === "Active");
  const pendingExchanges = myExchanges.filter((e) => e.status === "Pending");

  const displayedMatches = filterMutualOnly
    ? potentialMatches.filter((m) => m.mutual)
    : potentialMatches;

  const handleInitiateExchange = (user, match) => {
    setSelectedMatchUser(user);
    setSelectedMatchData(match);
    setIsModalOpen(true);
  };

  const handleAcceptProposal = async (exch) => {
    await handleExchangeStatus(exch.id, "Active");
    setScheduleExchangeTarget(exch);
    setIsScheduleOpen(true);
  };

  const handleRejectProposal = async (exchId) => {
    await handleExchangeStatus(exchId, "Rejected");
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <Repeat className="w-3.5 h-3.5" />
            <span>Skill Exchange Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mutual Skill Match & Exchange
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            The heart of SkillConnect! Swap your knowledge without cash or paywalls. Discover members who teach what you want to learn, and want what you already know.
          </p>
        </div>

        {/* Quick Dual Skill Tags Summary */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-indigo-200 block mb-1 font-semibold">Your Teaching Skills:</span>
            <div className="flex flex-wrap gap-1">
              {(currentUser?.skillsOffered || ["React.js", "Web Development"]).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-purple-200 block mb-1 font-semibold">Skills You Want:</span>
            <div className="flex flex-wrap gap-1">
              {(currentUser?.skillsWanted || ["UI/UX Design", "Spanish"]).map((s, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("discover")}
            className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "discover"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Discover Matches ({potentialMatches.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "active"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Active Exchanges ({activeExchanges.length})
          </button>
          <button
            onClick={() => setActiveTab("proposals")}
            className={`pb-2 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "proposals"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Exchange Proposals</span>
            {pendingExchanges.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-600 text-white font-semibold">
                {pendingExchanges.length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Toggle for Discover Tab */}
        {activeTab === "discover" && (
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer self-start sm:self-center">
            <input
              type="checkbox"
              checked={filterMutualOnly}
              onChange={(e) => setFilterMutualOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="font-semibold text-slate-700">
              Show 100% Mutual Matches Only
            </span>
          </label>
        )}
      </div>

      {/* Tab 1: Discover Matches */}
      {activeTab === "discover" && (
        <div className="space-y-4">
          {displayedMatches.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No direct skill matches found"
              description="Try updating your 'Skills Offered' or 'Skills Wanted' in your profile settings to broaden matching possibilities."
              actionLabel="Update My Skills"
              onAction={() => (window.location.href = "/dashboard/settings")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMatches.map((match) => (
                <ExchangeMatchCard
                  key={match.user.id}
                  match={match}
                  onInitiateExchange={handleInitiateExchange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Exchanges */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {activeExchanges.length === 0 ? (
            <EmptyState
              icon={Repeat}
              title="No active skill exchanges yet"
              description="Browse the Discover Matches tab to propose your first mutual skill exchange."
              actionLabel="Find Matches"
              onAction={() => setActiveTab("discover")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeExchanges.map((exch) => {
                const isRequester = exch.requesterId === currentUser?.id;
                const partnerName = isRequester ? exch.targetUserName : exch.requesterName;
                const partnerAvatar = isRequester ? exch.targetUserAvatar : exch.requesterAvatar;

                return (
                  <div
                    key={exch.id}
                    className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="indigo" size="sm" dot>
                          Active Exchange
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          Created {exch.createdDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={partnerAvatar}
                          alt={partnerName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{partnerName}</h4>
                          <p className="text-xs text-indigo-600 font-semibold">{exch.matchScore}</p>
                        </div>
                      </div>

                      {/* Swap Details */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">You Teach:</span>
                          <span className="font-bold text-indigo-700">{exch.offeredSkill}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">You Learn:</span>
                          <span className="font-bold text-purple-700">{exch.wantedSkill}</span>
                        </div>
                      </div>

                      {/* Session Progress Tracker */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-600">Exchange Sessions</span>
                          <span className="text-indigo-600">
                            {exch.sessionsCompleted} of {exch.totalPlannedSessions} Completed
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                            style={{
                              width: `${(exch.sessionsCompleted / exch.totalPlannedSessions) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link to="/dashboard/sessions">
                        <Button variant="outline" size="sm" icon={Calendar}>
                          Schedule Session
                        </Button>
                      </Link>
                      <Link
                        to={`/dashboard/messages?chat=${
                          isRequester ? exch.targetUserId : exch.requesterId
                        }`}
                      >
                        <Button variant="primary" size="sm">
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Proposals Sent & Received */}
      {activeTab === "proposals" && (
        <div className="space-y-4">
          {pendingExchanges.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No pending proposals"
              description="Propose a skill swap with any member on the Discover Matches tab."
            />
          ) : (
            <div className="space-y-3">
              {pendingExchanges.map((exch) => {
                const isIncoming = exch.targetUserId === currentUser?.id;
                const partnerName = isIncoming ? exch.requesterName : exch.targetUserName;
                const partnerAvatar = isIncoming ? exch.requesterAvatar : exch.targetUserAvatar;

                return (
                  <div
                    key={exch.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={partnerAvatar}
                          alt={partnerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-base font-bold text-slate-900">
                            {partnerName}
                          </h4>
                          <span className="text-xs text-purple-700 font-semibold">
                            {isIncoming ? "Proposed a skill swap with you" : "You proposed a swap"}
                          </span>
                        </div>
                      </div>

                      <Badge variant="amber" size="sm" dot>
                        {exch.status}
                      </Badge>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                      <p className="text-slate-700">
                        <strong>Swap Plan:</strong> You teach <em>{exch.offeredSkill}</em> in exchange for <em>{exch.wantedSkill}</em>.
                      </p>
                      {exch.note && (
                        <p className="text-slate-600 italic">
                          "{exch.note}"
                        </p>
                      )}
                    </div>

                    {isIncoming && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-50"
                          onClick={() => handleRejectProposal(exch.id)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptProposal(exch)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Accept & Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Propose Exchange Modal */}
      {selectedMatchUser && (
        <ExchangeRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMatchUser(null);
          }}
          targetUser={selectedMatchUser}
          matchData={selectedMatchData}
          onSubmit={sendExchangeRequest}
        />
      )}

      {/* Scheduling Session Modal after accepting proposal */}
      {scheduleExchangeTarget && (
        <ScheduleSessionModal
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setScheduleExchangeTarget(null);
          }}
          initialData={{
            title: `Exchange Session 1: ${scheduleExchangeTarget.offeredSkill}`,
            teacherName: currentUser?.name,
            learnerName: scheduleExchangeTarget.requesterName,
            date: new Date().toISOString().split("T")[0],
            time: "19:00 - 20:30 IST",
            format: "Online (Video Call)"
          }}
          onSubmit={async (sessData) => {
            await scheduleSession({
              ...sessData,
              teacherId: currentUser.id,
              learnerId: scheduleExchangeTarget.requesterId
            });
          }}
        />
      )}
    </div>
  );
};

