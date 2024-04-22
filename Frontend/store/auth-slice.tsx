import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userName: string | null;
  userId: string | null;
  isLoggedIn: boolean;
}
const initialState: AuthState = {
  userName: null,
  userId: null,
  isLoggedIn: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginIn(state, action) {
      state.isLoggedIn = true;
      const data = action.payload;
      state.userId = data._id;
      state.userName = data.name;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.userId = null;
    },
  },
});

export const { loginIn, logout } = authSlice.actions;
export default authSlice;
