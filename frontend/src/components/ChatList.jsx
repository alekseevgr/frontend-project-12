const ChatList = ({ channels }) => {
  return (
    <>
      <ul>
        {channels.map(({ id, name }) => {
          return <li key={id}>{name}</li>;
        })}
      </ul>
    </>
  );
};

export default ChatList;
