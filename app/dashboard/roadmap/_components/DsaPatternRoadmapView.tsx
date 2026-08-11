'use client'

import React, { useState } from 'react'
import { DsaPreferences } from './DsaPreferenceSetup'
import { exportRoadmapToPdf } from './RoadmapPdfExporter'

interface DsaPatternRoadmapViewProps {
  preferences: DsaPreferences
  studentName?: string
  onEditPreferences: () => void
}

interface DsaProblem {
  id: string
  leetcodeNo: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface DsaPattern {
  patternId: string
  patternName: string
  patternDesc: string
  problems: DsaProblem[]
}

const DSA_TOPICS = [
  { id: 'arrays', label: 'Arrays' },
  { id: 'strings', label: 'Strings' },
  { id: 'linked_list', label: 'Linked List' },
  { id: 'stack', label: 'Stack' },
  { id: 'queue', label: 'Queue' },
  { id: 'binary_search', label: 'Binary Search' },
  { id: 'trees', label: 'Trees & BST' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dp', label: 'Dynamic Programming' },
  { id: 'heap', label: 'Heaps & Priority Queue' },
  { id: 'tries', label: 'Tries' },
  { id: 'bit', label: 'Bit Manipulation' }
]

export default function DsaPatternRoadmapView({ preferences, studentName = 'Student', onEditPreferences }: DsaPatternRoadmapViewProps) {
  const [activeTopic, setActiveTopic] = useState('arrays')
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({})
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  // Get pattern-segregated LeetCode data for every topic
  const getTopicPatterns = (topicId: string, level: 'Beginner' | 'Intermediate' | 'Pro'): DsaPattern[] => {
    switch (topicId) {
      case 'arrays':
        return [
          {
            patternId: 'pat_arr_two_pointers',
            patternName: 'Pattern 1: Two Pointers (Converging & Fast/Slow Pointers)',
            patternDesc: 'Use left and right pointers moving towards each other or at different speeds on sorted arrays.',
            problems: [
              { id: 'lc_167', leetcodeNo: 167, title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium' },
              { id: 'lc_15', leetcodeNo: 15, title: '3Sum', difficulty: 'Medium' },
              { id: 'lc_11', leetcodeNo: 11, title: 'Container With Most Water', difficulty: 'Medium' },
              { id: 'lc_26', leetcodeNo: 26, title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy' },
              { id: 'lc_283', leetcodeNo: 283, title: 'Move Zeroes', difficulty: 'Easy' },
              { id: 'lc_977', leetcodeNo: 977, title: 'Squares of a Sorted Array', difficulty: 'Easy' },
              { id: 'lc_42', leetcodeNo: 42, title: 'Trapping Rain Water', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_arr_sliding_window',
            patternName: 'Pattern 2: Sliding Window (Fixed & Variable Window)',
            patternDesc: 'Maintain a running subarray window to optimize contiguous subarray sum or constraint problems.',
            problems: [
              { id: 'lc_121', leetcodeNo: 121, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy' },
              { id: 'lc_209', leetcodeNo: 209, title: 'Minimum Size Subarray Sum', difficulty: 'Medium' },
              { id: 'lc_1004', leetcodeNo: 1004, title: 'Max Consecutive Ones III', difficulty: 'Medium' },
              { id: 'lc_904', leetcodeNo: 904, title: 'Fruit Into Baskets', difficulty: 'Medium' },
              { id: 'lc_239', leetcodeNo: 239, title: 'Sliding Window Maximum', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_arr_prefix_sum',
            patternName: 'Pattern 3: Prefix Sum & Cumulative Subarray Sums',
            patternDesc: 'Precompute prefix sum arrays to answer subarray sum queries in O(1) time.',
            problems: [
              { id: 'lc_303', leetcodeNo: 303, title: 'Range Sum Query - Immutable', difficulty: 'Easy' },
              { id: 'lc_724', leetcodeNo: 724, title: 'Find Pivot Index', difficulty: 'Easy' },
              { id: 'lc_560', leetcodeNo: 560, title: 'Subarray Sum Equals K', difficulty: 'Medium' },
              { id: 'lc_525', leetcodeNo: 525, title: 'Contiguous Array', difficulty: 'Medium' },
              { id: 'lc_974', leetcodeNo: 974, title: 'Subarray Sums Divisible by K', difficulty: 'Medium' },
              { id: 'lc_523', leetcodeNo: 523, title: 'Continuous Subarray Sum', difficulty: 'Medium' },
              { id: 'lc_238', leetcodeNo: 238, title: 'Product of Array Except Self', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_arr_hashing',
            patternName: 'Pattern 4: Hashing & Frequency Map',
            patternDesc: 'Use Hash Maps / Sets for O(1) element lookup and frequency counting.',
            problems: [
              { id: 'lc_217', leetcodeNo: 217, title: 'Contains Duplicate', difficulty: 'Easy' },
              { id: 'lc_242', leetcodeNo: 242, title: 'Valid Anagram', difficulty: 'Easy' },
              { id: 'lc_1', leetcodeNo: 1, title: 'Two Sum', difficulty: 'Easy' },
              { id: 'lc_49', leetcodeNo: 49, title: 'Group Anagrams', difficulty: 'Medium' },
              { id: 'lc_347', leetcodeNo: 347, title: 'Top K Frequent Elements', difficulty: 'Medium' },
              { id: 'lc_128', leetcodeNo: 128, title: 'Longest Consecutive Sequence', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_arr_kadanes',
            patternName: 'Pattern 5: Kadane\'s Algorithm & Max Subarray Sum',
            patternDesc: 'Optimize contiguous max subarray sum using local vs global max tracking.',
            problems: [
              { id: 'lc_53', leetcodeNo: 53, title: 'Maximum Subarray', difficulty: 'Medium' },
              { id: 'lc_152', leetcodeNo: 152, title: 'Maximum Product Subarray', difficulty: 'Medium' },
              { id: 'lc_918', leetcodeNo: 918, title: 'Maximum Sum Circular Subarray', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_arr_cyclic_sort',
            patternName: 'Pattern 6: Cyclic Sort / In-Place Array Mutation',
            patternDesc: 'Sort array elements in range 1 to N in O(N) time and O(1) space by placing items at index (val - 1).',
            problems: [
              { id: 'lc_268', leetcodeNo: 268, title: 'Missing Number', difficulty: 'Easy' },
              { id: 'lc_448', leetcodeNo: 448, title: 'Find All Numbers Disappeared in an Array', difficulty: 'Easy' },
              { id: 'lc_287', leetcodeNo: 287, title: 'Find the Duplicate Number', difficulty: 'Medium' },
              { id: 'lc_442', leetcodeNo: 442, title: 'Find All Duplicates in an Array', difficulty: 'Medium' },
              { id: 'lc_41', leetcodeNo: 41, title: 'First Missing Positive', difficulty: 'Hard' }
            ]
          }
        ]

      case 'strings':
        return [
          {
            patternId: 'pat_str_two_pointers',
            patternName: 'Pattern 1: Two Pointers for Palindromes & String Reversal',
            patternDesc: 'Use left & right converging pointers to check palindromes and reverse string sequences.',
            problems: [
              { id: 'lc_125', leetcodeNo: 125, title: 'Valid Palindrome', difficulty: 'Easy' },
              { id: 'lc_680', leetcodeNo: 680, title: 'Valid Palindrome II', difficulty: 'Easy' },
              { id: 'lc_344', leetcodeNo: 344, title: 'Reverse String', difficulty: 'Easy' },
              { id: 'lc_345', leetcodeNo: 345, title: 'Reverse Vowels of a String', difficulty: 'Easy' },
              { id: 'lc_647', leetcodeNo: 647, title: 'Palindromic Substrings', difficulty: 'Medium' },
              { id: 'lc_5', leetcodeNo: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_str_sliding_window',
            patternName: 'Pattern 2: Sliding Window & Character Frequency Maps',
            patternDesc: 'Expand right pointer to include characters, contract left pointer to satisfy window condition.',
            problems: [
              { id: 'lc_3', leetcodeNo: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium' },
              { id: 'lc_424', leetcodeNo: 424, title: 'Longest Repeating Character Replacement', difficulty: 'Medium' },
              { id: 'lc_567', leetcodeNo: 567, title: 'Permutation in String', difficulty: 'Medium' },
              { id: 'lc_438', leetcodeNo: 438, title: 'Find All Anagrams in a String', difficulty: 'Medium' },
              { id: 'lc_76', leetcodeNo: 76, title: 'Minimum Window Substring', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_str_hashing',
            patternName: 'Pattern 3: String Hash Matching & Anagram Grouping',
            patternDesc: 'Use frequency counts or hash signatures to categorize anagrams and isomorphic strings.',
            problems: [
              { id: 'lc_242', leetcodeNo: 242, title: 'Valid Anagram', difficulty: 'Easy' },
              { id: 'lc_49', leetcodeNo: 49, title: 'Group Anagrams', difficulty: 'Medium' },
              { id: 'lc_205', leetcodeNo: 205, title: 'Isomorphic Strings', difficulty: 'Easy' },
              { id: 'lc_290', leetcodeNo: 290, title: 'Word Pattern', difficulty: 'Easy' }
            ]
          },
          {
            patternId: 'pat_str_parsing',
            patternName: 'Pattern 4: String Parsing & Pattern Matching',
            patternDesc: 'Process string indices for pattern matching and integer conversions.',
            problems: [
              { id: 'lc_387', leetcodeNo: 387, title: 'First Unique Character in a String', difficulty: 'Easy' },
              { id: 'lc_383', leetcodeNo: 383, title: 'Ransom Note', difficulty: 'Easy' },
              { id: 'lc_14', leetcodeNo: 14, title: 'Longest Common Prefix', difficulty: 'Easy' },
              { id: 'lc_28', leetcodeNo: 28, title: 'Find the Index of the First Occurrence in a String', difficulty: 'Easy' },
              { id: 'lc_8', leetcodeNo: 8, title: 'String to Integer (atoi)', difficulty: 'Medium' }
            ]
          }
        ]

      case 'linked_list':
        return [
          {
            patternId: 'pat_ll_fast_slow',
            patternName: 'Pattern 1: Fast & Slow Pointers (Floyd\'s Cycle Detection)',
            patternDesc: 'Move slow pointer by 1 step and fast pointer by 2 steps to detect loops & find middle node.',
            problems: [
              { id: 'lc_141', leetcodeNo: 141, title: 'Linked List Cycle', difficulty: 'Easy' },
              { id: 'lc_876', leetcodeNo: 876, title: 'Middle of the Linked List', difficulty: 'Easy' },
              { id: 'lc_142', leetcodeNo: 142, title: 'Linked List Cycle II', difficulty: 'Medium' },
              { id: 'lc_202', leetcodeNo: 202, title: 'Happy Number', difficulty: 'Easy' },
              { id: 'lc_287', leetcodeNo: 287, title: 'Find the Duplicate Number', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_ll_reversal',
            patternName: 'Pattern 2: In-Place Pointer Reversal',
            patternDesc: 'Reverse next pointer links iteratively using prev, current, and next Temp pointers.',
            problems: [
              { id: 'lc_206', leetcodeNo: 206, title: 'Reverse Linked List', difficulty: 'Easy' },
              { id: 'lc_92', leetcodeNo: 92, title: 'Reverse Linked List II', difficulty: 'Medium' },
              { id: 'lc_234', leetcodeNo: 234, title: 'Palindrome Linked List', difficulty: 'Easy' },
              { id: 'lc_24', leetcodeNo: 24, title: 'Swap Nodes in Pairs', difficulty: 'Medium' },
              { id: 'lc_25', leetcodeNo: 25, title: 'Reverse Nodes in k-Group', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_ll_merge',
            patternName: 'Pattern 3: Merging & Multi-Pointer Node Manipulation',
            patternDesc: 'Use dummy head nodes and multi-pointer links to merge or reorder nodes.',
            problems: [
              { id: 'lc_21', leetcodeNo: 21, title: 'Merge Two Sorted Lists', difficulty: 'Easy' },
              { id: 'lc_19', leetcodeNo: 19, title: 'Remove Nth Node From End of List', difficulty: 'Medium' },
              { id: 'lc_143', leetcodeNo: 143, title: 'Reorder List', difficulty: 'Medium' },
              { id: 'lc_138', leetcodeNo: 138, title: 'Copy List with Random Pointer', difficulty: 'Medium' },
              { id: 'lc_2', leetcodeNo: 2, title: 'Add Two Numbers', difficulty: 'Medium' },
              { id: 'lc_23', leetcodeNo: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_ll_partition',
            patternName: 'Pattern 4: Intersection & Node Partitioning',
            patternDesc: 'Align node lengths or split nodes into two dummy lists.',
            problems: [
              { id: 'lc_160', leetcodeNo: 160, title: 'Intersection of Two Linked Lists', difficulty: 'Easy' },
              { id: 'lc_86', leetcodeNo: 86, title: 'Partition List', difficulty: 'Medium' },
              { id: 'lc_82', leetcodeNo: 82, title: 'Remove Duplicates from Sorted List II', difficulty: 'Medium' }
            ]
          }
        ]

      case 'stack':
        return [
          {
            patternId: 'pat_st_monotonic',
            patternName: 'Pattern 1: Monotonic Stack (Next Greater / Smaller Element)',
            patternDesc: 'Maintain strictly increasing or decreasing element values to answer next greater element queries in O(N).',
            problems: [
              { id: 'lc_739', leetcodeNo: 739, title: 'Daily Temperatures', difficulty: 'Medium' },
              { id: 'lc_496', leetcodeNo: 496, title: 'Next Greater Element I', difficulty: 'Easy' },
              { id: 'lc_503', leetcodeNo: 503, title: 'Next Greater Element II', difficulty: 'Medium' },
              { id: 'lc_901', leetcodeNo: 901, title: 'Online Stock Span', difficulty: 'Medium' },
              { id: 'lc_853', leetcodeNo: 853, title: 'Car Fleet', difficulty: 'Medium' },
              { id: 'lc_84', leetcodeNo: 84, title: 'Largest Rectangle in Histogram', difficulty: 'Hard' },
              { id: 'lc_42_st', leetcodeNo: 42, title: 'Trapping Rain Water (Stack Solution)', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_st_parentheses',
            patternName: 'Pattern 2: Parentheses Balancing & Expression Parsing',
            patternDesc: 'Push opening tokens onto stack and pop matching closing tokens.',
            problems: [
              { id: 'lc_20', leetcodeNo: 20, title: 'Valid Parentheses', difficulty: 'Easy' },
              { id: 'lc_155', leetcodeNo: 155, title: 'Min Stack', difficulty: 'Medium' },
              { id: 'lc_150', leetcodeNo: 150, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium' },
              { id: 'lc_71', leetcodeNo: 71, title: 'Simplify Path', difficulty: 'Medium' },
              { id: 'lc_224', leetcodeNo: 224, title: 'Basic Calculator', difficulty: 'Hard' },
              { id: 'lc_227', leetcodeNo: 227, title: 'Basic Calculator II', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_st_decoding',
            patternName: 'Pattern 3: Stack Simulation & String Decoding',
            patternDesc: 'Push numbers and text multipliers to unwind nested string patterns.',
            problems: [
              { id: 'lc_394', leetcodeNo: 394, title: 'Decode String', difficulty: 'Medium' },
              { id: 'lc_1047', leetcodeNo: 1047, title: 'Remove All Adjacent Duplicates in String', difficulty: 'Easy' },
              { id: 'lc_735', leetcodeNo: 735, title: 'Asteroid Collision', difficulty: 'Medium' }
            ]
          }
        ]

      case 'queue':
        return [
          {
            patternId: 'pat_qu_deque',
            patternName: 'Pattern 1: Monotonic Deque & Sliding Window Maximum',
            patternDesc: 'Use double-ended queue to maintain maximum or minimum window values in O(N).',
            problems: [
              { id: 'lc_239', leetcodeNo: 239, title: 'Sliding Window Maximum', difficulty: 'Hard' },
              { id: 'lc_622', leetcodeNo: 622, title: 'Design Circular Queue', difficulty: 'Medium' },
              { id: 'lc_641', leetcodeNo: 641, title: 'Design Circular Deque', difficulty: 'Medium' },
              { id: 'lc_1425', leetcodeNo: 1425, title: 'Constrained Subsequence Sum', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_qu_bfs_buffer',
            patternName: 'Pattern 2: Queue Simulation & Task Buffers',
            patternDesc: 'First-In First-Out buffer for task scheduling and level simulations.',
            problems: [
              { id: 'lc_225', leetcodeNo: 225, title: 'Implement Stack using Queues', difficulty: 'Easy' },
              { id: 'lc_933', leetcodeNo: 933, title: 'Number of Recent Calls', difficulty: 'Easy' },
              { id: 'lc_621', leetcodeNo: 621, title: 'Task Scheduler', difficulty: 'Medium' },
              { id: 'lc_346', leetcodeNo: 346, title: 'Moving Average from Data Stream', difficulty: 'Easy' }
            ]
          }
        ]

      case 'binary_search':
        return [
          {
            patternId: 'pat_bs_array',
            patternName: 'Pattern 1: Search in Sorted & Rotated Arrays',
            patternDesc: 'Halve search space by evaluating sorted sub-ranges.',
            problems: [
              { id: 'lc_704', leetcodeNo: 704, title: 'Binary Search', difficulty: 'Easy' },
              { id: 'lc_33', leetcodeNo: 33, title: 'Search in Rotated Sorted Array', difficulty: 'Medium' },
              { id: 'lc_153', leetcodeNo: 153, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium' },
              { id: 'lc_81', leetcodeNo: 81, title: 'Search in Rotated Sorted Array II', difficulty: 'Medium' },
              { id: 'lc_34', leetcodeNo: 34, title: 'Find First and Last Position of Element in Sorted Array', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_bs_answer',
            patternName: 'Pattern 2: Binary Search on Solution / Monotonic Range',
            patternDesc: 'Apply binary search on condition functions where search space is monotonic [Low, High].',
            problems: [
              { id: 'lc_74', leetcodeNo: 74, title: 'Search a 2D Matrix', difficulty: 'Medium' },
              { id: 'lc_240', leetcodeNo: 240, title: 'Search a 2D Matrix II', difficulty: 'Medium' },
              { id: 'lc_875', leetcodeNo: 875, title: 'Koko Eating Bananas', difficulty: 'Medium' },
              { id: 'lc_1011', leetcodeNo: 1011, title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium' },
              { id: 'lc_410', leetcodeNo: 410, title: 'Split Array Largest Sum', difficulty: 'Hard' },
              { id: 'lc_4', leetcodeNo: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_bs_peak',
            patternName: 'Pattern 3: Peak Element & Monotonic Comparison',
            patternDesc: 'Compare mid element with mid + 1 to find local peaks in O(log N).',
            problems: [
              { id: 'lc_162', leetcodeNo: 162, title: 'Find Peak Element', difficulty: 'Medium' },
              { id: 'lc_540', leetcodeNo: 540, title: 'Single Element in a Sorted Array', difficulty: 'Medium' },
              { id: 'lc_441', leetcodeNo: 441, title: 'Arranging Coins', difficulty: 'Easy' }
            ]
          }
        ]

      case 'trees':
        return [
          {
            patternId: 'pat_tr_dfs',
            patternName: 'Pattern 1: Tree Depth First Search (DFS & Recursive Traversals)',
            patternDesc: 'Traverse left and right subtrees recursively to calculate depth, path sums, and properties.',
            problems: [
              { id: 'lc_226', leetcodeNo: 226, title: 'Invert Binary Tree', difficulty: 'Easy' },
              { id: 'lc_104', leetcodeNo: 104, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy' },
              { id: 'lc_543', leetcodeNo: 543, title: 'Diameter of Binary Tree', difficulty: 'Easy' },
              { id: 'lc_110', leetcodeNo: 110, title: 'Balanced Binary Tree', difficulty: 'Easy' },
              { id: 'lc_100', leetcodeNo: 100, title: 'Same Tree', difficulty: 'Easy' },
              { id: 'lc_572', leetcodeNo: 572, title: 'Subtree of Another Tree', difficulty: 'Easy' },
              { id: 'lc_235', leetcodeNo: 235, title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium' },
              { id: 'lc_236', leetcodeNo: 236, title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium' },
              { id: 'lc_124', leetcodeNo: 124, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard' },
              { id: 'lc_297', leetcodeNo: 297, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_tr_bfs',
            patternName: 'Pattern 2: Tree Breadth First Search (BFS & Level Order)',
            patternDesc: 'Traverse tree level by level using Queue buffer.',
            problems: [
              { id: 'lc_102', leetcodeNo: 102, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium' },
              { id: 'lc_199', leetcodeNo: 199, title: 'Binary Tree Right Side View', difficulty: 'Medium' },
              { id: 'lc_116', leetcodeNo: 116, title: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium' },
              { id: 'lc_103', leetcodeNo: 103, title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium' },
              { id: 'lc_637', leetcodeNo: 637, title: 'Average of Levels in Binary Tree', difficulty: 'Easy' }
            ]
          },
          {
            patternId: 'pat_tr_bst',
            patternName: 'Pattern 3: Binary Search Tree (BST) Validation & Operations',
            patternDesc: 'Exploit BST property (Left < Node < Right) for O(log N) searches and validation.',
            problems: [
              { id: 'lc_98', leetcodeNo: 98, title: 'Validate Binary Search Tree', difficulty: 'Medium' },
              { id: 'lc_230', leetcodeNo: 230, title: 'Kth Smallest Element in a BST', difficulty: 'Medium' },
              { id: 'lc_105', leetcodeNo: 105, title: 'Construct Binary Tree from Preorder & Inorder', difficulty: 'Medium' },
              { id: 'lc_450', leetcodeNo: 450, title: 'Delete Node in a BST', difficulty: 'Medium' }
            ]
          }
        ]

      case 'graphs':
        return [
          {
            patternId: 'pat_gr_matrix',
            patternName: 'Pattern 1: 2D Matrix Grid Traversal (BFS / DFS)',
            patternDesc: 'Explore connected grid cells using 4-directional or 8-directional exploration.',
            problems: [
              { id: 'lc_200', leetcodeNo: 200, title: 'Number of Islands', difficulty: 'Medium' },
              { id: 'lc_695', leetcodeNo: 695, title: 'Max Area of Island', difficulty: 'Medium' },
              { id: 'lc_994', leetcodeNo: 994, title: 'Rotting Oranges', difficulty: 'Medium' },
              { id: 'lc_130', leetcodeNo: 130, title: 'Surrounded Regions', difficulty: 'Medium' },
              { id: 'lc_417', leetcodeNo: 417, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium' },
              { id: 'lc_286', leetcodeNo: 286, title: 'Walls and Gates', difficulty: 'Medium' },
              { id: 'lc_1091', leetcodeNo: 1091, title: 'Shortest Path in Binary Matrix', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_gr_topo',
            patternName: 'Pattern 2: Topological Sort & DAG Dependencies',
            patternDesc: 'Order directed acyclic graph nodes using in-degree array (Kahn\'s Algorithm) or DFS stack.',
            problems: [
              { id: 'lc_207', leetcodeNo: 207, title: 'Course Schedule', difficulty: 'Medium' },
              { id: 'lc_210', leetcodeNo: 210, title: 'Course Schedule II', difficulty: 'Medium' },
              { id: 'lc_269', leetcodeNo: 269, title: 'Alien Dictionary', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_gr_union_find',
            patternName: 'Pattern 3: Connected Components & Union Find (Disjoint Set)',
            patternDesc: 'Use Union-Find data structure with path compression to detect cycles & component counts.',
            problems: [
              { id: 'lc_261', leetcodeNo: 261, title: 'Graph Valid Tree', difficulty: 'Medium' },
              { id: 'lc_323', leetcodeNo: 323, title: 'Number of Connected Components in Graph', difficulty: 'Medium' },
              { id: 'lc_684', leetcodeNo: 684, title: 'Redundant Connection', difficulty: 'Medium' },
              { id: 'lc_721', leetcodeNo: 721, title: 'Accounts Merge', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_gr_shortest_path',
            patternName: 'Pattern 4: Shortest Path Algorithms (Dijkstra / Bellman-Ford)',
            patternDesc: 'Find minimum edge-weight distance paths using priority queues.',
            problems: [
              { id: 'lc_743', leetcodeNo: 743, title: 'Network Delay Time (Dijkstra)', difficulty: 'Medium' },
              { id: 'lc_787', leetcodeNo: 787, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium' },
              { id: 'lc_1584', leetcodeNo: 1584, title: 'Min Cost to Connect All Points (Prim/Kruskal)', difficulty: 'Medium' }
            ]
          }
        ]

      case 'dp':
        return [
          {
            patternId: 'pat_dp_1d',
            patternName: 'Pattern 1: 1D Dynamic Programming (State Transitions)',
            patternDesc: 'State transition DP equations: dp[i] = dp[i-1] + dp[i-2] or min/max subproblem choices.',
            problems: [
              { id: 'lc_70', leetcodeNo: 70, title: 'Climbing Stairs', difficulty: 'Easy' },
              { id: 'lc_746', leetcodeNo: 746, title: 'Min Cost Climbing Stairs', difficulty: 'Easy' },
              { id: 'lc_198', leetcodeNo: 198, title: 'House Robber', difficulty: 'Medium' },
              { id: 'lc_213', leetcodeNo: 213, title: 'House Robber II', difficulty: 'Medium' },
              { id: 'lc_91', leetcodeNo: 91, title: 'Decode Ways', difficulty: 'Medium' },
              { id: 'lc_322', leetcodeNo: 322, title: 'Coin Change', difficulty: 'Medium' },
              { id: 'lc_300', leetcodeNo: 300, title: 'Longest Increasing Subsequence', difficulty: 'Medium' },
              { id: 'lc_139', leetcodeNo: 139, title: 'Word Break', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_dp_knapsack',
            patternName: 'Pattern 2: 2D DP & 0/1 Knapsack Subproblems',
            patternDesc: 'Include or exclude item at index i to optimize profit within target sum capacity.',
            problems: [
              { id: 'lc_416', leetcodeNo: 416, title: 'Partition Equal Subset Sum', difficulty: 'Medium' },
              { id: 'lc_494', leetcodeNo: 494, title: 'Target Sum', difficulty: 'Medium' },
              { id: 'lc_518', leetcodeNo: 518, title: 'Coin Change II', difficulty: 'Medium' },
              { id: 'lc_377', leetcodeNo: 377, title: 'Combination Sum IV', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_dp_grid_lcs',
            patternName: 'Pattern 3: Matrix Grid DP & Longest Common Subsequence',
            patternDesc: 'Compute optimal paths on 2D grid DP tables or compare 2 string sequences.',
            problems: [
              { id: 'lc_62', leetcodeNo: 62, title: 'Unique Paths', difficulty: 'Medium' },
              { id: 'lc_63', leetcodeNo: 63, title: 'Unique Paths II', difficulty: 'Medium' },
              { id: 'lc_64', leetcodeNo: 64, title: 'Minimum Path Sum', difficulty: 'Medium' },
              { id: 'lc_1143', leetcodeNo: 1143, title: 'Longest Common Subsequence', difficulty: 'Medium' },
              { id: 'lc_72', leetcodeNo: 72, title: 'Edit Distance', difficulty: 'Hard' },
              { id: 'lc_309', leetcodeNo: 309, title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_dp_palindrome',
            patternName: 'Pattern 4: Palindromic & Interval DP',
            patternDesc: 'Expand intervals dp[i][j] from inner subproblems to outer boundaries.',
            problems: [
              { id: 'lc_5_dp', leetcodeNo: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium' },
              { id: 'lc_647_dp', leetcodeNo: 647, title: 'Palindromic Substrings', difficulty: 'Medium' },
              { id: 'lc_516', leetcodeNo: 516, title: 'Longest Palindromic Subsequence', difficulty: 'Medium' }
            ]
          }
        ]

      case 'heap':
        return [
          {
            patternId: 'pat_hp_topk',
            patternName: 'Pattern 1: Top K Elements (Min Heap & Max Heap)',
            patternDesc: 'Maintain Min-Heap of size K to find Kth largest or most frequent elements in O(N log K).',
            problems: [
              { id: 'lc_215', leetcodeNo: 215, title: 'Kth Largest Element in an Array', difficulty: 'Medium' },
              { id: 'lc_973', leetcodeNo: 973, title: 'K Closest Points to Origin', difficulty: 'Medium' },
              { id: 'lc_692', leetcodeNo: 692, title: 'Top K Frequent Words', difficulty: 'Medium' },
              { id: 'lc_703', leetcodeNo: 703, title: 'Kth Largest Element in a Stream', difficulty: 'Easy' }
            ]
          },
          {
            patternId: 'pat_hp_two_heaps',
            patternName: 'Pattern 2: Two Heaps (Median Finder)',
            patternDesc: 'Balance max-heap for lower half and min-heap for upper half to maintain stream median in O(1).',
            problems: [
              { id: 'lc_295', leetcodeNo: 295, title: 'Find Median from Data Stream', difficulty: 'Hard' },
              { id: 'lc_480', leetcodeNo: 480, title: 'Sliding Window Median', difficulty: 'Hard' }
            ]
          },
          {
            patternId: 'pat_hp_merge',
            patternName: 'Pattern 3: Merge K Sorted Inputs',
            patternDesc: 'Use min-heap to keep track of current minimum head elements across K sorted arrays or lists.',
            problems: [
              { id: 'lc_23_hp', leetcodeNo: 23, title: 'Merge k Sorted Lists', difficulty: 'Hard' },
              { id: 'lc_373', leetcodeNo: 373, title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium' }
            ]
          }
        ]

      case 'tries':
        return [
          {
            patternId: 'pat_tr_prefix',
            patternName: 'Pattern 1: Trie Prefix Tree & Dictionary Search',
            patternDesc: 'Insert and search words prefix by prefix using 26-child character tree nodes.',
            problems: [
              { id: 'lc_208', leetcodeNo: 208, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium' },
              { id: 'lc_211', leetcodeNo: 211, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_tr_backtracking',
            patternName: 'Pattern 2: Trie Backtracking & Matrix Word Search',
            patternDesc: 'Combine Trie prefix pruning with 2D grid DFS traversal.',
            problems: [
              { id: 'lc_212', leetcodeNo: 212, title: 'Word Search II', difficulty: 'Hard' },
              { id: 'lc_421', leetcodeNo: 421, title: 'Maximum XOR of Two Numbers in an Array', difficulty: 'Medium' }
            ]
          }
        ]

      case 'bit':
        return [
          {
            patternId: 'pat_bt_xor',
            patternName: 'Pattern 1: Bitwise XOR & Bit Counting',
            patternDesc: 'Exploit XOR property (A ^ A = 0) and bit shifts (n & (n - 1)) for O(1) bit manipulation.',
            problems: [
              { id: 'lc_136', leetcodeNo: 136, title: 'Single Number', difficulty: 'Easy' },
              { id: 'lc_191', leetcodeNo: 191, title: 'Number of 1 Bits', difficulty: 'Easy' },
              { id: 'lc_338', leetcodeNo: 338, title: 'Counting Bits', difficulty: 'Easy' },
              { id: 'lc_190', leetcodeNo: 190, title: 'Reverse Bits', difficulty: 'Easy' },
              { id: 'lc_268', leetcodeNo: 268, title: 'Missing Number', difficulty: 'Easy' },
              { id: 'lc_371', leetcodeNo: 371, title: 'Sum of Two Integers', difficulty: 'Medium' },
              { id: 'lc_137', leetcodeNo: 137, title: 'Single Number II', difficulty: 'Medium' },
              { id: 'lc_260', leetcodeNo: 260, title: 'Single Number III', difficulty: 'Medium' }
            ]
          },
          {
            patternId: 'pat_bt_mask',
            patternName: 'Pattern 2: Bitmask Subsets & Bitwise Tricks',
            patternDesc: 'Iterate 0 to 2^N - 1 bitmasks to generate all power-set subsets in O(N * 2^N).',
            problems: [
              { id: 'lc_78', leetcodeNo: 78, title: 'Subsets (Bitmask Method)', difficulty: 'Medium' },
              { id: 'lc_201', leetcodeNo: 201, title: 'Bitwise AND of Numbers Range', difficulty: 'Medium' },
              { id: 'lc_1318', leetcodeNo: 1318, title: 'Minimum Flips to Make a OR b Equal to c', difficulty: 'Medium' }
            ]
          }
        ]

      default:
        return [
          {
            patternId: 'pat_gen_1',
            patternName: 'Pattern 1: Core Algorithmic Patterns',
            patternDesc: 'Essential pattern-based problems.',
            problems: [
              { id: `lc_${topicId}_1`, leetcodeNo: 101, title: `${topicId.toUpperCase()} Core Problem 1`, difficulty: 'Easy' },
              { id: `lc_${topicId}_2`, leetcodeNo: 202, title: `${topicId.toUpperCase()} Core Problem 2`, difficulty: 'Medium' }
            ]
          }
        ]
    }
  }

  const currentPatterns = getTopicPatterns(activeTopic, preferences.level)

  // Calculate total problems across all patterns in active topic
  const allProblemsInTopic = currentPatterns.flatMap(p => p.problems)
  const completedCount = allProblemsInTopic.filter(p => completedProblems[p.id]).length

  const handleToggleDone = (probId: string) => {
    setCompletedProblems(prev => ({
      ...prev,
      [probId]: !prev[probId]
    }))
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    const activeLabel = DSA_TOPICS.find(t => t.id === activeTopic)?.label || 'DSA'
    await exportRoadmapToPdf({
      containerId: 'dsa-pattern-roadmap-view',
      studentName,
      roadmapTitle: `DSA Pattern Roadmap - ${activeLabel} (${preferences.level})`,
      completedCount,
      totalCount: allProblemsInTopic.length
    })
    setIsExportingPdf(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white p-6 md:p-10 font-sans relative overflow-hidden select-none">
      
      {/* Background Dark Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#2a344a 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Main Top Header Banner */}
      <div className="w-full max-w-6xl mx-auto space-y-6 mb-8 relative z-10 border-b border-zinc-800 pb-6">
        
        {/* Navigation & Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Pattern-Based DSA Roadmap
              </span>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Level: {preferences.level}
              </span>
              <span className="text-xs font-mono text-purple-400 font-bold">
                Language: {preferences.language}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-cyan-400 uppercase tracking-tight mt-2">
              DSA Algorithmic Patterns
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onEditPreferences}
              className="text-xs font-mono px-4 py-2 rounded-xl border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white bg-white/5 transition-all"
            >
              &larr; Solar System
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] disabled:opacity-50"
            >
              {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Universal Topic Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-2 border-t border-zinc-800/80">
          {DSA_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setActiveTopic(topic.id)}
              className={`px-4 py-2 text-xs font-bold font-mono rounded-xl border transition-all shrink-0 ${
                activeTopic === topic.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                  : 'bg-[#0D111A]/80 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Topic Progress Header */}
        <div className="flex items-center justify-between bg-[#0D111A]/90 border border-zinc-800 p-4 rounded-2xl backdrop-blur-xl">
          <span className="text-xs font-mono text-zinc-300 font-bold">
            Topic Progress ({DSA_TOPICS.find(t => t.id === activeTopic)?.label}): <strong className="text-emerald-400">{completedCount}/{allProblemsInTopic.length} Problems Mastered</strong>
          </span>

          <div className="w-48 bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${allProblemsInTopic.length ? (completedCount / allProblemsInTopic.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pattern-Segregated Problem Roadmap View */}
      <div id="dsa-pattern-roadmap-view" className="w-full max-w-6xl mx-auto space-y-10 relative z-10">
        {currentPatterns.map((pat) => (
          <div key={pat.patternId} className="space-y-4">
            
            {/* Pattern Header (FIRST PRIORITY) */}
            <div className="bg-[#0D111A] border-l-4 border-l-emerald-400 border-y border-r border-zinc-800 p-4 rounded-r-2xl space-y-1 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {pat.patternName}
                </h2>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {pat.problems.length} Curated Sums
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                {pat.patternDesc}
              </p>
            </div>

            {/* Problem Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pat.problems.map((prob) => {
                const isDone = Boolean(completedProblems[prob.id])

                return (
                  <div
                    key={prob.id}
                    className={`border rounded-2xl p-5 space-y-4 transition-all backdrop-blur-xl ${
                      isDone
                        ? 'bg-[#0A3A1B]/70 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                        : 'bg-[#0D111A]/90 border-zinc-800/80 hover:border-emerald-500/40'
                    }`}
                  >
                    {/* Problem LeetCode No & Title */}
                    <div className="flex items-start justify-between gap-3 border-b border-zinc-800/60 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-widest block mb-0.5">
                          LeetCode #{prob.leetcodeNo}
                        </span>
                        <h3 className="text-sm font-bold text-white line-clamp-1">
                          {prob.title}
                        </h3>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : prob.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    {/* Completion Action */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-zinc-500">
                        {isDone ? 'Mastered ✓' : 'Not Mastered'}
                      </span>

                      <button
                        onClick={() => handleToggleDone(prob.id)}
                        className={`px-3.5 py-1.5 text-[10px] font-mono font-bold uppercase rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/5 text-zinc-300 hover:text-white border-zinc-800 hover:border-emerald-500/40'
                        }`}
                      >
                        {isDone ? 'Completed ✓' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
