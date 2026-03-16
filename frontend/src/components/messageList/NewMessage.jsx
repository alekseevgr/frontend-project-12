import { useFormik } from 'formik'
import { Button, Form } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import styles from '../../styles/MessageList.module.css'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { useRef, useEffect } from 'react'
import sendMessage from '../../utils/sendMessage'

const NewMessage = () => {
  const currentName = useSelector((state) => state.auth.username)
  const currentId = useSelector((state) => state.channels.activeChannelId)

  const { t } = useTranslation()
  const rollbar = useRollbar()

  const inputRef = useRef(null)
  const MAX_HEIGHT = 120

  const growOnly = () => {
    const el = inputRef.current
    if (!el) return

    const next = Math.min(el.scrollHeight, MAX_HEIGHT)
    if (next > el.offsetHeight) {
      el.style.height = `${next}px`
    }
  }

  const resetHeight = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = ''
  }

  useEffect(() => {
    resetHeight()
  }, [])

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: (values, { resetForm }) =>
      sendMessage(values, {
        currentName,
        currentId,
        t,
        resetForm,
        resetHeight,
        rollbar,
      }),
  })

  return (
    <Form onSubmit={formik.handleSubmit} className={styles.form}>
      <Form.Group className={styles.group}>
        <Form.Control
          as="textarea"
          rows={1}
          ref={inputRef}
          id="message"
          name="message"
          aria-label={t('channels.newMessage')}
          value={formik.values.message}
          onChange={(e) => {
            formik.handleChange(e)
            growOnly()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              formik.handleSubmit()
            }
          }}
          placeholder={t('channels.typeMessage')}
          className={styles.input}
          autoComplete="off"
        />
      </Form.Group>

      <Button type="submit" variant="primary" className={styles.button}>
        {t('channels.send')}
      </Button>
    </Form>
  )
}

export default NewMessage
