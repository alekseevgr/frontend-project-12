import instance from '../instance/instance'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import routes from './routes'

const login = async (values, deps) => {
  const { dispatch, navigate, rollbar, setErrorPassword, t } = deps
  try {
    const res = await instance.post(routes.login(), values)
    const token = res.data.token
    const name = res.data.username

    dispatch(setCredentials({ token, name }))

    localStorage.setItem('userId', token)
    localStorage.setItem('username', name)

    navigate('/', { replace: true })

    setErrorPassword(false)
  } catch (err) {
    if (err.response?.status === 401) {
      setErrorPassword(true)
    } else {
      rollbar.error('Login failed', err, { username: values.username })
      toast.error(!err.response ? t('errors.network') : t('errors.unknown'))
    }
  }
}

export default login
