import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import routes from "../routes";

import { useDispatch } from "react-redux";
import { setCredentials } from "./slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorPassword, setErrorPassword] = useState(null);

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

        dispatch(setCredentials({ token }));
        localStorage.setItem("userId", token);

        console.log(window.localStorage);

        navigate("/", { replace: true });

        setErrorPassword(null);
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorPassword(true);
        }
        console.error(err);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>

        <Form.Control
          id="username"
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={Boolean(errorPassword)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>

        <Form.Control
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={Boolean(errorPassword)}
        />
        <Form.Control.Feedback type="invalid">
          The username or password is incorrect
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default LoginPage;
