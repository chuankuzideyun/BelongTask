import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { PointsCounter } from '../../components/ui/PointsCounter';
import { SAMPLE_CHALLENGES, getChallengeById, formatDuration } from '../../constants/challenges';
import { THEME } from '../../constants/theme';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { useMusicStore } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';

export default function PlayerModal() {
  const params = useLocalSearchParams<{ id?: string }>();
  const challenges = useMusicStore((state) => state.challenges);
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const currentPosition = useMusicStore((state) => state.currentPosition);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const { play, pause, seekTo, stop, loading, error } = useMusicPlayer();

  const selectedChallenge = useMemo(
    () => getChallengeById(params.id, challenges) ?? getChallengeById(params.id, SAMPLE_CHALLENGES),
    [challenges, params.id],
  );

  useEffect(() => {
    if (selectedChallenge && currentTrack?.id !== selectedChallenge.id) {
      useMusicStore.getState().setCurrentTrack(selectedChallenge);
    }
  }, [currentTrack?.id, selectedChallenge]);

  if (!selectedChallenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Challenge not found</Text>
        <GlassButton title="Back home" onPress={() => router.back()} />
      </View>
    );
  }

  const progress = selectedChallenge.duration
    ? Math.min(100, (currentPosition / selectedChallenge.duration) * 100)
    : 0;
  const progressWidth: ViewStyle['width'] = `${progress}%`;
  const remaining = Math.max(0, selectedChallenge.duration - currentPosition);
  const alreadyCompleted = completedChallenges.includes(selectedChallenge.id);
  const buttonTitle = isPlaying ? 'Pause' : alreadyCompleted ? 'Replay' : 'Start playback';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.topLabel}>Player modal</Text>
        <Pressable
          onPress={() => {
            stop();
            router.back();
          }}
          hitSlop={10}
        >
          <Text style={styles.close}>Done</Text>
        </Pressable>
      </View>

      <GlassCard style={styles.heroCard}>
        <Text style={styles.kicker}>Now playing</Text>
        <Text style={styles.title}>{selectedChallenge.title}</Text>
        <Text style={styles.subtitle}>{selectedChallenge.artist}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progress)}% • {formatDuration(currentPosition)} / {formatDuration(selectedChallenge.duration)}
          </Text>
          <Text style={styles.progressText}>{formatDuration(remaining)} remaining</Text>
        </View>
      </GlassCard>

      <GlassCard style={styles.pointsCard}>
        <PointsCounter
          currentPoints={Math.floor((progress / 100) * selectedChallenge.points)}
          pointsEarned={Math.floor((progress / 100) * selectedChallenge.points)}
          progress={progress}
          isActive={isPlaying}
        />
      </GlassCard>

      <GlassCard style={styles.controlsCard}>
        <GlassButton
          title={buttonTitle}
          loading={loading}
          onPress={() => {
            if (isPlaying) {
              pause();
            } else {
              void play(selectedChallenge);
            }
          }}
        />
        <View style={styles.secondaryActions}>
          <GlassButton title="-15s" onPress={() => seekTo(currentPosition - 15)} style={styles.flexButton} />
          <GlassButton title="+15s" onPress={() => seekTo(currentPosition + 15)} style={styles.flexButton} />
        </View>
        <Text style={styles.note}>
          {alreadyCompleted
            ? 'This challenge is already completed. Replaying will let you review the progress UI without adding points twice.'
            : 'Points are awarded automatically when the progress reaches 100%.'}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </GlassCard>

      <GlassCard style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Challenge details</Text>
        <Text style={styles.helperText}>{selectedChallenge.description}</Text>
        <Text style={styles.helperText}>Duration: {formatDuration(selectedChallenge.duration)}</Text>
        <Text style={styles.helperText}>Reward: {selectedChallenge.points} points</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
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
    fontSize: 11,
  },
  close: {
    color: THEME.colors.text.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  heroCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  kicker: {
    color: THEME.colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
  },
  progressWrap: {
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.sm,
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
  progressText: {
    color: THEME.colors.text.secondary,
    fontSize: 13,
  },
  pointsCard: {
    padding: THEME.spacing.md,
  },
  controlsCard: {
    padding: THEME.spacing.md,
    gap: 10,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginTop: 10,
  },
  flexButton: {
    flex: 1,
  },
  note: {
    color: THEME.colors.text.secondary,
    lineHeight: 20,
  },
  error: {
    color: '#F76C6C',
    fontWeight: '600',
  },
  sectionTitle: {
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  helperText: {
    color: THEME.colors.text.secondary,
    lineHeight: 20,
  },
  detailsCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
});
