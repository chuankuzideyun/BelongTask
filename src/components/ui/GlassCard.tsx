import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { THEME } from '../../constants/theme';

interface GlassCardProps extends PropsWithChildren {
  style?: ViewStyle;
  blurIntensity?: number;
  borderRadius?: number;
  gradientColors?: readonly [string, string, ...string[]];
}

export function GlassCard({
  children,
  style,
  blurIntensity = 20,
  borderRadius = THEME.borderRadius.md,
  gradientColors = ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'],
}: GlassCardProps) {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView intensity={blurIntensity} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={gradientColors} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.inner, { borderRadius: borderRadius - 1 }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  inner: {
    margin: 1,
  },
});
