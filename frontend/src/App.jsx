import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { setChannels } from './slices/channelsSlice'
import { setMessages } from './slices/messagesSlice'

import ChatList from './components/channelsList/ChatList'
import MessageList from './components/messageList/MessageList'
import NewMessage from './components/messageList/NewMessage'
import styles from './styles/App.module.css'
import { useRollbar } from '@rollbar/react'
import api from './api/api'

const App = () => {
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const channels = useSelector(state => state.channels.items)
  const messages = useSelector(state => state.messages.items)
  const rollbar = useRollbar()

  async function getChannels() {
    const { data } = await api.get('/channels')
    return data
  }
  async function getMessages() {
    const { data } = await api.get('/messages')
    return data
  }

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [channelsData, messagesData] = await Promise.all([
          getChannels(token),
          getMessages(token),
        ])

        dispatch(setChannels(channelsData))
        dispatch(setMessages(messagesData))
      } catch (e) {
        rollbar.error('Failed to load initial data', e, {
          hasToken: Boolean(token),
        })
      }
    }

    loadInitialData()
  }, [token, dispatch, rollbar])

  return (
    <>
      <main className={styles.appMain}>
        <aside className={styles.channels}>
          <ChatList channels={channels} activeChannelId="1" />
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
    </>
  )
}

export default App
