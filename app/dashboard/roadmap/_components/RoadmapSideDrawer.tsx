'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Video, Play, Bookmark, CheckSquare, Check, CheckCircle2, 
  ExternalLink, FileText, Code2, Sparkles, BookOpen, Clock, AlertTriangle, Lightbulb, FolderGit2
} from 'lucide-react'

export default function RoadmapSideDrawer({
  node,
  language,
  company,
  checkedItems,
  bookmarkedVideos,
  onClose,
  onToggleChecklist,
  onToggleBookmark,
  onOpenVideo,
  onOpenAiMentor,
  onMarkCompleted
}: {
  node: any
  language: string
  company: string
  checkedItems: Record<string, boolean>
  bookmarkedVideos: Record<string, boolean>
  onClose: () => void
  onToggleChecklist: (node: any, item: string, index: number) => void
  onToggleBookmark: (videoId: string) => void
  onOpenVideo: (video: any) => void
  onOpenAiMentor: (node: any) => void
  onMarkCompleted: (nodeId: string) => void
}) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'overview' | 'practice' | 'interview' | 'projects'>('checklist')

  const creatorInfo = node.creatorInfo || {
    channel: node.channel || 'Striver',
    title: node.videoTitle || `${node.name || node.title} Masterclass in ${language}`,
    videoId: '0bHoB39fZ3U',
    duration: node.estimatedHours || '45 mins',
    views: '1.2M'
  }

  const defaultChecklist = node.checklist || [
    `Theory & Core Concepts`,
    `Watch ${creatorInfo.channel} ${language} Video`,
    `Read Documentation & ${language} Notes`,
    `Solve ${node.practiceTitle || 'Practice Problems'}`,
    `Complete Concept Quiz`,
    `Revision & Mock Interview Practice`
  ]

  const interviewQs = node.interviewQuestions || [
    { 
      question: `What are the core fundamentals of ${node.name || node.title}?`, 
      level: "Beginner", 
      answer: `Key concepts include theoretical foundations, memory models, and standard syntax implementations in ${language}.` 
    },
    { 
      question: `How do you handle edge cases and concurrency issues in ${node.name || node.title}?`, 
      level: "Intermediate", 
      answer: `Ensure thread safety, boundary checks, and proper exception handling during execution.` 
    },
    { 
      question: `Explain how ${node.name || node.title} is evaluated in high-throughput applications at ${company || 'tier-1 tech firms'}.`, 
      level: "Advanced", 
      answer: `Focus on time complexity optimization, profiling memory allocations, and eliminating system bottlenecks.` 
    }
  ]

  const miniProjects = node.miniProjects || [
    `${node.name || 'Topic'} Hands-on CLI Utility`,
    `Production ${language} Microservice Module`
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-[#111620] border-l border-gray-700 w-full max-w-2xl h-full p-6 space-y-6 relative overflow-y-auto shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header Info */}
        <div className="space-y-2 pr-10">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
              node.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            }`}>
              {node.difficulty || 'Easy'}
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              +{node.xp || 30} XP Reward
            </span>
            <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
              {language}
            </span>
          </div>

          <h3 className="text-2xl font-black text-white">{node.name || node.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{node.description || node.overview}</p>
        </div>

        {/* AI Mentor Quick Launch Banner */}
        <div className="bg-[#0D1117] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
              🤖
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Need AI Doubt Resolution?</span>
              <span className="text-[10px] text-gray-400">Ask doubts, generate code examples, or take concept quizzes.</span>
            </div>
          </div>

          <button
            onClick={() => onOpenAiMentor(node)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-extrabold rounded-xl text-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Launch AI Mentor
          </button>
        </div>

        {/* Navigation Tabs inside Drawer */}
        <div className="flex border-b border-gray-800 gap-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'checklist', label: '✅ Checklist' },
            { id: 'overview', label: '📖 Deep-Dive' },
            { id: 'practice', label: '💻 Practice' },
            { id: 'interview', label: '💼 Interview Qs' },
            { id: 'projects', label: '🛠️ Projects' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
                activeTab === tab.id ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Action Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            {/* Recommended Video Section */}
            <div className="bg-[#0D1117] border border-red-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-400" />
                  Recommended {language} Video Lesson
                </span>
                <span className="text-[11px] text-gray-400 font-bold">{creatorInfo.duration} • {creatorInfo.views} Views</span>
              </div>

              <div className="flex flex-wrap items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold shrink-0">
                    <Play className="w-5 h-5 fill-red-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{creatorInfo.title}</div>
                    <div className="text-[11px] text-gray-400">Creator: <span className="text-purple-300 font-bold">{creatorInfo.channel}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleBookmark(creatorInfo.videoId)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      bookmarkedVideos[creatorInfo.videoId] 
                        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenVideo({
                      videoId: creatorInfo.videoId,
                      title: creatorInfo.title,
                      creator: creatorInfo.channel,
                      node
                    })}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Watch Video
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                Step-by-Step Learning Checklist
              </h4>

              <div className="space-y-2">
                {defaultChecklist.map((item: string, idx: number) => {
                  const itemKey = `${node.id}_${item}`
                  const isChecked = checkedItems[itemKey] || node.status === 'completed'
                  return (
                    <div
                      key={idx}
                      onClick={() => onToggleChecklist(node, item, idx)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                        isChecked 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                          : 'bg-white/5 border-white/5 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-gray-950' : 'border-gray-600'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 text-gray-950 stroke-[3]" />}
                        </div>
                        <span>{item}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal">+10 XP</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Topic Overview Deep-Dive */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#0D1117] border border-gray-800">
                <span className="text-gray-400 text-[10px] block font-bold">IMPORTANCE</span>
                <span className="text-emerald-400 font-extrabold">High Priority</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-gray-800">
                <span className="text-gray-400 text-[10px] block font-bold">INTERVIEW FREQ</span>
                <span className="text-purple-300 font-extrabold">85% Asked</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-gray-800">
                <span className="text-gray-400 text-[10px] block font-bold">ESTIMATED TIME</span>
                <span className="text-cyan-400 font-extrabold">{node.estimatedHours || node.estimatedDuration || '2 Hours'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D1117] border border-gray-800">
                <span className="text-gray-400 text-[10px] block font-bold">PREREQUISITES</span>
                <span className="text-orange-300 font-extrabold">{node.prerequisites || 'Core Syntax'}</span>
              </div>
            </div>

            {/* Why Learn This */}
            <div className="p-4 bg-[#0D1117] border border-purple-500/30 rounded-2xl space-y-2">
              <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-purple-400" /> Why Learn This?
              </span>
              <p className="text-gray-300 leading-relaxed">{node.whyLearnThis || `Crucial topic for mastering ${node.name} and building production applications in ${language}.`}</p>
            </div>

            {/* Learning Objectives */}
            <div className="p-4 bg-[#0D1117] border border-gray-800 rounded-2xl space-y-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] block">Learning Objectives</span>
              <ul className="space-y-1.5 text-gray-300 list-disc list-inside">
                {(node.learningObjectives || [
                  `Understand internal memory layout and ${language} execution model.`,
                  `Analyze time and space complexity trade-offs for ${node.name}.`,
                  `Handle zero-boundary, null pointer, and concurrency edge cases.`
                ]).map((obj: string, i: number) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Beginner Mistakes */}
            <div className="p-4 bg-[#0D1117] border border-red-500/30 rounded-2xl space-y-2">
              <span className="font-bold text-red-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Common Beginner Mistakes
              </span>
              <ul className="space-y-1 text-gray-300 list-disc list-inside">
                {(node.beginnerMistakes || [
                  "Not practicing hands-on code and relying purely on passive watching.",
                  "Ignoring boundary conditions and memory allocation overhead."
                ]).map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Practice Links */}
        {activeTab === 'practice' && (
          <div className="space-y-3 text-xs">
            <a
              href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(node.practiceTitle || node.name)}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#0D1117] border border-cyan-500/30 text-cyan-300 rounded-2xl hover:bg-cyan-500/10 transition-all font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5"><Code2 className="w-5 h-5" /> Practice {node.practiceTitle || node.name} on LeetCode</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={`https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(node.name || 'DSA')}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#0D1117] border border-emerald-500/30 text-emerald-300 rounded-2xl hover:bg-emerald-500/10 transition-all font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5"><BookOpen className="w-5 h-5" /> Explore GeeksforGeeks Article & Practice</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={`https://neetcode.io/practice`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-[#0D1117] border border-purple-500/30 text-purple-300 rounded-2xl hover:bg-purple-500/10 transition-all font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5"><BookOpen className="w-5 h-5" /> View NeetCode Algorithmic Pattern</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Tab 4: Interview Questions */}
        {activeTab === 'interview' && (
          <div className="space-y-3 text-xs">
            {interviewQs.map((q: any, i: number) => (
              <div key={i} className="p-4 bg-[#0D1117] border border-gray-800 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-purple-400 uppercase tracking-wider text-[10px]">{q.level || 'Intermediate'} Question</span>
                  <span className="text-[10px] text-cyan-400 font-bold">Frequently Asked</span>
                </div>
                <p className="text-gray-200 font-semibold">{q.question}</p>
                <p className="text-gray-400 italic bg-white/5 p-3 rounded-xl border border-white/5">{q.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Topic Mini Projects */}
        {activeTab === 'projects' && (
          <div className="space-y-3 text-xs">
            {miniProjects.map((proj: string, i: number) => (
              <div key={i} className="p-4 bg-[#0D1117] border border-purple-500/30 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <FolderGit2 className="w-4 h-4" /> Mini Project #{i + 1}
                </div>
                <p className="text-white font-bold text-sm">{proj}</p>
                <p className="text-gray-400">Implement this hands-on project in {language} to solidify your mastery of {node.name || node.title}.</p>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Completion Action Button */}
        <div className="pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={() => {
              onMarkCompleted(node.id)
              onClose()
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark Topic Mastered (+{node.xp || 30} XP)
          </button>
        </div>
      </motion.div>
    </div>
  )
}
