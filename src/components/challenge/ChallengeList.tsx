import { View } from 'react-native';
import type { MusicChallenge } from '../../types';
import { ChallengeCard } from './ChallengeCard';

interface ChallengeListProps {
  challenges: MusicChallenge[];
}

export function ChallengeList({ challenges }: ChallengeListProps) {
  return (
    <View>
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </View>
  );
}
