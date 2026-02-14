import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import { useState } from 'react'
import axios from 'axios'
import routes from '../../utils/routes'

import { useDispatch } from 'react-redux'
import { setCredentials } from '../../slices/authSlice'
import styles from '../../styles/StartPage.module.css'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useRollbar } from '@rollbar/react'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errorPassword, setErrorPassword] = useState(false)
  const rollbar = useRollbar()

  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values)
        const token = res.data.token
        const name = res.data.username

        dispatch(setCredentials({ token, name }))

        localStorage.setItem('userId', token)
        localStorage.setItem('username', name)

        navigate('/', { replace: true })

        setErrorPassword(false)
      }
      catch (err) {
        if (err.response?.status === 401) {
          setErrorPassword(true)
        }
        else {
          rollbar.error('Login failed', err, { username: values.username })
          toast.error(!err.response ? t('errors.network') : t('errors.unknown'))
        }
      }
    },
  })

  const isInvalid = Boolean(errorPassword)
  const handleClick = () => {
    navigate('/signup', { replace: true })
  }

  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.content}>
            <h1 className={styles.title}>{t('login.enter')}</h1>
            <Form onSubmit={formik.handleSubmit} className={styles.form}>
              <Form.Group className={styles.formGroup}>
                <div className={styles.field}>
                  <Form.Control
                    id="username"
                    name="username"
                    type="text"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder=" "
                    className={`${styles.input} ${isInvalid ? styles.inputInvalid : ''}`}
                    isInvalid={isInvalid}
                  />
                  <label className={styles.floatingLabel} htmlFor="username">
                    {t('login.nickname')}
                  </label>
                </div>
              </Form.Group>

              <Form.Group className={styles.formGroup}>
                <div className={styles.field}>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder=" "
                    className={`${styles.input} ${isInvalid ? styles.inputInvalid : ''}`}
                    isInvalid={isInvalid}
                  />
                  <label className={styles.floatingLabel} htmlFor="password">
                    {t('login.password')}
                  </label>

                  {isInvalid
                    ? (
                    <Form.Control.Feedback
                      type="invalid"
                      className={styles.invalidFeedback}
                    >
                      {t('login.invalidCreds')}
                    </Form.Control.Feedback>
                      )
                    : null}
                </div>
              </Form.Group>

              <Button type="submit" className={styles.primaryButton}>
                {t('login.enter')}
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <div className={styles.footerBlock}>
        {t('login.noAccount')}
        {' '}
        <button
          type="button"
          onClick={handleClick}
          className={styles.footerLink}
        >
          {t('login.registration')}
        </button>
      </div>
    </div>
  )
}

export default LoginPage
