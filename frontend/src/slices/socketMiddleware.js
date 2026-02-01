import { io } from "socket.io-client";
import { addMessage } from "./messagesSlice";
import { addChannel, removeChannel, renameChannel } from "./channelsSlice";

export const socketMiddleware = () => {
  const socket = io(window.location.origin);

  return (store) => {
    socket.on("newMessage", (payload) => {
      store.dispatch(addMessage(payload));
    });
    socket.on("newChannel", (payload) => {
      console.log(payload); // { id: 6, name: "new channel", removable: true }
      store.dispatch(addChannel(payload));
    });
    socket.on("removeChannel", (payload) => {
      console.log(payload); // { id: 6 };
      store.dispatch(removeChannel(payload))
    });
    socket.on("renameChannel", (payload) => {
      console.log(payload); // { id: 7, name: "new name channel", removable: true }
      store.dispatch(renameChannel(payload))
    });

    return (next) => (action) => {
      return next(action);
    };
  };
};
