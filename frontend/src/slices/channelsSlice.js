import { createSlice } from '@reduxjs/toolkit'

const savedId = localStorage.getItem('activeChannelId')
const initialState = {
  items: [],
  activeChannelId: savedId ?? '1',
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload
      localStorage.setItem('activeChannelId', action.payload)
    },
    addChannel: (state, action) => {
      state.items.push(action.payload)
    },
    removeChannel: (state, action) => {
      const { id } = action.payload
      state.items = state.items.filter(item => item.id !== id)
      if (state.activeChannelId === id) {
        state.activeChannelId = '1'
        localStorage.setItem('activeChannelId', '1')
      }
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload
      const channel = state.items.find(item => item.id === id)
      if (channel) {
        channel.name = name
      }
    },
  },
})

export const {
  setChannels,
  setActiveChannel,
  addChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions
export default channelsSlice.reducer
