import { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { Modal, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import routes from '../../utils/routes'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { setActiveChannel } from '../../slices/channelsSlice'
import * as yup from 'yup'
import styles from '../../styles/Channels.module.css'
import { useRollbar } from '@rollbar/react'

import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import filter from 'leo-profanity'

const AddChannel = ({ show, onHide }) => {
  const token = useSelector((state) => state.auth.token)
  const channels = useSelector((state) => state.channels.items)
  const dispatch = useDispatch()
  const rollbar = useRollbar()

  const { t } = useTranslation()

  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .trim()
          .min(3, t('form.symbolsRange'))
          .max(20, t('form.symbolsRange'))
          .required(t('form.required'))
          .test('unique', t('channels.unique'), (value) => {
            const raw = value?.trim() ?? ''
            const cleaned = filter.clean(raw)
            return !channels.some((c) => c.name === cleaned)
          }),
      }),
    [t, channels],
  )

  const inputRef = useRef(null)
  useEffect(() => {
    if (show) {
      inputRef.current?.focus()
    }
  }, [show])

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const name = values.name.trim()

      const cleaned = filter.clean(name)
      const newChannel = { name: cleaned }

      return axios
        .post(routes.channels(), newChannel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
        <Modal.Title>{t('channels.createChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Label htmlFor="name" className="visually-hidden">
              {t('channels.channelName')}
            </Form.Label>
            <Form.Control
              ref={inputRef}
              id="name"
              name="name"
              aria-label={t('channels.channelName')}
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder={t('channels.typeNameChannel')}
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
              {t('channels.createChannel')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default AddChannel
// END
