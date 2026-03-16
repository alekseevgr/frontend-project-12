import { useSelector } from 'react-redux'
import styles from '../../styles/MessageList.module.css'
import { useRef, useEffect } from 'react'

const MessageList = ({ messages }) => {
  const activeChannelId = useSelector((state) => state.channels.activeChannelId)
  const currentName = useSelector((state) => state.auth.username)

  const messagesChannel = messages.filter(
    (message) => message.channelId === activeChannelId,
  )
  const listRef = useRef(null)

  const lastMessage = messagesChannel[messagesChannel.length - 1]
  const isOwnMessage = lastMessage?.username === currentName

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const nearBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 80

    if (nearBottom || isOwnMessage) {
      el.scrollTop = el.scrollHeight
    }
  }, [activeChannelId, messagesChannel.length, isOwnMessage])

  return (
    <ul ref={listRef} className={styles.messageList}>
      {messagesChannel.map(({ id, body, username }) => (
        <li key={id} className={styles.messageItem}>
          <span className={styles.messageUser}>{username}</span>
          <span className={styles.messageText}>{body}</span>
        </li>
      ))}
    </ul>
  )
}

export default MessageList
