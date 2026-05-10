import TrackPlayer, { Capability } from 'react-native-track-player';

let setupPromise: Promise<void> | null = null;

export async function ensureTrackPlayerReady() {
  if (!setupPromise) {
    setupPromise = (async () => {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });

      await TrackPlayer.updateOptions({
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
  await TrackPlayer.reset();
  await TrackPlayer.add({
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
  await TrackPlayer.play();
}

export async function pauseCurrentTrack() {
  await ensureTrackPlayerReady();
  await TrackPlayer.pause();
}

export async function stopCurrentTrack() {
  await ensureTrackPlayerReady();
  await TrackPlayer.stop();
}

export async function seekCurrentTrack(seconds: number) {
  await ensureTrackPlayerReady();
  await TrackPlayer.seekTo(seconds);
}
