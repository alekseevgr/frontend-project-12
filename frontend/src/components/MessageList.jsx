const MessageList = ({ messages }) => {
  //{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
  return (
    <>
      <ul>
        {messages.map(({ id, body, username }) => {
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
