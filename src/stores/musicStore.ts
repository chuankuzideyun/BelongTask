import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SAMPLE_CHALLENGES, cloneChallenges } from '../constants/challenges';
import type { MusicChallenge, MusicStore } from '../types';
import { create } from 'zustand';

function mergeChallenges(base: MusicChallenge[], existing: MusicChallenge[]) {
  return base.map((challenge) => {
    const saved = existing.find((item) => item.id === challenge.id);

    return saved
      ? {
          ...challenge,
          completed: saved.completed,
          progress: saved.progress,
          completedAt: saved.completedAt,
        }
      : challenge;
  });
}

export const useMusicStore = create<MusicStore>()(
  persist(
    (set, get) => ({
      challenges: cloneChallenges(SAMPLE_CHALLENGES),
      currentTrack: null,
      isPlaying: false,
      currentPosition: 0,
      loadChallenges: () => {
        set((state) => ({
          challenges: mergeChallenges(cloneChallenges(SAMPLE_CHALLENGES), state.challenges),
        }));
      },
      setCurrentTrack: (track) =>
        set({
          currentTrack: track,
          currentPosition: track?.progress ? Math.round((track.progress / 100) * track.duration) : 0,
        }),
      setPlaying: (value) => set({ isPlaying: value }),
      updateProgress: (challengeId, progress) =>
        set((state) => {
          const challenges = state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  progress: Math.max(0, Math.min(100, progress)),
                }
              : challenge,
          );

          const currentTrack =
            state.currentTrack?.id === challengeId
              ? {
                  ...state.currentTrack,
                  progress: Math.max(0, Math.min(100, progress)),
                }
              : state.currentTrack;

          const currentPosition =
            state.currentTrack?.id === challengeId
              ? Math.round((Math.max(0, Math.min(100, progress)) / 100) * state.currentTrack.duration)
              : state.currentPosition;

          return { challenges, currentTrack, currentPosition };
        }),
      markChallengeComplete: (challengeId) =>
        set((state) => {
          const completedAt = new Date().toISOString();
          const challenges = state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  completed: true,
                  progress: 100,
                  completedAt,
                }
              : challenge,
          );

          const currentTrack =
            state.currentTrack?.id === challengeId
              ? {
                  ...state.currentTrack,
                  completed: true,
                  progress: 100,
                  completedAt,
                }
              : state.currentTrack;

          return {
            challenges,
            currentTrack,
            isPlaying: false,
            currentPosition:
              state.currentTrack?.id === challengeId ? state.currentTrack.duration : state.currentPosition,
          };
        }),
      resetChallengeProgress: (challengeId) =>
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  completed: false,
                  progress: 0,
                  completedAt: undefined,
                }
              : challenge,
          ),
        })),
    }),
    {
      name: 'belongtask-music-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        challenges: state.challenges,
        currentTrack: state.currentTrack,
        isPlaying: state.isPlaying,
        currentPosition: state.currentPosition,
      }),
    },
  ),
);
