import instance from '../instance/instance'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import routes from './routes'

const registration = async (values, deps) => {
  const { dispatch, navigate, rollbar, formikHelpers, t } = deps
  try {
    const { username, password } = values
    const res = await instance.post(routes.signup, {
      username,
      password,
    })

    const token = res.data.token
    const name = res.data.username

    dispatch(setCredentials({ token, name }))

    localStorage.setItem('userId', token)
    localStorage.setItem('username', name)

    navigate('/', { replace: true })
  }
  catch (err) {
    if (err.response?.status === 409) {
      formikHelpers.setFieldError('username', t('login.nameTaken'))
      return
    }

    rollbar.error('Registration failed', err, {
      username: values.username,
    })
    toast.error(!err.response ? t('errors.network') : t('errors.unknown'))
  }
}

export default registration
