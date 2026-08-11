'use client'

import React from 'react'

interface DsaOverviewScreenProps {
  onContinue: () => void
  onBackToLanding: () => void
}

export default function DsaOverviewScreen({ onContinue, onBackToLanding }: DsaOverviewScreenProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      
      {/* Background Dark Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#2a344a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="w-full max-w-3xl bg-[#0D111A]/90 border border-emerald-500/30 p-8 md:p-10 rounded-3xl backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,102,0.15)] space-y-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              DSA Masterclass Guide
            </span>
          </div>

          <button
            onClick={onBackToLanding}
            className="text-xs font-mono px-3.5 py-1.5 rounded-xl border border-zinc-800 hover:border-emerald-500/40 text-zinc-400 hover:text-emerald-300 transition-all bg-white/5"
          >
            &larr; Solar System
          </button>
        </div>

        {/* Developer Personal Message Card */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-black text-xl text-black shadow-[0_0_25px_rgba(0,255,102,0.3)] shrink-0">
              S
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                A Note from Sudha 👋
              </h1>
              <p className="text-xs text-emerald-400 font-mono font-semibold">
                Developer of EchoYou
              </p>
            </div>
          </div>

          <div className="bg-[#06080D]/80 border border-zinc-800/80 p-6 rounded-2xl space-y-4 text-xs text-zinc-300 leading-relaxed font-mono">
            <p className="text-sm font-bold text-white font-sans">
              "Hi there! I am Sudha, the developer of EchoYou."
            </p>
            <p>
              I am hereby guiding you to start your DSA preparation with a <strong className="text-emerald-400">Pattern Recognition Method</strong> rather than memorizing random solutions.
            </p>
            <p>
              Practicing Data Structures & Algorithms consistently every single day will naturally sharpen your problem-solving skills and make you confident in technical interviews. Don't get overwhelmed — tackle one pattern at a time, stay curious, and enjoy the process! I'm cheering for you every step of the way. 🚀
            </p>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Step 1: Master the Pattern &rarr; Step 2: Solve Core LeetCode Problems &rarr; Step 3: Crack Technical Interviews</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(0,255,102,0.3)]"
          >
            Setup Preferences & Build Roadmap &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
