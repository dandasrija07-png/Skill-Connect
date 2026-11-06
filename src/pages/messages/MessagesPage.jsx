import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Send,
  Search,
  MessageSquare,
  Sparkles,
  CheckCheck,
  User,
  Info,
  Calendar,
  Repeat
} from "lucide-react";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { messageService } from "../../services/messageService";
import { initialUsers } from "../../data/mockData";

export const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const initialChatUserId = searchParams.get("chat");

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Load conversations
  useEffect(() => {
    const loadConvs = async () => {
      setLoading(true);
      const list = await messageService.getConversations();
      setConversations(list);

      if (initialChatUserId) {
        const found = await messageService.getConversationByUser(initialChatUserId);
        setActiveConv(found);
      } else if (list.length > 0) {
        setActiveConv(list[0]);
      }
      setLoading(false);
    };
    loadConvs();
  }, [initialChatUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const handleSelectConv = async (conv) => {
    await messageService.markConversationAsRead(conv.userId);
    setActiveConv({ ...conv, unreadCount: 0 });
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg = await messageService.sendMessage(
      activeConv.userId,
      currentUser?.id || "user-1",
      textToSend
    );

    if (newMsg) {
      setActiveConv((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), newMsg],
        lastMessage: textToSend,
        lastTimestamp: "Just now"
      }));

      // Refresh list ordering
      const updatedList = await messageService.getConversations();
      setConversations(updatedList);
    }
  };

  const handleQuickReply = (text) => {
    setInputText(text);
  };

  const filteredConversations = conversations.filter((c) =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-fade-in pb-4">
      {/* Page Title & Demo Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Direct Messages
          </h1>
          <p className="text-xs text-slate-500">
            Real-time chat simulation with prospective teachers, learners, and skill-swap partners.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold self-start sm:self-center">
          <Info className="w-3.5 h-3.5" />
          <span>Local Frontend Chat Demo</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
        {/* Left Col: Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-slate-100 rounded-xl text-xs py-2 pl-9 pr-3 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv)}
                    className={`w-full p-4 text-left flex items-start gap-3.5 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-white border-l-4 border-indigo-600 shadow-xs"
                        : "hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conv.userAvatar}
                        alt={conv.userName}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {conv.userName}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {conv.lastTimestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Active Conversation Thread */}
        {activeConv ? (
          <div className="flex-1 flex flex-col bg-white min-h-0">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.userAvatar}
                  alt={activeConv.userName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeConv.userName}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">
                    {activeConv.userHeadline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/profile/${activeConv.userId}`}>
                  <Button variant="outline" size="sm" icon={User}>
                    Profile
                  </Button>
                </Link>
                <Link to="/dashboard/sessions">
                  <Button variant="outline" size="sm" icon={Calendar}>
                    Schedule
                  </Button>
                </Link>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {activeConv.messages?.map((msg) => {
                const isMe = msg.senderId === (currentUser?.id || "user-1");
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pills */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] text-slate-400 font-semibold flex-shrink-0">
                Quick replies:
              </span>
              {[
                "Looking forward to our session!",
                "Can we reschedule to 7 PM?",
                "Thanks so much for the feedback!",
                "I'm ready for the video call!"
              ].map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickReply(pill)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] text-slate-600 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-slate-200 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConv.userName}...`}
                className="flex-1 bg-slate-100 border border-transparent focus:border-indigo-600 focus:bg-white text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none transition-all"
              />
              <Button
                type="submit"
                variant="primary"
                icon={Send}
                disabled={!inputText.trim()}
              >
                Send
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
            <EmptyState
              icon={MessageSquare}
              title="No Conversation Selected"
              description="Choose a conversation from the left sidebar to start chatting."
            />
          </div>
        )}
      </div>
    </div>
  );
};
