import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  Send,
  Star,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { ReviewModal } from "../../components/forms/ReviewModal";
import { useAuth } from "../../context/AuthContext";
import { useSkills } from "../../context/SkillContext";
import { initialUsers } from "../../data/mockData";

export const SessionRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { sessions, updateSessionStatus, submitReview } = useSkills();

  const session = sessions.find((s) => s.id === id) || {
    id: "sess-demo",
    title: "1-on-1 SkillConnect Video Session",
    teacherName: "Priya Sharma",
    learnerName: "Alex Chen",
    format: "Online (Video Call)",
    date: "Today",
    time: "Live Session",
    notes: "Interactive practical exercises and code review."
  };

  // Video call controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState("chat"); // "chat" | "notes" | null

  // Live timer
  const [seconds, setSeconds] = useState(0);

  // In-room chat
  const [roomChat, setRoomChat] = useState([
    {
      id: "rc-1",
      sender: session.teacherName,
      text: "Welcome to today's session! Let me know if you can hear and see my screen clearly.",
      time: "00:01"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // In-room shared notes
  const [roomNotes, setRoomNotes] = useState(
    "Key Topics for Today:\n1. Recap previous milestones\n2. Live hands-on implementation\n3. Q&A and next homework task"
  );

  // Review modal upon call end
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `rc-${Date.now()}`,
      sender: currentUser?.name || "You",
      text: chatInput.trim(),
      time: formatTimer(seconds)
    };
    setRoomChat([...roomChat, newMsg]);
    setChatInput("");
  };

  const handleEndCall = async () => {
    await updateSessionStatus(session.id, "Completed");
    setIsReviewOpen(true);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 animate-fade-in">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {session.title}
            </h3>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-xs font-mono">
            ID: {session.id}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === "chat" ? null : "chat")}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeSidePanel === "chat" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="In-call chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveSidePanel(activeSidePanel === "notes" ? null : "notes")}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeSidePanel === "notes" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Session notes"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Stage & Side Panel */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Video Grid */}
        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center bg-radial-[at_50%_50%] from-slate-900 to-slate-950">
          {/* Tile 1: Other participant / Screen Share */}
          <div className="relative w-full h-full min-h-[220px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-lg group">
            {screenSharing ? (
              <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Monitor className="w-16 h-16 text-indigo-400 animate-pulse mb-2" />
                <h4 className="text-sm font-bold text-white">Screen Sharing Active</h4>
                <p className="text-xs text-slate-400">Presenting session workspace & live code demonstration...</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces"
                  alt="Partner"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-700 mx-auto shadow-md"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {session.teacherName === currentUser?.name ? session.learnerName : session.teacherName}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-medium">Connected • Speaking</span>
                </div>
              </div>
            )}

            {/* Tile label */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{session.teacherName === currentUser?.name ? session.learnerName : session.teacherName}</span>
            </div>
          </div>

          {/* Tile 2: Self Video */}
          <div className="relative w-full h-full min-h-[220px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-lg">
            {videoOn ? (
              <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-900 flex flex-col items-center justify-center space-y-3">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces"}
                  alt={currentUser?.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 mx-auto shadow-md"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{currentUser?.name} (You)</h4>
                  <span className="text-[11px] text-slate-400">Video HD Active</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <VideoOff className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">Camera is turned off</p>
              </div>
            )}

            {/* Tile label */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs text-white flex items-center gap-1.5">
              <span>{currentUser?.name} (You)</span>
              {!micOn && <MicOff className="w-3 h-3 text-rose-400 ml-1" />}
            </div>
          </div>
        </div>

        {/* Side Panel: In-Call Chat / Notes */}
        {activeSidePanel && (
          <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
            {/* Panel Tab Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                {activeSidePanel === "chat" ? "In-Call Messages" : "Live Session Notes"}
              </span>
              <button
                onClick={() => setActiveSidePanel(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Panel Content */}
            {activeSidePanel === "chat" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {roomChat.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 bg-slate-800 p-2.5 rounded-xl">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type in-call message..."
                    className="flex-1 bg-slate-800 text-xs px-3 py-2 rounded-xl outline-none text-white focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 p-4 flex flex-col">
                <textarea
                  rows={15}
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  className="w-full flex-1 bg-slate-800 p-3 rounded-xl text-xs text-slate-200 font-mono outline-none resize-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
                <span className="text-[10px] text-slate-500 mt-2 block">
                  Shared real-time scratchpad for curriculum notes, links, and code snippets.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Call Controls Dock */}
      <div className="h-18 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-center gap-3 sm:gap-4">
        {/* Mic Toggle */}
        <button
          onClick={() => setMicOn(!micOn)}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
            micOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
          }`}
          title={micOn ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setVideoOn(!videoOn)}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
            videoOn ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-rose-600 text-white"
          }`}
          title={videoOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={() => setScreenSharing(!screenSharing)}
          className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
            screenSharing ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Session</span>
        </button>
      </div>

      {/* Review Modal Prompt */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          navigate("/dashboard/sessions");
        }}
        session={session}
        onSubmit={async (data) => {
          await submitReview(data);
          setIsReviewOpen(false);
          navigate("/dashboard/sessions");
        }}
      />
    </div>
  );
};

