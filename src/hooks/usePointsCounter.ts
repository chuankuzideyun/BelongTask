import { useMemo } from 'react';
import { useMusicStore } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';

export interface UsePointsCounterReturn {
  currentPoints: number;
  pointsEarned: number;
  progress: number;
  isActive: boolean;
}

export function usePointsCounter(): UsePointsCounterReturn {
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const currentPosition = useMusicStore((state) => state.currentPosition);
  const totalPoints = useUserStore((state) => state.totalPoints);

  return useMemo(() => {
    const progress = currentTrack ? (currentPosition / currentTrack.duration) * 100 : 0;
    const pointsEarned = currentTrack ? Math.floor((progress / 100) * currentTrack.points) : 0;

    return {
      currentPoints: totalPoints + pointsEarned,
      pointsEarned,
      progress,
      isActive: isPlaying,
    };
  }, [currentPosition, currentTrack, isPlaying, totalPoints]);
}
