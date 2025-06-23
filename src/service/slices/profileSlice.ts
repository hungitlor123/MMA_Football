import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  avatar: string | null;
  name: string;
  joinDate: string;
}

const initialState: ProfileState = {
  avatar: null,
  name: 'Football Fan',
  joinDate: new Date().toISOString().split('T')[0], // Today's date as join date
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    resetProfile: (state) => {
      state.avatar = null;
      state.name = 'Football Fan';
    },
  },
});

export const { setAvatar, setName, resetProfile } = profileSlice.actions;
export default profileSlice.reducer; 