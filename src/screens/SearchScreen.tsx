import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../service/store/hooks';
import { fetchAllPlayers, searchPlayers } from '../service/slices/playersSlice';
import { addToFavorites, removeFromFavorites } from '../service/slices/favoritesSlice';
import { Player } from '../types';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { colors } from '../styles/colors';
import { spacing, typography, borderRadius } from '../styles/spacing';
import { debounce } from '../utils/helpers';
import { FootballPlayerCard } from '../components';

export default function SearchScreen() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const { players, filteredPlayers, isLoading } = useAppSelector(state => state.players);
  const { favorites } = useAppSelector(state => state.favorites);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Load players when component mounts
  useEffect(() => {
    if (players.length === 0) {
      dispatch(fetchAllPlayers());
    }
  }, [dispatch, players.length]);

  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      dispatch(searchPlayers(query));
    }
  }, 300);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  const handlePlayerPress = (player: Player) => {
    navigation.navigate('PlayerDetails', { playerId: player.id });
  };

  const handleFavoritePress = (player: Player) => {
    const isFavorite = favorites.some(fav => fav.id === player.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(player.id));
    } else {
      dispatch(addToFavorites(player));
    }
  };

  const isFavorite = (playerId: string) => {
    return favorites.some(fav => fav.id === playerId);
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDisplayData = () => {
    if (!searchQuery.trim()) {
      return players; // Show all players when no search
    }
    return filteredPlayers;
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <FootballPlayerCard
      player={item}
      onPress={() => handlePlayerPress(item)}
      isFavorite={isFavorite(item.id)}
      onFavoritePress={() => handleFavoritePress(item)}
    />
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Search Players</Text>
            <Text style={styles.subtitle}>Find your favorite football stars</Text>
          </View>

          <View style={styles.searchContainer}>
            <TouchableOpacity
              style={[
                styles.searchInputContainer,
                isFocused && styles.searchInputFocused
              ]}
              onPress={() => searchInputRef.current && searchInputRef.current.focus()}
              activeOpacity={1}
            >
              <Ionicons
                name="search"
                size={20}
                color={isFocused ? colors.primary : colors.text.secondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, team, or position..."
                placeholderTextColor={colors.text.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                editable={true}
                selectTextOnFocus={true}
                blurOnSubmit={false}
                keyboardType="default"
                ref={searchInputRef}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchQuery('')}
                >
                  <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          <FlatList
            data={getDisplayData()}
            renderItem={renderPlayer}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <Ionicons
                    name={searchQuery.trim() ? "search" : "football"}
                    size={48}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  {searchQuery.trim() ? "No players found" : "Start searching"}
                </Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery.trim()
                    ? `No results for "${searchQuery}". Try different keywords.`
                    : "Type a player name, team, or position to find players"
                  }
                </Text>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.heading,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  searchInputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  clearButton: {
    padding: spacing.xs,
  },
  resultsContainer: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  playerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerImageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  playerImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
  },
  favoriteButton: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  playerTeam: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
  },
  captainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  captainText: {
    fontSize: typography.sizes.xs,
    color: colors.warning,
    fontWeight: typography.weights.bold,
    marginLeft: 2,
  },
  playerPosition: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  minutesHighlight: {
    color: colors.primary,
  },
  accuracyHighlight: {
    color: colors.success,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  debugContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  debugText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  debugButton: {
    padding: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  debugButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
}); 