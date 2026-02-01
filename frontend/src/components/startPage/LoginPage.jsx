import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import routes from "../../utils/routes";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/authSlice";
import styles from "./StartPage.module.css";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorPassword, setErrorPassword] = useState(false);

  //const location = useLocation();

  //const from = location.state?.from?.pathname || "/";

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
        localStorage.setItem('username', name)

        navigate("/", { replace: true });

        setErrorPassword(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorPassword(true);
        }
        console.error(err);
      }
    },
  });

  const isInvalid = Boolean(errorPassword);

  return (
    <Form onSubmit={formik.handleSubmit} className={styles.form}>
      <Form.Group className={styles.formGroup}>
        <Form.Label htmlFor="username" className={styles.label}>
          Username
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
          Password
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
        <Form.Control.Feedback
          type="invalid"
          className={styles.invalidFeedback}
        >
          The username or password is incorrect
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" className={styles.button}>
        Submit
      </Button>
    </Form>
  );
};

export default LoginPage;
