const ChatList = ({ channels }) => {
   // [{ id: '1', name: 'general', removable: false }, ...]
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
