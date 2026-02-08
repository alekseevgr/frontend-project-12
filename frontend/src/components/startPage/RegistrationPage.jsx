import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import routes from "../../utils/routes";
import * as yup from "yup";

import styles from "./StartPage.module.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRollbar } from "@rollbar/react";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const validationSchema = yup.object({
    username: yup
      .string()
      .trim()
      .min(3, t("form.minSymbols"))
      .max(20, t("form.maxSymbols"))
      .required(t("form.required")),
    password: yup
      .string()
      .trim()
      .min(6, t("form.minPassword"))
      .required(t("form.required")),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password")], t("form.equalPassword"))
      .required(t("form.required")),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { username, password } = values;
        const res = await axios.post(routes.signupPath(), {
          username,
          password,
        });

        const token = res.data.token;
        const name = res.data.username;

        dispatch(setCredentials({ token, name }));

        localStorage.setItem("userId", token);
        localStorage.setItem("username", name);

        navigate("/", { replace: true });
      } catch (err) {
        if (err.response?.status === 409) {
          formik.setFieldError("username", t("login.nameTaken"));
          return;
        }
        rollbar.error("Registration failed", err, {
          username: values.username,
        });
        toast.error(!err.response ? t("errors.network") : t("errors.unknown"));
      }
    },
  });
  const usernameInvalid =
    formik.touched.username && Boolean(formik.errors.username);
  const passwordInvalid =
    formik.touched.password && Boolean(formik.errors.password);
  const confirmInvalid =
    formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword);

  return (
    <Form onSubmit={formik.handleSubmit} className={styles.form}>
      <Form.Group className={styles.formGroup}>
        <Form.Label htmlFor="username" className={styles.label}>
          {t("login.name")}
        </Form.Label>

        <Form.Control
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${styles.input} ${usernameInvalid ? styles.inputInvalid : ""}`}
          isInvalid={usernameInvalid}
        />
        <Form.Control.Feedback
          type="invalid"
          className={styles.invalidFeedback}
        >
          {formik.touched.username ? formik.errors.username : null}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className={styles.formGroup}>
        <Form.Label htmlFor="password" className={styles.label}>
          {t("login.password")}
        </Form.Label>

        <Form.Control
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${styles.input} ${passwordInvalid ? styles.inputInvalid : ""}`}
          isInvalid={passwordInvalid}
        />
        <Form.Control.Feedback
          type="invalid"
          className={styles.invalidFeedback}
        >
          {formik.touched.password ? formik.errors.password : null}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className={styles.formGroup}>
        <Form.Label htmlFor="confirmPassword" className={styles.label}>
          {t("login.confirmPassword")}
        </Form.Label>

        <Form.Control
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`${styles.input} ${confirmInvalid ? styles.inputInvalid : ""}`}
          isInvalid={confirmInvalid}
        />
        <Form.Control.Feedback
          type="invalid"
          className={styles.invalidFeedback}
        >
          {formik.touched.confirmPassword
            ? formik.errors.confirmPassword
            : null}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className={styles.button}>
        {t("login.registration")}
      </Button>
    </Form>
  );
};

export default RegistrationPage;
