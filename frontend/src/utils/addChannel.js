import { setActiveChannel } from '../slices/channelsSlice'
import { toast } from 'react-toastify'
import instance from '../instance/instance'
import routes from './routes'

const addChannel = async (values, deps) => {
  const { normalizeName, dispatch, resetForm, onHide, rollbar, t } = deps
  const cleaned = normalizeName(values.name)
  const newChannel = { name: cleaned }

  return await instance
    .post(routes.channels(), newChannel)
    .then(({ data }) => {
      dispatch(setActiveChannel(data.id))
      toast.success(t('toast.created'))
      resetForm()
      onHide()
    })
    .catch((e) => {
      rollbar.error('Create channel failed', e, {
        channelName: cleaned,
        status: e?.response?.status,
      })
      toast.error(!e.response ? t('errors.network') : t('errors.unknown'))
    })
}

export default addChannel
