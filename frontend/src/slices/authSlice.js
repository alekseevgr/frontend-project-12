import { createSlice } from '@reduxjs/toolkit'

const tokenFromStorage = localStorage.getItem('userId')
const usernameFromStorage = localStorage.getItem('username')
const initialState = {
  token: tokenFromStorage,
  isAuthenticated: Boolean(tokenFromStorage),
  username: usernameFromStorage,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      state.username = action.payload.name
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
