import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
import type { UserStore } from '../types';

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      totalPoints: 0,
      completedChallenges: [],
      addPoints: (points) =>
        set((state) => ({
          totalPoints: state.totalPoints + points,
        })),
      completeChallenge: (challengeId) =>
        set((state) => ({
          completedChallenges: state.completedChallenges.includes(challengeId)
            ? state.completedChallenges
            : [...state.completedChallenges, challengeId],
        })),
      resetProgress: () =>
        set({
          totalPoints: 0,
          completedChallenges: [],
        }),
    }),
    {
      name: 'belongtask-user-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        totalPoints: state.totalPoints,
        completedChallenges: state.completedChallenges,
      }),
    },
  ),
);
