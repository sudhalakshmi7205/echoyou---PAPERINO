'use client';

import { Wand2, Loader2, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { ATSBulletAnalysis } from '@/lib/ai/ats-analyzer';

interface PowerEditProps {
  bulletAnalysis: ATSBulletAnalysis[];
  aiSuggestions: { improvedBio: string; addedSkills: string[] } | null;
  loadingSuggestions: boolean;
  isApplying: boolean;
  onFetchAISuggestions: () => void;
  onApplySuggestions: () => void;
  onDismissSuggestions: () => void;
  onPrint: () => void;
}

export default function PowerEdit({
  bulletAnalysis,
  aiSuggestions,
  loadingSuggestions,
  isApplying,
  onFetchAISuggestions,
  onApplySuggestions,
  onDismissSuggestions,
  onPrint,
}: PowerEditProps) {
  return (
    <div className="bg-[#081311] border border-[#0f766e]/30 rounded-3xl p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Wand2 className="w-6 h-6 text-[#2dd4bf]" />
        <h2 className="text-xl font-semibold text-white">Power Edit — AI Resume Optimizer</h2>
      </div>
      <p className="text-zinc-400 text-sm mb-8">
        Review and apply AI-generated improvements to your resume bullet points
      </p>

      <div className="space-y-6 mb-10">
        {bulletAnalysis.length > 0 ? (
          bulletAnalysis.map((bullet, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 bg-rose-500/5 border-l-2 border-rose-500 p-4 rounded-r-xl">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Before</div>
                <p className="text-zinc-300 text-sm line-through mb-3">{bullet.originalBullet}</p>
                <p className="text-rose-300/80 text-xs mt-auto">Issue: {bullet.issue}</p>
              </div>
              <div className="flex items-center justify-center lg:hidden text-zinc-500">
                <ArrowRight className="w-5 h-5 rotate-90" />
              </div>
              <div className="hidden lg:flex items-center justify-center text-zinc-500">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div className="flex-1 bg-[#2dd4bf]/5 border-l-2 border-[#2dd4bf] p-4 rounded-r-xl relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider">After</div>
                  <span className="bg-[#2dd4bf]/10 text-[#2dd4bf] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Improved
                  </span>
                </div>
                <p className="text-white text-sm mb-4">{bullet.suggestedImprovement}</p>
                <button className="mt-auto inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#2dd4bf]/50 text-[#2dd4bf] hover:bg-[#2dd4bf]/10 transition-colors">
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 text-sm italic">
            No bullet point improvements suggested.
          </p>
        )}
      </div>

      {aiSuggestions && (
        <div className="mb-10 bg-[#0a1a18] border border-[#0f766e]/40 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Review AI Optimizations</h3>
          <div className="mb-5">
            <h4 className="text-sm font-medium text-zinc-300 mb-2">Improved Bio</h4>
            <div className="bg-[#081311] p-4 rounded-xl border border-white/5 text-sm text-zinc-300">
              {aiSuggestions.improvedBio}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="text-sm font-medium text-zinc-300 mb-2">Recommended Skills Added</h4>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.addedSkills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-[#0f766e]/20 text-[#2dd4bf] px-2.5 py-1 rounded-md text-xs font-medium border border-[#0f766e]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={onApplySuggestions}
              disabled={isApplying}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isApplying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Apply Changes
            </button>
            <button 
              onClick={onDismissSuggestions}
              disabled={isApplying}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#0f766e]/20">
        <button
          onClick={onFetchAISuggestions}
          disabled={loadingSuggestions || isApplying}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-[#0f766e] to-[#2dd4bf] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loadingSuggestions ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          Improve Wording with AI
        </button>
        <button
          onClick={onPrint}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl border border-[#0f766e]/50 text-[#2dd4bf] hover:bg-[#0f766e]/10 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </button>
      </div>
    </div>
  );
}
