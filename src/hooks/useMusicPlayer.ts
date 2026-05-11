import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeModules } from 'react-native';
import {
  ensureTrackPlayerReady,
  loadSingleTrack,
  pauseCurrentTrack,
  playCurrentTrack,
  seekCurrentTrack,
  stopCurrentTrack,
} from '../services/audioService';
import { useMusicStore } from '../stores/musicStore';
import { useUserStore } from '../stores/userStore';
import type { MusicChallenge } from '../types';

export interface UseMusicPlayerReturn {
  isPlaying: boolean;
  currentTrack: MusicChallenge | null;
  currentPosition: number;
  duration: number;
  loading: boolean;
  error: string | null;
  play: (track: MusicChallenge) => Promise<void>;
  pause: () => void;
  seekTo: (seconds: number) => void;
  stop: () => void;
}

export function useMusicPlayer(): UseMusicPlayerReturn {
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const currentPosition = useMusicStore((state) => state.currentPosition);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const setCurrentTrack = useMusicStore((state) => state.setCurrentTrack);
  const setPlaying = useMusicStore((state) => state.setPlaying);
  const updateProgress = useMusicStore((state) => state.updateProgress);
  const markChallengeComplete = useMusicStore((state) => state.markChallengeComplete);
  const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const awardedTrackIdRef = useRef<string | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const finalizeTrack = useCallback(
    (track: MusicChallenge) => {
      clearProgressTimer();
      setPlaying(false);

      if (!completedChallenges.includes(track.id) && awardedTrackIdRef.current !== track.id) {
        awardedTrackIdRef.current = track.id;
        markChallengeComplete(track.id);
        addPoints(track.points);
        completeChallenge(track.id);
      }
    },
    [addPoints, clearProgressTimer, completeChallenge, completedChallenges, markChallengeComplete, setPlaying],
  );

  useEffect(() => {
    let mounted = true;

    async function primeTrackPlayer() {
      if (!NativeModules.TrackPlayerModule) {
        return;
      }

      try {
        await ensureTrackPlayerReady();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Playback failed');
        }
      }
    }

    void primeTrackPlayer();

    return () => {
      mounted = false;
      clearProgressTimer();
    };
  }, [clearProgressTimer]);

  useEffect(() => {
    if (!isPlaying || !currentTrack) {
      clearProgressTimer();
      return;
    }

    clearProgressTimer();
    progressTimerRef.current = setInterval(() => {
      const latestTrack = useMusicStore.getState().currentTrack ?? currentTrack;
      const latestPosition = useMusicStore.getState().currentPosition;
      const nextPosition = Math.min(latestTrack.duration, latestPosition + 1);
      const nextProgress = Math.min(100, (nextPosition / latestTrack.duration) * 100);

      updateProgress(latestTrack.id, nextProgress);

      if (nextPosition >= latestTrack.duration) {
        finalizeTrack(latestTrack);
      }
    }, 1000);

    return clearProgressTimer;
  }, [clearProgressTimer, currentTrack, finalizeTrack, isPlaying, updateProgress]);

  const play = useCallback(
    async (track: MusicChallenge) => {
      try {
        setLoading(true);
        setError(null);
        clearProgressTimer();
        awardedTrackIdRef.current = completedChallenges.includes(track.id) ? track.id : null;
        if (NativeModules.TrackPlayerModule) {
          await ensureTrackPlayerReady();

          const shouldReset = currentTrack?.id !== track.id;

          if (shouldReset) {
            await loadSingleTrack(track);
          }

          await playCurrentTrack();
        } else {
          throw new Error('Audio playback requires a development build with react-native-track-player installed.');
        }

        setCurrentTrack(track);
        updateProgress(track.id, track.progress ?? 0);
        setPlaying(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Playback failed');
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    },
    [clearProgressTimer, completedChallenges, currentTrack?.id, setCurrentTrack, setPlaying, updateProgress],
  );

  const pause = useCallback(() => {
    clearProgressTimer();
    void pauseCurrentTrack();
    setPlaying(false);
  }, [clearProgressTimer, setPlaying]);

  const seekTo = useCallback(
    (seconds: number) => {
      const resolvedTrack = currentTrack;
      if (!resolvedTrack) {
        return;
      }

      const clamped = Math.max(0, Math.min(resolvedTrack.duration, seconds));
      void seekCurrentTrack(clamped);
      updateProgress(resolvedTrack.id, (clamped / resolvedTrack.duration) * 100);
    },
    [currentTrack, updateProgress],
  );

  const stop = useCallback(() => {
    clearProgressTimer();
    void stopCurrentTrack();
    setPlaying(false);
    setCurrentTrack(null);
    awardedTrackIdRef.current = null;
  }, [clearProgressTimer, setCurrentTrack, setPlaying]);

  return useMemo(
    () => ({
      isPlaying,
      currentTrack: currentTrack ?? null,
      currentPosition,
      duration: currentTrack?.duration ?? 0,
      loading,
      error,
      play,
      pause,
      seekTo,
      stop,
    }),
    [
      currentPosition,
      currentTrack,
      error,
      loading,
      pause,
      play,
      seekTo,
      stop,
      isPlaying,
    ],
  );
}
