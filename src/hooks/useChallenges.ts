import { useMemo } from 'react';
import { useMusicStore } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

export interface UseChallengesReturn {
  loading: boolean;
  error: string | null;
  refreshChallenges: () => void;
  completeChallenge: (challengeId: string) => void;
}

export function useChallenges(): UseChallengesReturn {
  const loading = false;
  const error = null;
  const refreshChallenges = useMusicStore((state) => state.loadChallenges);
  const completeChallenge = useUserStore((state) => state.completeChallenge);

  return useMemo(
    () => ({
      loading,
      error,
      refreshChallenges,
      completeChallenge,
    }),
    [error, loading, refreshChallenges, completeChallenge],
  );
}
