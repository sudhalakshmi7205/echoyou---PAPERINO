import { db } from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminUsersPage({
  searchParams
}: { searchParams: { q?: string; page?: string } }) {
  const page = parseInt(searchParams.page ?? '1')
  const q = searchParams.q ?? ''
  const pageSize = 20

  const [users, total] = await Promise.all([
    db.user.findMany({
      where: q ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
        ]
      } : {},
      include: {
        profile: { select: { role: true, onboardingCompleted: true, interviewsCompleted: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    db.user.count({
      where: q ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
        ]
      } : {}
    })
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-400 mt-1">Manage all {total} users on the platform</p>
        </div>
        <form className="relative">
          <input 
            name="q"
            defaultValue={q}
            placeholder="Search users..." 
            className="pl-4 pr-10 py-2 bg-[#111620] border border-gray-800 text-sm text-white rounded-lg focus:outline-none focus:border-cyan-500 w-64"
          />
        </form>
      </div>

      <div className="bg-[#111620] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#0B0E14] border-b border-gray-800 text-xs uppercase text-gray-500 font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Target Role</th>
              <th className="px-6 py-4">Interviews</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {u.imageUrl ? (
                      <Image src={u.imageUrl} alt="Avatar" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">{u.firstName?.[0] || '?'}</div>
                    )}
                    <div>
                      <div className="font-medium text-white flex items-center gap-2">
                        {u.firstName} {u.lastName}
                        {u.isAdmin && <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-1.5 py-0.5 rounded">ADMIN</span>}
                      </div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {u.profile?.role || <span className="text-gray-600 italic">Not set</span>}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-800 text-cyan-400 px-2 py-1 rounded-md text-xs font-bold">
                    {u.profile?.interviewsCompleted || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/users/${u.id}`} className="text-cyan-500 hover:text-cyan-400 text-xs font-medium">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No users found matching "{q}"
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-500">
          Showing {users.length} of {total} users
        </p>
        <div className="flex items-center gap-2">
          {page > 1 && (
            <Link href={`/admin/users?page=${page - 1}&q=${q}`} className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700">Previous</Link>
          )}
          {page * pageSize < total && (
            <Link href={`/admin/users?page=${page + 1}&q=${q}`} className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700">Next</Link>
          )}
        </div>
      </div>
    </div>
  )
}
