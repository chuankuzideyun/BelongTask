import { NativeModules } from 'react-native';
import { playbackService } from './src/services/playbackService';

if (NativeModules.TrackPlayerModule) {
  void import('react-native-track-player').then((TrackPlayer) => {
    TrackPlayer.default.registerPlaybackService(() => playbackService);
  });
}

require('expo-router/entry');
