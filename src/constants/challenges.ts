import type { MusicChallenge } from '../types';

export const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: 'challenge-1',
    title: 'All Night',
    artist: 'Camo & Krooked',
    duration: 219,
    points: 150,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen to this drum & bass classic to earn points.',
    difficulty: 'easy',
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-2',
    title: 'New Forms',
    artist: 'Roni Size',
    duration: 464,
    points: 300,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3',
    description: 'Complete this legendary track for bonus points.',
    difficulty: 'medium',
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-3',
    title: 'Bonus Challenge',
    artist: 'Camo & Krooked',
    duration: 219,
    points: 250,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen again for extra points and repeat functionality.',
    difficulty: 'hard',
    completed: false,
    progress: 0,
  },
];

export function getChallengeById(id: string | undefined, challenges: MusicChallenge[]) {
  if (!id) {
    return undefined;
  }

  return challenges.find((challenge) => challenge.id === id);
}

export function getDifficultyLabel(difficulty: MusicChallenge['difficulty']) {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    default:
      return difficulty;
  }
}

export function getDifficultyAccent(difficulty: MusicChallenge['difficulty']) {
  switch (difficulty) {
    case 'easy':
      return '#34CB76';
    case 'medium':
      return '#FCBE25';
    case 'hard':
      return '#F76C6C';
    default:
      return '#FFFFFF';
  }
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function cloneChallenges(challenges: MusicChallenge[]) {
  return challenges.map((challenge) => ({ ...challenge }));
}
