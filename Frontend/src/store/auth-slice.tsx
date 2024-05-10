import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userName: string | null;
  userRole: string | null;
  userId: string;
  isLoggedIn: boolean;
  token: string;
}
const initialState: AuthState = {
  userName: null,
  userId: "",
  userRole: null,
  isLoggedIn: false,
  token: "",
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginIn(state, action) {
      state.isLoggedIn = true;
      const data = action.payload;
      state.token = data.resData.token;
      state.userId = data.userDetail._id;
      const name =
        data.userDetail.name.substring(0, 1).toUpperCase() +
        data.userDetail.name.substring(1);
      state.userName = name;
      state.userRole = data.userDetail?.role;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userName = null;
      state.userId = "";
      state.userRole = null;
    },
    changeRole(state) {
      state.userRole = "member";
    },
  },
});

export const { loginIn, logout, changeRole } = authSlice.actions;
export default authSlice.reducer;
