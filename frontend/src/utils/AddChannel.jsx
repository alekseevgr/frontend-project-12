
import { useEffect, useRef } from 'react'
import _ from 'lodash'
import { useFormik } from 'formik'
import { Modal, Form, Button } from 'react-bootstrap'

const Add = ({ show, onHide, onAdd }) => {

  const inputRef = useRef(null)
  useEffect(() => {
    if (show) {
      inputRef.current?.focus()
    }
  }, [show])

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values, helpers) => {
      const name = values.message.trim()
      if (!name) return

      const task = {
        id: _.uniqueId('task_'),
        name,
      }
      onAdd(task)
      console.log('submit', task)

      helpers.resetForm()
    },
  });


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              ref={inputRef}
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              placeholder='type new channel name' />
          </Form.Group>

          <Button type="submit">Add channel</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Add