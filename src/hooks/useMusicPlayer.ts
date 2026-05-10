import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Event, State, useActiveTrack, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player';
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
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const progress = useProgress(1000);
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const currentPosition = useMusicStore((state) => state.currentPosition);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const challenges = useMusicStore((state) => state.challenges);
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

  useEffect(() => {
    const activeChallenge = challenges.find((challenge) => challenge.id === activeTrack?.id);
    if (activeChallenge) {
      setCurrentTrack(activeChallenge);
    }
  }, [activeTrack?.id, challenges, setCurrentTrack]);

  useEffect(() => {
    const track =
      currentTrack ?? challenges.find((challenge) => challenge.id === activeTrack?.id) ?? null;
    if (!track || !progress.duration) {
      return;
    }

    const nextPosition = Math.min(progress.position, progress.duration);
    const nextProgress = Math.min(100, (nextPosition / progress.duration) * 100);

    updateProgress(track.id, nextProgress);
    setPlaying(playbackState.state === State.Playing);

    if (
      progress.duration > 0 &&
      nextPosition >= progress.duration - 0.25 &&
      !completedChallenges.includes(track.id) &&
      awardedTrackIdRef.current !== track.id
    ) {
      awardedTrackIdRef.current = track.id;
      markChallengeComplete(track.id);
      addPoints(track.points);
      completeChallenge(track.id);
    }
  }, [
    addPoints,
    completeChallenge,
    completedChallenges,
    currentTrack,
    playbackState.state,
    progress.duration,
    progress.position,
    setPlaying,
    activeTrack,
    markChallengeComplete,
    updateProgress,
  ]);

  useTrackPlayerEvents([Event.PlaybackError, Event.PlaybackActiveTrackChanged], async (event) => {
    if (event.type === Event.PlaybackError) {
      setError(event.message ?? 'Playback failed');
      setLoading(false);
      return;
    }

    if (event.type === Event.PlaybackActiveTrackChanged && event.track) {
      const activeChallenge = challenges.find((challenge) => challenge.id === event.track?.id) ?? null;
      if (activeChallenge) {
        setCurrentTrack(activeChallenge);
        updateProgress(activeChallenge.id, 0);
        awardedTrackIdRef.current = null;
      }
    }
  });

  const play = useCallback(
    async (track: MusicChallenge) => {
      try {
        setLoading(true);
        setError(null);
        awardedTrackIdRef.current = completedChallenges.includes(track.id) ? track.id : null;
        await ensureTrackPlayerReady();

        const shouldReset = activeTrack?.id !== track.id;

        if (shouldReset) {
          await loadSingleTrack(track);
        }

        setCurrentTrack(track);
        updateProgress(track.id, track.progress ?? 0);
        setPlaying(true);
        await playCurrentTrack();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Playback failed');
      } finally {
        setLoading(false);
      }
    },
    [activeTrack?.id, completedChallenges, setCurrentTrack, updateProgress],
  );

  const pause = useCallback(() => {
    void pauseCurrentTrack();
    setPlaying(false);
  }, [setPlaying]);

  const seekTo = useCallback(
    (seconds: number) => {
      const resolvedTrack =
        currentTrack ?? challenges.find((challenge) => challenge.id === activeTrack?.id) ?? null;
      if (!resolvedTrack) {
        return;
      }

      const clamped = Math.max(0, Math.min(resolvedTrack.duration, seconds));
      void seekCurrentTrack(clamped);
      updateProgress(resolvedTrack.id, (clamped / resolvedTrack.duration) * 100);
    },
    [activeTrack, challenges, currentTrack, updateProgress],
  );

  const stop = useCallback(() => {
    void stopCurrentTrack();
    setPlaying(false);
    setCurrentTrack(null);
    awardedTrackIdRef.current = null;
  }, [setCurrentTrack, setPlaying]);

  useEffect(() => {
    void ensureTrackPlayerReady();
  }, []);

  return useMemo(
    () => ({
      isPlaying: playbackState.state === State.Playing,
      currentTrack: currentTrack ?? challenges.find((challenge) => challenge.id === activeTrack?.id) ?? null,
      currentPosition,
      duration: currentTrack?.duration ?? progress.duration,
      loading,
      error,
      play,
      pause,
      seekTo,
      stop,
    }),
    [
      activeTrack,
      currentPosition,
      currentTrack,
      error,
      loading,
      pause,
      play,
      playbackState.state,
      progress.duration,
      seekTo,
      stop,
      challenges,
    ],
  );
}
