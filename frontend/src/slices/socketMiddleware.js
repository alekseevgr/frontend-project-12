import { io } from 'socket.io-client'
import { addMessage } from './messagesSlice'
import { addChannel, removeChannel, renameChannel } from './channelsSlice'

export const socketMiddleware = () => {
  const socket = io(window.location.origin)

  return (store) => {
    socket.on('newMessage', (payload) => {
      store.dispatch(addMessage(payload))
    })
    socket.on('newChannel', (payload) => {
      store.dispatch(addChannel(payload))
    })
    socket.on('removeChannel', (payload) => {
      store.dispatch(removeChannel(payload))
    })
    socket.on('renameChannel', (payload) => {
      store.dispatch(renameChannel(payload))
    })

    return next => (action) => {
      return next(action)
    }
  }
}
