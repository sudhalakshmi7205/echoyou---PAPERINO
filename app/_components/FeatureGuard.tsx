'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { isAdminEmail } from '@/lib/adminAuth'
import { FeatureKey } from '@/lib/featureToggles'
import { Wrench, ShieldAlert, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface FeatureGuardProps {
  featureKey: FeatureKey
  featureName: string
  children: React.ReactNode
}

export default function FeatureGuard({ featureKey, featureName, children }: FeatureGuardProps) {
  const { user } = useUser()
  const [isEnabled, setIsEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  const userEmail = user?.primaryEmailAddress?.emailAddress
  const isAdmin = isAdminEmail(userEmail)

  const checkFeatureStatus = async () => {
    try {
      const res = await fetch('/api/admin/feature-toggles')
      if (res.ok) {
        const data = await res.json()
        if (data.toggles && featureKey in data.toggles) {
          setIsEnabled(Boolean(data.toggles[featureKey]))
        }
      }
    } catch (err) {
      console.error('Error checking feature toggle:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkFeatureStatus()
  }, [featureKey])

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#05060B]">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    )
  }

  // Admin access bypass: Admin can ALWAYS access and make changes!
  if (isAdmin) {
    return (
      <div className="relative w-full h-full">
        {!isEnabled && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-xs font-mono text-amber-300 flex items-center justify-between z-50">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <strong>ADMIN TEST MODE:</strong> This feature ({featureName}) is turned OFF for public users. You can edit and test changes freely!
            </span>
            <span className="bg-amber-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-amber-200">
              Admin Exclusive View
            </span>
          </div>
        )}
        {children}
      </div>
    )
  }

  // If feature is turned OFF for normal students/users: Show Maintenance Screen!
  if (!isEnabled) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#05060B] text-white flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="w-full max-w-lg bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl space-y-6 relative z-10">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Wrench className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 uppercase tracking-widest">
              Under Maintenance
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              {featureName} is Temporarily Offline
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono pt-1">
              Developer Sudha is currently updating and improving this module. Access will be restored shortly!
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={checkFeatureStatus}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-white bg-white/[0.04] transition-all text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Check Status Again</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Command Center</span>
            </Link>
          </div>

        </div>
      </div>
    )
  }

  return <>{children}</>
}
