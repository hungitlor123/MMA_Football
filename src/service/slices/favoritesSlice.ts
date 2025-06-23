import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../types';
import { storage } from '../../utils/storage';
import { STORAGE_KEYS } from '../constants/appConstants';

interface FavoritesState {
  favorites: Player[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await storage.getItem<Player[]>(STORAGE_KEYS.FAVORITES) || [];
      return favorites;
    } catch (error) {
      return rejectWithValue('Failed to load favorites');
    }
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (player: Player, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const isAlreadyFavorite = state.favorites.favorites.some(fav => fav.id === player.id);
      
      if (isAlreadyFavorite) {
        return rejectWithValue('Player is already in favorites');
      }
      
      const updatedFavorites = [...state.favorites.favorites, player];
      await storage.setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      return rejectWithValue('Failed to add to favorites');
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (playerId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { favorites: FavoritesState };
      const updatedFavorites = state.favorites.favorites.filter(fav => fav.id !== playerId);
      await storage.setItem(STORAGE_KEYS.FAVORITES, updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      return rejectWithValue('Failed to remove from favorites');
    }
  }
);

export const clearAllFavorites = createAsyncThunk(
  'favorites/clearAllFavorites',
  async (_, { rejectWithValue }) => {
    try {
      await storage.setItem(STORAGE_KEYS.FAVORITES, []);
      return [];
    } catch (error) {
      return rejectWithValue('Failed to clear favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.favorites = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Clear all favorites
      .addCase(clearAllFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(clearAllFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer; 