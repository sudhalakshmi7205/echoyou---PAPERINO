'use client'

import React, { useState } from 'react'
import { exportRoadmapToPdf } from './RoadmapPdfExporter'

interface CoreCsRoadmapViewProps {
  topicId: string
  studentName?: string
  onBackToUniverse: () => void
}

interface CsStage {
  id: string
  stageNo: string
  title: string
  description: string
  keyConcepts: string[]
  miniProject?: string
  exitCriteria?: string
}

const TOPIC_DETAILS: Record<string, { name: string, badge: string, color: string, stages: CsStage[] }> = {
  oops: {
    name: 'Object Oriented Programming System (OOPS)',
    badge: 'OOPS Track (12 Phases)',
    color: '#00D2FF',
    stages: [
      {
        id: 'oops_1',
        stageNo: '01',
        title: 'Introduction to OOP',
        description: 'Goal: Understand why OOP exists and transition from procedural code to real-world object modeling.',
        keyConcepts: ['What is OOP?', 'Procedural Programming vs Object-Oriented Programming', 'Real-world Object Modeling', 'Benefits & Principles of OOP'],
        miniProject: 'Task: Model a Student, Car, or Bank Account'
      },
      {
        id: 'oops_2',
        stageNo: '02',
        title: 'Classes & Objects',
        description: 'Goal: Learn the foundation of OOP — class blueprints, object state & behavior, and the `this` keyword.',
        keyConcepts: ['Class Definition vs Object Instance', 'Creating Objects & Memory Allocation', 'Object State & Behavior', 'Instance Variables & Methods', '`this` Keyword Usage'],
        miniProject: 'Mini Project: Student Management System'
      },
      {
        id: 'oops_3',
        stageNo: '03',
        title: 'Constructors',
        description: 'Goal: Safely initialize object state using constructors, overloading, and chaining.',
        keyConcepts: ['Default Constructor', 'Parameterized Constructor', 'Constructor Overloading', 'Copy Constructor (C++)', 'Constructor Chaining'],
        miniProject: 'Mini Task: Create a Bank Account Class'
      },
      {
        id: 'oops_4',
        stageNo: '04',
        title: 'Encapsulation',
        description: 'Goal: Protect data integrity through data hiding and controlled accessors.',
        keyConcepts: ['Data Hiding Concepts', 'Access Modifiers: Public, Private, Protected', 'Getter & Setter Methods', 'Immutable Objects'],
        miniProject: 'Mini Project: Employee Management System'
      },
      {
        id: 'oops_5',
        stageNo: '05',
        title: 'Inheritance',
        description: 'Goal: Promote code reusability and class hierarchies across parent & child classes.',
        keyConcepts: ['Why Inheritance?', 'Base Class vs Derived Class', 'Types: Single, Multilevel, Hierarchical, Multiple & Hybrid', 'Method Inheritance & Constructor Calling'],
        miniProject: 'Mini Project: Vehicle → Car → ElectricCar Hierarchy'
      },
      {
        id: 'oops_6',
        stageNo: '06',
        title: 'Polymorphism',
        description: 'Goal: Enable dynamic runtime & compile-time method behavior.',
        keyConcepts: ['Compile-Time: Method & Operator Overloading', 'Run-Time: Method Overriding', 'Dynamic Dispatch & Virtual Functions', '`super` / `base` Keyword Usage'],
        miniProject: 'Mini Project: Shape Area Calculator'
      },
      {
        id: 'oops_7',
        stageNo: '07',
        title: 'Abstraction',
        description: 'Goal: Separate interface contracts from internal implementations.',
        keyConcepts: ['What is Abstraction?', 'Abstract Class & Abstract Methods', 'Interfaces & Contracts', 'Difference between Abstract Class & Interface'],
        miniProject: 'Mini Project: Payment Gateway System'
      },
      {
        id: 'oops_8',
        stageNo: '08',
        title: 'Association Between Classes',
        description: 'Goal: Model object relationships and structural dependencies.',
        keyConcepts: ['Association (Using Relationship)', 'Aggregation (HAS-A Weak Relationship)', 'Composition (HAS-A Strong Ownership)', 'IS-A vs HAS-A Relationships'],
        miniProject: 'Mini Project: University → Department → Student'
      },
      {
        id: 'oops_9',
        stageNo: '09',
        title: 'Static & Final Members',
        description: 'Goal: Manage class-level state, shared memory, and immutability.',
        keyConcepts: ['Static Variables (Shared Memory)', 'Static Methods & Utility Functions', 'Static Blocks (Java)', 'Final / Const Members & Constants'],
        miniProject: 'Task: Class Counter & Configuration Manager'
      },
      {
        id: 'oops_10',
        stageNo: '10',
        title: 'Exception Handling',
        description: 'Goal: Build resilient applications that handle runtime errors gracefully.',
        keyConcepts: ['Errors vs Exceptions', 'Try, Catch & Finally Blocks', 'Throw & Throws Keywords', 'Custom User-Defined Exceptions'],
        miniProject: 'Mini Project: ATM Simulation System'
      },
      {
        id: 'oops_11',
        stageNo: '11',
        title: 'Object Class Concepts',
        description: 'Goal: Master root object methods, comparisons, and cloning.',
        keyConcepts: ['toString() Representation', 'equals() vs Identity Comparison', 'hashCode() Contract', 'Object Cloning & Deep Copy'],
        miniProject: 'Task: Custom Product Comparison Engine'
      },
      {
        id: 'oops_12',
        stageNo: '12',
        title: 'Advanced OOP Concepts',
        description: 'Goal: Apply enterprise architecture principles and design patterns.',
        keyConcepts: ['SOLID Principles (Introduction)', 'Dependency Injection (Basics)', 'Design Patterns Overview (Factory, Singleton)', 'Generics / Templates', 'Lambda Expressions & Functional Interfaces'],
        miniProject: 'Mini Project: Enterprise Notification Service Architecture'
      }
    ]
  },
  os: {
    name: 'Operating Systems (OS)',
    badge: 'OS Track',
    color: '#00FF66',
    stages: [
      {
        id: 'os_1',
        stageNo: '01',
        title: 'OS Architecture & System Calls',
        description: 'Understand dual-mode execution, kernel architecture, user space vs kernel space, and system calls.',
        keyConcepts: ['User Mode vs Kernel Mode Execution', 'System Calls (fork, exec, wait)', 'Monolithic vs Microkernel Architecture', 'Trap & Interrupt Handling']
      },
      {
        id: 'os_2',
        stageNo: '02',
        title: 'Processes, Threads & CPU Scheduling',
        description: 'Process life cycle, Process Control Block (PCB), context switching, multithreading, and CPU scheduling algorithms.',
        keyConcepts: ['Process States & PCB Structure', 'Context Switching Overhead', 'Preemptive vs Non-Preemptive Scheduling', 'FCFS, SJF, Round Robin & Priority Scheduling']
      },
      {
        id: 'os_3',
        stageNo: '03',
        title: 'Process Synchronization & Deadlocks',
        description: 'Prevent race conditions using synchronization primitives and avoid system deadlocks.',
        keyConcepts: ['Critical Section Problem', 'Mutex Locks & Counting Semaphores', '4 Necessary Deadlock Conditions', 'Banker\'s Algorithm for Deadlock Avoidance']
      },
      {
        id: 'os_4',
        stageNo: '04',
        title: 'Memory Management & Virtual Memory',
        description: 'Physical vs logical address spaces, paging, segmentation, page faults, and virtual memory page replacement.',
        keyConcepts: ['Paging & Page Table Architecture', 'Segmentation & Memory Fragmentation', 'Page Faults & Thrashing', 'FIFO, LRU & Optimal Page Replacement']
      }
    ]
  },
  cn: {
    name: 'Computer Networks (CN)',
    badge: 'CN Track',
    color: '#A855F7',
    stages: [
      {
        id: 'cn_1',
        stageNo: '01',
        title: 'Network Layer Models & OSI Spectrum',
        description: 'Understand packet flow across physical hardware and logical protocol layers.',
        keyConcepts: ['OSI 7-Layer Model vs TCP/IP 4-Layer Model', 'Packet Switching vs Circuit Switching', 'MAC Addressing & Ethernet Frames', 'ARP & RARP Protocols']
      },
      {
        id: 'cn_2',
        stageNo: '02',
        title: 'IP Addressing & Network Layer',
        description: 'Master logical IP routing, subnet masks, CIDR notation, and network layer protocols.',
        keyConcepts: ['IPv4 vs IPv6 Header Structure', 'Subnetting & CIDR Notation (/24, /16)', 'ICMP (Ping & Traceroute)', 'Routers vs Switches vs Gateways']
      },
      {
        id: 'cn_3',
        stageNo: '03',
        title: 'Transport Layer: TCP & UDP Protocols',
        description: 'Reliable vs connectionless data transfer. Deep dive into TCP handshake and congestion control.',
        keyConcepts: ['TCP 3-Way Handshake & 4-Way Teardown', 'TCP Flow Control (Sliding Window)', 'TCP Congestion Control (Slow Start)', 'UDP vs TCP Performance Tradeoffs']
      },
      {
        id: 'cn_4',
        stageNo: '04',
        title: 'Application Layer Protocols & Security',
        description: 'Understand web protocols powering modern microservices and web browsers.',
        keyConcepts: ['HTTP/1.1 vs HTTP/2 vs HTTP/3', 'HTTPS & TLS/SSL Handshake Encryption', 'DNS Resolution Hierarchy', 'Sockets, REST API & WebSockets']
      }
    ]
  },
  dbms: {
    name: 'Database Management Systems (DBMS)',
    badge: 'DBMS Track',
    color: '#F59E0B',
    stages: [
      {
        id: 'dbms_1',
        stageNo: '01',
        title: 'Database Architecture & Relational Model',
        description: 'Understand relational schemas, primary/foreign keys, and data independence.',
        keyConcepts: ['DBMS vs File System Storage', 'Relational Model & Schemas', 'Primary Key, Foreign Key & Candidate Keys', 'Entity-Relationship (ER) Diagrams']
      },
      {
        id: 'dbms_2',
        stageNo: '02',
        title: 'SQL & Complex Query Optimization',
        description: 'Write efficient SQL queries, joins, aggregations, and subqueries.',
        keyConcepts: ['INNER, LEFT, RIGHT & FULL Outer Joins', 'GROUP BY, HAVING & Aggregations', 'Subqueries & Correlated Subqueries', 'Window Functions (ROW_NUMBER, RANK)']
      },
      {
        id: 'dbms_3',
        stageNo: '03',
        title: 'Database Normalization',
        description: 'Eliminate data redundancy and update anomalies by decomposing relations into normal forms.',
        keyConcepts: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)']
      },
      {
        id: 'dbms_4',
        stageNo: '04',
        title: 'Transactions & ACID Properties',
        description: 'Ensure data consistency during concurrent updates and system crashes.',
        keyConcepts: ['Atomicity, Consistency, Isolation & Durability', 'Transaction Concurrency Anomalies', 'Isolation Levels (Read Committed, Serializable)', 'Two-Phase Locking (2PL) Protocol']
      },
      {
        id: 'dbms_5',
        stageNo: '05',
        title: 'Indexing & Storage Engines',
        description: 'Optimize query execution speed using B-Trees and clustered indexes.',
        keyConcepts: ['B-Tree & B+ Tree Index Architecture', 'Clustered vs Non-Clustered Indexes', 'Database Transactions & Write-Ahead Logging (WAL)', 'NoSQL vs RDBMS Overview']
      }
    ]
  },
  system_design: {
    name: 'System Design Roadmap',
    badge: 'System Design Track (4 Phases)',
    color: '#F43F5E',
    stages: [
      {
        id: 'sys_phase1',
        stageNo: 'PHASE 1',
        title: '🟢 FOUNDATIONS — How Applications Communicate, Store Data, and Scale',
        description: 'Goal: Don\'t start with "System Design" immediately — build solid core foundations first.',
        keyConcepts: [
          '1. Programming & OOP Basics: Classes, Objects, Encapsulation, Inheritance, Polymorphism, Abstraction, Interfaces, Composition',
          '2. Networking Fundamentals: Client-Server, HTTP/HTTPS, REST APIs, TCP/IP, DNS, WebSockets, Request/Response Lifecycle',
          '3. Backend Fundamentals: API Design, Authentication, Authorization, Sessions, JWT, CRUD, Middleware, API Gateway',
          '4. Database Fundamentals: SQL (Tables, PK/FK, Joins, ACID, Indexing, Normalization) & NoSQL (Document, Key-Value, Redis)',
          '5. Scalability Basics: Vertical vs Horizontal Scaling, Stateless Architecture, Load Balancing, Reverse Proxy, Caching, CDN'
        ],
        miniProject: 'Build: REST API, Authentication System, URL Shortener & Simple E-Commerce Backend',
        exitCriteria: 'Exit Criterion: Explain "A user sends a request to my app — what happens from browser until DB and back?"'
      },
      {
        id: 'sys_phase2',
        stageNo: 'PHASE 2',
        title: '🔵 LOW-LEVEL DESIGN (LLD) — Maintainable Code & Component Architecture',
        description: 'Goal: Connect OOP programming principles with real component design and clean architecture.',
        keyConcepts: [
          '1. SOLID Principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
          '2. Design Patterns: Creational (Factory, Builder, Singleton), Structural (Adapter, Decorator), Behavioral (Strategy, Observer, Command)',
          '3. UML & Class Design: Class diagrams, Composition, Aggregation, Association & Sequence Diagrams',
          '4. LLD Practice Problems: Parking Lot → Library Management → ATM → Elevator → Movie Booking → Food Delivery → Splitwise',
          '5. Execution Flow: Requirements → Entities → Classes → Relationships → Interfaces → Design Patterns → Implementation'
        ],
        miniProject: 'Practice: Take "Design a Parking Lot" and produce a clean class-level design with abstractions and trade-offs',
        exitCriteria: 'Exit Criterion: Produce a clean class diagram and implementation for "Design a Parking Lot" with trade-off rationale'
      },
      {
        id: 'sys_phase3',
        stageNo: 'PHASE 3',
        title: '🟠 HIGH-LEVEL DESIGN (HLD) — Large-Scale Architecture & Component Scaling',
        description: 'Goal: Learn to design large-scale web applications using standard industry frameworks.',
        keyConcepts: [
          '1. Architecture Patterns: Monolith, Modular Monolith, Microservices, Event-Driven Architecture (When NOT to use microservices)',
          '2. Advanced Scaling: Load Balancers (L4 vs L7), Horizontal Scaling, DB Replication, Read Replicas, Sharding, Partitioning',
          '3. Caching Strategies: Cache-aside, Write-through, Write-back, TTL, Cache Invalidation, LRU, Redis',
          '4. Asynchronous Messaging: Message Queues, Kafka, RabbitMQ, Producers/Consumers, Topics, Partitions, Consumer Groups',
          '5. Reliability & API Design: Circuit Breakers, Timeouts, Retries, Idempotency, Rate Limiting, Pagination, Filtering, Versioning',
          '6. HLD Problems: URL Shortener → Rate Limiter → Notification System → Chat App → File Storage → Instagram → Uber'
        ],
        miniProject: 'Framework: Requirements → Non-Functional → Capacity → API → DB Schema → Architecture → Bottlenecks → Trade-offs',
        exitCriteria: 'Exit Criterion: Independently design "Instagram" architecture and justify why each component exists'
      },
      {
        id: 'sys_phase4',
        stageNo: 'PHASE 4',
        title: '🔴 ADVANCED & DISTRIBUTED SYSTEMS — Massive Scale, Failures & Reliability',
        description: 'Goal: Understand what happens when architecture operates at massive scale or under system failures.',
        keyConcepts: [
          '1. Distributed Systems Principles: CAP Theorem, Eventual vs Strong Consistency, Distributed Transactions, Consensus, Leader Election',
          '2. Advanced Storage & Caching: Sharding strategies, Consistent Hashing, Cache Stampede/Penetration/Avalanche mitigation',
          '3. Distributed Messaging: Kafka deep-dive, Ordering, Consumer Groups, At-most-once, At-least-once, Exactly-once semantics, DLQs',
          '4. Reliability & Observability: Multi-region active-active/passive, RPO/RTO, Logs/Metrics/Tracing (Prometheus, Grafana, OpenTelemetry)',
          '5. Security & Scale: OAuth, JWT, API Security, TLS, Secrets Management, DDoS Protection',
          '6. Advanced HLD Systems: Netflix, YouTube, Uber, WhatsApp, Google Search, Distributed File System, Real-time Collaboration'
        ],
        miniProject: 'Failure Scenarios: Node failures, Data-center outages, and 100x traffic scaling redesigns',
        exitCriteria: 'Exit Criterion: Answer "What happens if an entire data center fails?" and "How to scale this system for 100x traffic?"'
      }
    ]
  },
  git: {
    name: 'Git & GitHub Version Control',
    badge: 'Git Track',
    color: '#FF6B00',
    stages: [
      {
        id: 'git_1',
        stageNo: '01',
        title: 'Git Core Architecture & 3 Trees',
        description: 'Master the inner workings of Git snapshotting and tracking state.',
        keyConcepts: ['Working Directory, Staging Area & Local Repository', 'Git Commit Hashing (SHA-1 / SHA-256)', 'Git HEAD Pointer & Branch References', 'git status, git add & git commit']
      },
      {
        id: 'git_2',
        stageNo: '02',
        title: 'Branching, Merging & Rebasing',
        description: 'Manage parallel feature development and integrate code cleanly.',
        keyConcepts: ['git branch & git switch / checkout', 'Fast-Forward vs 3-Way Merge', 'git rebase vs git merge Tradeoffs', 'Resolving Merge Conflicts']
      },
      {
        id: 'git_3',
        stageNo: '03',
        title: 'Remote Collaboration & Pull Requests',
        description: 'Collaborate with teams on GitHub using remote origins and PR workflows.',
        keyConcepts: ['git clone, git remote add origin', 'git fetch vs git pull', 'git push & Tracking Branches', 'Pull Requests (PR), Code Reviews & Forking']
      },
      {
        id: 'git_4',
        stageNo: '04',
        title: 'Advanced Git Tooling & Recovery',
        description: 'Undo mistakes safely and rescue lost commits using advanced Git utilities.',
        keyConcepts: ['git stash & git stash pop', 'git cherry-pick for selective commits', 'git reset (--soft, --mixed, --hard)', 'git revert & git reflog for Disaster Recovery']
      }
    ]
  }
}

export default function CoreCsRoadmapView({ topicId, studentName = 'Student', onBackToUniverse }: CoreCsRoadmapViewProps) {
  const currentTopic = TOPIC_DETAILS[topicId] || TOPIC_DETAILS.oops
  const [completedStages, setCompletedStages] = useState<Record<string, boolean>>({})
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false)

  const completedCount = currentTopic.stages.filter(s => completedStages[s.id]).length

  const handleToggleDone = (stageId: string) => {
    setCompletedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }))
  }

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    await exportRoadmapToPdf({
      containerId: 'core-cs-roadmap-view',
      studentName,
      roadmapTitle: `${currentTopic.name} Core CS Roadmap`,
      completedCount,
      totalCount: currentTopic.stages.length
    })
    setIsExportingPdf(false)
  }

  const SYSTEM_DESIGN_25_QUESTIONS = [
    { id: 1, category: 'Phase 1 Foundations', q: 'What happens under the hood from the moment a user types a URL in a browser until the database responds and content renders?' },
    { id: 2, category: 'Phase 1 Foundations', q: 'Explain the key differences between SQL (ACID, relational) and NoSQL (Document, Key-Value) databases, and when to pick each.' },
    { id: 3, category: 'Phase 1 Foundations', q: 'How does Horizontal Scaling differ from Vertical Scaling, and what stateless architectural constraints are required for horizontal scaling?' },
    { id: 4, category: 'Phase 1 Foundations', q: 'What is the role of an API Gateway vs a Reverse Proxy (Nginx) in a modern backend system?' },
    { id: 5, category: 'Phase 1 Foundations', q: 'Explain how JWT authentication works and compare Session-based vs Token-based authentication.' },
    { id: 6, category: 'Phase 2 LLD', q: 'How do you apply SOLID principles when designing a maintainable class hierarchy?' },
    { id: 7, category: 'Phase 2 LLD', q: 'Explain when you would use the Strategy Pattern vs the State Pattern vs the Observer Pattern with concrete examples.' },
    { id: 8, category: 'Phase 2 LLD', q: 'How would you design a Parking Lot system (LLD) handling multiple spot types, entry/exit gates, and pricing strategies?' },
    { id: 9, category: 'Phase 2 LLD', q: 'Design an Elevator Management System for a 50-story building with multiple lift cars (LLD).' },
    { id: 10, category: 'Phase 2 LLD', q: 'Design Splitwise: How do you model users, expense groups, balances, and expense simplification algorithms?' },
    { id: 11, category: 'Phase 3 HLD', q: 'How do you design a scalable URL Shortener (TinyURL) handling 100M daily active redirects with low latency?' },
    { id: 12, category: 'Phase 3 HLD', q: 'Design a Distributed Rate Limiter (Token Bucket vs Leaky Bucket vs Sliding Window Log).' },
    { id: 13, category: 'Phase 3 HLD', q: 'Explain the difference between Layer 4 and Layer 7 Load Balancing, and how Consistent Hashing prevents cache churn.' },
    { id: 14, category: 'Phase 3 HLD', q: 'Compare Cache-Aside, Write-Through, and Write-Back caching strategies. How do you handle cache invalidation and LRU eviction?' },
    { id: 15, category: 'Phase 3 HLD', q: 'How do Message Queues (Kafka / RabbitMQ) decouple microservices, and how do consumer groups process partitions in parallel?' },
    { id: 16, category: 'Phase 3 HLD', q: 'Design a Notification System capable of pushing millions of SMS, Email, and In-App push notifications reliably.' },
    { id: 17, category: 'Phase 3 HLD', q: 'Design a Real-Time One-on-One and Group Chat System (WhatsApp / Slack) using WebSockets and DB storage.' },
    { id: 18, category: 'Phase 3 HLD', q: 'Design Instagram: How do you handle image storage (S3/CDN), news feed generation (push vs pull), and user follow relationships?' },
    { id: 19, category: 'Phase 4 Distributed Systems', q: 'What is the CAP Theorem? Explain why a distributed system can only provide 2 out of 3 guarantees during network partitions.' },
    { id: 20, category: 'Phase 4 Distributed Systems', q: 'Explain Database Sharding vs Partitioning. What are the common sharding key strategies and trade-offs?' },
    { id: 21, category: 'Phase 4 Distributed Systems', q: 'What are Cache Stampede, Cache Penetration, and Cache Avalanche, and how do you prevent them?' },
    { id: 22, category: 'Phase 4 Distributed Systems', q: 'What is the difference between At-most-once, At-least-once, and Exactly-once message delivery semantics in Kafka?' },
    { id: 23, category: 'Phase 4 Distributed Systems', q: 'How do Circuit Breakers, Timeouts, and Retries with Exponential Backoff prevent cascading system failures?' },
    { id: 24, category: 'Phase 4 Distributed Systems', q: 'What happens if a primary database node or an entire multi-region data center fails? Explain RPO and RTO.' },
    { id: 25, category: 'Phase 4 Distributed Systems', q: 'How do Distributed Tracing (OpenTelemetry) and Centralized Logging (Prometheus/Grafana) help debug microservice latency bottlenecks?' }
  ]

  const OOPS_25_QUESTIONS = [
    { id: 1, category: 'Phase 1 — OOP Fundamentals', q: 'What is OOP? What are its four main principles? (Encapsulation, Abstraction, Inheritance, Polymorphism)', isPriority: true },
    { id: 2, category: 'Phase 1 — OOP Fundamentals', q: 'What is a class and what is an object? Explain with an example.', isPriority: true },
    { id: 3, category: 'Phase 1 — OOP Fundamentals', q: 'What is the difference between a class and an object?' },
    { id: 4, category: 'Phase 1 — OOP Fundamentals', q: 'What is encapsulation? Give a real-world example.', isPriority: true },
    { id: 5, category: 'Phase 1 — OOP Fundamentals', q: 'What is abstraction? How is it different from encapsulation?', isPriority: true },
    { id: 6, category: 'Phase 1 — OOP Fundamentals', q: 'What is inheritance? Why is it used?', isPriority: true },
    { id: 7, category: 'Phase 1 — OOP Fundamentals', q: 'What are the different types of inheritance? (Single, Multilevel, Hierarchical, Multiple, Hybrid)', isPriority: true },
    { id: 8, category: 'Phase 1 — OOP Fundamentals', q: 'What is polymorphism? What are its types? (Compile-time vs Runtime)', isPriority: true },
    { id: 9, category: 'Phase 2 — Core OOP Concepts', q: 'What is method overloading?' },
    { id: 10, category: 'Phase 2 — Core OOP Concepts', q: 'What is method overriding?' },
    { id: 11, category: 'Phase 2 — Core OOP Concepts', q: 'What is the difference between overloading and overriding? ⭐', isPriority: true },
    { id: 12, category: 'Phase 2 — Core OOP Concepts', q: 'What is dynamic method dispatch / dynamic binding?', isPriority: true },
    { id: 13, category: 'Phase 2 — Core OOP Concepts', q: 'What is the difference between compile-time and runtime polymorphism?' },
    { id: 14, category: 'Phase 2 — Core OOP Concepts', q: 'What is a constructor? Why is it used?', isPriority: true },
    { id: 15, category: 'Phase 2 — Core OOP Concepts', q: 'What are the different types of constructors? (Default, Parameterized, Copy)' },
    { id: 16, category: 'Phase 2 — Core OOP Concepts', q: 'What is constructor overloading?' },
    { id: 17, category: 'Phase 2 — Core OOP Concepts', q: 'What is constructor chaining?', isPriority: true },
    { id: 18, category: 'Phase 2 — Core OOP Concepts', q: 'Can a constructor be overridden? Why or why not?' },
    { id: 19, category: 'Phase 3 — Important Interview Concepts', q: 'What are access modifiers/specifiers? (public, private, protected, default/package-private)', isPriority: true },
    { id: 20, category: 'Phase 3 — Important Interview Concepts', q: 'What is the difference between an abstract class and an interface? ⭐', isPriority: true },
    { id: 21, category: 'Phase 3 — Important Interview Concepts', q: 'Can an abstract class have a constructor?' },
    { id: 22, category: 'Phase 3 — Important Interview Concepts', q: 'Can an interface have methods with implementation? (Default & Static methods in Java 8+)' },
    { id: 23, category: 'Phase 3 — Important Interview Concepts', q: 'What is the `this` keyword and how is it used?' },
    { id: 24, category: 'Phase 3 — Important Interview Concepts', q: 'What is the `super` keyword and when is it required? (`this` vs `super`)', isPriority: true },
    { id: 25, category: 'Phase 3 — Important Interview Concepts', q: 'What is the difference between composition and inheritance? Which is preferred and why? ⭐', isPriority: true }
  ]

  const activeQuestions = topicId === 'oops' ? OOPS_25_QUESTIONS : SYSTEM_DESIGN_25_QUESTIONS

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

      {/* Header Banner */}
      <div className="w-full max-w-4xl mx-auto space-y-6 mb-12 relative z-10 border-b border-zinc-800 pb-8 text-center">
        
        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToUniverse}
            className="text-xs font-mono px-4 py-2 rounded-xl border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white bg-white/5 transition-all"
          >
            &larr; Core CS Universe
          </button>

          <div className="flex items-center gap-3">
            <span 
              className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{
                color: currentTopic.color,
                backgroundColor: `${currentTopic.color}15`,
                borderColor: `${currentTopic.color}40`
              }}
            >
              {currentTopic.badge}
            </span>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
            >
              {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400 uppercase tracking-tight">
            {currentTopic.name}
          </h1>
          <p className="text-xs text-zinc-400 font-mono">
            Essential Core CS Fundamentals for Technical Interviews
          </p>
        </div>

        {/* Progress Tracker & Special Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="inline-flex items-center gap-4 bg-[#0D111A]/90 border border-zinc-800 px-6 py-2.5 rounded-full backdrop-blur-xl">
            <span className="text-xs font-mono text-zinc-300">
              Progress: <strong className="text-emerald-400">{completedCount}/{currentTopic.stages.length} Stages Cleared</strong>
            </span>
            <div className="w-32 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div 
                className="bg-gradient-to-r from-purple-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${(completedCount / currentTopic.stages.length) * 100}%` }}
              />
            </div>
          </div>

          {(topicId === 'system_design' || topicId === 'oops') && (
            <button
              onClick={() => setShowInterviewQuestions(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-full transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span>🔥 Top 25 {topicId === 'oops' ? 'OOP' : 'System Design'} Interview Questions</span>
            </button>
          )}
        </div>
      </div>

      {/* Vertical Circuit Path Flowchart Container */}
      <div id="core-cs-roadmap-view" className="w-full max-w-4xl mx-auto relative z-10 pb-16">
        
        {/* SVG Dual-Tone Glowing Central Circuit Line */}
        <div className="absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-2 pointer-events-none hidden md:block">
          <svg className="w-full h-full overflow-visible">
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="100%"
              stroke={currentTopic.color}
              strokeWidth="3"
              strokeDasharray="8 6"
              className="opacity-70"
            />
          </svg>
        </div>

        {/* Vertical List of Stages (Alternating 3-Column Grid) */}
        <div className="space-y-12 relative">
          {currentTopic.stages.map((stg, index) => {
            const isDone = Boolean(completedStages[stg.id])
            const isUnlocked = index === 0 || Boolean(completedStages[currentTopic.stages[index - 1].id])
            const isEven = index % 2 === 0

            return (
              <div 
                key={stg.id}
                className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6"
              >
                {/* Col 1 (Left Card Slot) */}
                <div className="w-full flex justify-end order-2 md:order-1">
                  {isEven ? (
                    <CsStageCard 
                      stage={stg}
                      topicColor={currentTopic.color}
                      isDone={isDone}
                      isUnlocked={isUnlocked}
                      onToggleDone={() => {
                        if (isUnlocked || isDone) handleToggleDone(stg.id)
                      }}
                    />
                  ) : (
                    <div className="hidden md:block w-full" />
                  )}
                </div>

                {/* Col 2 (Center Circular Numbered Badge Node) */}
                <div className="relative z-20 flex justify-center order-1 md:order-2 shrink-0">
                  <div 
                    onClick={() => {
                      if (isUnlocked || isDone) handleToggleDone(stg.id)
                    }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-base transition-all border-2 shadow-2xl ${
                      isDone
                        ? 'bg-[#0A3A1B] border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer'
                        : isUnlocked
                        ? 'bg-white text-black shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-110 cursor-pointer'
                        : 'bg-[#0D111A] border-zinc-700 text-zinc-400 cursor-not-allowed'
                    }`}
                    style={{
                      borderColor: isDone ? '#00FF66' : isUnlocked ? currentTopic.color : '#3F3F46'
                    }}
                  >
                    {isDone ? '✓' : isUnlocked ? stg.stageNo : '🔒'}
                  </div>
                </div>

                {/* Col 3 (Right Card Slot) */}
                <div className="w-full flex justify-start order-3 md:order-3">
                  {!isEven ? (
                    <CsStageCard 
                      stage={stg}
                      topicColor={currentTopic.color}
                      isDone={isDone}
                      isUnlocked={isUnlocked}
                      onToggleDone={() => {
                        if (isUnlocked || isDone) handleToggleDone(stg.id)
                      }}
                    />
                  ) : (
                    <div className="hidden md:block w-full" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top 25 Interview Questions Modal */}
      {showInterviewQuestions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0F17] border border-cyan-500/30 w-full max-w-3xl rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 md:p-8 space-y-6 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                  {topicId === 'oops' ? 'OOP Technical Interview Prep' : 'System Design Interview Prep'}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
                  <span>🔥 Top 25 {topicId === 'oops' ? 'OOP' : 'System Design'} Interview Questions</span>
                </h3>
              </div>
              <button
                onClick={() => setShowInterviewQuestions(false)}
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-mono cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Questions List */}
            <div className="overflow-y-auto pr-2 space-y-3.5 flex-1">
              {activeQuestions.map((item: any) => (
                <div 
                  key={item.id}
                  className={`bg-[#111622] border rounded-2xl p-4 transition-all ${
                    item.isPriority 
                      ? 'border-cyan-500/40 bg-[#0F1B2B]/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                      : 'border-zinc-800/80 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                      Q{item.id.toString().padStart(2, '0')} · {item.category}
                    </span>
                    {item.isPriority && (
                      <span className="text-[10px] font-mono font-extrabold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ⭐ Must Prepare First
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-zinc-200 leading-relaxed">
                    {item.q}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono text-zinc-400">
              <span>{topicId === 'oops' ? 'Covering OOP Fundamentals, Core Concepts & Enterprise Trade-offs' : 'Covering Phase 1 (Foundations) to Phase 4 (Distributed Systems)'}</span>
              <button
                onClick={() => setShowInterviewQuestions(false)}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CsStageCard({ 
  stage, 
  topicColor,
  isDone, 
  isUnlocked,
  onToggleDone 
}: { 
  stage: CsStage
  topicColor: string
  isDone: boolean
  isUnlocked: boolean
  onToggleDone: () => void 
}) {
  return (
    <div
      className={`group border rounded-2xl p-5 space-y-4 transition-all backdrop-blur-xl shadow-xl ${
        isDone
          ? 'bg-[#0A3A1B]/70 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          : isUnlocked
          ? 'bg-[#0D111A]/95 hover:border-purple-400'
          : 'bg-[#0D111A]/95 border-zinc-800'
      }`}
      style={{
        borderColor: isDone ? '#00FF66' : isUnlocked ? `${topicColor}50` : '#27272A'
      }}
    >
      {/* Title */}
      <div className="border-b border-zinc-800/80 pb-2.5">
        <h3 className="text-sm font-black uppercase tracking-wider text-white">
          Stage {stage.stageNo}: {stage.title}
        </h3>
        <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
          {stage.description}
        </p>
      </div>

      {/* Key Concepts Bullet List */}
      <div className="space-y-1.5 text-xs text-zinc-300">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-1">
          Topics & Concepts:
        </span>
        {stage.keyConcepts.map((kc, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[11px]">
            <span className="font-bold" style={{ color: topicColor }}>&gt;</span>
            <span className="text-zinc-300">{kc}</span>
          </div>
        ))}
      </div>

      {/* Practical Mini Project / Task Badge */}
      {stage.miniProject && (
        <div className="pt-2 border-t border-zinc-800/60">
          <div className="bg-white/5 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 text-[10px] font-bold uppercase">🛠️ Practical Task / Project:</span>
            <span className="text-cyan-300 font-bold text-[11px]">{stage.miniProject}</span>
          </div>
        </div>
      )}

      {/* Phase Exit Criteria */}
      {stage.exitCriteria && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 flex items-start gap-2 text-xs font-mono">
          <span className="text-emerald-400 text-[11px] font-bold shrink-0">✅</span>
          <span className="text-emerald-200 text-[11px] font-medium leading-relaxed">{stage.exitCriteria}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex justify-between items-center border-t border-zinc-800/40">
        <button
          onClick={onToggleDone}
          disabled={!isUnlocked && !isDone}
          className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-xl border transition-all ${
            isDone
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isUnlocked
              ? 'bg-white/5 text-purple-300 border-purple-500/40 hover:bg-purple-500/20 cursor-pointer'
              : 'bg-zinc-900 text-zinc-400 border-zinc-700 cursor-not-allowed'
          }`}
        >
          {isDone ? 'Completed ✓' : isUnlocked ? 'Mark Completed' : 'Locked 🔒'}
        </button>

        {!isUnlocked && !isDone && (
          <span className="text-[10px] font-mono text-zinc-400 italic">
            Complete previous stage first
          </span>
        )}
      </div>
    </div>
  )
}
