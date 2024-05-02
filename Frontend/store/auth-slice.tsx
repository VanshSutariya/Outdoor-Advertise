import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AuthState {
  userName: string | null;
  userRole: string;
  userId: string | null;
  isLoggedIn: boolean;
}
const initialState: AuthState = {
  userName: null,
  userId: null,
  userRole: null,
  isLoggedIn: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginIn(state, action) {
      state.isLoggedIn = true;
      const data = action.payload;
      state.userId = data._id;
      const name =
        data.name.substring(0, 1).toUpperCase() + data.name.substring(1);
      state.userName = name;
      state.userRole = data?.role;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.userId = null;
      state.userRole = null;
    },
  },
});

export const { loginIn, logout } = authSlice.actions;
export default authSlice.reducer;
