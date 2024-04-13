import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: string | null;
  isLoggedIn: boolean;
}
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginIn(state, action: PayloadAction<string>) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { loginIn, logout } = authSlice.actions;
export default authSlice;
