import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../constants/theme';

interface PointsCounterProps {
  currentPoints: number;
  pointsEarned: number;
  progress: number;
  isActive: boolean;
}

export function PointsCounter({
  currentPoints,
  pointsEarned,
  progress,
  isActive,
}: PointsCounterProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{isActive ? 'Earning now' : 'Session points'}</Text>
        <Text style={styles.points}>{currentPoints}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.secondary}>{pointsEarned} earned</Text>
        <Text style={styles.secondary}>{Math.round(progress)}% progress</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: THEME.spacing.md,
  },
  label: {
    color: THEME.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
    fontWeight: '700',
  },
  points: {
    color: THEME.colors.text.primary,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 2,
  },
  rightSide: {
    alignItems: 'flex-end',
    gap: 4,
  },
  secondary: {
    color: THEME.colors.text.secondary,
    fontSize: 14,
  },
});
