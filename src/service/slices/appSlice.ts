import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  theme: 'light' | 'dark';
  language: string;
  isOnboardingCompleted: boolean;
  isNetworkConnected: boolean;
  loading: {
    global: boolean;
    overlay: boolean;
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  currentScreen: string;
}

const initialState: AppState = {
  theme: 'light',
  language: 'en',
  isOnboardingCompleted: false,
  isNetworkConnected: true,
  loading: {
    global: false,
    overlay: false,
  },
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  currentScreen: 'Home',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingCompleted = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isNetworkConnected = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setOverlayLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.overlay = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<AppState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    resetApp: () => initialState,
  },
});

export const {
  setTheme,
  setLanguage,
  setOnboardingCompleted,
  setNetworkStatus,
  setGlobalLoading,
  setOverlayLoading,
  updateNotificationSettings,
  setCurrentScreen,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer; 