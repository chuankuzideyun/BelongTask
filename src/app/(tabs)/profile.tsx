import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { THEME } from '../../constants/theme';
import { useMusicStore } from '../../stores/musicStore';
import { useUserStore } from '../../stores/userStore';

export default function ProfileScreen() {
  const challenges = useMusicStore((state) => state.challenges);
  const totalPoints = useUserStore((state) => state.totalPoints);
  const completedChallenges = useUserStore((state) => state.completedChallenges);

  const completedList = challenges.filter((challenge) => completedChallenges.includes(challenge.id));
  const completionRate = challenges.length ? Math.round((completedList.length / challenges.length) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Progress dashboard</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Your saved progress is stored locally with AsyncStorage, so it survives app restarts.
        </Text>
      </View>

      <GlassCard style={styles.metricCard}>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{totalPoints}</Text>
            <Text style={styles.metricLabel}>Total points</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{completedList.length}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{completionRate}%</Text>
            <Text style={styles.metricLabel}>Progress</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Completed challenges</Text>
        {completedList.length ? (
          <View style={styles.list}>
            {completedList.map((challenge) => (
              <View key={challenge.id} style={styles.listItem}>
                <View style={styles.listText}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeSubtitle}>{challenge.artist}</Text>
                </View>
                <Text style={styles.challengePoints}>+{challenge.points}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyState}>No completed challenges yet. Head back to Home and start one.</Text>
        )}
      </GlassCard>

      <Link href="/" asChild>
        <Text style={styles.link} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          Back to Home
        </Text>
      </Link>
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
  header: {
    gap: THEME.spacing.sm,
  },
  kicker: {
    color: THEME.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: THEME.colors.text.secondary,
    fontSize: 16,
    lineHeight: 22,
  },
  metricCard: {
    padding: THEME.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  metric: {
    flex: 1,
    gap: 4,
  },
  metricValue: {
    color: THEME.colors.text.primary,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionCard: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  sectionTitle: {
    color: THEME.colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    gap: THEME.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: THEME.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  listText: {
    flex: 1,
  },
  challengeTitle: {
    color: THEME.colors.text.primary,
    fontWeight: '700',
  },
  challengeSubtitle: {
    color: THEME.colors.text.secondary,
    marginTop: 2,
  },
  challengePoints: {
    color: THEME.colors.secondary,
    fontWeight: '800',
  },
  emptyState: {
    color: THEME.colors.text.secondary,
    lineHeight: 21,
  },
  link: {
    color: THEME.colors.primary,
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
