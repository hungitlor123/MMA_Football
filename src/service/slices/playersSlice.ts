import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Player, TeamFilter } from '../../types';
import { playersApi } from '../api/playersApi';

interface PlayersState {
  players: Player[];
  filteredPlayers: Player[];
  selectedTeam: string | null;
  teams: TeamFilter[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: PlayersState = {
  players: [],
  filteredPlayers: [],
  selectedTeam: null,
  teams: [],
  isLoading: false,
  error: null,
  searchQuery: '',
};

// Async thunks
export const fetchAllPlayers = createAsyncThunk(
  'players/fetchAllPlayers',
  async (_, { rejectWithValue }) => {
    try {
      const players = await playersApi.getAllPlayers();
      return players;
    } catch (error) {
      return rejectWithValue('Failed to fetch players');
    }
  }
);

export const fetchPlayerById = createAsyncThunk(
  'players/fetchPlayerById',
  async (playerId: string, { rejectWithValue }) => {
    try {
      const player = await playersApi.getPlayerById(playerId);
      return player;
    } catch (error) {
      return rejectWithValue('Failed to fetch player details');
    }
  }
);

export const searchPlayers = createAsyncThunk(
  'players/searchPlayers',
  async (query: string, { rejectWithValue }) => {
    try {
      const players = await playersApi.searchPlayers(query);
      return { players, query };
    } catch (error) {
      return rejectWithValue('Failed to search players');
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setSelectedTeam: (state, action: PayloadAction<string | null>) => {
      state.selectedTeam = action.payload;
      if (action.payload) {
        state.filteredPlayers = state.players.filter(
          player => player.team === action.payload
        );
      } else {
        state.filteredPlayers = state.players;
      }
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.filteredPlayers = state.selectedTeam 
        ? state.players.filter(player => player.team === state.selectedTeam)
        : state.players;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all players
      .addCase(fetchAllPlayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllPlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.players = action.payload;
        state.filteredPlayers = action.payload;
        
        // Generate teams data
        const teamsMap: Record<string, number> = {};
        action.payload.forEach(player => {
          teamsMap[player.team] = (teamsMap[player.team] || 0) + 1;
        });
        
        state.teams = Object.entries(teamsMap).map(([name, count]) => ({
          name,
          count,
        }));
      })
      .addCase(fetchAllPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search players
      .addCase(searchPlayers.fulfilled, (state, action) => {
        state.filteredPlayers = action.payload.players;
        state.searchQuery = action.payload.query;
      });
  },
});

export const { setSelectedTeam, clearSearch, clearError } = playersSlice.actions;
export default playersSlice.reducer; 