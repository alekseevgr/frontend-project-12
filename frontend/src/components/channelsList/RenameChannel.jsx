import { Modal, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import routes from "../../utils/routes";
import axios from "axios";

import { useEffect, useRef } from "react";
import * as yup from "yup";
import styles from "./Channels.module.css";

const RenameChannel = ({ show, onHide, channelId }) => {
  const token = useSelector((state) => state.auth.token);
  const channel = useSelector((state) =>
  state.channels.items.find((c) => c.id === channelId)
);

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
      name: channel?.name ?? "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newName = values;
      return axios
        .patch(routes.editChannel(channelId), newName, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          resetForm();
          onHide();
        })
        .catch((e) => {
          console.error(e);
        });
    },
  });
  const isInvalid = formik.touched.name && Boolean(formik.errors.name);
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rename channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Control
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="type new name channel"
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
            Rename channel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
