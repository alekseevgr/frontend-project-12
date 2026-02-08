import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import routes from "../../utils/routes";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import styles from "./StartPage.module.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorPassword, setErrorPassword] = useState(false);

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values);
        const token = res.data.token;
        const name = res.data.username;

        dispatch(setCredentials({ token, name }));

        localStorage.setItem("userId", token);
        localStorage.setItem("username", name);

        navigate("/", { replace: true });

        setErrorPassword(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorPassword(true);
        } else {
          toast.error(
            !err.response ? t("errors.network") : t("errors.unknown"),
          );
        }
      }
    },
  });

  const isInvalid = Boolean(errorPassword);
  const handleClick = () => {
    navigate("/signup", { replace: true });
  };

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
          className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""}`}
          isInvalid={isInvalid}
        />
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
          className={`${styles.input} ${isInvalid ? styles.inputInvalid : ""}`}
          isInvalid={isInvalid}
        />
        {isInvalid ? (
          <Form.Control.Feedback
            type="invalid"
            className={styles.invalidFeedback}
          >
            {t("login.invalidCreds")}
          </Form.Control.Feedback>
        ) : null}
      </Form.Group>

      <Button type="submit" className={styles.button}>
        {t("login.enter")}
      </Button>
      <Button type="button" onClick={handleClick} className={styles.button}>
        {t("login.registration")}
      </Button>
    </Form>
  );
};

export default LoginPage;
