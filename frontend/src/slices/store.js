import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import messagesReducer from './messagesSlice'
import channelsReducer from './channelsSlice'
import { socketMiddleware } from './socketMiddleware'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    channels: channelsReducer,
  },
  middleware: getDefault => getDefault().concat(socketMiddleware()),
})
