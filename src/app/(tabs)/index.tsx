import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChallengeList } from '../../components/challenge/ChallengeList';
import { GlassCard } from '../../components/ui/GlassCard';
import { THEME } from '../../constants/theme';
import { useChallenges } from '../../hooks/useChallenges';
import { useMusicStore } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';

export default function HomeScreen() {
  const challenges = useMusicStore((state) => state.challenges);
  const currentTrack = useMusicStore((state) => state.currentTrack);
  const completedChallenges = useUserStore((state) => state.completedChallenges);
  const totalPoints = useUserStore((state) => state.totalPoints);
  const { refreshChallenges } = useChallenges();

  const stats = useMemo(
    () => [
      { label: 'Challenges', value: challenges.length },
      { label: 'Completed', value: completedChallenges.length },
      { label: 'Points', value: totalPoints },
    ],
    [challenges.length, completedChallenges.length, totalPoints],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refreshChallenges} tintColor="#fff" />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>Belong-style mobile assessment</Text>
        <Text style={styles.title}>Music Rewards</Text>
        <Text style={styles.subtitle}>
          Pick a challenge, play the track, and earn points as progress builds up.
        </Text>
      </View>

      <GlassCard style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {currentTrack ? (
        <GlassCard style={styles.nowPlayingCard}>
          <Text style={styles.sectionTitle}>Continue listening</Text>
          <Text style={styles.nowPlayingTitle}>{currentTrack.title}</Text>
          <Text style={styles.nowPlayingSubtitle}>{currentTrack.artist}</Text>
          <Link href={{ pathname: '/player', params: { id: currentTrack.id } }} asChild>
            <Pressable style={styles.resumeButton}>
              <Text
                style={styles.resumeButtonText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                Open Player
              </Text>
            </Pressable>
          </Link>
        </GlassCard>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Challenges</Text>
        <Text style={styles.sectionHint}>Tap a card for details or play.</Text>
      </View>

      <ChallengeList challenges={challenges} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    paddingBottom: 48,
    backgroundColor: THEME.colors.background,
    gap: THEME.spacing.lg,
  },
  hero: {
    gap: THEME.spacing.sm,
  },
  kicker: {
    color: THEME.colors.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
    lineHeight: 23,
  },
  summaryCard: {
    padding: THEME.spacing.md,
  },
  summaryRow: {
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
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nowPlayingCard: {
    padding: THEME.spacing.md,
    gap: 6,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    color: THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHint: {
    color: THEME.colors.text.secondary,
    fontSize: 13,
  },
  nowPlayingTitle: {
    color: THEME.colors.text.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  nowPlayingSubtitle: {
    color: THEME.colors.text.secondary,
  },
  resumeButton: {
    alignSelf: 'flex-start',
    marginTop: THEME.spacing.sm,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  resumeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
