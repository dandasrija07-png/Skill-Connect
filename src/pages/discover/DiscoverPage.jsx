import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Sparkles,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { SkillCard } from "../../components/cards/SkillCard";
import { RequestLearnModal } from "../../components/forms/RequestLearnModal";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { useSkills } from "../../context/SkillContext";
import { initialUsers, skillCategories } from "../../data/mockData";

export const DiscoverPage = () => {
  const { skills, sendLearningRequest } = useSkills();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("popularity");

  // Modal states
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Find teacher
      const teacher = initialUsers.find((u) => u.id === skill.teacherId);
      const teacherName = teacher ? teacher.name.toLowerCase() : "";

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        skill.title.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q) ||
        teacherName.includes(q);

      // Category match
      const matchesCategory =
        selectedCategory === "All Categories" || skill.category === selectedCategory;

      // Level match
      const matchesLevel =
        selectedLevel === "All" || skill.level === selectedLevel || skill.level === "All Levels";

      // Format match
      const matchesFormat =
        selectedFormat === "All" ||
        skill.format.toLowerCase().includes(selectedFormat.toLowerCase());

      // Rating match
      const matchesRating = skill.rating >= minRating;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel &&
        matchesFormat &&
        matchesRating
      );
    }).sort((a, b) => {
      if (sortBy === "popularity") return b.activeLearners - a.activeLearners;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return new Date(b.createdDate) - new Date(a.createdDate);
      return 0;
    });
  }, [
    skills,
    searchQuery,
    selectedCategory,
    selectedLevel,
    selectedFormat,
    minRating,
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedLevel("All");
    setSelectedFormat("All");
    setMinRating(0);
    setSortBy("popularity");
  };

  const handleOpenLearn = (skill, teacher) => {
    setSelectedSkill(skill);
    setSelectedTeacher(teacher);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Peer Skill Marketplace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Discover Skills & Mentors
        </h1>
        <p className="text-sm text-slate-600">
          Explore over 25+ subjects taught directly by enthusiastic community members.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {skillCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Filters Controls Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search skill title or teacher name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Level Filter */}
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            options={[
              { label: "All Skill Levels", value: "All" },
              { label: "Beginner", value: "Beginner" },
              { label: "Intermediate", value: "Intermediate" },
              { label: "Advanced", value: "Advanced" }
            ]}
          />

          {/* Format Filter */}
          <Select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            options={[
              { label: "All Formats", value: "All" },
              { label: "Online Only", value: "Online" },
              { label: "In-Person", value: "In-Person" },
              { label: "Hybrid", value: "Hybrid" }
            ]}
          />

          {/* Sort By */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { label: "Sort: Most Popular", value: "popularity" },
              { label: "Sort: Highest Rated", value: "rating" },
              { label: "Sort: Newest First", value: "newest" }
            ]}
          />
        </div>

        {/* Secondary Rating & Reset Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Minimum Rating:</span>
            <div className="flex items-center gap-1">
              {[0, 4.0, 4.5, 4.8].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(rate)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    minRating === rate
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {rate === 0 ? "Any Rating" : `${rate}+ ★`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Showing <strong>{filteredSkills.length}</strong> skills
            </span>
            {(searchQuery ||
              selectedCategory !== "All Categories" ||
              selectedLevel !== "All" ||
              selectedFormat !== "All" ||
              minRating > 0) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No skills match your filters"
          description="Try clearing your search query or selecting 'All Categories' to discover more offerings."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => {
            const teacher = initialUsers.find((u) => u.id === skill.teacherId);
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                teacher={teacher}
                onRequestLearn={handleOpenLearn}
              />
            );
          })}
        </div>
      )}

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
    </div>
  );
};

