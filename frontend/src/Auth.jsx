import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Field, Form } from 'formik';


const Auth = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={{
        firstName: '',
        password: '',
      }}
      onSubmit={ (values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <label htmlFor="firstName">Name</label>
        <Field id="firstName" name="firstName" placeholder="Jane" />

        <label htmlFor="password">Password</label>
        <Field
          id="password"
          name="password"
          placeholder="password"
          type="password"
        />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  </div>
);

export default Auth