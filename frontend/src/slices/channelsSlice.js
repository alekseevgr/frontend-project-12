import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  currentChannelId: "1",
};

const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action) => {
      state.items = action.payload;
    },
    setChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
});

export const { setChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
