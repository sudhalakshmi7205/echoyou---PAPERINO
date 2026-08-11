'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, FileText, Settings, Bell, Clock, Shield, Link2 } from 'lucide-react'

const SETTINGS_NAV = [
  { href: '/dashboard/settings/profile',       icon: User,         label: 'Profile' },
  { href: '/dashboard/settings/preferences',   icon: Settings,     label: 'Preferences' },
  { href: '/dashboard/settings/notifications', icon: Bell,         label: 'Notifications' },
  { href: '/dashboard/settings/sessions',      icon: Clock,        label: 'Sessions' },
  { href: '/dashboard/settings/account',       icon: Shield,       label: 'Account' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            {SETTINGS_NAV.map(item => {
              const Icon = item.icon
              const isActive = pathname === item.href || (pathname === '/dashboard/settings' && item.href === '/dashboard/settings/profile')

              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
}
