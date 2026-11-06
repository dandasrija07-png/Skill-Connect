import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Select } from "../common/Select";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Repeat, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const ExchangeRequestModal = ({
  isOpen,
  onClose,
  targetUser,
  matchData,
  onSubmit
}) => {
  const { currentUser } = useAuth();

  const myOfferedOptions = currentUser?.skillsOffered || ["General Mentoring"];
  const theirOfferedOptions = targetUser?.skillsOffered || ["General Learning"];

  const [formData, setFormData] = useState({
    offeredSkill: myOfferedOptions[0] || "",
    wantedSkill: theirOfferedOptions[0] || "",
    totalPlannedSessions: "4",
    note: `Hi ${targetUser?.name || "there"}, I'd love to exchange skills with you! I can teach you ${myOfferedOptions[0] || "my skill"} in return for your guidance in ${theirOfferedOptions[0] || "your skill"}.`
  });

  const [loading, setLoading] = useState(false);

  if (!targetUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSubmit({
        targetUserId: targetUser.id,
        targetUserName: targetUser.name,
        targetUserAvatar: targetUser.avatar,
        offeredSkill: formData.offeredSkill,
        wantedSkill: formData.wantedSkill,
        totalPlannedSessions: Number(formData.totalPlannedSessions) || 4,
        matchScore: matchData?.matchScore || "Mutual Skill Exchange",
        note: formData.note
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Propose a Skill Exchange"
      subtitle={`Create a mutual skill swap agreement with ${targetUser.name}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Match Highlight Header */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <img
            src={targetUser.avatar}
            alt={targetUser.name}
            className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900">{targetUser.name}</h4>
            <p className="text-xs text-indigo-700 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {matchData?.matchScore || "Mutual Community Match"}
            </p>
          </div>
        </div>

        {/* What you teach */}
        <Select
          label="Skill You Will Teach *"
          value={formData.offeredSkill}
          onChange={(e) => setFormData({ ...formData, offeredSkill: e.target.value })}
          options={myOfferedOptions}
        />

        {/* What they teach */}
        <Select
          label={`Skill ${targetUser.name} Will Teach You *`}
          value={formData.wantedSkill}
          onChange={(e) => setFormData({ ...formData, wantedSkill: e.target.value })}
          options={theirOfferedOptions}
        />

        {/* Planned sessions */}
        <Select
          label="Total Planned Exchange Sessions"
          value={formData.totalPlannedSessions}
          onChange={(e) =>
            setFormData({ ...formData, totalPlannedSessions: e.target.value })
          }
          options={[
            { label: "2 Sessions (Quick Swap)", value: "2" },
            { label: "4 Sessions (Recommended)", value: "4" },
            { label: "6 Sessions (Deep Dive)", value: "6" },
            { label: "8 Sessions (Comprehensive)", value: "8" }
          ]}
        />

        {/* Proposal note */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Proposal Note
          </label>
          <textarea
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:border-indigo-600 focus:ring-indigo-500/20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Repeat}
            loading={loading}
          >
            Send Exchange Proposal
          </Button>
        </div>
      </form>
    </Modal>
  );
};

