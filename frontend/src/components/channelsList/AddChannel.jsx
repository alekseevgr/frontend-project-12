import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import routes from "../../utils/routes";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { setActiveChannel } from "../../slices/channelsSlice";
import * as yup from "yup";
import styles from "./Channels.module.css";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const AddChannel = ({ show, onHide }) => {
  const token = useSelector((state) => state.auth.token);
  const channels = useSelector((state) => state.channels.items);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .trim()
          .min(3, t("form.minSymbols"))
          .max(20, t("form.maxSymbols"))
          .required(t("form.required"))
          .test("unique", t("channels.unique"), (value) => {
            const name = value?.trim();
            return !channels.some((c) => c.name === name);
          }),
      }),
    [t, channels],
  );

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
          toast.success(t("toast.created"));
          resetForm();
          onHide();
        })
        .catch((e) => {
          toast.error(!e.response ? t("errors.network") : t("errors.unknown"));
        });
    },
  });
  // [{ id: '1', name: 'general', removable: false }, ...]
  const isInvalid = formik.touched.name && Boolean(formik.errors.name);
  const handleCancel = () => {
    formik.resetForm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{t("channels.createChannel")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} className={styles.form}>
          <Form.Group className={styles.formGroup}>
            <Form.Control
              ref={inputRef}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder={t("channels.typeNameChannel")}
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
            {t("channels.createChannel")}
          </Button>
          <Button
            type="button"
            className={styles.button}
            onClick={handleCancel}
          >
            {t("channels.reject")}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
// END
