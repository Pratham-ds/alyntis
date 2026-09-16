import { useEffect, useState, useCallback } from 'react';
import { Trophy, Loader2, Crown, Medal, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { StudentPointsSummary, InnovationPointsLog, InnovationReason } from '@/types';
import { POINT_LABELS } from '@/lib/innovation';

type Period = 'week' | 'month' | 'term' | 'all';

const PERIOD_LABELS: Record<Period, string> = {
  week: 'This Week',
  month: 'This Month',
  term: 'This Term',
  all: 'All Time',
};

const CLASS_FILTERS = ['All', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Senior'];

function periodStart(period: Period): string | null {
  if (period === 'all') return null;
  const now = new Date();
  if (period === 'week') {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start.toISOString();
  }
  if (period === 'month') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 1);
    return start.toISOString();
  }
  if (period === 'term') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 4);
    return start.toISOString();
  }
  return null;
}

export default function Leaderboard() {
  const { profile } = useAuth();
  const [period, setPeriod] = useState<Period>('all');
  const [classFilter, setClassFilter] = useState('All');
  const [entries, setEntries] = useState<StudentPointsSummary[]>([]);
  const [periodPoints, setPeriodPoints] = useState<Record<string, number>>({});
  const [myPoints, setMyPoints] = useState(0);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);

    const { data: summaryData } = await supabase
      .from('student_points_summary')
      .select('*')
      .eq('school', profile?.school || '')
      .order('total_points', { ascending: false });

    let filtered = (summaryData as StudentPointsSummary[]) || [];
    if (classFilter !== 'All') {
      filtered = filtered.filter((e) => e.class_level === classFilter);
    }

    // For period filtering, fetch points log for the period
    const startDate = periodStart(period);
    let periodMap: Record<string, number> = {};

    if (startDate) {
      const { data: logData } = await supabase
        .from('innovation_points_log')
        .select('student_id, points, created_at')
        .gte('created_at', startDate);

      if (logData) {
        (logData as InnovationPointsLog[]).forEach((log) => {
          periodMap[log.student_id] = (periodMap[log.student_id] || 0) + log.points;
        });
      }

      // Re-rank based on period points
      filtered = filtered
        .map((e) => ({ ...e, total_points: periodMap[e.student_id] || 0 }))
        .sort((a, b) => b.total_points - a.total_points);
    }

    setEntries(filtered);
    setPeriodPoints(periodMap);

    // Find my rank
    const myEntry = filtered.find((e) => e.student_id === profile?.id);
    if (myEntry) {
      const rank = filtered.findIndex((e) => e.student_id === profile?.id) + 1;
      setMyRank(rank);
      setMyPoints(myEntry.total_points);
    } else {
      setMyRank(null);
      setMyPoints(0);
    }

    setLoading(false);
  }, [period, classFilter, profile?.id, profile?.school]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Calculate points needed for next rank
  let pointsToNext = 0;
  if (myRank && myRank > 1) {
    const above = entries[myRank - 2];
    if (above) pointsToNext = above.total_points - myPoints + 1;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Innovation Leaderboard</h2>
          <p className="text-xs text-gray-400">
            {profile?.school ? `${profile.school} · ` : ''}Compete with your schoolmates
          </p>
        </div>
      </div>

      {/* Period filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              period === p ? 'bg-teal-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Class filter */}
      <div className="mt-2 flex flex-wrap gap-2">
        {CLASS_FILTERS.map((cls) => (
          <button
            key={cls}
            onClick={() => setClassFilter(cls)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              classFilter === cls ? 'bg-navy-700 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* My rank summary */}
      {myRank !== null && (
        <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Your Rank</p>
              <p className="text-2xl font-bold text-white">#{myRank}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Your Points</p>
              <p className="text-2xl font-bold text-teal-400">{myPoints}</p>
            </div>
          </div>
          {pointsToNext > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {pointsToNext} points to reach rank #{myRank - 1}
            </p>
          )}
          {myRank === 1 && (
            <p className="mt-2 text-xs font-semibold text-amber-400">
              You're leading the leaderboard!
            </p>
          )}
        </div>
      )}

      {/* Leaderboard entries */}
      {loading ? (
        <div className="mt-4 flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        </div>
      ) : entries.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-white/10 p-6 text-center">
          <Award className="mx-auto h-8 w-8 text-gray-600" />
          <p className="mt-2 text-xs text-gray-500">
            No rankings yet. Complete projects to earn innovation points!
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-1.5 max-h-[400px] overflow-y-auto">
          {entries.map((entry, idx) => {
            const rank = idx + 1;
            const isMe = entry.student_id === profile?.id;
            const displayPoints = period === 'all' ? entry.total_points : (periodPoints[entry.student_id] || 0);

            if (displayPoints === 0 && period !== 'all') return null;

            return (
              <div
                key={entry.student_id}
                className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                  isMe ? 'border border-teal-500/30 bg-teal-500/10' : 'border border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
                  {rank === 1 ? (
                    <Crown className="h-5 w-5 text-amber-400" />
                  ) : rank === 2 ? (
                    <Medal className="h-5 w-5 text-gray-300" />
                  ) : rank === 3 ? (
                    <Medal className="h-5 w-5 text-orange-400" />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">{rank}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${isMe ? 'text-teal-400' : 'text-white'}`}>
                    {entry.full_name || 'Student'}
                    {isMe && ' (You)'}
                  </p>
                  {entry.class_level && (
                    <p className="text-xs text-gray-500">{entry.class_level}</p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-white">{displayPoints}</p>
                  <p className="text-[10px] text-gray-500">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
