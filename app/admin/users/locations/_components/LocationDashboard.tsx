'use client'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-[#111620] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
      <div className="text-3xl font-bold text-white mb-2">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function LocationDashboard({ data }: { data: any }) {
  const [tab, setTab] = useState<'country' | 'city' | 'region'>('country')

  return (
    <div>
      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total users" value={data.total} />
        <StatCard label="With location" value={data.withLocation} />
        <StatCard label="Countries" value={data.byCountry.length} />
        <StatCard label="Cities" value={data.byCity.length} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {/* Tabs */}
          <div className="bg-[#111620] border border-gray-800 rounded-xl overflow-hidden mb-8 shadow-2xl">
            <div className="flex border-b border-gray-800 bg-[#0B0E14] px-4 pt-4 gap-2">
              <button 
                onClick={() => setTab('country')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'country' ? 'bg-[#111620] text-white border-t border-x border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}
              >
                By country
              </button>
              <button 
                onClick={() => setTab('city')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'city' ? 'bg-[#111620] text-white border-t border-x border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}
              >
                By city
              </button>
              <button 
                onClick={() => setTab('region')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === 'region' ? 'bg-[#111620] text-white border-t border-x border-gray-800' : 'text-gray-500 hover:text-gray-300'}`}
              >
                By region
              </button>
            </div>
            <div className="p-6">
              {tab === 'country' && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  {data.byCountry.map((c: any) => (
                    <div key={c.country} className="flex items-center gap-4">
                      <div className="w-8 font-mono text-sm font-bold text-gray-400 text-right">{c.countryCode || 'N/A'}</div>
                      <div className="w-32 truncate text-sm font-medium text-white">{c.country || 'Unknown'}</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(c.pct, 1)}%` }} />
                      </div>
                      <div className="w-12 text-right font-semibold text-white text-sm">{c.count}</div>
                      <div className="w-12 text-right text-xs text-gray-500">{c.pct}%</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'city' && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  {data.byCity.map((c: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-48 truncate text-sm font-medium text-white">{c.city || 'Unknown'}, {c.country}</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full" style={{ width: `${Math.max((c.count / data.withLocation) * 100, 1)}%` }} />
                      </div>
                      <div className="w-12 text-right font-semibold text-white text-sm">{c.count}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'region' && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4">
                  {data.byRegion.map((c: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-48 truncate text-sm font-medium text-white">{c.region || 'Unknown'}, {c.country}</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.max((c.count / data.withLocation) * 100, 1)}%` }} />
                      </div>
                      <div className="w-12 text-right font-semibold text-white text-sm">{c.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#111620] border border-gray-800 rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#0B0E14]">
              <h2 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Recent Signups With Location</h2>
              <span className="text-[10px] text-gray-600">LAST 10</span>
            </div>
            <div className="divide-y divide-gray-800 max-h-[665px] overflow-y-auto">
              {data.recent.map((user: any) => (
                <div key={user.id} className="p-4 hover:bg-gray-800/20 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/20">
                      {user.firstName?.[0] || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.firstName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono font-bold bg-gray-800 text-gray-400 px-1 py-0.5 rounded">
                        {user.countryCode}
                      </span>
                      <span className="text-xs font-semibold text-gray-300">
                        {user.city}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt))} ago
                    </p>
                  </div>
                </div>
              ))}
              {data.recent.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">No recent signups</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
