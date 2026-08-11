import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Laptop, Smartphone, Monitor } from 'lucide-react'

export default async function SessionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const client = await clerkClient()
  const sessions = await client.sessions.getSessionList({ userId })

  function getDeviceIcon(deviceType: string) {
    if (deviceType?.includes('Mobile') || deviceType?.includes('iPhone') || deviceType?.includes('Android')) return <Smartphone className="w-5 h-5 text-gray-400" />
    if (deviceType?.includes('Mac') || deviceType?.includes('Windows') || deviceType?.includes('Linux')) return <Laptop className="w-5 h-5 text-gray-400" />
    return <Monitor className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-[#111620] border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Active Sessions</h2>
        <p className="text-sm text-gray-400 mb-6">These are the devices that have logged into your account. Revoke any sessions that you do not recognize.</p>
        
        <div className="space-y-4">
          {sessions.data.map(session => {
            const isCurrent = session.status === 'active'
            const browser = session.latestActivity?.deviceType || 'Unknown Device'
            const ip = session.latestActivity?.ipAddress || 'Unknown IP'
            const lastActive = new Date(session.lastActiveAt).toLocaleString()

            return (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-800 rounded-lg bg-[#0B0E14]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center border border-gray-800">
                    {getDeviceIcon(browser)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{browser}</p>
                      {isCurrent && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          Current Session
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IP: {ip} • Last active: {lastActive}</p>
                  </div>
                </div>
                {!isCurrent && (
                  <form action={async () => {
                    'use server'
                    const client = await clerkClient()
                    await client.sessions.revokeSession(session.id)
                  }}>
                    <button className="text-xs text-red-400 hover:text-red-300 font-medium px-3 py-1.5 rounded-md hover:bg-red-400/10 transition-colors">
                      Revoke
                    </button>
                  </form>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
