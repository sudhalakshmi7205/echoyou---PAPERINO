'use client'

import React, { useState } from 'react'
import { UserPreferences } from './PreferenceIntakeForm'
import NodeDetailModal, { RoadmapNodeData } from './NodeDetailModal'
import { exportRoadmapToPdf } from './RoadmapPdfExporter'

interface RoadmapFlowchartCanvasProps {
  preferences: UserPreferences
  studentName?: string
  onEditPreferences: () => void
}

type TabType = 'role' | 'dsa' | 'cs'

export default function RoadmapFlowchartCanvas({ preferences, studentName = 'Student', onEditPreferences }: RoadmapFlowchartCanvasProps) {
  const [activeTab, setActiveTab] = useState<TabType>('role')
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeData | null>(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // Node completion tracking state
  const [completedNodesMap, setCompletedNodesMap] = useState<Record<string, boolean>>({})

  // Generate dynamic nodes based on user preferences
  const buildRoleNodes = (): RoadmapNodeData[] => {
    const isShortTimeline = preferences.timeframe === '2 weeks'
    const isServiceOrStartup = preferences.companyTier !== 'Product-based'
    const isEntryLevel = preferences.targetRole === 'SDE-1' || preferences.targetRole === 'Frontend Engineer'

    const base: RoadmapNodeData[] = [
      {
        id: 'role_resume',
        title: 'Resume Building',
        description: 'Craft ATS-friendly technical resume highlighting projects and core skills.',
        category: 'role',
        status: 'unlocked',
        practiceLink: 'https://overleaf.com/'
      },
      {
        id: 'role_aptitude',
        title: 'Aptitude & OA Prep',
        description: 'Quantitative, logical reasoning, and Online Assessment speed coding rounds.',
        category: 'role',
        status: 'locked',
        parentId: 'role_resume'
      },
      {
        id: 'role_tech',
        title: 'Technical Round Prep',
        description: 'Live coding, code explanation, time complexity analysis, and OOP design.',
        category: 'role',
        status: 'locked',
        parentId: 'role_aptitude'
      }
    ]

    // Include System Design only if Product-based or 3+ month timeframe or Advanced
    if (!isShortTimeline && (!isServiceOrStartup || !isEntryLevel)) {
      base.push({
        id: 'role_system_design',
        title: 'System Design Basics',
        description: 'High-level architecture, scalability, load balancers, caching, and SQL vs NoSQL.',
        category: 'role',
        status: 'locked',
        parentId: 'role_tech'
      })
    }

    const lastParentId = base[base.length - 1].id
    base.push({
      id: 'role_hr',
      title: 'HR & Behavioral Prep',
      description: 'STAR method for behavioral questions, company research, and cultural fit.',
      category: 'role',
      status: 'locked',
      parentId: lastParentId
    })

    return base
  }

  const buildDsaNodes = (): RoadmapNodeData[] => {
    const isBeginner = preferences.dsaLevel === 'Beginner'
    const isAdvanced = preferences.dsaLevel === 'Advanced'

    const nodes: RoadmapNodeData[] = [
      { id: 'dsa_arrays', title: 'Arrays', description: 'Two pointers, sliding window, prefix sums, 2D matrices.', category: 'dsa', status: 'unlocked' },
      { id: 'dsa_strings', title: 'Strings', description: 'String manipulation, anagrams, palindrome algorithms.', category: 'dsa', status: 'locked', parentId: 'dsa_arrays' },
      { id: 'dsa_ll', title: 'Linked Lists', description: 'Singly, doubly, cycle detection (Floyd\'s algorithm), reversal.', category: 'dsa', status: 'locked', parentId: 'dsa_strings' },
      { id: 'dsa_sq', title: 'Stacks & Queues', description: 'Monotonic stack, queue implementation, expression evaluation.', category: 'dsa', status: 'locked', parentId: 'dsa_ll' },
      { id: 'dsa_trees', title: 'Trees', description: 'Binary trees, BST, traversals (BFS/DFS), height, diameter.', category: 'dsa', status: 'locked', parentId: 'dsa_sq' },
      { id: 'dsa_graphs', title: 'Graphs', description: 'Adjacency list, BFS, DFS, Topological Sort, Dijkstra\'s, Union Find.', category: 'dsa', status: 'locked', parentId: 'dsa_trees' },
      { id: 'dsa_dp', title: 'Dynamic Programming', description: 'Memoization vs Tabulation, Knapsack, LCS, LIS, Grid DP.', category: 'dsa', status: 'locked', parentId: 'dsa_graphs' },
      { id: 'dsa_greedy', title: 'Greedy', description: 'Activity selection, fractional knapsack, interval scheduling.', category: 'dsa', status: 'locked', parentId: 'dsa_dp' },
      { id: 'dsa_backtracking', title: 'Backtracking', description: 'Subsets, permutations, N-Queens, Sudoku solver.', category: 'dsa', status: 'locked', parentId: 'dsa_greedy' }
    ]

    // Adjust starting node status based on preferences
    if (!isBeginner) {
      // Unlock Arrays & Strings automatically for Intermediate/Advanced
      nodes[0].status = 'done'
      nodes[1].status = 'unlocked'
      if (isAdvanced) {
        nodes[1].status = 'done'
        nodes[2].status = 'done'
        nodes[3].status = 'done'
        nodes[4].status = 'done'
        nodes[5].status = 'unlocked' // Advanced starts closer to Graphs/DP
      }
    }

    return nodes
  }

  const buildCsNodes = (): RoadmapNodeData[] => {
    const isWeakCS = preferences.coreCsConfidence === 'Weak'

    const nodes: RoadmapNodeData[] = [
      { id: 'cs_oop', title: 'OOP Basics', description: 'Inheritance, Polymorphism, Encapsulation, Abstraction, SOLID principles.', category: 'cs', status: 'unlocked' },
      { id: 'cs_dbms', title: 'DBMS', description: 'ER diagrams, Relational algebra, SQL queries, Normalization, ACID properties.', category: 'cs', status: 'locked', parentId: 'cs_oop' },
      { id: 'cs_os', title: 'Operating Systems', description: 'Processes, Threads, Concurrency, Deadlocks, Memory Management, Paging.', category: 'cs', status: 'locked', parentId: 'cs_dbms' },
      { id: 'cs_cn', title: 'Computer Networks', description: 'OSI 7-Layer model, TCP/IP, HTTP/HTTPS, DNS, Sockets, IP Addressing.', category: 'cs', status: 'locked', parentId: 'cs_os' },
      { id: 'cs_sd', title: 'System Design Fundamentals', description: 'Monolith vs Microservices, Caching, Databases, Message Queues.', category: 'cs', status: 'locked', parentId: 'cs_cn' }
    ]

    // If Core CS confidence is weak, mark OS & DBMS as priority nodes
    if (isWeakCS) {
      nodes[1].description = '[PRIORITY] ' + nodes[1].description
      nodes[2].description = '[PRIORITY] ' + nodes[2].description
    }

    return nodes
  }

  // Get raw nodes for current tab
  const getRawNodes = (): RoadmapNodeData[] => {
    if (activeTab === 'role') return buildRoleNodes()
    if (activeTab === 'dsa') return buildDsaNodes()
    return buildCsNodes()
  }

  const rawNodes = getRawNodes()

  // Compute dynamic state (Locked / Active / Done) based on parent completion
  const processedNodes: RoadmapNodeData[] = rawNodes.map((node, index) => {
    const isManuallyDone = completedNodesMap[node.id]
    if (isManuallyDone) {
      return { ...node, status: 'done' }
    }

    if (index === 0 && node.status !== 'done') {
      return { ...node, status: 'unlocked' }
    }

    if (node.parentId) {
      const parentIsDone = completedNodesMap[node.parentId] || rawNodes.find(n => n.id === node.parentId)?.status === 'done'
      if (parentIsDone) {
        return { ...node, status: 'unlocked' }
      }
    }

    return { ...node, status: node.status === 'done' ? 'done' : 'locked' }
  })

  // Calculate top progress
  const completedCount = processedNodes.filter(n => n.status === 'done').length
  const totalCount = processedNodes.length

  const handleToggleDone = (nodeId: string, currentStatus: string) => {
    setCompletedNodesMap(prev => ({
      ...prev,
      [nodeId]: currentStatus !== 'done'
    }))
    setSelectedNode(prev => prev ? { ...prev, status: currentStatus === 'done' ? 'unlocked' : 'done' } : null)
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    const tabTitle = activeTab === 'role' ? 'Role-Based Prep' : activeTab === 'dsa' ? 'DSA Prep' : 'Core CS Concepts'
    await exportRoadmapToPdf({
      containerId: 'roadmap-flowchart-view',
      studentName,
      roadmapTitle: `${tabTitle} (${preferences.targetRole})`,
      completedCount,
      totalCount
    })
    setIsExportingPdf(false)
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white p-6 font-sans flex flex-col items-center">
      
      {/* Top Header Controls */}
      <div className="w-full max-w-3xl space-y-6 mb-8 border-b border-zinc-800 pb-6">
        
        {/* Subtitle / Preference Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">
              EchoRoadmap
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Target: <span className="text-[#00FF66] font-bold">{preferences.targetRole}</span> ({preferences.companyTier}) | DSA: {preferences.dsaLevel} | Time: {preferences.timeframe}
            </p>
          </div>

          <button
            onClick={onEditPreferences}
            className="text-xs font-mono px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
          >
            Edit Preferences
          </button>
        </div>

        {/* Tab Switcher & Progress & PDF Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {/* Tabs */}
          <div className="flex items-center border border-zinc-800 bg-black p-1 space-x-1">
            {[
              { id: 'role', label: 'Role-Based Prep' },
              { id: 'dsa',  label: 'DSA Prep' },
              { id: 'cs',   label: 'Core CS Concepts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 text-xs font-bold transition-colors uppercase ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-[#00FF66] border border-[#00FF66]'
                    : 'text-zinc-400 hover:text-white border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Progress & PDF */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-300 font-bold border border-zinc-800 px-3 py-2 bg-zinc-950">
              {completedCount}/{totalCount} completed
            </span>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 bg-[#00FF66] text-black font-bold text-xs uppercase hover:bg-[#00DD55] transition-colors disabled:opacity-50"
            >
              {isExportingPdf ? 'Exporting PDF...' : 'Download as PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Connected Flowchart Container */}
      <div 
        id="roadmap-flowchart-view" 
        className="w-full max-w-2xl bg-black p-8 flex flex-col items-center relative space-y-0"
      >
        {processedNodes.map((node, index) => {
          const isDone = node.status === 'done'
          const isUnlocked = node.status === 'unlocked'
          const isLocked = node.status === 'locked'
          const isLast = index === processedNodes.length - 1

          // Line color: parent done -> neon green, else thin grey
          const parentDone = node.parentId ? completedNodesMap[node.parentId] : (index > 0 ? processedNodes[index - 1].status === 'done' : true)

          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onClick={() => !isLocked && setSelectedNode(node)}
                className={`w-full max-w-md p-4 text-center border transition-all select-none ${
                  isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${
                  isDone
                    ? 'bg-[#0A3A1B] border-white text-white'
                    : isUnlocked
                    ? 'bg-black border-[#00FF66] text-white shadow-[0_0_15px_rgba(0,255,102,0.4)]'
                    : 'bg-black border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {/* SVG Checkmark Icon for Done nodes only */}
                  {isDone && (
                    <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="font-bold text-sm tracking-wide">{node.title}</span>
                </div>
              </div>

              {/* Vertical Connecting SVG Line */}
              {!isLast && (
                <div className="w-full flex justify-center py-2 relative">
                  <svg className="w-1 h-10 overflow-visible">
                    <line
                      x1="2"
                      y1="0"
                      x2="2"
                      y2="40"
                      stroke={parentDone && isDone ? '#00FF66' : '#3F3F46'}
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onToggleDone={handleToggleDone}
        />
      )}
    </div>
  )
}
