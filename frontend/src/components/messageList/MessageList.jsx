import { useSelector } from 'react-redux'
import styles from '../../styles/MessageList.module.css'
import { useRef, useEffect } from 'react'

const MessageList = ({ messages }) => {
  const activeChannelId = useSelector((state) => state.channels.activeChannelId)

  const messagesChannel = messages.filter(
    (message) => message.channelId === activeChannelId,
  )
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return

    const nearBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 80

    if (nearBottom) {
      el.scrollTop = el.scrollHeight
    }
  }, [activeChannelId, messagesChannel.length])

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
