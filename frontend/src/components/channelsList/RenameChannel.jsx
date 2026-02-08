import { Modal, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import routes from "../../utils/routes";
import axios from "axios";

import { useEffect, useRef } from "react";
import * as yup from "yup";
import styles from "./Channels.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const RenameChannel = ({ show, onHide, channelId }) => {
  const token = useSelector((state) => state.auth.token);
  const channel = useSelector((state) =>
    state.channels.items.find((c) => c.id === channelId),
  );
  const channels = useSelector((state) => state.channels.items);
  const { t } = useTranslation();

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .min(3, t("form.minSymbols"))
      .max(20, t("form.maxSymbols"))
      .required(t("form.required"))
      .test("unique", t("channels.unique"), (value) => {
        const name = value?.trim();
        return !channels.some((c) => c.name === name && c.id !== channelId);
      }),
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
          toast.success(t("toast.renaming"));
          resetForm();
          onHide();
        })
        .catch((e) => {
          toast.error(!e.response ? t("errors.network") : t("errors.unknown"));
        });
    },
  });
  const isInvalid = formik.touched.name && Boolean(formik.errors.name);
  const handleCancel = () => {
    formik.resetForm();
    onHide();
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{t("channels.changeName")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Control
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder={t("channels.typeNewNameChannel")}
              className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""}`}
              isInvalid={isInvalid}
            />
            <Form.Control.Feedback
              type="invalid"
              className={styles.invalidFeedback}
            >
              {formik.touched.name ? formik.errors.name : null}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            disabled={formik.isSubmitting}
            className={styles.button}
          >
            {t("channels.changeName")}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className={styles.button}
          >
            {t("channels.reject")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
