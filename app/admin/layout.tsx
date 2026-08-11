import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Users, FileText, Database, Settings } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect('/sign-in')

  const user = await db.user.findUnique({
    where: { clerkId: clerkUser.id }
  })

  // Auth Guard
  if (!user?.isAdmin) {
    redirect('/dashboard')
  }

  const ADMIN_NAV = [
    { href: '/admin/users',      icon: Users,    label: 'Users' },
    { href: '/admin/interviews', icon: Database, label: 'Interviews' },
    { href: '/admin/prompts',    icon: FileText, label: 'AI Prompts' },
    { href: '/admin/flags',      icon: Settings, label: 'Flagged Sessions' },
  ]

  return (
    <div className="flex h-screen bg-[#0B0E14] text-white">
      <aside className="w-64 border-r border-gray-800 bg-[#111620] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400">
            EchoAdmin
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/dashboard" className="text-sm text-cyan-400 hover:text-cyan-300">
            &larr; Back to App
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
