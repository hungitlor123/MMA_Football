import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '../types';
import { geminiService } from '../service/api/geminiApi';
import { colors } from '../styles/colors';
import { spacing, typography, borderRadius } from '../styles/spacing';
import { useAppSelector } from '../service/store/hooks';

interface SimilarPlayersProps {
  player: Player;
  onPlayerPress: (player: Player) => void;
}

export function SimilarPlayers({ player, onPlayerPress }: SimilarPlayersProps) {
  const [similarPlayers, setSimilarPlayers] = useState<Player[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { players } = useAppSelector(state => state.players);

  useEffect(() => {
    fetchSimilarPlayers();
    fetchAnalysis();
  }, [player.id]);

  const fetchSimilarPlayers = async () => {
    setLoading(true);
    try {
      const result = await geminiService.getSimilarPlayers(player, players);
      setSimilarPlayers(result);
    } catch (error) {
      console.error('Error fetching similar players:', error);
      Alert.alert('Error', 'Could not fetch similar players. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const result = await geminiService.getPlayerInsights(player);
      setAnalysis(result);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePlayerPress = (selectedPlayer: Player) => {
    onPlayerPress(selectedPlayer);
  };

  const handleRefresh = () => {
    fetchSimilarPlayers();
    fetchAnalysis();
  };

  if (loading) {
    return (
      <View style={styles.loadingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>AI Analysis</Text>
          </View>
          <View style={styles.aiPoweredBadge}>
            <Ionicons name="flash" size={12} color={colors.warning} />
            <Text style={styles.aiText}>AI</Text>
          </View>
        </View>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing player data...</Text>
        </View>
      </View>
    );
  }

  if (!analysis && similarPlayers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* AI Analysis Section */}
      <View style={styles.analysisCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>AI Analysis</Text>
          </View>
          <View style={styles.aiPoweredBadge}>
            <Ionicons name="flash" size={12} color={colors.warning} />
            <Text style={styles.aiText}>AI</Text>
          </View>
        </View>
        
        <View style={styles.analysisContent}>
          <Text style={styles.analysisText}>{analysis}</Text>
        </View>
      </View>

      {/* Similar Players Section */}
      <View style={styles.similarPlayersCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.playersIcon}>
              <Ionicons name="people" size={20} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Similar Players</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.aiPoweredBadge}>
              <Ionicons name="flash" size={12} color={colors.warning} />
              <Text style={styles.aiText}>AI</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Ionicons name="refresh" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {similarPlayers.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playersScrollContent}
          >
            {similarPlayers.map((similarPlayer: Player, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.playerCard}
                onPress={() => handlePlayerPress(similarPlayer)}
                activeOpacity={0.8}
              >
                <View style={styles.playerImageContainer}>
                  <Image 
                    source={{ uri: similarPlayer.image }} 
                    style={styles.playerImage} 
                  />
                  {similarPlayer.isCaptain && (
                    <View style={styles.captainBadge}>
                      <Ionicons name="star" size={10} color={colors.warning} />
                    </View>
                  )}
                </View>
                
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={2}>
                    {similarPlayer.playerName}
                  </Text>
                  <Text style={styles.playerTeam} numberOfLines={1}>
                    {similarPlayer.team}
                  </Text>
                  <View style={styles.playerPositionBadge}>
                    <Text style={styles.playerPosition}>{similarPlayer.position}</Text>
                  </View>
                </View>

                <View style={styles.playerStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{new Date().getFullYear() - similarPlayer.YoB}</Text>
                    <Text style={styles.statLabel}>Age</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{formatMinutes(similarPlayer.MinutesPlayed)}</Text>
                    <Text style={styles.statLabel}>Time</Text>
                  </View>
                </View>

                <View style={styles.accuracyBadge}>
                  <Text style={styles.accuracyText}>
                    {(similarPlayer.PassingAccuracy * 100).toFixed(0)}% pass
                  </Text>
                </View>

                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={12} color={colors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyTitle}>No Similar Players</Text>
            <Text style={styles.emptySubtitle}>
              Could not find players with similar characteristics
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analysisCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  similarPlayersCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  playersIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  aiPoweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 2,
  },
  aiText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.warning,
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  analysisContent: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  analysisText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    lineHeight: 22,
  },
  playersScrollContent: {
    paddingRight: spacing.lg,
  },
  playerCard: {
    width: 200,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
  },
  captainBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.warning,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  playerInfo: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  playerTeam: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  playerPositionBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  playerPosition: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  playerStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  accuracyBadge: {
    backgroundColor: colors.success + '20',
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  accuracyText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.success,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  viewButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 