import { Modal, Form, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import routes from '../../utils/routes'
import axios from 'axios'

import { useEffect, useRef } from 'react'
import * as yup from 'yup'
import styles from '../../styles/Channels.module.css'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'
import { useRollbar } from '@rollbar/react'

const RenameChannel = ({ show, onHide, channelId }) => {
  const token = useSelector(state => state.auth.token)
  const channel = useSelector(state =>
    state.channels.items.find(c => c.id === channelId),
  )
  const channels = useSelector(state => state.channels.items)
  const { t } = useTranslation()
  const rollbar = useRollbar()

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, t('form.symbolsRange'))
      .max(20, t('form.symbolsRange'))
      .required(t('form.required'))
      .test('unique', t('channels.unique'), (value) => {
        const name = value?.trim()
        return !channels.some(c => c.name === name && c.id !== channelId)
      }),
  })

  const inputRef = useRef(null)
  useEffect(() => {
    if (show) {
      inputRef.current?.focus()
    }
  }, [show])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: channel?.name ?? '',
    },
    validationSchema,
    onSubmit: (values, { resetForm, setFieldError, setSubmitting }) => {
      const name = values.name.trim()

      if (filter.check(name)) {
        setFieldError('name', t('errors.profanity'))
        toast.error(t('errors.profanity'))
        setSubmitting(false)
        return
      }

      const newName = { name }
      return axios
        .patch(routes.editChannel(channelId), newName, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          toast.success(t('toast.renaming'))
          resetForm()
          onHide()
        })
        .catch((e) => {
          rollbar.error('Rename channel failed', e, {
            nameChannel: name,
            status: e?.response?.status,
          })
          toast.error(!e.response ? t('errors.network') : t('errors.unknown'))
        })
    },
  })
  const isInvalid = formik.touched.name && Boolean(formik.errors.name)
  const handleCancel = () => {
    formik.resetForm()
    onHide()
  }
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{t('channels.changeName')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Label
              htmlFor="rename-channel-name"
              className="visually-hidden"
            >
              {t('channels.channelName')}
            </Form.Label>
            <Form.Control
              ref={inputRef}
              name="name"
              id="rename-channel-name"
              value={formik.values.name}
              aria-label={t('channels.channelName')}
              onChange={(e) => {
                formik.handleChange(e)
                if (formik.errors.name) {
                  formik.setFieldError('name', undefined)
                }
              }}
              placeholder={t('channels.typeNewNameChannel')}
              className={`${styles.input} ${isInvalid ? styles.inputInvalid : ''}`}
              isInvalid={isInvalid}
            />
            <Form.Control.Feedback
              type="invalid"
              className={styles.invalidFeedback}
            >
              {formik.touched.name ? formik.errors.name : null}
            </Form.Control.Feedback>
          </Form.Group>

          <div className={styles.formActions}>
            <Button
              type="button"
              onClick={handleCancel}
              className={styles.secondaryButton}
            >
              {t('channels.reject')}
            </Button>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className={styles.primaryButton}
            >
              {t('channels.changeName')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default RenameChannel
