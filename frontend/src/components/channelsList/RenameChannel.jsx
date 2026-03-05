import { Modal, Form, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useEffect, useRef, useMemo } from 'react'
import styles from '../../styles/Channels.module.css'
import { useTranslation } from 'react-i18next'
import { useRollbar } from '@rollbar/react'
import { getChannelValidationSchema } from '../../utils/validationSchema'
import renameChannel from '../../utils/renameChannel'

const RenameChannel = ({ show, onHide, channelId }) => {
  const channel = useSelector((state) =>
    state.channels.items.find((c) => c.id === channelId),
  )
  const channels = useSelector((state) => state.channels.items)
  const { t } = useTranslation()
  const rollbar = useRollbar()

  const validationSchema = useMemo(
    () =>
      getChannelValidationSchema({
        t,
        channels,
        channelId,
      }),
    [t, channels, channelId],
  )

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
    onSubmit: (values, formikHelpers) =>
      renameChannel(values, { channelId, onHide, rollbar, formikHelpers, t }),
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
