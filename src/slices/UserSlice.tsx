import { createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { RootState } from '../store';

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set_user: (state, actions) => {
      state.currentUser = actions.payload;
      state.isLoading = false;
    },
    clear_user: (state) => {
      state.currentUser = null;
      state.isLoading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set_user, clear_user } = userSlice.actions;

// Selector
export const selectValue = (state: RootState) => state.user;

export default userSlice.reducer;
