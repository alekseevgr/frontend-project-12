import { useEffect } from "react";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import routes from "./utils/routes";
import { setChannels } from "./slices/channelsSlice";
import { setMessages } from "./slices/messagesSlice";

import ChatList from "./components/channelsList/ChatList";
import MessageList from "./components/messageList/MessageList";
import NewMessage from "./components/messageList/NewMessage";
import styles from "./App.module.css";
import { logout } from "./slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const channels = useSelector((state) => state.channels.items);
  const messages = useSelector((state) => state.messages.items);

  async function getChannels(token) {
    const { data } = await axios.get(routes.channels(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  }
  async function getMessages(token) {
    const { data } = await axios.get(routes.messages(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  }

  useEffect(() => {
    (async () => {
      const channelsData = await getChannels(token);
      const messagesData = await getMessages(token);

      dispatch(setChannels(channelsData));
      dispatch(setMessages(messagesData));
    })();
  }, [token, dispatch]);

  return (
    <>
      <header className={styles.appHeader}>
        <span>Hexlet chat</span>
        <button type="button" onClick={() => dispatch(logout())}>
          Выйти
        </button>
      </header>

      <main className={styles.appMain}>
        <aside className={styles.channels}>
          <ChatList channels={channels} activeChannelId={"1"} />
        </aside>

        <section className={styles.chat}>
          <div className={styles.messages}>
            <MessageList messages={messages} activeChannelId="1" />
          </div>

          <div className={styles.sendMessage}>
            <NewMessage />
          </div>
        </section>
      </main>

      <footer />
    </>
  );
};

export default App;
