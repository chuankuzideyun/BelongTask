# BelongTask

BelongTask is a mobile music rewards app built with Expo and React Native. It follows the same high-level patterns used in the Belong mobile app, including file-based routing, store-driven state, and a glassmorphism-style UI.

## Highlights

- Expo Router for navigation
- Zustand for state management
- AsyncStorage for local persistence
- react-native-track-player for real audio playback
- Glass-style UI components with blur and gradient effects

## Features

- Home screen with a list of music challenges
- Player modal with play, pause, seek, and progress tracking
- Profile screen with total points and completion stats
- Challenge detail screen for individual challenge progress
- Local persistence for points and completed challenges

## Tech Stack

- Expo SDK 54
- React Native
- Expo Router
- Zustand
- AsyncStorage
- react-native-track-player

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

To run the app with native audio support, use a development build:

```bash
npx expo run:ios
```

or

```bash
npx expo run:android
```

## Notes

- Audio playback uses `react-native-track-player`, so it requires a native development build rather than Expo Go.
- State is persisted locally with AsyncStorage, so points and completion status remain after restarting the app.

