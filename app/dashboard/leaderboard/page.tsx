import { db } from '@/lib/db'
import { Trophy, Medal, Award, Flame, Target, Star, Crown, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  // Fetch all real non-dummy users
  const profiles = await db.profile.findMany({
    where: {
      user: {
        email: {
          not: {
            contains: 'example.com'
          }
        }
      }
    },
    select: {
      id: true,
      clerkId: true,
      currentStreak: true,
      role: true,
      customAvatarUrl: true,
      badges: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true
        }
      }
    }
  })

  // Calculate GENUINE points for each candidate by summing up scores from actual completed interviews in DB
  const genuineLeaderboard = await Promise.all(
    profiles.map(async (profile) => {
      const completedInterviews = await db.interview.findMany({
        where: {
          clerkId: profile.clerkId,
          status: 'completed'
        },
        select: {
          score: true
        }
      })

      // Calculate total genuine XP points (Sum of actual completed interview scores)
      const genuinePoints = completedInterviews.reduce((acc, curr) => acc + Math.round(curr.score || 0), 0)

      return {
        ...profile,
        points: genuinePoints,
        interviewsCompleted: completedInterviews.length
      }
    })
  )

  // Filter out users with 0 genuine points & sort by genuine points descending
  const topProfiles = genuineLeaderboard
    .filter(p => p.points > 0 && p.interviewsCompleted > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 50)

  const top3 = topProfiles.slice(0, 3)
  const restOfUsers = topProfiles.slice(3)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0E14] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center gap-4 mb-16">
          <Link href="/dashboard" className="p-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Global Leaderboard
            </h1>
            <p className="text-gray-400">Compete with engineers worldwide. Climb the ranks by practicing more interviews.</p>
          </div>
        </div>

      {topProfiles.length === 0 ? (
        <div className="bg-[#1C1F26] border border-gray-800 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4 my-12 shadow-2xl">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto animate-bounce" />
          <h2 className="text-xl font-bold text-white tracking-wide uppercase">No Contributions Yet</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            No active candidates have completed interview sessions yet. Start your first AI interview practice session now to claim Rank #1 on the Global Leaderboard!
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/interviews/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              🚀 Start First Interview
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-8 pt-12 sm:pt-24 pb-8 sm:pb-16 mb-8 sm:mb-16 w-full max-w-xl mx-auto">
            
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className="flex flex-col items-center gap-2 sm:gap-4 w-1/3 animate-in slide-in-from-bottom-8 duration-700 delay-100 shrink-0">
                <div className="relative">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 absolute -top-7 sm:-top-10 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" />
                  <img src={top3[1].user?.imageUrl || top3[1].customAvatarUrl || ''} alt="" className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.4)] bg-gray-800 object-cover" />
                  <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-gray-900 font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">2</div>
                </div>
                <div className="text-center w-full px-1">
                  <div className="font-semibold text-xs sm:text-base text-gray-200 truncate">{top3[1].user?.firstName || 'Candidate'} {top3[1].user?.lastName || ''}</div>
                  <div className="text-[10px] sm:text-sm font-medium text-gray-400">{top3[1].points.toLocaleString()} pts</div>
                </div>
                <div className="w-full h-24 sm:h-32 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700/50 rounded-t-lg border-t-2 border-gray-500/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {top3[0] && (
              <div className="flex flex-col items-center gap-2 sm:gap-4 w-1/3 -mt-6 sm:-mt-12 animate-in slide-in-from-bottom-12 duration-700 shrink-0">
                <div className="relative">
                  <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-400 absolute -top-9 sm:-top-14 left-1/2 -translate-x-1/2 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse" />
                  <img src={top3[0].user?.imageUrl || top3[0].customAvatarUrl || ''} alt="" className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] bg-gray-800 z-10 relative object-cover" />
                  <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-base shadow-lg z-20">1</div>
                </div>
                <div className="text-center w-full px-1">
                  <div className="font-bold text-xs sm:text-lg text-white truncate">{top3[0].user?.firstName || 'Candidate'} {top3[0].user?.lastName || ''}</div>
                  <div className="text-[10px] sm:text-sm font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">{top3[0].points.toLocaleString()} pts</div>
                </div>
                <div className="w-full h-32 sm:h-44 bg-gradient-to-t from-gray-900 via-yellow-900/40 to-yellow-700/30 rounded-t-lg border-t-2 border-yellow-500/80 flex items-center justify-center relative overflow-hidden shadow-[0_-10px_40px_rgba(250,204,21,0.15)]">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(250,204,21,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className="flex flex-col items-center gap-2 sm:gap-4 w-1/3 animate-in slide-in-from-bottom-8 duration-700 delay-200 shrink-0">
                <div className="relative">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 absolute -top-7 sm:-top-10 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]" />
                  <img src={top3[2].user?.imageUrl || top3[2].customAvatarUrl || ''} alt="" className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-amber-700 shadow-[0_0_20px_rgba(217,119,6,0.4)] bg-gray-800 object-cover" />
                  <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg">3</div>
                </div>
                <div className="text-center w-full px-1">
                  <div className="font-semibold text-xs sm:text-base text-gray-200 truncate">{top3[2].user?.firstName || 'Candidate'} {top3[2].user?.lastName || ''}</div>
                  <div className="text-[10px] sm:text-sm font-medium text-gray-400">{top3[2].points.toLocaleString()} pts</div>
                </div>
                <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-gray-900 via-amber-950/40 to-amber-800/30 rounded-t-lg border-t-2 border-amber-600/50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(217,119,6,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Ranks 4+ List */}
          {restOfUsers.length > 0 && (
            <div className="bg-[#1C1F26] border border-gray-800 rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom-12 duration-700 delay-300">
              <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between text-sm font-medium text-gray-400">
                <div className="w-16">Rank</div>
                <div className="flex-1">Engineer</div>
                <div className="w-24 text-center hidden sm:block">Streaks</div>
                <div className="w-24 text-right">Points</div>
              </div>
              
              <div className="divide-y divide-gray-800">
                {restOfUsers.map((profile, index) => (
                  <div key={profile.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors group">
                    <div className="w-16 font-bold text-gray-500">#{index + 4}</div>
                    <div className="flex-1 flex items-center gap-4">
                      <img src={profile.user.imageUrl || ''} alt="" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 group-hover:border-cyan-500/50 transition-colors" />
                      <div>
                        <div className="font-semibold text-gray-200">{profile.user.firstName} {profile.user.lastName}</div>
                        <div className="text-xs text-gray-500">{profile.role || 'Software Engineer'}</div>
                      </div>
                      {/* Badges */}
                      <div className="hidden md:flex items-center gap-2 ml-4">
                        {profile.badges.map((badge, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-800 border border-gray-700 text-gray-300 flex items-center gap-1">
                            <Medal className="w-3 h-3 text-cyan-400" /> {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-24 text-center hidden sm:flex items-center justify-center gap-1 text-orange-400 font-medium">
                      <Flame className="w-4 h-4" /> {profile.currentStreak}
                    </div>
                    <div className="w-24 text-right font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {profile.points.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
    </div>
  )
}
