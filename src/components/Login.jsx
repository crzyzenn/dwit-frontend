import { Button, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import { $axios } from "../lib/axios";
import * as yup from "yup";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function Login() {
  const handleLogin = async (formData) => {
    try {
      const { data } = await $axios.post("/auth/login", formData);
      // We have data.accessToken
      // Use it globally by setting the header as axios common header...
      $axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleLogin}
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
            />
            <Button type="submit">Login</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
