'use client'

import { FolderGit2, ExternalLink, Code2, Layers, Cpu, CheckCircle } from 'lucide-react'

export default function RoadmapProjectsView({ role }: { role: string }) {
  const projects = [
    {
      id: 'p1',
      title: 'High-Concurrency E-Commerce Backend Microservice',
      level: 'Real Industry Capstone',
      description: 'Distributed microservice system handling 10k RPS with Redis caching, Kafka message broker, and PostgreSQL database sharding.',
      stack: ['Java / Spring Boot', 'Kafka', 'Redis', 'PostgreSQL', 'Docker'],
      architecture: 'API Gateway ➔ Auth Service ➔ Order Processing Worker ➔ Notification Engine',
      github: 'https://github.com/topics/ecommerce-microservices'
    },
    {
      id: 'p2',
      title: 'Real-Time AI Code Execution Sandbox & Judge System',
      level: 'Advanced Project',
      description: 'Isolated Docker container execution runtime for running user code against automated test cases with memory profiling.',
      stack: ['Node.js / Express', 'Docker Engine API', 'WebSockets', 'Tailwind CSS'],
      architecture: 'Frontend IDE ➔ WebSocket Streamer ➔ Isolated Container Runtime',
      github: 'https://github.com/topics/code-execution-engine'
    }
  ]

  return (
    <div className="bg-[#111620]/90 border border-white/[0.08] rounded-3xl p-6 space-y-6 backdrop-blur-xl">
      <div>
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-purple-400" />
          Industry Portfolio & Capstone Projects
        </h3>
        <p className="text-xs text-gray-400 mt-1">Build real-world production projects to add directly to your resume for target role: <strong className="text-white">{role}</strong>.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => (
          <div key={proj.id} className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {proj.level}
              </span>
              <a href={proj.github} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1">
                GitHub Ref <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h4 className="font-bold text-white text-base">{proj.title}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">{proj.description}</p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">System Architecture</span>
              <span className="text-xs font-medium text-gray-300 block">{proj.architecture}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {proj.stack.map(tech => (
                <span key={tech} className="text-[11px] px-2.5 py-1 bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/20 font-bold">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
