import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import routes from "../routes";

const LoginPage = () => {
  const [error, setError] = useState(null);

  //sconst location = useLocation();
  const navigate = useNavigate();

  //const from = location.state?.from?.pathname || "/";

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const res = await axios.post(routes.loginPath(), values);

        window.localStorage.setItem(
          "userId",
          JSON.stringify({ token: res.data.token }),
        );
        console.log(window.localStorage)

        navigate("/", { replace: true });

        setError(null);
      } catch (err) {
        console.error(err)
      }
    },
  });

  const errorDiv = (<div className="invalid-feedback">the username or password is incorrect</div>)

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
          isInvalid={Boolean(error)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>

        <Form.Control
          id="password"
          name="password"
          type="text"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={Boolean(error)}
        />
        {error && errorDiv}
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default LoginPage;
