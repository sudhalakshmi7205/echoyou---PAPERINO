'use client';

import { Zap, Plus } from 'lucide-react';

interface PredictedSkillsProps {
  preferredSkills: string[];
  technologies: string[];
  tools: string[];
  alreadyMatched: string[];
}

export default function PredictedSkills({
  preferredSkills,
  technologies,
  tools,
  alreadyMatched,
}: PredictedSkillsProps) {
  // Combine, deduplicate, and filter out already matched skills
  const allSkills = Array.from(new Set([...preferredSkills, ...technologies, ...tools]));
  const predictedSkills = allSkills.filter(
    (skill) => !alreadyMatched.some((matched) => matched.toLowerCase() === skill.toLowerCase())
  );

  return (
    <div className="bg-[#0f2b26] border border-[#2dd4bf]/20 rounded-3xl p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-6 h-6 text-[#2dd4bf]" />
        <h2 className="text-xl font-semibold text-white">Predicted Skills for This Role</h2>
      </div>
      <p className="text-zinc-400 text-sm mb-6">
        Common skills found in similar job descriptions that could strengthen your application
      </p>

      {predictedSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {predictedSkills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 text-[#2dd4bf]"
            >
              <Plus className="w-3 h-3" />
              {skill}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-zinc-400 text-sm italic">
          No additional skills predicted for this role.
        </p>
      )}
    </div>
  );
}
