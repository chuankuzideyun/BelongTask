import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/services/playbackService';

TrackPlayer.registerPlaybackService(() => playbackService);

require('expo-router/entry');
