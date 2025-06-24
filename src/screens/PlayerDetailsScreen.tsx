import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../service/store/hooks';
import { addToFavorites, removeFromFavorites } from '../service/slices/favoritesSlice';
import { PlayerDetailsRouteProp, Player } from '../types';
import { FootballPlayerCard, GeminiPlayerAnalysis } from '../components';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { colors } from '../styles/colors';
import { spacing, typography, borderRadius } from '../styles/spacing';

export default function PlayerDetailsScreen() {
  const route = useRoute<PlayerDetailsRouteProp>();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { playerId } = route.params;

  const { players } = useAppSelector(state => state.players);
  const { favorites } = useAppSelector(state => state.favorites);

  const [player, setPlayer] = useState<Player | null>(null);
  const [showAIOverlay, setShowAIOverlay] = useState(false);

  useEffect(() => {
    const foundPlayer = players.find(p => p.id === playerId);
    if (foundPlayer) {
      setPlayer(foundPlayer);
    }
  }, [playerId, players]);

  const handleFavoritePress = () => {
    if (!player) return;
    const isFavorite = favorites.some(fav => fav.id === player.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(player.id));
    } else {
      dispatch(addToFavorites(player));
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isFavorite = () => {
    return player ? favorites.some(fav => fav.id === player.id) : false;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!player) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingText}>Loading player details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalFeedbacks = player.feedbacks.length;
  const averageRating = totalFeedbacks > 0
    ? player.feedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
    : 0;

  // Xác định 2 cầu thủ tiếp theo
  const currentIndex = players.findIndex(p => p.id === playerId);
  const nextPlayers =
    currentIndex >= 0
      ? players.slice(currentIndex + 1, currentIndex + 3)
      : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: player.image }} style={styles.avatar} />
              {player.isCaptain && (
                <View style={styles.captainBadge}>
                  <Ionicons name="star" size={18} color={colors.surface} />
                  <Text style={styles.captainText}>Captain</Text>
                </View>
              )}
            </View>
            <Text style={styles.playerName}>{player.playerName}</Text>
            <Text style={styles.playerTeam}>{player.team}</Text>
            <View style={styles.positionBadge}>
              <Ionicons name="football" size={16} color={colors.surface} style={{ marginRight: 6 }} />
              <Text style={styles.positionText}>{player.position}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFavorite() ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite() ? colors.danger : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Stats section */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={styles.statValue}>{formatMinutes(player.MinutesPlayed)}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="calendar" size={20} color={colors.success} />
            <Text style={styles.statValue}>{new Date().getFullYear() - player.YoB}</Text>
            <Text style={styles.statLabel}>Age</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="trending-up" size={20} color={colors.warning} />
            <Text style={styles.statValue}>{(player.PassingAccuracy * 100).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Passing</Text>
          </View>
        </View>

        {/* Progress bar section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Passing Accuracy</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${player.PassingAccuracy * 100}%` }]} />
          </View>
        </View>

        {/* Fan reviews */}
        {totalFeedbacks > 0 && (
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Text style={styles.reviewsTitle}>Fan Reviews</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={colors.warning} />
                <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
              </View>
            </View>
            {player.feedbacks.slice(0, 3).map((feedback, idx) => (
              <View key={idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewInitial}>{feedback.author.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.reviewAuthor}>{feedback.author}</Text>
                  <View style={styles.reviewStars}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Ionicons
                        key={star}
                        name={star <= feedback.rating ? 'star' : 'star-outline'}
                        size={13}
                        color={colors.warning}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{feedback.comment}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Gợi ý cầu thủ tiếp theo */}
        {nextPlayers.length > 0 && (
          <View style={{ marginTop: spacing.xl, marginHorizontal: spacing.lg }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.primary, marginBottom: 8 }}>Cầu thủ có thể bạn biết</Text>
            {nextPlayers.map((np) => (
              <FootballPlayerCard
                key={np.id}
                player={np}
                onPress={() => navigation.navigate('PlayerDetails', { playerId: np.id })}
                isFavorite={favorites.some(fav => fav.id === np.id)}
                onFavoritePress={() => {
                  const isFav = favorites.some(fav => fav.id === np.id);
                  if (isFav) {
                    dispatch(removeFromFavorites(np.id));
                  } else {
                    dispatch(addToFavorites(np));
                  }
                }}
              />
            ))}
          </View>
        )}

        {/* Action button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.actionButton, isFavorite() && styles.actionButtonFavorited]}
            onPress={handleFavoritePress}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isFavorite() ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite() ? colors.surface : colors.primary}
            />
            <Text style={[styles.actionButtonText, isFavorite() && styles.actionButtonTextFavorited]}>
              {isFavorite() ? 'Remove from Favorites' : 'Add to Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
      {/* Floating AI Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAIOverlay(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="bulb" size={28} color={colors.surface} />
      </TouchableOpacity>
      {/* AI Overlay Modal */}
      <Modal
        visible={showAIOverlay}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAIOverlay(false)}
      >
        <View style={styles.overlayBackdrop}>
          <View style={styles.overlayBox}>
            <TouchableOpacity style={styles.overlayCloseBtn} onPress={() => setShowAIOverlay(false)}>
              <Ionicons name="close" size={24} color={colors.danger} />
            </TouchableOpacity>
            <GeminiPlayerAnalysis player={player} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.lg,
    color: colors.surface,
    fontWeight: typography.weights.medium,
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'column',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: colors.card,
  },
  captainBadge: {
    position: 'absolute',
    bottom: -16,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  captainText: {
    color: colors.surface,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  playerName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  playerTeam: {
    fontSize: typography.sizes.md,
    color: colors.surface + 'CC',
    marginBottom: 2,
    textAlign: 'center',
  },
  positionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  positionText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 1,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: '85%',
    alignSelf: 'center',
    marginTop: -60,
    zIndex: 2,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  progressSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  progressLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: 10,
    backgroundColor: colors.success,
    borderRadius: 5,
  },
  reviewsSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    color: colors.warning,
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  reviewInitial: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    color: colors.text.primary,
    fontSize: 14,
    marginRight: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  reviewComment: {
    color: colors.text.secondary,
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 2,
  },
  actionSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  actionButtonFavorited: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  actionButtonTextFavorited: {
    color: colors.surface,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  overlayCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
  },
}); 