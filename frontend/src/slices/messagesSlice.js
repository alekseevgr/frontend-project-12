import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],

};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
