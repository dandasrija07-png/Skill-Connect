import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Repeat,
  GraduationCap,
  BookOpen,
  Users,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe2,
  Calendar,
  MessageSquare,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/common/Button";
import { SkillCard } from "../../components/cards/SkillCard";
import { TeacherCard } from "../../components/cards/TeacherCard";
import { RequestLearnModal } from "../../components/forms/RequestLearnModal";
import { ExchangeRequestModal } from "../../components/forms/ExchangeRequestModal";
import { useSkills } from "../../context/SkillContext";
import { useAuth } from "../../context/AuthContext";
import { initialUsers, skillCategories } from "../../data/mockData";

export const LandingPage = () => {
  const { skills, sendLearningRequest, sendExchangeRequest } = useSkills();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  // FAQ Accordion active index
  const [activeFaq, setActiveFaq] = useState(null);

  const featuredSkills = skills.slice(0, 6);
  const featuredTeachers = initialUsers.slice(0, 4);

  const stats = [
    { label: "Community Members", value: "12,400+", icon: Users },
    { label: "Active Skills Listed", value: "1,850+", icon: BookOpen },
    { label: "Sessions Exchanged", value: "8,900+", icon: Repeat },
    { label: "Average Mentor Rating", value: "4.92 ★", icon: Star }
  ];

  const popularCategories = [
    { name: "Web Development", count: "340+ skills", icon: "💻", gradient: "from-blue-500/10 to-indigo-500/10" },
    { name: "UI/UX Design", count: "210+ skills", icon: "🎨", gradient: "from-purple-500/10 to-pink-500/10" },
    { name: "Languages", count: "185+ skills", icon: "🌍", gradient: "from-emerald-500/10 to-teal-500/10" },
    { name: "Photography", count: "140+ skills", icon: "📷", gradient: "from-amber-500/10 to-orange-500/10" },
    { name: "Music", count: "160+ skills", icon: "🎸", gradient: "from-rose-500/10 to-red-500/10" },
    { name: "Programming", count: "290+ skills", icon: "⚡", gradient: "from-cyan-500/10 to-blue-500/10" },
    { name: "Cooking", count: "95+ skills", icon: "🍳", gradient: "from-yellow-500/10 to-amber-500/10" },
    { name: "Digital Marketing", count: "130+ skills", icon: "📈", gradient: "from-teal-500/10 to-indigo-500/10" }
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "Create Your Dual Profile",
      desc: "Tell us what you can teach and what you want to learn. Everyone in our community can be both a teacher and a learner.",
      icon: Users
    },
    {
      step: "02",
      title: "Discover or Match Skills",
      desc: "Browse our marketplace or let our mutual match system find people who teach what you want and want what you teach.",
      icon: Repeat
    },
    {
      step: "03",
      title: "Schedule 1-on-1 Sessions",
      desc: "Connect directly, pick times that work on the interactive calendar, and meet via high-quality video calls.",
      icon: Calendar
    },
    {
      step: "04",
      title: "Review & Grow Reputation",
      desc: "Leave authentic peer reviews, earn community badges, and build a verified skill portfolio that speaks for itself.",
      icon: Star
    }
  ];

  const whyChooseUs = [
    {
      title: "Pure Skill Exchange",
      desc: "No expensive subscriptions or course paywalls. Exchange your knowledge for someone else's expertise directly.",
      icon: Repeat
    },
    {
      title: "Personalized 1-on-1 Mentorship",
      desc: "Forget generic pre-recorded videos. Learn live with real-time feedback, screen sharing, and personalized guidance.",
      icon: GraduationCap
    },
    {
      title: "Verified Community Reputation",
      desc: "Transparent reviews, completion badges, and verified session logs ensure authentic, high-quality learning.",
      icon: ShieldCheck
    },
    {
      title: "Global Diversity of Talents",
      desc: "From modern coding and design systems to sourdough baking, acoustic guitar, and foreign languages.",
      icon: Globe2
    }
  ];

  const faqs = [
    {
      q: "How does the Skill Exchange system work?",
      a: "SkillConnect matches users based on complementary skills. For example, if you know Python and want to learn Figma, our platform identifies members who teach Figma and want to learn Python. You can also request traditional learning sessions even without a direct mutual swap."
    },
    {
      q: "Do I have to be a professional certified teacher?",
      a: "Not at all! Anyone with genuine passion and practical knowledge can teach. Whether you are a senior software engineer or an enthusiastic home baker, your skills have immense value to someone eager to learn."
    },
    {
      q: "Is SkillConnect completely free to join?",
      a: "Yes! SkillConnect is built on community peer-to-peer exchange. You contribute your knowledge and receive learning sessions in return without expensive course subscriptions."
    },
    {
      q: "How do learning sessions actually take place?",
      a: "Sessions can be held online via built-in video links (Google Meet / Zoom placeholders) or arranged locally in person if both learners prefer. You coordinate your schedule right on your dashboard calendar."
    },
    {
      q: "Can I teach multiple skills at the same time?",
      a: "Absolutely! You can publish as many skill listings as you wish across different categories and manage them from your Teacher Portal."
    }
  ];

  const handleOpenLearnModal = (skill, teacher) => {
    setSelectedSkill(skill);
    setSelectedTeacher(teacher);
    setIsRequestModalOpen(true);
  };

  const handleOpenExchangeModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsExchangeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-radial-[at_50%_0%] from-indigo-50/80 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share What You Know. Learn What You Love.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Skills Have Value.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Share Them With The World.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Discover new abilities, connect with passionate people, and exchange knowledge through a community built for learning together. Everyone can be a teacher. Everyone can be a learner.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/discover">
                <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto shadow-lg shadow-indigo-500/25">
                  Explore Skills
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" icon={GraduationCap} className="w-full sm:w-auto">
                  Become a Teacher
                </Button>
              </Link>
            </div>

            {/* Floating Trust Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                No Course Paywalls
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <Repeat className="w-3.5 h-3.5 text-purple-600" />
                Direct 1-on-1 Skill Swaps
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                Verified Community Reviews
              </span>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-indigo-200/50 via-purple-200/30 to-transparent shadow-2xl">
              <div className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-inner">
                {/* Visual Header bar */}
                <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="mx-auto text-xs text-slate-400 font-mono">
                    skillconnect.community/exchange-portal
                  </span>
                </div>

                {/* Hero Showcase Grid */}
                <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Skill Offering */}
                  <div className="p-4 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={initialUsers[0].avatar}
                          alt="Priya"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Priya Sharma</p>
                          <p className="text-[10px] text-indigo-600 font-medium">Offers: React & Tailwind</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        "Teaching modern component architecture and clean frontend patterns."
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Wants: Figma UI/UX</span>
                      <span className="text-amber-500 font-bold">4.9 ★</span>
                    </div>
                  </div>

                  {/* Card 2: Mutual Swap Match Center */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
                      <Repeat className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full mb-2">
                      100% Mutual Match
                    </span>
                    <h4 className="text-base font-bold">Priya ⇄ Alex</h4>
                    <p className="text-xs text-white/80 mt-1 max-w-[200px]">
                      React Frontend for Figma Design Systems
                    </p>
                    <Link to="/dashboard/exchange" className="mt-4">
                      <Button size="sm" variant="accent" className="bg-white text-indigo-900 hover:bg-slate-100 shadow-sm text-xs">
                        View Exchange
                      </Button>
                    </Link>
                  </div>

                  {/* Card 3: Counterpart Offering */}
                  <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={initialUsers[1].avatar}
                          alt="Alex"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Alex Chen</p>
                          <p className="text-[10px] text-purple-600 font-medium">Offers: UI/UX & Figma</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        "Mentoring on auto-layout, design tokens, and developer handoff."
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Wants: React.js</span>
                      <span className="text-amber-500 font-bold">4.8 ★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {s.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR SKILL CATEGORIES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Explore Disciplines
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Skill Categories
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Find mentors or share your experience across dozens of creative, technical, and life skills.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/discover?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/discover">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View All 18 Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Simple & Community-Driven
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How SkillConnect Works
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Learn a new craft or teach your passion in 4 intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-indigo-600/30">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRENDING SKILLS (Direct Marketplace preview) */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                Learn from Peers
              </h2>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Trending Skills on SkillConnect
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Explore hand-crafted listings from community members ready to teach today.
              </p>
            </div>
            <Link to="/discover">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                Explore All Listings
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((skill) => {
              const teacher = initialUsers.find((u) => u.id === skill.teacherId);
              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  teacher={teacher}
                  onRequestLearn={handleOpenLearnModal}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FEATURED TEACHERS & COMMUNITY MENTORS */}
      <section id="community" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Meet The Teachers
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Community Mentors
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Passionate creators, developers, designers, and artisans sharing their expertise every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onDirectExchange={handleOpenExchangeModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE SKILLCONNECT */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-indigo-900/30 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              The Peer Advantage
            </h2>
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              Why Choose SkillConnect?
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Traditional courses leave you watching pre-recorded videos in isolation. SkillConnect brings back genuine human connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS & SUCCESS STORIES */}
      <section id="testimonials" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Stories from the Community
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Real People. Real Skills Exchanged.
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              See how everyday learners and teachers are growing together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Story 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "I was struggling to understand Figma auto-layout and component tokens. Through SkillConnect, I matched with Alex Chen. I taught him React hooks and in return he taught me Figma design systems. An absolute game-changer!"
                </p>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
                <img
                  src={initialUsers[0].avatar}
                  alt="Priya"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Priya Sharma</h5>
                  <p className="text-[11px] text-slate-500">Frontend Engineer, Bengaluru</p>
                </div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "As a product designer, I wanted to build my own apps without relying on engineering sprints. Learning React directly from Priya gave me immediate practical confidence. The mutual skill swap made it 10x more rewarding."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
                <img
                  src={initialUsers[1].avatar}
                  alt="Alex"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Alex Chen</h5>
                  <p className="text-[11px] text-slate-500">Product Designer, San Francisco</p>
                </div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Learning Spanish from Elena using live conversation drills was 100 times better than any mobile language app. I can now order food and hold conversations with native speakers without hesitation."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200">
                <img
                  src={initialUsers[2].avatar}
                  alt="Rohan"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Rohan Patel</h5>
                  <p className="text-[11px] text-slate-500">Backend Dev, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              Got Questions?
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about teaching and learning on SkillConnect.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Share What You Know & Learn What You Love?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of passionate teachers and learners today. Create your free profile and start exchanging skills within minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/register">
              <Button size="lg" variant="accent" icon={ArrowRight} iconPosition="right" className="bg-white text-indigo-900 hover:bg-slate-100 shadow-xl font-bold">
                Get Started for Free
              </Button>
            </Link>
            <Link to="/discover">
              <Button size="lg" variant="outline" className="border-indigo-300 text-white hover:bg-white/10">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Request to Learn Modal */}
      {selectedSkill && (
        <RequestLearnModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          skill={selectedSkill}
          teacher={selectedTeacher}
          onSubmit={sendLearningRequest}
        />
      )}

      {/* Skill Exchange Modal */}
      {selectedTeacher && (
        <ExchangeRequestModal
          isOpen={isExchangeModalOpen}
          onClose={() => setIsExchangeModalOpen(false)}
          targetUser={selectedTeacher}
          matchData={{ matchScore: "Skill Exchange Proposal" }}
          onSubmit={sendExchangeRequest}
        />
      )}

      <Footer />
    </div>
  );
};

