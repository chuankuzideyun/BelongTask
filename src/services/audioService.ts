import { NativeModules } from 'react-native';

let setupPromise: Promise<void> | null = null;

async function getTrackPlayerModule() {
  if (!NativeModules.TrackPlayerModule) {
    return null;
  }

  return import('react-native-track-player');
}

export async function ensureTrackPlayerReady() {
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    throw new Error('Audio playback requires a development build with react-native-track-player installed.');
  }

  if (!setupPromise) {
    setupPromise = (async () => {
      const { Capability } = trackPlayer;

      await trackPlayer.default.setupPlayer({
        autoHandleInterruptions: true,
      });

      await trackPlayer.default.updateOptions({
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop, Capability.SeekTo],
        compactCapabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
      });
    })().catch((error) => {
      setupPromise = null;
      throw error;
    });
  }

  return setupPromise;
}

export async function loadSingleTrack(track: {
  id: string;
  audioUrl: string;
  title: string;
  artist: string;
  artwork?: string;
  duration?: number;
}) {
  await ensureTrackPlayerReady();
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    throw new Error('Audio playback requires a development build with react-native-track-player installed.');
  }

  await trackPlayer.default.reset();
  await trackPlayer.default.add({
    id: track.id,
    url: track.audioUrl,
    title: track.title,
    artist: track.artist,
    artwork: track.artwork,
    duration: track.duration,
  });
}

export async function playCurrentTrack() {
  await ensureTrackPlayerReady();
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    throw new Error('Audio playback requires a development build with react-native-track-player installed.');
  }

  await trackPlayer.default.play();
}

export async function pauseCurrentTrack() {
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    return;
  }

  await trackPlayer.default.pause();
}

export async function stopCurrentTrack() {
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    return;
  }

  await trackPlayer.default.stop();
}

export async function seekCurrentTrack(seconds: number) {
  const trackPlayer = await getTrackPlayerModule();
  if (!trackPlayer) {
    return;
  }

  await trackPlayer.default.seekTo(seconds);
}
