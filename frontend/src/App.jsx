import { useEffect } from "react";
import axios from "axios";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import routes from "./utils/routes";
import { setChannels } from "./slices/channelsSlice";
import { setMessages } from "./slices/messagesSlice";

import ChatList from "./components/ChatList";
import MessageList from "./components/MessageList";
import NewMessage from "./components/NewMessage"

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

  useEffect(() => {
    console.log("channels:", channels);
    console.log("messages:", messages);
  }, [channels, messages]);

  return (
    <>
      <header className="app-header">Hexlet chat by alekseevgr</header>
      <main className="app-main">
        <aside className="channels">
          <ChatList channels={channels} activeChannelId={"1"} />
        </aside>
        <section className="chat">
          <div className="messages">
            <MessageList messages={messages} activeChannelId="1" />
          </div>
          <div className="sendMessage"><NewMessage /></div>
        </section>
      </main>
      <footer></footer>
    </>
  );
};

export default App;
