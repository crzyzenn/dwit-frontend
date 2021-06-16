import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { SnackbarContext } from "../contexts/Snackbar";
import { $axios } from "../lib/axios";

const validationSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().max(255).min(6).required(),
  password: yup.string().required().max(1024),
  date: yup.date(),
});

export default function Register() {
  const { openSnackbar } = useContext(SnackbarContext);
  const [loading, setLoading] = useState(false);
  const handleRegistration = async (data, { resetForm }) => {
    try {
      setLoading(true);
      await $axios.post("/auth/register", data);
      openSnackbar("Registered successfully.");
      resetForm();
    } catch (error) {
      if (error.response) {
        openSnackbar(error.response.data, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1>Registration</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegistration}
      >
        {({ touched, errors }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
              helperText={touched.name && errors.name}
              error={touched.name && !!errors.name}
              name="name"
              label="Name"
              as={TextField}
            />
            <Field
              helperText={touched.email && errors.email}
              error={touched.email && !!errors.email}
              name="email"
              label="Email"
              as={TextField}
            />
            <Field
              helperText={touched.password && errors.password}
              error={touched.password && !!errors.password}
              name="password"
              label="Password"
              as={TextField}
            />
            <Button type="submit">
              {loading ? <CircularProgress size={20} /> : "Register"}
            </Button>
          </Form>
        )}
      </Formik>
      <p>
        Already a user? <Link to="/login">Log in</Link>
      </p>
    </>
  );
}
