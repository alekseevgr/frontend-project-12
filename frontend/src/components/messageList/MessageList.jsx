import { useSelector } from "react-redux";
import styles from "./MessageList.module.css";

const MessageList = ({ messages }) => {
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);

  const messagesChannel = messages.filter(
    (message) => message.channelId === activeChannelId,
  );

  return (
    <ul className={styles.messageList}>
      {messagesChannel.map(({ id, body, username }) => (
        <li key={id} className={styles.messageItem}>
          <span className={styles.messageUser}>{username}</span>
          <span className={styles.messageText}>{body}</span>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
