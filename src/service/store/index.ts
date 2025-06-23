import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appReducer from '../slices/appSlice';
import playersReducer from '../slices/playersSlice';
import favoritesReducer from '../slices/favoritesSlice';
import profileReducer from '../slices/profileSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['app', 'favorites', 'profile'], // Only persist these reducers
};

const rootReducer = combineReducers({
  app: appReducer,
  players: playersReducer,
  favorites: favoritesReducer,
  profile: profileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 