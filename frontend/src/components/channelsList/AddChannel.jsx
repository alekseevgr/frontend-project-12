import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import routes from "../../utils/routes";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChannel } from "../../slices/channelsSlice";
import * as yup from "yup";
import styles from "./Channels.module.css";

const AddChannel = ({ show, onHide }) => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, "Минимум 3 символа")
      .max(20, "Максимум 20 символов")
      .required("Обязательно"),
  });

  const inputRef = useRef(null);
  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newChannel = values;
      return axios
        .post(routes.channels(), newChannel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          dispatch(setActiveChannel(data.id));
          resetForm();
          onHide();
        })
        .catch((e) => {
          console.error(e);
        });
    },
  });
  // [{ id: '1', name: 'general', removable: false }, ...]
  const isInvalid = formik.touched.name && Boolean(formik.errors.name);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Control
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="type name channel"
              className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""}`}
              isInvalid={isInvalid}
            />
            <Form.Control.Feedback
              type="invalid"
              className={styles.invalidFeedback}
            >
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className={styles.button}
          >
            Create channel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
// END
