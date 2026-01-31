import { createSlice } from "@reduxjs/toolkit";

const savedId = localStorage.getItem("activeChannelId");
const initialState = {
  items: [],
  activeChannelId:  savedId ?? "1",
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload;
    },
    setActiveChannel: (state, action) => {
      state.activeChannelId = action.payload;
      localStorage.setItem("activeChannelId", action.payload)
    },
    addChannel: (state, action) => {
      state.items.push(action.payload)
    }
  },
});

export const { setChannels, setActiveChannel, addChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
