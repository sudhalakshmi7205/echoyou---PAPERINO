'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, ZoomOut, Maximize2, Lock, Check, Sparkles, 
  ChevronRight, ChevronDown, Eye, RefreshCw, Compass
} from 'lucide-react'

export interface RoadmapNode {
  id: string
  name: string
  description?: string
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  xp?: number
  status?: 'completed' | 'unlocked' | 'locked'
  unlocked?: boolean
  children?: RoadmapNode[]
  checklist?: string[]
  creatorInfo?: any
  estimatedDuration?: string
  practiceTitle?: string
}

export default function InteractiveRoadmapGraph({ 
  tree, 
  onSelectNode,
  searchQuery,
  completedNodes = []
}: { 
  tree: RoadmapNode[]
  onSelectNode: (node: RoadmapNode) => void
  searchQuery?: string
  completedNodes?: string[]
}) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root': true,
    'phase_1': true,
    'phase_2': true,
    'node_1_1': true
  })
  const [focusMode, setFocusMode] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const expandAll = () => {
    const allIds: Record<string, boolean> = {}
    const collect = (nodes: RoadmapNode[]) => {
      nodes.forEach(n => {
        allIds[n.id] = true
        if (n.children) collect(n.children)
      })
    }
    collect(tree)
    setExpandedNodes(allIds)
  }

  const collapseAll = () => {
    setExpandedNodes({})
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  // Recursive Renderer for Nodes
  const renderTreeNode = (node: RoadmapNode, depth = 0, isLast = false) => {
    const isCompleted = completedNodes.includes(node.id) || node.status === 'completed'
    const isUnlocked = node.unlocked !== false || isCompleted || depth === 0
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes[node.id] !== false

    const matchesSearch = !searchQuery || node.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (focusMode && !isUnlocked) return null

    return (
      <div key={node.id} className="relative flex flex-col items-center my-4 transition-all">
        {/* Animated Connecting SVG Bezier Line */}
        {depth > 0 && (
          <svg className="w-full h-8 overflow-visible pointer-events-none mb-1">
            <path
              d="M 50% 0 L 50% 100%"
              stroke={isCompleted ? '#10B981' : isUnlocked ? '#A855F7' : '#374151'}
              strokeWidth="2.5"
              strokeDasharray={isUnlocked ? 'none' : '4 4'}
              fill="transparent"
            />
          </svg>
        )}

        {/* Node Box */}
        <motion.div
          whileHover={{ scale: isUnlocked ? 1.04 : 1 }}
          onClick={() => isUnlocked && onSelectNode(node)}
          className={`relative z-10 px-5 py-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3 shadow-xl ${
            matchesSearch && searchQuery ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : ''
          } ${
            isCompleted
              ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-[0_0_25px_rgba(16,185,129,0.25)]'
              : isUnlocked
              ? 'bg-[#111620] border-purple-500/80 text-white shadow-[0_0_30px_rgba(168,85,247,0.35)]'
              : 'bg-[#0D1117]/80 border-gray-800 text-gray-500 opacity-60 cursor-not-allowed'
          }`}
        >
          {/* Status Badge Icon */}
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs border ${
            isCompleted 
              ? 'bg-emerald-500 text-gray-950 border-emerald-400' 
              : isUnlocked 
              ? 'bg-purple-600 text-white border-purple-400' 
              : 'bg-gray-800 text-gray-600 border-gray-700'
          }`}>
            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : !isUnlocked ? <Lock className="w-3.5 h-3.5" /> : '⚡'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs text-white line-clamp-1">{node.name}</h4>
              {node.difficulty && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  node.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                }`}>
                  {node.difficulty}
                </span>
              )}
            </div>
            {node.description && <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{node.description}</p>}
          </div>

          {/* Expand/Collapse Chevron Button */}
          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors ml-2"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </motion.div>

        {/* Children Subtrees */}
        {hasChildren && isExpanded && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap justify-center gap-6 pt-4 relative"
            >
              {node.children!.map((child, idx) =>
                renderTreeNode(child, depth + 1, idx === node.children!.length - 1)
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full h-[650px] bg-[#0A0D14] border border-white/[0.08] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl select-none"
    >
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #A855F7 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating Graph Toolbar Controls */}
      <div className="absolute top-5 left-5 z-30 flex flex-wrap items-center gap-2 bg-[#111620]/90 border border-gray-800 p-2 rounded-2xl backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.8))}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.5))}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-gray-800 my-auto" />
        <span className="text-xs font-mono font-semibold text-cyan-400 px-2 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          {Math.round(zoom * 100)}%
        </span>
        <div className="h-4 w-px bg-gray-800 my-auto" />
        <button
          onClick={expandAll}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors"
        >
          Collapse All
        </button>
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            focusMode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
          }`}
        >
          {focusMode ? '🎯 Focus Mode ON' : 'Focus Mode'}
        </button>
      </div>

      {/* Interactive Drag & Zoom Canvas Container */}
      <div
        className="w-full h-full flex justify-center items-start pt-16 transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center top'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          {tree.map((rootNode, idx) => renderTreeNode(rootNode, 0, idx === tree.length - 1))}
        </div>
      </div>
    </div>
  )
}
