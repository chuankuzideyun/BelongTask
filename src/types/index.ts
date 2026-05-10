export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MusicChallenge {
  id: string;
  title: string;
  artist: string;
  duration: number;
  points: number;
  audioUrl: string;
  imageUrl?: string;
  description: string;
  difficulty: Difficulty;
  completed: boolean;
  progress: number;
  completedAt?: string;
}

export interface PointsCounterConfig {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
}

export interface MusicStore {
  challenges: MusicChallenge[];
  currentTrack: MusicChallenge | null;
  isPlaying: boolean;
  currentPosition: number;
  loadChallenges: () => void;
  setCurrentTrack: (track: MusicChallenge | null) => void;
  setPlaying: (value: boolean) => void;
  updateProgress: (challengeId: string, progress: number) => void;
  markChallengeComplete: (challengeId: string) => void;
  resetChallengeProgress: (challengeId: string) => void;
}

export interface UserStore {
  totalPoints: number;
  completedChallenges: string[];
  addPoints: (points: number) => void;
  completeChallenge: (challengeId: string) => void;
  resetProgress: () => void;
}
