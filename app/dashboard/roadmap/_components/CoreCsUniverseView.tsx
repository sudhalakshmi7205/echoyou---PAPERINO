'use client'

import React, { useState, useEffect, useRef } from 'react'

interface CoreCsTopic {
  id: string
  name: string
  subText: string
  color: string
  glowColor: string
}

const CS_TOPICS: CoreCsTopic[] = [
  {
    id: 'oops',
    name: 'OOPS',
    subText: 'CLASSES & PATTERNS',
    color: '#00D2FF', // Electric Cyan
    glowColor: 'rgba(0, 210, 255, 0.85)'
  },
  {
    id: 'os',
    name: 'OS',
    subText: 'PROCESSES & MEMORY',
    color: '#00FF66', // Vivid Emerald Green
    glowColor: 'rgba(0, 255, 102, 0.85)'
  },
  {
    id: 'cn',
    name: 'CN',
    subText: 'NETWORKS & PROTOCOLS',
    color: '#A855F7', // Luminous Purple
    glowColor: 'rgba(168, 85, 247, 0.85)'
  },
  {
    id: 'dbms',
    name: 'DBMS',
    subText: 'SQL & TRANSACTIONS',
    color: '#FFB800', // Bright Gold
    glowColor: 'rgba(255, 184, 0, 0.85)'
  },
  {
    id: 'system_design',
    name: 'SYSTEM DESIGN',
    subText: 'SCALABILITY & CAP',
    color: '#FF007A', // Hot Neon Pink
    glowColor: 'rgba(255, 0, 122, 0.85)'
  },
  {
    id: 'git',
    name: 'GIT & GITHUB',
    subText: 'VERSION CONTROL',
    color: '#FF5500', // Flaming Bright Orange
    glowColor: 'rgba(255, 85, 0, 0.85)'
  }
]

interface CoreCsUniverseViewProps {
  onSelectTopic: (topicId: string) => void
  onBackToLanding: () => void
}

export default function CoreCsUniverseView({ onSelectTopic, onBackToLanding }: CoreCsUniverseViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)
  const spherePositionsRef = useRef<Array<{ id: string; x: number; y: number; radius: number }>>([])

  // Perfect Math Alignment & Butter-Smooth 60 FPS Luminous Spheres Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Perfect Center Alignment (Offsetting header & footer)
      const centerX = canvas.width / 2
      const centerY = canvas.height * 0.48 // Centered perfectly above footer
      
      // Radius bounds to prevent ANY bottom overlap
      const radiusX = Math.min(canvas.width * 0.34, 400)
      const radiusY = Math.min(canvas.height * 0.21, 195)

      angle += 0.003 // Smooth 60 FPS orbital rotation

      // 1. Dashed Orbital Ring
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 6])
      ctx.stroke()
      ctx.setLineDash([])

      // 2. Central Core Hub Sphere (`CORE CS`)
      const time = Date.now() * 0.002
      const hubPulse = Math.sin(time) * 3

      // Outer Glowing Aura Ring
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, 95 + hubPulse, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
      ctx.lineWidth = 2
      ctx.shadowColor = '#A855F7'
      ctx.shadowBlur = 35
      ctx.stroke()
      ctx.restore()

      // Luminous Central Hub Sphere
      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
      const hubGrad = ctx.createRadialGradient(centerX - 20, centerY - 20, 5, centerX, centerY, 85)
      hubGrad.addColorStop(0, '#FFFFFF')
      hubGrad.addColorStop(0.3, '#A855F7')
      hubGrad.addColorStop(0.6, '#4C1D95')
      hubGrad.addColorStop(1, '#070812')
      ctx.fillStyle = hubGrad
      ctx.shadowColor = '#A855F7'
      ctx.shadowBlur = 50
      ctx.fill()
      ctx.lineWidth = 2.5
      ctx.strokeStyle = '#C084FC'
      ctx.stroke()
      ctx.restore()

      // Central Lightning Bolt Icon
      ctx.save()
      ctx.fillStyle = '#F59E0B'
      ctx.shadowColor = '#F59E0B'
      ctx.shadowBlur = 20
      ctx.font = '22px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('⚡', centerX, centerY - 20)
      ctx.restore()

      // Central Hub Text
      ctx.save()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 17px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('CORE CS', centerX, centerY + 8)

      ctx.fillStyle = '#E9D5FF'
      ctx.font = '800 8px monospace'
      ctx.fillText('CS FUNDAMENTALS', centerX, centerY + 26)
      ctx.restore()

      // 3. Render 6 Luminous Orbiting Spheres
      const currentPositions: Array<{ id: string; x: number; y: number; radius: number }> = []

      CS_TOPICS.forEach((topic, index) => {
        const topicAngle = angle + (index * (Math.PI * 2 / CS_TOPICS.length))
        const x = centerX + Math.cos(topicAngle) * radiusX
        const y = centerY + Math.sin(topicAngle) * radiusY

        // Staggered Breathing / Zooming Scale (0.88x to 1.12x)
        const breathScale = Math.sin(time * 1.5 + index * 1.2) * 0.12 + 1
        const isHovered = hoveredTopic === topic.id
        const scale = isHovered ? 1.25 : breathScale
        const sphereRadius = 58 * scale

        currentPositions.push({ id: topic.id, x, y, radius: sphereRadius })

        // Luminous Outer Neon Aura Ring 1
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, sphereRadius + 8, 0, Math.PI * 2)
        ctx.fillStyle = topic.glowColor
        ctx.shadowColor = topic.color
        ctx.shadowBlur = isHovered ? 60 : 35
        ctx.globalAlpha = isHovered ? 0.9 : 0.5
        ctx.fill()
        ctx.restore()

        // Luminous Outer Halo Border 2
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, sphereRadius + 4, 0, Math.PI * 2)
        ctx.strokeStyle = topic.color
        ctx.lineWidth = isHovered ? 3.5 : 2
        ctx.shadowColor = topic.color
        ctx.shadowBlur = isHovered ? 40 : 20
        ctx.stroke()
        ctx.restore()

        // 3D Luminous Sphere Body (Rich saturated topic color gradient)
        ctx.save()
        ctx.beginPath()
        ctx.arc(x, y, sphereRadius, 0, Math.PI * 2)
        const sphereGrad = ctx.createRadialGradient(x - sphereRadius * 0.35, y - sphereRadius * 0.35, 2, x, y, sphereRadius)
        sphereGrad.addColorStop(0, '#FFFFFF') // Luminous core highlight
        sphereGrad.addColorStop(0.2, topic.color) // Bright topic color
        sphereGrad.addColorStop(0.65, `${topic.color}44`) // Semi-transparent glow
        sphereGrad.addColorStop(1, '#070812')
        ctx.fillStyle = sphereGrad
        ctx.shadowColor = topic.color
        ctx.shadowBlur = isHovered ? 55 : 35
        ctx.fill()
        ctx.lineWidth = isHovered ? 3 : 2
        ctx.strokeStyle = topic.color
        ctx.stroke()
        ctx.restore()

        // Sphere Static Camera-Facing Text
        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '900 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = topic.color
        ctx.shadowBlur = 12
        ctx.fillText(topic.name, x, y - 5)

        ctx.fillStyle = topic.color
        ctx.font = '800 8px monospace'
        ctx.shadowBlur = 8
        ctx.fillText(topic.subText, x, y + 11)
        ctx.restore()
      })

      spherePositionsRef.current = currentPositions
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [hoveredTopic])

  // Mouse Interactivity
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    let foundHover: string | null = null
    spherePositionsRef.current.forEach(sp => {
      const dist = Math.hypot(mouseX - sp.x, mouseY - sp.y)
      if (dist <= sp.radius) {
        foundHover = sp.id
      }
    })
    setHoveredTopic(foundHover)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    spherePositionsRef.current.forEach(sp => {
      const dist = Math.hypot(mouseX - sp.x, mouseY - sp.y)
      if (dist <= sp.radius) {
        onSelectTopic(sp.id)
      }
    })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080D] text-white relative overflow-hidden select-none font-sans flex flex-col items-center justify-between p-6">
      
      {/* 3D Luminous Solar System Canvas */}
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-pointer" 
      />

      {/* Top Header Banner Overlay */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-between border-b border-zinc-800/80 pb-4 pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="text-xs font-mono px-4 py-2 rounded-xl border border-zinc-800 hover:border-purple-500/40 text-zinc-300 hover:text-white bg-white/5 transition-all"
        >
          &larr; Solar System
        </button>

        <div className="text-center">
          <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
            CORE CS UNIVERSE
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mt-1">
            COMPUTER SCIENCE FUNDAMENTALS
          </h1>
        </div>

        <div className="w-24" />
      </div>

      {/* Bottom Helper Footer (Guaranteed No Overlap) */}
      <div className="relative z-20 text-xs font-mono text-zinc-500 text-center border-t border-zinc-800/80 pt-3 w-full max-w-4xl pointer-events-none mb-2">
        Click any orbiting topic sphere to explore its essential circuit roadmap.
      </div>
    </div>
  )
}
