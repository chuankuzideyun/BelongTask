import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { GlassCard } from '../ui/GlassCard';
import { THEME } from '../../constants/theme';
import { formatDuration, getDifficultyAccent, getDifficultyLabel } from '../../constants/challenges';
import type { MusicChallenge } from '../../types';

interface ChallengeCardProps {
  challenge: MusicChallenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const difficultyColor = getDifficultyAccent(challenge.difficulty);
  const progressWidth: ViewStyle['width'] = `${Math.max(0, Math.min(100, challenge.progress))}%`;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.artist}>{challenge.artist}</Text>
        </View>
        <View style={[styles.badge, { borderColor: difficultyColor }]}>
          <Text style={[styles.badgeText, { color: difficultyColor }]}>{getDifficultyLabel(challenge.difficulty)}</Text>
        </View>
      </View>

      <Text style={styles.description}>{challenge.description}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{formatDuration(challenge.duration)}</Text>
        <Text style={styles.metaText}>{challenge.points} pts</Text>
        <Text style={[styles.metaText, challenge.completed ? styles.completed : null]}>
          {challenge.completed ? 'Completed' : `${Math.round(challenge.progress)}%`}
        </Text>
      </View>

      <View style={styles.progressTrack} accessibilityLabel={`${challenge.title} progress`}>
        <View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.actions}>
        <Link href={{ pathname: '/challenge-detail', params: { id: challenge.id } }} asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Details</Text>
          </Pressable>
        </Link>
        <Link href={{ pathname: '/player', params: { id: challenge.id } }} asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Play</Text>
          </Pressable>
        </Link>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: THEME.spacing.md,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  artist: {
    color: THEME.colors.text.secondary,
    marginTop: 4,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  description: {
    color: THEME.colors.text.secondary,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: THEME.spacing.sm,
  },
  metaText: {
    color: THEME.colors.text.secondary,
    fontSize: 13,
  },
  completed: {
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: THEME.colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    minHeight: 44,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.borderRadius.md,
    minHeight: 44,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  secondaryButtonText: {
    color: THEME.colors.text.primary,
    fontWeight: '700',
  },
});
