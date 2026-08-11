'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap, Brain, Target, Activity, Award, FileSearch, ChevronRight, CheckCircle } from 'lucide-react'
import IntroSequence from './IntroSequence'

/* ─────────────── Tiny floating particle ─────────────── */
function Particle({ x, y, size, delay, color }: { x: number; y: number; size: number; delay: number; color: string }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 4}px ${color}`,
        animation: `particle-float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.4,
      }}
    />
  )
}

/* ─────────────── Logo Ring ─────────────── */
function LogoRing({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full spin-slow"
        style={{
          background: 'conic-gradient(from 0deg, #7C5CFF, #4DA8FF, #00E5FF, #7C5CFF)',
          padding: 2,
          borderRadius: '50%',
        }}
      >
        <div className="w-full h-full rounded-full" style={{ background: '#070812' }} />
      </div>
      {/* Inner dot */}
      <div
        className="relative z-10 rounded-full"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background: 'linear-gradient(135deg, #7C5CFF, #00E5FF)',
          boxShadow: '0 0 12px rgba(124,92,255,0.8)',
        }}
      />
    </div>
  )
}

/* ─────────────── Animated Aurora Background ─────────────── */
function AuroraBackground() {
  return (
    // position:fixed so it covers whole page while scrolling
    // z-index:-1 ensures it sits BELOW all page content
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Base dark gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #070812 0%, #0D1021 50%, #07090F 100%)' }} />

      {/* Aurora blobs */}
      <div
        className="aurora-1"
        style={{ position: 'absolute', top: '-10%', left: '10%', width: '70vw', height: '70vw', background: 'radial-gradient(ellipse, rgba(124,92,255,0.18) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)' }}
      />
      <div
        className="aurora-2"
        style={{ position: 'absolute', top: '20%', right: '-10%', width: '55vw', height: '55vw', background: 'radial-gradient(ellipse, rgba(0,229,255,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(100px)' }}
      />
      <div
        className="aurora-3"
        style={{ position: 'absolute', bottom: '5%', left: '30%', width: '45vw', height: '45vw', background: 'radial-gradient(ellipse, rgba(77,168,255,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(120px)' }}
      />

      {/* Mesh grid */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(124,92,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Particles */}
      <Particle x={15} y={20} size={3} delay={0} color="rgba(124,92,255,0.9)" />
      <Particle x={80} y={15} size={2} delay={1} color="rgba(0,229,255,0.9)" />
      <Particle x={25} y={75} size={2} delay={2} color="rgba(77,168,255,0.8)" />
      <Particle x={70} y={60} size={3} delay={0.5} color="rgba(124,92,255,0.8)" />
      <Particle x={45} y={35} size={2} delay={3} color="rgba(0,229,255,0.7)" />
      <Particle x={90} y={80} size={2} delay={1.5} color="rgba(53,243,167,0.7)" />
      <Particle x={5}  y={55} size={3} delay={2.5} color="rgba(124,92,255,0.6)" />
      <Particle x={60} y={90} size={2} delay={4}   color="rgba(77,168,255,0.8)" />
      <Particle x={35} y={8}  size={2} delay={1.2} color="rgba(0,229,255,0.6)" />
      <Particle x={55} y={50} size={2} delay={3.5} color="rgba(124,92,255,0.5)" />
    </div>
  )
}

/* ─────────────── Glassmorphism Navbar ─────────────── */
function Navbar({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 transition-all duration-500"
      style={{
        zIndex: 100,
        height: 80,
        background: scrolled ? 'rgba(7,8,18,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <LogoRing size={36} />
          <span
            className="text-xl font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(90deg, #7C5CFF, #4DA8FF, #00E5FF)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EchoYou
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: '#A9B2C7', fontFamily: 'var(--font-inter)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A9B2C7')}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <Link
              href="/sign-in"
              className="hidden md:block text-sm font-medium transition-colors duration-200"
              style={{ color: '#A9B2C7', fontFamily: 'var(--font-inter)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#A9B2C7')}
            >
              Sign In
            </Link>
          )}
          <Link
            href={isLoggedIn ? '/dashboard' : '/sign-up'}
            className="relative group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              fontFamily: 'var(--font-inter)',
              background: 'rgba(18,20,35,0.9)',
              border: '1px solid rgba(124,92,255,0.5)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(124,92,255,0.2)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(124,92,255,0.5), 0 0 60px rgba(124,92,255,0.15)'
              e.currentTarget.style.borderColor = 'rgba(124,92,255,0.9)'
              e.currentTarget.style.transform = 'scale(1.04)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(124,92,255,0.2)'
              e.currentTarget.style.borderColor = 'rgba(124,92,255,0.5)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isLoggedIn ? 'Dashboard' : 'Get Started'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}

/* ─────────────── Variants ─────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const LANGUAGES = [
  'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'React', 'Node.js',
  'SQL', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'Redis',
  // duplicated for seamless loop
  'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'React', 'Node.js',
  'SQL', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'Redis',
]

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Interviewer',
    desc: 'Speak with a hyper-realistic voice AI that mirrors senior engineers from Google, Meta, and Stripe — asking follow-ups, pushing back on weak answers, and adapting in real-time.',
    color: '#7C5CFF',
    glow: 'rgba(124,92,255,0.25)',
  },
  {
    icon: FileSearch,
    title: 'ATS Resume Lab',
    desc: 'Upload your resume and receive an instant ATS compatibility score. The AI flags missing keywords, formatting issues, and impact gaps before any human recruiter does.',
    color: '#4DA8FF',
    glow: 'rgba(77,168,255,0.25)',
  },
  {
    icon: Activity,
    title: 'Performance Analytics',
    desc: 'A comprehensive dashboard tracks your interview history, coding accuracy, communication quality, and confidence score across every session.',
    color: '#00E5FF',
    glow: 'rgba(0,229,255,0.25)',
  },
  {
    icon: Zap,
    title: 'In-Browser Coding IDE',
    desc: 'Write, run, and debug code directly in the browser. Supports 10+ languages with real test case execution, time complexity analysis, and AI-driven hints.',
    color: '#7C5CFF',
    glow: 'rgba(124,92,255,0.25)',
  },
  {
    icon: Award,
    title: 'Neural Badges',
    desc: 'Gamified progression system. Earn animated achievement badges and unlock advanced challenges by proving your skills across categories.',
    color: '#35F3A7',
    glow: 'rgba(53,243,167,0.25)',
  },
  {
    icon: Target,
    title: 'Resume Followups',
    desc: 'Upload your resume and jump straight into questions tailored to your actual experience. The AI has read everything — be ready.',
    color: '#4DA8FF',
    glow: 'rgba(77,168,255,0.25)',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Configure',
    desc: 'Set your target role, difficulty, and language. The platform personalises every question to match real-world expectations for your exact job description.',
    color: '#7C5CFF',
  },
  {
    num: '02',
    title: 'Simulate',
    desc: 'Face a live, voice-driven AI interviewer. Answer OOPS, CN, OS, DBMS, and DSA questions. Code directly in the built-in IDE with real test case execution.',
    color: '#4DA8FF',
  },
  {
    num: '03',
    title: 'Evolve',
    desc: 'Receive a FAANG-level scorecard covering 7 dimensions. Pinpoint mistakes, track improvement, and follow a structured plan to land your dream role.',
    color: '#00E5FF',
  },
]

const STATS = [
  { value: '50K+', label: 'Interviews Completed' },
  { value: '94%', label: 'User Satisfaction' },
  { value: '10+', label: 'Languages Supported' },
  { value: '3×', label: 'Faster Improvement' },
]

/* ─────────────── Main Component ─────────────── */
export default function LandingClient({ isLoggedIn }: { isLoggedIn?: boolean }) {
  const [introDone, setIntroDone] = useState(false)

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('echoyou_intro_seen', 'true')
    } catch (e) {}
    setIntroDone(true)
  }

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -40])

  if (!introDone) {
    return <IntroSequence onComplete={handleIntroComplete} />
  }

  return (
    // Root wrapper: background colour only — NO z-index, NO noise pseudo-element
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: '#070812', isolation: 'isolate' }}
    >
      {/* Layer 0 (z:-1): Aurora + particles — fixed, behind everything */}
      <AuroraBackground />

      {/* Layer 100: Sticky navbar */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* ── HERO (Layer 50) ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 50,
          isolation: 'isolate',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingTop: 100,
          paddingBottom: 60,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-8"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(124,92,255,0.12)',
                  border: '1px solid rgba(124,92,255,0.35)',
                  color: '#A9B2C7',
                  fontFamily: 'var(--font-inter)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span style={{ background: 'linear-gradient(90deg,#7C5CFF,#00E5FF)', borderRadius: '50%', width: 8, height: 8, display: 'inline-block' }} />
                The Next-Generation AI Interview Platform
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontWeight: 800,
                fontSize: 'clamp(52px, 8vw, 96px)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              Interview Smarter.<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #7C5CFF 0%, #4DA8FF 50%, #00E5FF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Own Your Future.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mx-auto text-lg leading-relaxed"
              style={{
                maxWidth: 680,
                color: '#A9B2C7',
                fontFamily: 'var(--font-inter)',
                lineHeight: 1.75,
                fontWeight: 400,
              }}
            >
              A cinematic, AI-powered platform that simulates real high-pressure technical interviews
              with brutal precision — so the actual interview feels like a warm-up.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={isLoggedIn ? '/dashboard' : '/sign-up'}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #7C5CFF 0%, #4DA8FF 60%, #00E5FF 100%)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-inter)',
                  boxShadow: '0 0 40px rgba(124,92,255,0.4), 0 4px 32px rgba(0,0,0,0.4)',
                  fontSize: 16,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(124,92,255,0.6), 0 8px 40px rgba(0,0,0,0.5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(124,92,255,0.4), 0 4px 32px rgba(0,0,0,0.4)'
                }}
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Start Free Today'}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300"
                style={{
                  background: 'rgba(18,20,35,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#A9B2C7',
                  fontFamily: 'var(--font-inter)',
                  backdropFilter: 'blur(12px)',
                  fontSize: 16,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124,92,255,0.5)'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = '#A9B2C7'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 pt-4 flex-wrap">
              {['No credit card required', 'Start in 60 seconds', 'Cancel anytime'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm" style={{ color: '#6E758B', fontFamily: 'var(--font-inter)' }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#35F3A7' }} />
                  {t}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: '#6E758B' }}
        >
          <span className="text-xs" style={{ fontFamily: 'var(--font-inter)' }}>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, rgba(124,92,255,0.8), transparent)' }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div
        className="relative overflow-hidden py-8 border-y"
        style={{
          borderColor: 'rgba(255,255,255,0.06)',
          background: 'rgba(13,16,33,0.6)',
          backdropFilter: 'blur(12px)',
          zIndex: 50,
        }}
      >
        <div className="absolute left-0 inset-y-0 w-32 pointer-events-none z-10" style={{ background: 'linear-gradient(to right, #070812, transparent)' }} />
        <div className="absolute right-0 inset-y-0 w-32 pointer-events-none z-10" style={{ background: 'linear-gradient(to left, #070812, transparent)' }} />
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#6E758B', fontFamily: 'var(--font-inter)' }}>
          Supported Environments
        </p>
        <div className="flex whitespace-nowrap marquee-track gap-12 items-center">
          {LANGUAGES.map((lang, i) => (
            <span
              key={i}
              className="text-2xl font-bold transition-colors duration-200"
              style={{
                color: i % 3 === 0 ? 'rgba(124,92,255,0.4)' : i % 3 === 1 ? 'rgba(77,168,255,0.3)' : 'rgba(0,229,255,0.3)',
                fontFamily: 'var(--font-space-grotesk)',
              }}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="relative py-20 px-6" style={{ zIndex: 10 }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map(({ value, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  background: 'linear-gradient(135deg, #7C5CFF, #00E5FF)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {value}
              </div>
              <div className="text-sm" style={{ color: '#6E758B', fontFamily: 'var(--font-inter)' }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#7C5CFF', fontFamily: 'var(--font-inter)' }}>
              The Echo Protocol
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold"
              style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.02em', color: '#ffffff' }}
            >
              Three steps to mastery.
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="group flex flex-col md:flex-row gap-8 items-start p-8 rounded-3xl transition-all duration-500 cursor-default"
                style={{
                  background: 'rgba(18,20,35,0.75)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${step.color}40`
                  e.currentTarget.style.boxShadow = `0 0 60px ${step.color}15`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  className="text-5xl font-black shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}40`,
                    color: step.color,
                    boxShadow: `0 0 30px ${step.color}30`,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-space-grotesk)', color: '#ffffff' }}>
                    {step.title}
                  </h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#A9B2C7', fontFamily: 'var(--font-inter)', lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section id="features" className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#4DA8FF', fontFamily: 'var(--font-inter)' }}>
              Platform Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-5xl md:text-6xl font-bold"
              style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.02em', color: '#ffffff' }}
            >
              Everything you need to win.
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color, glow }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group p-8 rounded-3xl transition-all duration-500 cursor-default"
                style={{
                  background: 'rgba(18,20,35,0.75)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}40`
                  e.currentTarget.style.boxShadow = `0 20px 60px ${glow}, 0 0 0 1px ${color}20`
                  e.currentTarget.style.transform = 'translateY(-8px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}35`,
                    boxShadow: `0 0 20px ${glow}`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-space-grotesk)', color: '#ffffff' }}>
                  {title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#A9B2C7', fontFamily: 'var(--font-inter)', lineHeight: 1.7, fontSize: 15 }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mx-auto text-center p-16 rounded-3xl relative overflow-hidden"
          style={{
            background: 'rgba(18,20,35,0.85)',
            border: '1px solid rgba(124,92,255,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Glow blobs inside card */}
          <div className="absolute -top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124,92,255,0.15), transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute -bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.12), transparent 70%)', filter: 'blur(60px)' }} />

          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-widest mb-6" style={{ color: '#7C5CFF', fontFamily: 'var(--font-inter)' }}>
              Ready to transform your career?
            </p>
            <h2
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '-0.02em', color: '#ffffff' }}
            >
              Your dream job is one
              <br />
              <span style={{ background: 'linear-gradient(135deg, #7C5CFF, #4DA8FF, #00E5FF)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                interview away.
              </span>
            </h2>
            <p className="mb-10 mx-auto" style={{ maxWidth: 520, color: '#A9B2C7', fontFamily: 'var(--font-inter)', lineHeight: 1.7, fontSize: 17 }}>
              Join thousands of engineers who cracked their dream company after just 2 weeks of EchoYou practice.
            </p>
            <Link
              href={isLoggedIn ? '/dashboard' : '/sign-up'}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7C5CFF 0%, #4DA8FF 60%, #00E5FF 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-inter)',
                boxShadow: '0 0 50px rgba(124,92,255,0.5)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 0 80px rgba(124,92,255,0.7)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 0 50px rgba(124,92,255,0.5)'
              }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Begin Your Journey'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="relative py-12 px-6 border-t text-center"
        style={{ borderColor: 'rgba(255,255,255,0.06)', zIndex: 10 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoRing size={28} />
            <span
              className="font-bold"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                background: 'linear-gradient(90deg, #7C5CFF, #00E5FF)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EchoYou
            </span>
          </div>
          <p className="text-sm" style={{ color: '#6E758B', fontFamily: 'var(--font-inter)' }}>
            © {new Date().getFullYear()} EchoYou. Built to make you interview-ready.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: '#6E758B', fontFamily: 'var(--font-inter)' }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a
                key={l}
                href="#"
                className="transition-colors duration-200"
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6E758B')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
