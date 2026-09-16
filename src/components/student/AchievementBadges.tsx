import { useEffect, useState } from 'react';
import {
  Bot, CircuitBoard, Wifi, Brain, Plane, Box, Lightbulb, Trophy,
  Loader2, Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { BADGES } from '@/lib/innovation';

const BADGE_ICONS: Record<string, LucideIcon> = {
  Bot, CircuitBoard, Wifi, Brain, Plane, Box, Lightbulb, Trophy,
};

export default function AchievementBadges() {
  const { profile } = useAuth();
  const [earnedKeys, setEarnedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('student_achievements')
      .select('badge_key')
      .eq('student_id', profile.id)
      .then(({ data }) => {
        setEarnedKeys(new Set((data || []).map((d: { badge_key: string }) => d.badge_key)));
        setLoading(false);
      });
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Achievement Badges</h2>
          <p className="text-xs text-gray-400">
            {earnedKeys.size} of {BADGES.length} earned
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BADGES.map((badge) => {
          const isEarned = earnedKeys.has(badge.key);
          const Icon = BADGE_ICONS[badge.icon] || Trophy;

          return (
            <div
              key={badge.key}
              className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
                isEarned
                  ? 'border-white/20 bg-white/10'
                  : 'border-white/5 bg-white/[0.02] opacity-60'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isEarned
                    ? `bg-gradient-to-br ${badge.color} shadow-lg`
                    : 'bg-white/5'
                }`}
              >
                {isEarned ? (
                  <Icon className="h-6 w-6 text-white" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <p className={`mt-2 text-xs font-semibold ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                {badge.name}
              </p>
              <p className="mt-0.5 text-[10px] text-gray-500">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
