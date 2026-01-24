import { createSlice } from "@reduxjs/toolkit";

const tokenFromStorage = localStorage.getItem("userId");
const initialState = {
  token: tokenFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userId");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
