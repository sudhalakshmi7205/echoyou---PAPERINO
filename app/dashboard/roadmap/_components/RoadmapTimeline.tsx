'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, Flame, ShieldCheck, Award, Lock, Check, CheckCircle2,
  PlayCircle, Clock, Sparkles, CheckSquare, ChevronDown, ChevronUp,
  RefreshCw, BookOpen, Code2, Video, Target, Trophy, X, ExternalLink,
  Crown, Bookmark, FileText, AlertCircle, Play, Eye, Calendar, Sparkle, LayoutGrid, Network, ArrowLeft
} from 'lucide-react'
import InteractiveRoadmapGraph from './InteractiveRoadmapGraph'
import RoadmapSideDrawer from './RoadmapSideDrawer'
import PhaseBossGateModal from './PhaseBossGateModal'
import GamificationRanksBadge from './GamificationRanksBadge'
import RoadmapProjectsView from './RoadmapProjectsView'
import { RoadmapSettingsDrawer } from './RoadmapSettingsDrawer'
import FloatingProgressWidget from './FloatingProgressWidget'

/* ───────────────────── LANGUAGE-STRICT CREATOR DATABASE ───────────────────── */
const LANGUAGE_CREATORS: Record<string, any[]> = {
  Java: [
    { channel: 'Striver', title: 'Java & A2Z DSA Placement Series', videoId: '0bHoB39fZ3U', duration: '45 mins', views: '1.2M', date: '2024' },
    { channel: 'Kunal Kushwaha', title: 'Complete Java + Memory Architecture', videoId: 'rZ41y93Puu8', duration: '50 mins', views: '2.5M', date: '2024' },
    { channel: 'Apna College Java', title: 'Java One Shot for Placements', videoId: 'yRpLlJmRo2w', duration: '2 Hours', views: '4.1M', date: '2023' },
    { channel: 'CodeHelp Java', title: 'Java OOPs & Data Structures', videoId: 'bSrm9RXwBaI', duration: '1 Hour', views: '850K', date: '2024' },
    { channel: 'Bro Code Java', title: 'Java Programming Full Course', videoId: 'xk4_1vDrzzo', duration: '3.5 Hours', views: '3.8M', date: '2023' }
  ],
  Python: [
    { channel: 'freeCodeCamp Python', title: 'Python for Beginners Full Course', videoId: 'rfscVS0vtbw', duration: '4.5 Hours', views: '42M', date: '2023' },
    { channel: 'Programming with Mosh', title: 'Python Tutorial for Beginners', videoId: '_uQrJ0TkZlc', duration: '1 Hour', views: '35M', date: '2023' },
    { channel: 'CodeWithHarry Python', title: '100 Days of Python Code', videoId: '7wnove7yL0U', duration: '45 mins', views: '8.4M', date: '2024' },
    { channel: 'Bro Code Python', title: 'Python Full Course for Beginners', videoId: 'IXXz-B8-iMo', duration: '12 Hours', views: '5.2M', date: '2024' }
  ],
  'C++': [
    { channel: 'Striver C++', title: 'C++ Basics & STL Complete Series', videoId: 'EAR7De6Goz4', duration: '1 Hour', views: '1.8M', date: '2024' },
    { channel: 'Love Babbar', title: 'C++ Placement Course & DSA', videoId: 'WQoB2z67hvY', duration: '1.5 Hours', views: '6.2M', date: '2023' },
    { channel: 'CodeHelp C++', title: 'Master C++ Pointers & Memory', videoId: 'zuegQmMdy8M', duration: '50 mins', views: '1.1M', date: '2024' },
    { channel: 'Apna College C++', title: 'Complete C++ Tutorial Series', videoId: 'z9bZufPHFLU', duration: '2 Hours', views: '3.9M', date: '2023' }
  ],
  JavaScript: [
    { channel: 'Chai aur Code', title: 'JS in Hindi (DOM & Async JS)', videoId: '13gLB6hEEHE', duration: '1 Hour', views: '2.1M', date: '2024' },
    { channel: 'Hitesh Choudhary', title: 'JavaScript Engine & Execution Context', videoId: 'ZvbzSrg0afE', duration: '45 mins', views: '950K', date: '2024' },
    { channel: 'Akshay Saini', title: 'Namaste JavaScript Season 1 & 2', videoId: 'pN6jk0uUrD8', duration: '40 mins', views: '5.5M', date: '2023' },
    { channel: 'freeCodeCamp JS', title: 'Learn JavaScript Full Course', videoId: 'PkZNo7MFNFg', duration: '3 Hours', views: '18M', date: '2023' }
  ]
}

/* ───────────────────── PRESET DATA FOR DSA & CORE CS ───────────────────── */
const DSA_PATTERNS_24 = [
  { name: 'Arrays & Static Storage', level: 'Basic', count: '15 Qs', pattern: 'Contiguous Memory & Indices', creator: 'Striver' },
  { name: 'Strings & Character Arrays', level: 'Basic', count: '12 Qs', pattern: 'ASCII & Frequency Hashing', creator: 'Love Babbar' },
  { name: 'Two Pointers Technique', level: 'Basic', count: '10 Qs', pattern: 'Opposite & Same Direction Pointers', creator: 'NeetCode' },
  { name: 'Sliding Window Pattern', level: 'Basic', count: '10 Qs', pattern: 'Fixed & Variable Window Shrinking', creator: 'NeetCode' },
  { name: 'Prefix Sum & Difference Arrays', level: 'Basic', count: '8 Qs', pattern: 'Range Query Precomputation', creator: 'Kunal Kushwaha' },
  { name: 'Sorting & Searching Basics', level: 'Basic', count: '10 Qs', pattern: 'Merge Sort, Quick Sort, Comparator', creator: 'Striver' },
  { name: 'Hashing & Frequency Maps', level: 'Basic', count: '10 Qs', pattern: 'Chaining & Open Addressing', creator: 'CodeWithHarry' },
  { name: 'Recursion & Backtracking Basics', level: 'Medium', count: '12 Qs', pattern: 'Call Stack & Base Cases', creator: 'Striver' },
  { name: 'Linked List Reversals & Cycles', level: 'Medium', count: '12 Qs', pattern: 'Floyd Cycle Detection (Fast & Slow)', creator: 'Love Babbar' },
  { name: 'Stack & Monotonic Stack', level: 'Medium', count: '12 Qs', pattern: 'Next Greater Element & Expression Eval', creator: 'NeetCode' },
  { name: 'Queue & Monotonic Queue', level: 'Medium', count: '8 Qs', pattern: 'Sliding Window Maximum', creator: 'Kunal Kushwaha' },
  { name: 'Binary Search Space Reduction', level: 'Medium', count: '15 Qs', pattern: 'Search Space & Answer Predicate', creator: 'Striver' },
  { name: 'Trees & DFS/BFS Traversals', level: 'Medium', count: '18 Qs', pattern: 'Preorder, Inorder, Postorder & Level Order', creator: 'Striver' },
  { name: 'Binary Search Trees (BST)', level: 'Medium', count: '12 Qs', pattern: 'BST Inorder Property & Deletion', creator: 'Apna College' },
  { name: 'Heaps & Priority Queues', level: 'Medium', count: '10 Qs', pattern: 'K-th Top Elements & Heapify', creator: 'NeetCode' },
  { name: 'Trie (Prefix Trees)', level: 'Pro', count: '8 Qs', pattern: 'Prefix Matching & Bitwise Trie', creator: 'Striver' },
  { name: 'Graph Traversal (BFS & DFS)', level: 'Pro', count: '15 Qs', pattern: 'Adjacency List & Connected Components', creator: 'Striver' },
  { name: 'Graph Shortest Paths (Dijkstra/Bellman)', level: 'Pro', count: '12 Qs', pattern: 'Priority Queue Relaxation', creator: 'Take U Forward' },
  { name: 'Topological Sort & Kahn\'s Algorithm', level: 'Pro', count: '10 Qs', pattern: 'DAG Dependency Ordering', creator: 'Striver' },
  { name: 'Disjoint Set Union (DSU / Kruskal)', level: 'Pro', count: '10 Qs', pattern: 'Path Compression & Rank Union', creator: 'Striver' },
  { name: 'Dynamic Programming (1D & 2D Memoization)', level: 'Pro', count: '20 Qs', pattern: 'Overlapping Subproblems & State Transition', creator: 'Striver' },
  { name: 'Dynamic Programming (Knapsack & DP on Grids)', level: 'Pro', count: '15 Qs', pattern: 'Tabulation & Space Optimization', creator: 'NeetCode' },
  { name: 'Bit Manipulation & Masking', level: 'Pro', count: '8 Qs', pattern: 'Bitwise Operators & Subset Masking', creator: 'Kunal Kushwaha' },
  { name: 'Segment Tree & Fenwick Tree', level: 'Pro', count: '6 Qs', pattern: 'Point Update & Range Query', creator: 'Striver' },
]

const CORE_CS_TROPHY_ROAD = [
  {
    id: 'os',
    title: 'Operating Systems (OS)',
    icon: '💻',
    difficulty: 'Core Fundamental',
    resources: 'Gate Smashers • Jenny\'s Lectures • Neso Academy',
    concepts: ['Process vs Thread Synchronization', 'CPU Scheduling (Round Robin, SJF)', 'Semaphores & Mutex Deadlocks', 'Memory Paging & Virtual Memory', 'Page Replacement Algorithms'],
    interviewQ: ['Explain Mutex vs Semaphore.', 'What is Thrashing & Page Faults in OS?', 'Difference between Multiprogramming & Multitasking.']
  },
  {
    id: 'cn',
    title: 'Computer Networks (CN)',
    icon: '🌐',
    difficulty: 'Core Fundamental',
    resources: 'Neso Academy • Gate Smashers • Fireship',
    concepts: ['OSI 7-Layer Model & Encapsulation', 'TCP 3-Way Handshake & UDP Protocol', 'HTTP/1.1 vs HTTP/2 vs HTTP/3 & SSL/TLS', 'DNS Resolution & Domain Hierarchy', 'IP Subnetting & CIDR Notation'],
    interviewQ: ['What happens step-by-step when typing google.com?', 'Explain TCP Flow Control & Congestion Window.', 'Difference between Gateway & Router.']
  },
  {
    id: 'dbms',
    title: 'Database Management Systems (DBMS)',
    icon: '🗄️',
    difficulty: 'Core Fundamental',
    resources: 'Gate Smashers • TechTFQ • CodeWithHarry',
    concepts: ['ER Diagram & Relational Schemas', 'Normalization (1NF, 2NF, 3NF, BCNF)', 'ACID Properties & Transaction Isolation', 'SQL Joins, Subqueries & Window Functions', 'B-Trees & B+ Tree Database Indexing'],
    interviewQ: ['What is the difference between WHERE and HAVING?', 'Explain ACID Properties with Real-World Bank Example.', 'Why do we use Database Indexing?']
  },
  {
    id: 'oop',
    title: 'Object-Oriented Programming (OOP)',
    icon: '🧱',
    difficulty: 'Core Fundamental',
    resources: 'Kunal Kushwaha • Love Babbar • Bro Code',
    concepts: ['Encapsulation & Data Hiding', 'Inheritance & Polymorphism (Overloading vs Overriding)', 'Abstraction, Interfaces & Abstract Classes', 'Virtual Functions & VTABLE', 'SOLID Design Principles'],
    interviewQ: ['What is the difference between Abstraction & Encapsulation?', 'Explain the 5 SOLID Design Principles.', 'Why are Multiple Inheritances restricted in Java?']
  },
  {
    id: 'sys_design',
    title: 'System Design Basics & Scalability',
    icon: '🏗️',
    resources: 'Gaurav Sen • ByteByteGo • Fireship',
    difficulty: 'High Scale Architecture',
    concepts: ['Horizontal vs Vertical Scaling', 'Load Balancing Algorithms (Round Robin, Consistent Hashing)', 'Caching Strategies (Redis & Memcached)', 'Database Sharding & Replication', 'Message Queues (Kafka & RabbitMQ)'],
    interviewQ: ['How would you scale a web application to 10M daily users?', 'Explain Cache Invalidation Strategies.', 'What is the CAP Theorem in Distributed Systems?']
  },
  {
    id: 'dev_tools',
    title: 'Linux CLI, Git & REST APIs',
    icon: '⚡',
    resources: 'Hitesh Choudhary • Chai aur Code • Bro Code',
    difficulty: 'Developer Tools',
    concepts: ['Linux Shell Commands & Permissions (chmod/chown)', 'Git Branching, Merging & Rebase Workflows', 'RESTful API Conventions & HTTP Status Codes', 'JWT Authentication & OAuth 2.0 Basics'],
    interviewQ: ['Explain Git Rebase vs Git Merge.', 'What are idempotent HTTP methods?', 'How do JWT tokens work for API auth?']
  }
]

const SAMPLE_ROLE_WORLD_MAP = {
  role: 'Software Engineer',
  company: 'Google',
  duration: '90 Days',
  skillLevel: 'Intermediate',
  language: 'Java',
  totalXP: 6000,
  phases: [
    {
      id: 1,
      title: 'Phase 1: Programming & Core Syntax',
      description: 'Master core language syntax, memory layout, control flow, and OOP foundation.',
      duration: '2 Weeks',
      badge: 'Syntax Warrior',
      xpReward: 500,
      unlocked: true,
      completed: false,
      nodes: [
        {
          id: 'node_1_1',
          name: 'Java Variables & Memory Stack vs Heap',
          description: 'Master primitive data types, reference memory, stack frames, and heap allocation.',
          difficulty: 'Easy',
          estimatedDuration: '45 mins',
          xp: 30,
          status: 'completed',
          unlocked: true,
          channel: 'Kunal Kushwaha',
          videoTitle: 'Java Primitives & Memory Architecture Masterclass',
          videoId: 'rZ41y93Puu8',
          views: '2.5M',
          date: '2024',
          practiceTitle: 'LeetCode 217 - Contains Duplicate',
          practiceLink: 'https://leetcode.com/problems/contains-duplicate/',
          checklist: [
            'Watch Kunal Kushwaha Memory Architecture Video',
            'Read Stack vs Heap Memory Layout Notes',
            'Write 5 Primitive Variable Programs',
            'Solve Type Casting Challenge',
            'Revise Key Concepts'
          ]
        },
        {
          id: 'node_1_2',
          name: 'Control Flow, Conditional Branching & Loops',
          description: 'If-else logic, switch statements, for/while loops, and loop break/continue optimization.',
          difficulty: 'Easy',
          estimatedDuration: '45 mins',
          xp: 30,
          status: 'unlocked',
          unlocked: true,
          channel: 'Striver',
          videoTitle: 'Loop Patterns & Logic Building Series',
          videoId: '0bHoB39fZ3U',
          views: '1.2M',
          date: '2024',
          practiceTitle: 'LeetCode 26 - Remove Duplicates from Sorted Array',
          practiceLink: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
          checklist: [
            'Watch Striver Loop Patterns Video',
            'Implement 3 Star Pattern Algorithms',
            'Solve LeetCode 26 - Remove Duplicates',
            'Complete Loop Performance Quiz',
            'Revise Key Concepts'
          ]
        },
        {
          id: 'node_1_3',
          name: 'Object-Oriented Programming (OOP) Pillars',
          description: 'Classes, Objects, Inheritance, Polymorphism, Abstraction, and Encapsulation.',
          difficulty: 'Easy',
          estimatedDuration: '1.5 Hours',
          xp: 40,
          status: 'locked',
          unlocked: false,
          channel: 'Apna College Java',
          videoTitle: 'Complete OOPs in Java Tutorial',
          videoId: 'yRpLlJmRo2w',
          views: '4.1M',
          date: '2023',
          practiceTitle: 'Design Banking Management System Classes',
          practiceLink: 'https://leetcode.com/problemset/all/',
          checklist: [
            'Watch Encapsulation & Abstraction Lectures',
            'Implement Method Overloading & Overriding',
            'Learn Interface vs Abstract Class',
            'Solve 5 OOP Inheritance Questions',
            'Revise Key Concepts'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Phase 2: Problem Solving & Essential DSA',
      description: 'Master Arrays, Strings, Two Pointers, Sliding Window, and Binary Search.',
      duration: '3 Weeks',
      badge: 'Algorithm Knight',
      xpReward: 750,
      unlocked: false,
      completed: false,
      nodes: [
        {
          id: 'node_2_1',
          name: 'Arrays & HashMap Frequency Patterns',
          description: 'Array operations, HashMaps, HashSets, Prefix Sum, and Kadane\'s Algorithm.',
          difficulty: 'Easy',
          estimatedDuration: '1.5 Hours',
          xp: 40,
          status: 'locked',
          unlocked: false,
          channel: 'Striver',
          videoTitle: 'A2Z DSA Course - Array Patterns',
          videoId: '0bHoB39fZ3U',
          views: '1.8M',
          date: '2024',
          practiceTitle: 'LeetCode 1 - Two Sum',
          practiceLink: 'https://leetcode.com/problems/two-sum/',
          checklist: [
            'Watch Striver Array Series Video',
            'Solve Two Sum (LeetCode 1)',
            'Solve Valid Anagram (LeetCode 242)',
            'Implement Kadane\'s Max Subarray Algorithm',
            'Revise Key Concepts'
          ]
        }
      ]
    }
  ]
}

interface RoadmapTimelineProps {
  initialData?: any
  preferences?: any
  onChangeUniverse?: () => void
  onSettingsRegenerate?: (updatedPreferences: any) => void
}

export default function RoadmapTimeline({ initialData, preferences, onChangeUniverse, onSettingsRegenerate }: RoadmapTimelineProps) {
  /* ── Category Selection & View Mode ── */
  const [activeCategory, setActiveCategory] = useState<'role' | 'dsa' | 'cs'>(preferences?.universe || 'role')
  const [viewMode, setViewMode] = useState<'graph' | 'card'>('graph')
  const [showSettings, setShowSettings] = useState(false)

  /* ── Setup Form State ── */
  const [form, setForm] = useState({
    role: preferences?.role || 'Software Engineer',
    company: preferences?.company || 'Google',
    duration: preferences?.duration || '90 Days',
    language: preferences?.language || 'Java',
    showAlternatives: false
  })

  const [loading, setLoading] = useState(false)
  const [worldData, setWorldData] = useState<any>(initialData || SAMPLE_ROLE_WORLD_MAP)
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(['node_1_1'])

  /* ── Fetch Saved Progress from Database on Mount ── */
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/roadmap/progress')
        const data = await res.json()
        if (data.progress) {
          if (data.progress.completedNodes) setCompletedNodeIds(data.progress.completedNodes)
          if (data.progress.role) setForm(prev => ({ ...prev, role: data.progress.role, company: data.progress.company || 'Google', language: data.progress.language || 'Java' }))
        }
      } catch (err) {
        console.error('Error loading roadmap progress from DB:', err)
      }
    }
    loadProgress()
  }, [])

  /* ── Selected Node Modal & Boss Battle Modal ── */
  const [selectedNodeModal, setSelectedNodeModal] = useState<any | null>(null)
  const [activeBossModal, setActiveBossModal] = useState<{ phaseTitle: string } | null>(null)

  /* ── Embedded YouTube Player State ── */
  const [embeddedVideo, setEmbeddedVideo] = useState<{ videoId: string, title: string, creator: string, node: any } | null>(null)
  const [videoWatchConfirmed, setVideoWatchConfirmed] = useState(false)

  /* ── AI Mentor Suggestions Toast ── */
  const [aiMentorToast, setAiMentorToast] = useState<string | null>(null)

  /* ── Bookmarked Lessons State ── */
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Record<string, boolean>>({})

  /* ── Checked Checklist Items ── */
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'node_1_1_Watch Kunal Kushwaha Memory Architecture Video': true,
    'node_1_1_Read Stack vs Heap Memory Layout Notes': true,
    'node_1_1_Write 5 Primitive Variable Programs': true,
    'node_1_1_Solve Type Casting Challenge': true,
    'node_1_1_Revise Key Concepts': true,
  })

  /* ── Phase Celebration Modal ── */
  const [celebrationModal, setCelebrationModal] = useState<any | null>(null)

  /* ── DSA Level ── */
  const [dsaLevel, setDsaLevel] = useState<'basic' | 'medium' | 'pro'>('medium')

  /* ── Search & Filter State ── */
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')

  /* ── AI Mentor Interactive Drawer State ── */
  const [aiMentorTopic, setAiMentorTopic] = useState<any | null>(null)
  const [aiMentorTab, setAiMentorTab] = useState<'explain' | 'quiz' | 'flashcards' | 'interview'>('explain')
  const [aiUserQuestion, setAiUserQuestion] = useState('')
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: string, text: string }>>([
    { role: 'assistant', text: 'Hello! I am your AI Career Mentor. Ask me any doubt about this topic, or request a quick quiz!' }
  ])
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({})

  /* ── AI Mentor Chat Handler ── */
  const handleAskAiMentor = async () => {
    if (!aiUserQuestion.trim() || isAiThinking) return
    const userMsg = aiUserQuestion.trim()
    setAiUserQuestion('')
    setAiChatMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setIsAiThinking(true)

    try {
      const res = await fetch('/api/roadmap/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiMentorTopic?.name || aiMentorTopic?.title,
          question: userMsg,
          language: form.language,
          role: form.role
        })
      })
      const data = await res.json()
      setAiChatMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Here is a breakdown of the concept: Focus on the core memory structure, practice time complexity analysis, and implement edge cases.' }])
    } catch {
      setAiChatMessages(prev => [...prev, { role: 'assistant', text: `Here is a quick AI explanation for ${userMsg}: Focus on key memory layout, write modular code, and test edge cases.` }])
    } finally {
      setIsAiThinking(false)
    }
  }

  /* ── Dummy AI Quizzes Generator for Selected Topic ── */
  const getTopicQuiz = (topicName: string) => [
    {
      q: `What is the primary advantage of ${topicName} in software engineering?`,
      options: ['O(1) memory lookup & execution speed', 'Eliminates all runtime exceptions', 'Requires no compilation', 'Works only on single-threaded CPUs'],
      correct: 0
    },
    {
      q: `Which common mistake occurs most frequently when implementing ${topicName}?`,
      options: ['Off-by-one index boundary errors', 'Infinite recursion memory leak', 'Ignoring null pointer validation', 'All of the above'],
      correct: 3
    },
    {
      q: `In a ${form.company} technical interview, how is ${topicName} evaluated?`,
      options: ['Syntax memorization only', 'Algorithmic efficiency & handling edge cases', 'Number of code lines written', 'Using third-party libraries'],
      correct: 1
    }
  ]

  /* ── AI Roadmap Generator ── */
  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      if (result.phases) {
        setWorldData(result)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to generate custom roadmap.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Toggle Bookmark ── */
  const toggleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }))
  }

  /* ── Checklist Item Toggle with AI Mentor Guidance ── */
  const toggleChecklist = (node: any, item: string, index: number) => {
    // AI Mentor Check: Recommend finishing Theory video (item index 0) before practice
    if (index > 1 && !checkedItems[`${node.id}_${node.checklist?.[0]}`]) {
      setAiMentorToast("💡 AI Mentor Suggestion: We recommend watching the Theory Video before attempting practice problems!")
      setTimeout(() => setAiMentorToast(null), 4000)
    }

    const key = `${node.id}_${item}`
    const isNowChecked = !checkedItems[key]
    
    const updated = { ...checkedItems, [key]: isNowChecked }
    setCheckedItems(updated)

    // Check if ALL checklist items for this node are done
    const checklist = node.checklist || []
    const allChecked = checklist.length > 0 && checklist.every((ci: string) => updated[`${node.id}_${ci}`])
    if (allChecked && node.status !== 'completed') {
      markNodeCompleted(node.id)
    }
  }

  /* ── Mark Node Completed & Unlock Next Node ── */
  const markNodeCompleted = (nodeId: string) => {
    let newlyCompletedPhase: any = null

    const updatedPhases = worldData.phases.map((phase: any) => {
      const nodesList = phase.nodes || phase.tasks || phase.skills || []
      const updatedNodes = nodesList.map((n: any) => {
        if (n.id === nodeId) {
          return { ...n, status: 'completed', unlocked: true }
        }
        return n
      })

      for (let i = 0; i < updatedNodes.length; i++) {
        if (updatedNodes[i].status === 'completed' && updatedNodes[i + 1]) {
          if (updatedNodes[i + 1].status === 'locked' || !updatedNodes[i + 1].unlocked) {
            updatedNodes[i + 1].status = 'unlocked'
            updatedNodes[i + 1].unlocked = true
          }
        }
      }

      const allNodesCompleted = updatedNodes.length > 0 && updatedNodes.every((n: any) => n.status === 'completed')
      if (allNodesCompleted && !phase.completed) {
        newlyCompletedPhase = { ...phase, title: phase.title, badge: phase.badge || 'Phase Master' }
      }

      return {
        ...phase,
        completed: allNodesCompleted,
        nodes: updatedNodes
      }
    })

    for (let i = 0; i < updatedPhases.length; i++) {
      if (updatedPhases[i].completed && updatedPhases[i + 1]) {
        updatedPhases[i + 1].unlocked = true
        const nextNodes = updatedPhases[i + 1].nodes || updatedPhases[i + 1].tasks || []
        if (nextNodes[0]) {
          nextNodes[0].unlocked = true
          nextNodes[0].status = 'unlocked'
        }
      }
    }

    setWorldData({ ...worldData, phases: updatedPhases })

    if (newlyCompletedPhase) {
      setCelebrationModal(newlyCompletedPhase)
    }
  }

  /* ── Confirm Video Completion Handler ── */
  const handleConfirmVideoCompletion = () => {
    if (embeddedVideo && embeddedVideo.node) {
      const firstChecklist = embeddedVideo.node.checklist?.[0] || 'Watch Video'
      const key = `${embeddedVideo.node.id}_${firstChecklist}`
      setCheckedItems(prev => ({ ...prev, [key]: true }))
      
      setVideoWatchConfirmed(true)
      setTimeout(() => {
        setVideoWatchConfirmed(false)
        setEmbeddedVideo(null)
      }, 1500)
    }
  }

  /* ── Stats Calculations ── */
  const totalNodes = worldData.phases?.reduce((acc: number, p: any) => {
    const list = p.nodes || p.tasks || p.skills || []
    return acc + list.length
  }, 0) || 0

  const completedNodes = worldData.phases?.reduce((acc: number, p: any) => {
    const list = p.nodes || p.tasks || p.skills || []
    return acc + list.filter((n: any) => n.status === 'completed').length
  }, 0) || 0

  const overallPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
  
  const totalEarnedXP = worldData.phases?.reduce((acc: number, p: any) => {
    const list = p.nodes || p.tasks || p.skills || []
    const nodeXP = list.reduce((nAcc: number, n: any) => n.status === 'completed' ? nAcc + (n.xp || 30) : nAcc, 0)
    return acc + nodeXP + (p.completed ? (p.xpReward || 500) : 0)
  }, 300) || 300

  const userLevel = Math.floor(totalEarnedXP / 250) + 1
  const totalBadges = worldData.phases?.filter((p: any) => p.completed)?.length || 1

  /* ── Get Language Creator Recommendations ── */
  const currentLanguageCreators = LANGUAGE_CREATORS[form.language] || LANGUAGE_CREATORS['Java']

  return (
    <div className="space-y-8 w-full max-w-[1800px] mx-auto px-4 sm:px-6 pb-24 relative">

      {/* AI Mentor Toast Notification */}
      <AnimatePresence>
        {aiMentorToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-[#111620] border border-cyan-500/60 p-4 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] max-w-md text-xs font-bold text-cyan-300 flex items-center gap-3 backdrop-blur-xl"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{aiMentorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CLEAN SAAS HEADER & BREADCRUMB NAVIGATION ═══ */}
      <div className="bg-[#111620]/90 border border-white/[0.08] rounded-2xl p-4 sm:p-5 backdrop-blur-2xl shadow-xl space-y-4">
        {/* Top Breadcrumb & Return Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => { if (onChangeUniverse) onChangeUniverse() }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white rounded-xl border border-white/10 transition-all font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portals
            </button>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-gray-400 font-medium hidden sm:inline">Dashboard</span>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-gray-400 font-medium hidden sm:inline">EchoRoadmap</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-bold">{activeCategory === 'dsa' ? 'DSA Universe' : activeCategory === 'role' ? 'Role Universe' : 'Core CS Universe'}</span>
          </div>

          {/* Integrated Header Progress Metrics */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-[#0D1117] border border-white/10 rounded-xl px-3 py-1.5">
              <span className="text-gray-400 font-medium">Progress:</span>
              <span className="font-black text-cyan-400">{overallPercent}%</span>
              <div className="w-16 bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full" style={{ width: `${overallPercent}%` }} />
              </div>
            </div>

            <div className="bg-[#0D1117] border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-1 font-bold text-purple-300">
              <Crown className="w-3.5 h-3.5 text-purple-400" /> Lvl {userLevel}
            </div>

            <div className="bg-[#0D1117] border border-white/10 rounded-xl px-3 py-1.5 font-bold text-purple-400">
              {totalEarnedXP} XP
            </div>
          </div>
        </div>

        {/* Title, Subtitle & Action Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              {activeCategory === 'dsa' && <Zap className="w-5 h-5 text-cyan-400" />}
              {activeCategory === 'role' && <Target className="w-5 h-5 text-purple-400" />}
              {activeCategory === 'cs' && <Code2 className="w-5 h-5 text-emerald-400" />}
              {activeCategory === 'dsa' ? 'DSA Universe' : activeCategory === 'role' ? 'Role Universe' : 'Core CS Universe'}
            </h1>
            <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-medium text-gray-400">Personalized for:</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold">{form.language}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                {activeCategory === 'dsa' ? (preferences?.dsaDifficulty || 'NeetCode 150') : activeCategory === 'role' ? (form.company || form.role) : (preferences?.csSubjects?.join(', ') || 'Core Subjects')}
              </span>
              <span>•</span>
              <span className="text-gray-300 font-medium">{form.duration}</span>
              <span>•</span>
              <span className="text-gray-300 font-medium">{preferences?.dailyHours || 2} hrs/day</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Navigation Tabs */}
            <div className="flex items-center bg-[#0D1117] border border-gray-800 p-1 rounded-xl gap-1">
              {[
                { id: 'role', label: '🎯 Role' },
                { id: 'dsa',  label: '⚡ DSA' },
                { id: 'cs',   label: '💻 Core CS' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#0D1117] border border-gray-800 p-1 rounded-xl gap-1">
              <button
                onClick={() => setViewMode('graph')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'graph' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Interactive Graph"
              >
                <Network className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'card' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all flex items-center gap-1.5"
            >
              ⚙ Settings
            </button>
          </div>
        </div>

        {/* Clean Sticky Toolbar: Search & Difficulty Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="text"
              placeholder="🔍 Search topics, patterns, practice questions, notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Difficulty:</span>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficultyFilter(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedDifficultyFilter === diff 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ ROADMAP 1: ROLE-BASED PREPARATION ════════════════ */}
      {activeCategory === 'role' && (
        <div className="space-y-8">

          {/* 🌟 INTERACTIVE SVG GRAPH OR CARDS MAP 🌟 */}
          {viewMode === 'graph' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-gray-400">🗺️ Interactive Bezier Connection Graph • Click nodes to expand or view side drawer</span>
                <span className="text-xs font-bold text-purple-400">Language: {form.language} | Company: {form.company}</span>
              </div>
              <InteractiveRoadmapGraph 
                tree={(worldData.phases || []).map((phase: any, pIdx: number) => ({
                  id: phase.id || `phase_${pIdx}`,
                  name: `Phase ${pIdx + 1}: ${phase.title}`,
                  description: phase.description,
                  unlocked: phase.unlocked !== false || pIdx === 0,
                  status: phase.completed ? 'completed' : (phase.unlocked !== false || pIdx === 0 ? 'unlocked' : 'locked'),
                  children: (phase.nodes || phase.tasks || phase.skills || []).map((node: any, nIdx: number) => ({
                    ...node,
                    id: node.id || `node_${pIdx}_${nIdx}`,
                    name: node.name || node.title,
                    description: node.description || node.overview,
                    unlocked: node.unlocked !== false || nIdx === 0 || completedNodeIds.includes(node.id),
                    status: completedNodeIds.includes(node.id) || node.status === 'completed' ? 'completed' : (node.unlocked !== false || nIdx === 0 ? 'unlocked' : 'locked')
                  }))
                }))}
                onSelectNode={(node) => setSelectedNodeModal(node)}
                searchQuery={searchQuery}
                completedNodes={completedNodeIds}
              />
            </div>
          ) : (
            <div className="space-y-12">
              {worldData.phases?.map((phase: any, pIdx: number) => {
              const isPhaseUnlocked = phase.unlocked !== false || pIdx === 0
              const isPhaseCompleted = phase.completed
              const rawNodes = phase.nodes || phase.tasks || phase.skills || []
              
              // Apply Search & Difficulty Filters
              const nodesList = rawNodes.filter((n: any) => {
                const matchesSearch = searchQuery === '' || 
                  (n.name || n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (n.description || '').toLowerCase().includes(searchQuery.toLowerCase())
                const matchesDiff = selectedDifficultyFilter === 'All' || n.difficulty === selectedDifficultyFilter
                return matchesSearch && matchesDiff
              })

              const phaseCompletedCount = nodesList.filter((n: any) => n.status === 'completed').length
              const phasePercent = nodesList.length > 0 ? Math.round((phaseCompletedCount / nodesList.length) * 100) : 0

              return (
                <div key={phase.id || pIdx} className="bg-[#111620]/60 border border-white/[0.06] rounded-3xl p-8 space-y-8 relative overflow-hidden">
                  
                  {/* Phase Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${
                        isPhaseCompleted 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : isPhaseUnlocked
                          ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                          : 'bg-gray-800 text-gray-500 border-gray-700'
                      }`}>
                        {isPhaseCompleted ? <Check className="w-6 h-6 text-emerald-400 stroke-[3]" /> : `P${pIdx + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Phase {pIdx + 1} • {phase.duration}</span>
                          {phase.badge && (
                            <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-purple-400" />
                              {phase.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-black text-white mt-0.5">{phase.title}</h3>
                        <p className="text-xs text-gray-400">{phase.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setActiveBossModal({ phaseTitle: phase.title })}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold rounded-xl text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                      >
                        ⚔️ Boss Interview Gate
                      </button>

                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-300">{phaseCompletedCount} / {nodesList.length} Milestones Cleared ({phasePercent}%)</span>
                        <div className="w-36 bg-gray-900 h-2 rounded-full overflow-hidden mt-1 p-0.5 border border-gray-800">
                          <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${phasePercent}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connected Visual World Path Milestones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {nodesList.map((node: any, nIdx: number) => {
                      const isNodeCompleted = node.status === 'completed'
                      const isNodeUnlocked = node.unlocked !== false || nIdx === 0 || isNodeCompleted
                      const isCurrentNode = isNodeUnlocked && !isNodeCompleted

                      const creatorInfo = currentLanguageCreators[nIdx % currentLanguageCreators.length]
                      const checklist = node.checklist || [
                        `Watch ${creatorInfo.channel} ${form.language} Video`,
                        'Read Documentation Notes',
                        'Write Code Examples',
                        `Solve ${node.practiceTitle || 'Practice Problem'}`,
                        'Revise Key Concepts'
                      ]
                      const completedCount = checklist.filter((c: string) => checkedItems[`${node.id}_${c}`]).length || (isNodeCompleted ? checklist.length : 0)

                      return (
                        <motion.div
                          key={node.id || nIdx}
                          onClick={() => isNodeUnlocked && setSelectedNodeModal({ ...node, creatorInfo })}
                          whileHover={{ scale: isNodeUnlocked ? 1.03 : 1 }}
                          className={`rounded-3xl p-6 border transition-all duration-300 cursor-pointer relative flex flex-col justify-between ${
                            isNodeCompleted
                              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                              : isCurrentNode
                              ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_30px_rgba(138,92,255,0.4)] animate-pulse'
                              : isNodeUnlocked
                              ? 'bg-[#111620] border-gray-800 hover:border-purple-500/50'
                              : 'bg-[#0D1117]/60 border-gray-800/40 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                              node.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {node.difficulty || 'Easy'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setAiMentorTopic(node)
                                }}
                                className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded hover:bg-cyan-500/20 flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3 text-cyan-400" /> AI Mentor
                              </button>
                              <span className="text-xs font-black text-purple-400">+{node.xp || 30} XP</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs border ${
                                isNodeCompleted ? 'bg-emerald-500 text-gray-950 border-emerald-400' : isNodeUnlocked ? 'bg-purple-600 text-white border-purple-400' : 'bg-gray-800 text-gray-500 border-gray-700'
                              }`}>
                                {isNodeCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : !isNodeUnlocked ? <Lock className="w-3.5 h-3.5" /> : (nIdx + 1)}
                              </div>
                              <h4 className="font-bold text-white text-sm line-clamp-1">{node.name || node.title}</h4>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{node.description || node.overview}</p>
                          </div>

                          {/* Creator Tag strictly matching user language */}
                          <div className="mb-3 px-3 py-1.5 bg-[#0D1117] rounded-xl border border-gray-800 flex items-center justify-between text-[11px]">
                            <span className="text-gray-400 font-medium">🎥 Creator: <span className="text-purple-300 font-bold">{creatorInfo.channel}</span></span>
                            <span className="text-cyan-400 font-semibold">{creatorInfo.duration}</span>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">{completedCount}/{checklist.length} Checklists</span>
                            <span className={`font-bold ${isNodeCompleted ? 'text-emerald-400' : isNodeUnlocked ? 'text-purple-300' : 'text-gray-600'}`}>
                              {isNodeCompleted ? 'Completed ✓' : isNodeUnlocked ? 'Open Quest →' : 'Locked 🔒'}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                </div>
              )
            })}
          </div>
          )}

        </div>
      )}

      {/* ════════════════ ROADMAP 2: UNIVERSAL DSA PREPARATION ════════════════ */}
      {activeCategory === 'dsa' && (
        <div className="space-y-8">
          <div className="bg-[#111620]/90 border border-white/[0.08] rounded-3xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                  Universal Data Structures & Algorithms Roadmap
                </h3>
                <p className="text-xs text-gray-400 mt-1">Master 24 fundamental DSA topics and algorithmic patterns categorized into NeetCode levels.</p>
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'basic', label: 'Basic (75 NeetCode Qs)' },
                  { id: 'medium', label: 'Medium (150 NeetCode Qs)' },
                  { id: 'pro', label: 'Pro (250 NeetCode Qs)' },
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setDsaLevel(lvl.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      dsaLevel === lvl.id 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' 
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DSA_PATTERNS_24.filter(topic => searchQuery === '' || topic.name.toLowerCase().includes(searchQuery.toLowerCase()) || topic.pattern.toLowerCase().includes(searchQuery.toLowerCase())).map((topic, i) => (
                <div key={i} className="bg-[#0D1117] border border-gray-800 hover:border-cyan-500/40 rounded-2xl p-5 space-y-3 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Topic {i + 1}</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{topic.count}</span>
                  </div>
                  
                  <h4 className="font-bold text-white text-sm">{topic.name}</h4>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Algorithmic Pattern</span>
                    <span className="text-xs font-bold text-purple-300 block">{topic.pattern}</span>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[11px] text-gray-400">
                    <span>Creator: <strong className="text-gray-200">{topic.creator}</strong></span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAiMentorTopic(topic)}
                        className="text-cyan-400 hover:underline font-bold text-[11px]"
                      >
                        Ask AI ↗
                      </button>
                      <a
                        href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(topic.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-bold"
                      >
                        Practice ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════ ROADMAP 3: CORE CS FUNDAMENTALS ════════════════ */}
      {activeCategory === 'cs' && (
        <div className="space-y-8">
          <div className="bg-[#111620]/90 border border-white/[0.08] rounded-3xl p-6 space-y-6 backdrop-blur-xl">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Core Computer Science Subjects Roadmap
              </h3>
              <p className="text-xs text-gray-400 mt-1">High-frequency interview subjects with Gate Smashers, Neso Academy & Jenny's Lectures creator notes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CORE_CS_TROPHY_ROAD.filter(subj => searchQuery === '' || subj.title.toLowerCase().includes(searchQuery.toLowerCase())).map(subj => (
                <div key={subj.id} className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{subj.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-base">{subj.title}</h4>
                        <p className="text-xs text-purple-400 font-semibold">{subj.resources}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAiMentorTopic(subj)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20"
                    >
                      AI Mentor 🤖
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Core Concepts</span>
                    <div className="flex flex-wrap gap-1.5">
                      {subj.concepts.map(c => (
                        <span key={c} className="text-xs px-2.5 py-1 bg-white/5 text-gray-300 rounded-lg border border-white/5 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Top Interview Qs</span>
                    {subj.interviewQ.map((q, idx) => (
                      <p key={idx} className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span> {q}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ INDUSTRY PORTFOLIO & CAPSTONE PROJECTS ═══ */}
      <div className="pt-16 mt-16 border-t border-white/[0.08]">
        <RoadmapProjectsView role={form.role} />
      </div>

      {/* ═══ INTERACTIVE TOPIC SIDE DRAWER ═══ */}
      <AnimatePresence>
        {selectedNodeModal && (
          <RoadmapSideDrawer
            node={selectedNodeModal}
            language={form.language}
            company={form.company}
            checkedItems={checkedItems}
            bookmarkedVideos={bookmarkedVideos}
            onClose={() => setSelectedNodeModal(null)}
            onToggleChecklist={(node, item, idx) => toggleChecklist(node, item, idx)}
            onToggleBookmark={(videoId) => toggleBookmark(videoId)}
            onOpenVideo={(videoObj) => setEmbeddedVideo(videoObj)}
            onOpenAiMentor={(nodeObj) => setAiMentorTopic(nodeObj)}
            onMarkCompleted={(nodeId) => markNodeCompleted(nodeId)}
          />
        )}
      </AnimatePresence>

      {/* ═══ EMBEDDED YOUTUBE VIDEO PLAYER MODAL & WATCH PROGRESS TRACKER ═══ */}
      <AnimatePresence>
        {embeddedVideo && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-[#111620] border border-red-500/50 w-full max-w-4xl rounded-3xl p-6 space-y-4 relative shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            >
              <button 
                onClick={() => setEmbeddedVideo(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{embeddedVideo.title}</h3>
                  <p className="text-xs text-gray-400">Creator: <span className="text-purple-300 font-bold">{embeddedVideo.creator}</span> • Embedded EchoYou Player</p>
                </div>
              </div>

              {/* YouTube IFrame Embed Player */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-2xl">
                <iframe 
                  src={`https://www.youtube.com/embed/${embeddedVideo.videoId}?autoplay=1&enablejsapi=1`}
                  title={embeddedVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Return Verification Bar */}
              <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-white block">Finished watching this lesson?</span>
                  <span className="text-[11px] text-gray-400">Confirming completion will automatically mark the task checklist & award +20 XP.</span>
                </div>

                <div className="flex items-center gap-3">
                  {videoWatchConfirmed ? (
                    <div className="px-5 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> Watched & +20 XP Claimed!
                    </div>
                  ) : (
                    <button
                      onClick={handleConfirmVideoCompletion}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirm & Claim +20 XP
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ AI MENTOR INTERACTIVE DRAWER MODAL ═══ */}
      <AnimatePresence>
        {aiMentorTopic && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111620] border border-cyan-500/50 w-full max-w-2xl rounded-3xl p-6 space-y-6 relative shadow-[0_0_50px_rgba(34,211,238,0.3)] max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setAiMentorTopic(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">AI Mentor: {aiMentorTopic.name || aiMentorTopic.title}</h3>
                  <p className="text-xs text-gray-400">Ask doubts, test your knowledge, or generate instant revision flashcards.</p>
                </div>
              </div>

              {/* Tabs inside AI Mentor */}
              <div className="flex border-b border-gray-800 gap-4">
                {[
                  { id: 'explain', label: '💬 Doubts & Explanation' },
                  { id: 'quiz', label: '🎯 Practice Quiz' },
                  { id: 'interview', label: '💼 Interview Questions' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAiMentorTab(t.id as any)}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                      aiMentorTab === t.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Doubts & Chat */}
              {aiMentorTab === 'explain' && (
                <div className="space-y-4">
                  <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 h-60 overflow-y-auto space-y-3">
                    {aiChatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAiThinking && (
                      <div className="text-xs text-cyan-400 italic animate-pulse">AI Mentor is thinking...</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask any doubt regarding this concept..."
                      value={aiUserQuestion}
                      onChange={e => setAiUserQuestion(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAskAiMentor()}
                      className="flex-1 bg-[#0D1117] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAskAiMentor}
                      disabled={isAiThinking}
                      className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl text-xs transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Practice Quiz */}
              {aiMentorTab === 'quiz' && (
                <div className="space-y-4">
                  {getTopicQuiz(aiMentorTopic.name || aiMentorTopic.title).map((qObj, qIdx) => (
                    <div key={qIdx} className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 space-y-3">
                      <div className="text-xs font-bold text-white">Q{qIdx + 1}. {qObj.q}</div>
                      <div className="grid grid-cols-1 gap-2">
                        {qObj.options.map((opt, oIdx) => {
                          const isSelected = selectedQuizAnswers[qIdx] === oIdx
                          const isCorrect = qObj.correct === oIdx
                          return (
                            <button
                              key={oIdx}
                              onClick={() => setSelectedQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                                isSelected
                                  ? isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-red-500/20 border-red-500 text-red-300'
                                  : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const totalQs = 3
                      let score = 0
                      const quizList = getTopicQuiz(aiMentorTopic.name || aiMentorTopic.title)
                      quizList.forEach((q, i) => {
                        if (selectedQuizAnswers[i] === q.correct) score++
                      })
                      setQuizScore(score)
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-600/20"
                  >
                    Submit Quiz
                  </button>

                  {quizScore !== null && (
                    <div className="p-4 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-2xl text-center font-bold text-sm">
                      🎯 Quiz Result: You scored {quizScore} / 3! (+20 XP Awarded)
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Top Interview Questions */}
              {aiMentorTab === 'interview' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 bg-[#0D1117] border border-gray-800 rounded-2xl space-y-2">
                    <span className="font-bold text-purple-400 block uppercase tracking-wider text-[10px]">🔥 Top Asked at {form.company}</span>
                    <p className="text-gray-200 font-semibold">"Explain how {aiMentorTopic.name || aiMentorTopic.title} behaves under high concurrency."</p>
                    <p className="text-gray-400 italic">Key points to mention: Thread safety, lock contention, memory barriers.</p>
                  </div>

                  <div className="p-4 bg-[#0D1117] border border-gray-800 rounded-2xl space-y-2">
                    <span className="font-bold text-cyan-400 block uppercase tracking-wider text-[10px]">🧠 Behavioral / Scenario Round</span>
                    <p className="text-gray-200 font-semibold">"Tell me about a time when you optimized a bottleneck involving {aiMentorTopic.name || aiMentorTopic.title}."</p>
                    <p className="text-gray-400 italic">STAR Format: Situation, Task, Action (Profiling tools used), Result (% latency drop).</p>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ CELEBRATION CONFETTI MODAL ═══ */}
      <AnimatePresence>
        {celebrationModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#111620] border border-purple-500/60 w-full max-w-md rounded-3xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(138,92,255,0.4)]"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-purple-500/30 animate-bounce">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">🎉 Milestone Phase Cleared!</span>
                <h3 className="text-2xl font-black text-white">{celebrationModal.title}</h3>
                <p className="text-xs text-gray-400 mt-2">Congratulations! You have completed all milestone tasks in this phase and unlocked the next phase.</p>
              </div>

              <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-4 space-y-2">
                <div className="text-xs text-gray-400 font-medium">Rewards Claimed</div>
                <div className="flex justify-center gap-4">
                  <span className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold">
                    +500 XP
                  </span>
                  <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {celebrationModal.badge}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCelebrationModal(null)}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-500/25"
              >
                Continue Journey →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ PHASE BOSS GATE MOCK INTERVIEW MODAL ═══ */}
      <AnimatePresence>
        {activeBossModal && (
          <PhaseBossGateModal
            phaseTitle={activeBossModal.phaseTitle}
            company={form.company}
            onClose={() => setActiveBossModal(null)}
            onPassBossBattle={() => {
              setAiMentorToast('🎉 Phase Boss Battle Victory! +500 XP Awarded & Next Phase Unlocked!')
              setTimeout(() => setAiMentorToast(null), 5000)
            }}
          />
        )}
      </AnimatePresence>
      {/* ═══ ROADMAP SETTINGS DRAWER ═══ */}
      <RoadmapSettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={{
          universe: activeCategory,
          language: form.language,
          role: form.role,
          company: form.company,
          dailyHours: preferences?.dailyHours || 2,
          duration: form.duration,
          goal: preferences?.goal || 'Placement',
          experience: preferences?.experience,
          learningStyle: preferences?.learningStyle || 'mixed',
          startDate: preferences?.startDate || new Date().toISOString().split('T')[0],
          dsaDifficulty: preferences?.dsaDifficulty,
          dsaTarget: preferences?.dsaTarget,
          csSubjects: preferences?.csSubjects,
        }}
        onSave={(updated: any) => {
          setForm(prev => ({
            ...prev,
            role: updated.role || prev.role,
            company: updated.company || prev.company,
            language: updated.language || prev.language,
            duration: updated.duration || prev.duration,
          }))
          setShowSettings(false)
          if (onSettingsRegenerate) onSettingsRegenerate(updated)
        }}
        onChangeUniverse={() => {
          setShowSettings(false)
          if (onChangeUniverse) onChangeUniverse()
        }}
      />

      {/* ═══ FLOATING AI MENTOR TRIGGER ═══ */}
      <FloatingProgressWidget
        onOpenAiMentor={() => setAiMentorTopic({ name: activeCategory === 'dsa' ? 'Data Structures & Algorithms' : activeCategory === 'role' ? form.role : 'Core CS Fundamentals' })}
      />

    </div>
  )
}
