import api from '../api/api'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'

const sendMessage = async (values, deps) => {
  const { currentName, currentId, t, resetForm, resetHeight, rollbar } = deps
  const raw = values.message.trim()
  if (!raw) return

  const cleaned = filter.clean(raw)

  if (cleaned !== raw) {
    toast.info(t('toast.profanityCleaned'))
  }

  const newMessage = {
    body: cleaned,
    channelId: currentId,
    username: currentName,
  }

  return await api
    .post('/messages', newMessage)
    .then(() => {
      resetForm()
      resetHeight()
    })
    .catch((e) => {
      rollbar.error('Send message failed', e, {
        data: {
          channelId: newMessage.channelId,
          username: newMessage.username,
        },
        status: e?.response?.status,
      })
      toast.error(!e.response ? t('errors.network') : t('errors.unknown'))
    })
}

export default sendMessage
