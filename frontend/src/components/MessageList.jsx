import { useSelector } from "react-redux";

const MessageList = ({ messages }) => {
  //{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]

  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messagesChannel = messages.filter(
    (message) => message.channelId === activeChannelId,
  );

  return (
    <>
      <ul>
        {messagesChannel.map(({ id, body, username }) => {
          return (
            <li key={id}>
              <h3>{username}</h3>
              <p>{body}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default MessageList;
