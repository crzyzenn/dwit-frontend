import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { AuthContext } from "../contexts/AuthContext";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={login}
        validationSchema={validationSchema}
      >
        {({ touched, errors }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Field
              name="email"
              label="Email"
              helperText={touched.email && errors.email}
              error={touched.email && !!errors.email}
              as={TextField}
            />
            <Field
              name="password"
              label="Password"
              helperText={touched.password && errors.password}
              error={touched.password && !!errors.password}
              as={TextField}
              type="password"
            />
            <Button type="submit">
              {loading ? <CircularProgress size={15} /> : "Login"}
            </Button>
          </Form>
        )}
      </Formik>
      <p>
        Not a user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
