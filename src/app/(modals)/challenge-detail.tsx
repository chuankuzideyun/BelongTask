import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassCard } from '../../components/ui/GlassCard';
import {
  SAMPLE_CHALLENGES,
  formatDuration,
  getChallengeById,
  getDifficultyAccent,
  getDifficultyLabel,
} from '../../constants/challenges';
import { THEME } from '../../constants/theme';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';

export default function ChallengeDetailModal() {
  const params = useLocalSearchParams<{ id?: string }>();
  const challenges = useMusicStore((state) => state.challenges);
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const addPoints = useUserStore((state) => state.addPoints);
  const completeChallenge = useUserStore((state) => state.completeChallenge);
  const { play, isPlaying } = useMusicPlayer();

  const challenge = useMemo(
    () => getChallengeById(params.id, challenges) ?? getChallengeById(params.id, SAMPLE_CHALLENGES),
    [challenges, params.id],
  );

  if (!challenge) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Challenge not found</Text>
        <GlassButton title="Back home" onPress={() => router.back()} />
      </View>
    );
  }

  const completed = completedChallenges.includes(challenge.id) || challenge.completed;
  const difficultyColor = getDifficultyAccent(challenge.difficulty);
  const progressWidth: ViewStyle['width'] = `${Math.max(0, Math.min(100, challenge.progress))}%`;

  const handleMarkComplete = () => {
    const state = useMusicStore.getState();
    if (!completed) {
      state.markChallengeComplete(challenge.id);
      addPoints(challenge.points);
      completeChallenge(challenge.id);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>Back</Text>
        </Pressable>
        <Text style={styles.topLabel}>Challenge detail</Text>
        <Pressable
          onPress={() => {
            router.replace({ pathname: '/player', params: { id: challenge.id } });
          }}
          hitSlop={10}
        >
          <Text style={styles.close}>Player</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.heroCard}>
        <Text style={[styles.badge, { color: difficultyColor }]}>{getDifficultyLabel(challenge.difficulty)}</Text>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.artist}>{challenge.artist}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
      </GlassCard>

      <GlassCard style={styles.statsCard}>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{challenge.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(challenge.duration)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{Math.round(challenge.progress)}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Completion tracking</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.helperText}>
          {completed
            ? `Completed${challenge.completedAt ? ` on ${new Date(challenge.completedAt).toLocaleString()}` : ''}.`
            : 'This challenge is still active. You can play it from here or mark it complete after review.'}
        </Text>
      </GlassCard>

      <GlassCard style={styles.actionsCard}>
        <GlassButton
          title={isPlaying ? 'Currently playing' : 'Play challenge'}
          loading={false}
          onPress={() => void play(challenge)}
          style={styles.actionButton}
        />
        <GlassButton
          title={completed ? 'Already completed' : 'Mark complete'}
          onPress={handleMarkComplete}
          disabled={completed}
          style={styles.actionButton}
        />
      </GlassCard>

      <GlassCard style={styles.noteCard}>
        <Text style={styles.sectionTitle}>What this page shows</Text>
        <Text style={styles.helperText}>
          The challenge detail page shares the same persisted Zustand state as Home and Profile, so progress updates
          are reflected everywhere.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    paddingBottom: 48,
    backgroundColor: THEME.colors.background,
    gap: THEME.spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.md,
    backgroundColor: THEME.colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  topLabel: {
    color: THEME.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 12,
  },
  close: {
    color: THEME.colors.text.primary,
    fontWeight: '700',
  },
  heroCard: {
    padding: THEME.spacing.md,
    gap: 6,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  artist: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
  },
  description: {
    color: THEME.colors.text.secondary,
    lineHeight: 22,
    marginTop: 4,
  },
  statsCard: {
    padding: THEME.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: THEME.spacing.sm,
  },
  stat: {
    flex: 1,
    gap: 4,
  },
  statValue: {
    color: THEME.colors.text.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  sectionTitle: {
    color: THEME.colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
  },
  helperText: {
    color: THEME.colors.text.secondary,
    lineHeight: 21,
  },
  actionsCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
  noteCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
});
