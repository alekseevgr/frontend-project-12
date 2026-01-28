import { io } from "socket.io-client";
import { addMessage } from "./messagesSlice";

export const socketMiddleware = () => {
  const socket = io(window.location.origin);

  return (store) => {
    socket.on("newMessage", (payload) => {
      store.dispatch(addMessage(payload));
    });

    return (next) => (action) => {
      return next(action);
    };
  };
};
