import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.items = action.payload;
    },
    addMessage: (state, action) => {
      state.items = [...state.items, action.payload];
    },
  },
});

export const { setMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;