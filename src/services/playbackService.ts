export const playbackService = async function playbackService() {
  const { default: TrackPlayer, Event } = await import('react-native-track-player');

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    void TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    void TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    void TrackPlayer.stop();
  });
};
