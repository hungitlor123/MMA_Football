import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '../service/store/hooks';
import { setAvatar } from '../service/slices/profileSlice';
import { imageService } from '../service/api/imageService';
import { Player } from '../types';
import { colors } from '../styles/colors';
import { spacing, typography, borderRadius } from '../styles/spacing';

export default function ProfileScreen() {
  const { favorites } = useAppSelector(state => state.favorites);
  const { players } = useAppSelector(state => state.players);
  const { avatar, name } = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  // Calculate stats
  const totalFavorites = favorites.length;
  const favoriteTeams = [...new Set(favorites.map(player => player.team))];
  const favoritePositions = [...new Set(favorites.map(player => player.position))];
  
  const captainCount = favorites.filter(player => player.isCaptain).length;
  
  const averageAge = favorites.length > 0 
    ? Math.round(favorites.reduce((sum, player) => sum + (new Date().getFullYear() - player.YoB), 0) / favorites.length)
    : 0;
    
  const totalMinutes = favorites.reduce((sum, player) => sum + player.MinutesPlayed, 0);
  const averageAccuracy = favorites.length > 0
    ? (favorites.reduce((sum, player) => sum + player.PassingAccuracy, 0) / favorites.length * 100).toFixed(1)
    : 0;

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getTopTeam = () => {
    if (favorites.length === 0) return 'None';
    const teamCounts: Record<string, number> = {};
    favorites.forEach(player => {
      teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
    });
    return Object.entries(teamCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';
  };

  const getTopPosition = () => {
    if (favorites.length === 0) return 'None';
    const positionCounts: Record<string, number> = {};
    favorites.forEach(player => {
      positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
    });
    return Object.entries(positionCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';
  };

  const handleAvatarPress = async () => {
    try {
      const result = await imageService.showImagePickerOptions();
      if (result) {
        dispatch(setAvatar(result.uri));
      }
    } catch (error) {
      console.error('Error selecting avatar:', error);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color = colors.primary }: {
    icon: string;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color={colors.primary} />
                <View style={styles.addIconContainer}>
                  <Ionicons name="add-circle" size={20} color={colors.primary} />
                </View>
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileSubtitle}>Player Statistics Dashboard</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            icon="heart"
            title="Favorites"
            value={totalFavorites}
            subtitle="players saved"
            color={colors.danger}
          />
          <StatCard
            icon="people"
            title="Teams"
            value={favoriteTeams.length}
            subtitle="different teams"
            color={colors.primary}
          />
        </View>
        
        <View style={styles.statsRow}>
          <StatCard
            icon="star"
            title="Captains"
            value={captainCount}
            subtitle="team leaders"
            color={colors.warning}
          />
          <StatCard
            icon="time"
            title="Avg Age"
            value={averageAge || 'N/A'}
            subtitle="years old"
            color={colors.success}
          />
        </View>
      </View>

      {/* Detailed Info Cards */}
      <View style={styles.infoSection}>
        <InfoCard title="Team Preferences">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Top Team:</Text>
            <Text style={styles.infoValue}>{getTopTeam()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teams Following:</Text>
            <Text style={styles.infoValue}>{favoriteTeams.length}</Text>
          </View>
          <View style={styles.teamsList}>
            {favoriteTeams.slice(0, 5).map((team, index) => (
              <View key={team} style={styles.teamBadge}>
                <Text style={styles.teamBadgeText}>{team}</Text>
              </View>
            ))}
            {favoriteTeams.length > 5 && (
              <View style={styles.teamBadge}>
                <Text style={styles.teamBadgeText}>+{favoriteTeams.length - 5}</Text>
              </View>
            )}
          </View>
        </InfoCard>

        <InfoCard title="Playing Statistics">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Favorite Position:</Text>
            <Text style={styles.infoValue}>{getTopPosition()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Minutes:</Text>
            <Text style={[styles.infoValue, { color: colors.primary }]}>
              {formatMinutes(totalMinutes)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Avg Passing Accuracy:</Text>
            <Text style={[styles.infoValue, { color: colors.success }]}>
              {averageAccuracy}%
            </Text>
          </View>
        </InfoCard>

        <InfoCard title="Collection Summary">
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{players.length}</Text>
              <Text style={styles.summaryLabel}>Total Players</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{favoritePositions.length}</Text>
              <Text style={styles.summaryLabel}>Positions</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: colors.danger }]}>
                {((totalFavorites / Math.max(players.length, 1)) * 100).toFixed(1)}%
              </Text>
              <Text style={styles.summaryLabel}>Collection Rate</Text>
            </View>
          </View>
        </InfoCard>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Share Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addIconContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  statsGrid: {
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
  },
  statSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  infoSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
  },
  teamsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  teamBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  teamBadgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.primary,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
}); 