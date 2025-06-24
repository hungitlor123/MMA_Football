import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../service/store/hooks';
import { fetchAllPlayers, setSelectedTeam } from '../service/slices/playersSlice';
import { addToFavorites, removeFromFavorites } from '../service/slices/favoritesSlice';
import { Player } from '../types';
import { FootballPlayerCard } from '../components';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { colors } from '../styles/colors';
import { spacing, typography, borderRadius } from '../styles/spacing';

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const { players, filteredPlayers, isLoading, selectedTeam } = useAppSelector(state => state.players);
  const { favorites } = useAppSelector(state => state.favorites);

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [teamModalVisible, setTeamModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const positionCounts: Record<string, number> = {};
  players.forEach(player => {
    positionCounts[player.position] = (positionCounts[player.position] || 0) + 1;
  });
  const sortedPositions = Object.keys(positionCounts).sort((a, b) => a.localeCompare(b));
  const positions = ['All', ...sortedPositions];

  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllPlayers());
  }, [dispatch]);

  const teamCounts: Record<string, number> = {};
  players.forEach(player => {
    teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
  });
  const sortedTeams = Object.keys(teamCounts).sort((a, b) => a.localeCompare(b));
  const teams = ['All', ...sortedTeams];

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

  const handleTeamFilter = (team: string) => {
    dispatch(setSelectedTeam(team === 'All' ? null : team));
  };

  const handlePositionFilter = (position: string) => {
    setSelectedPosition(position === 'All' ? null : position);
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
    let data = players;
    if (selectedPosition) {
      data = data.filter(player => player.position === selectedPosition);
    }
    if (showFavoritesOnly) {
      data = data.filter(player => isFavorite(player.id));
    }
    if (searchQuery.trim()) {
      data = data.filter(player => player.playerName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return data;
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header bóng đá */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
            <View>
              <Text style={styles.headerTitle}>FootWatch</Text>
              <Text style={styles.headerSubtitle}>{getDisplayData().length} players</Text>
            </View>
          </View>
        </View>

        {/* Search box */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, isSearchFocused && styles.searchInputFocused]}>
            <Ionicons
              name="search"
              size={20}
              color={isSearchFocused ? colors.primary : colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by player name..."
              placeholderTextColor={colors.text.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chip */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
            {positions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.chip,
                  (selectedPosition === item || (item === 'All' && !selectedPosition)) && styles.chipActive
                ]}
                onPress={() => handlePositionFilter(item)}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.chipText,
                  (selectedPosition === item || (item === 'All' && !selectedPosition)) && styles.chipTextActive
                ]}>
                  {item}
                  {item !== 'All' && (
                    <Text style={styles.chipCount}>  ({positionCounts[item]})</Text>
                  )}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Players List */}
        <FlatList
          data={getDisplayData()}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.playersContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={showFavoritesOnly ? 'heart-outline' : 'football'}
                size={48}
                color={colors.primary}
              />
              <Text style={styles.emptyTitle}>
                {showFavoritesOnly ? 'No favorite players' : 'No players found'}
              </Text>
              <Text style={styles.emptyDescription}>
                {showFavoritesOnly
                  ? 'Add some players to your favorites to see them here'
                  : 'Check your internet connection or try again'
                }
              </Text>
            </View>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: typography.sizes.md,
    color: colors.surface + 'CC',
  },
  filtersContainer: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.lg,
  },
  filtersContent: {
    gap: spacing.sm,
  },
  chip: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.surface,
  },
  chipText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  chipTextActive: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  chipCount: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  playersContainer: {
    padding: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: 'flex-start',
    marginLeft: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  dropdownButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemActive: {
    backgroundColor: colors.primary,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalItemTextActive: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  modalClose: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: colors.danger,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
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
}); 