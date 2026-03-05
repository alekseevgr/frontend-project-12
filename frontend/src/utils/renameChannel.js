import api from '../api/api'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'

const renameChannel = async (values, deps) => {
  const { channelId, onHide, rollbar, formikHelpers, t } = deps
  const name = values.name.trim()

  if (filter.check(name)) {
    formikHelpers.setFieldError('name', t('errors.profanity'))
    toast.error(t('errors.profanity'))
    formikHelpers.setSubmitting(false)
    return
  }

  const newName = { name }
  return await api
    .patch(`channels/${channelId}`, newName)
    .then(() => {
      toast.success(t('toast.renaming'))
      formikHelpers.resetForm()
      onHide()
    })
    .catch((e) => {
      rollbar.error('Rename channel failed', e, {
        nameChannel: name,
        status: e?.response?.status,
      })
      toast.error(!e.response ? t('errors.network') : t('errors.unknown'))
    })
}

export default renameChannel
