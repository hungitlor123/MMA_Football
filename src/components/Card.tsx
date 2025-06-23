import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius } from '../styles/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: boolean;
}

export default function Card({ 
  children, 
  style, 
  padding = 'lg', 
  shadow = true 
}: CardProps) {
  const cardStyles = [
    styles.card,
    { padding: spacing[padding] },
    shadow && styles.shadow,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}); 