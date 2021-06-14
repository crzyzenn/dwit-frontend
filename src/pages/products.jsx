// Exercise
// JOIN ... in mongodb...
// aggregation -- mongod -> $lookup..
// API
// jwt...access, refresh tokens, login, logout, register...

import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from "@material-ui/core";
import {
  AddOutlined,
  DeleteOutline,
  EditOutlined,
  RefreshOutlined,
  Replay10Outlined
} from "@material-ui/icons";
import { Field, Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { SnackbarContext } from "../contexts/Snackbar";
import { $axios } from "../lib/axios";

const validationSchema = yup.object({
  name: yup.string().min(5).max(255).required(),
  description: yup.string(),
  image: yup.string().max(1024).required(),
  categoryId: yup.string().required(),
  price: yup.number().required(),
  createdAt: yup.date(),
  published: yup.boolean()
});

export default function Products() {
  const { openSnackbar } = useContext(SnackbarContext);
  const [dialogs, setDialogs] = useState({
    addEdit: false,
    delete: false
  });

  const [deleteId, setDeleteId] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const [loadings, setLoadings] = useState({
    fetch: false,
    save: false,
    delete: false
  });

  const [mode, setMode] = useState("ADD");

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Dialog fns
  const openDialog = (whichDialog) => {
    setDialogs({ ...dialogs, [whichDialog]: true });
  };

  const closeDialog = (whichDialog) => {
    setDialogs({ ...dialogs, [whichDialog]: false });

    // Prevent new product form flash for a ms....
    setTimeout(() => {
      setMode("ADD");
    }, 500);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadings({ ...loadings, fetch: true });
      const { data } = await $axios.get("/categories");
      setCategories(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadings({ ...loadings, fetch: false });
    }
  };

  // Fetch categories
  const fetchProducts = async () => {
    try {
      setLoadings({ ...loadings, fetch: true });
      const { data } = await $axios.get("/products");
      setProducts(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadings({ ...loadings, fetch: false });
    }
  };

  // Add a new product
  const addProduct = async (data) => {
    try {
      setLoadings({ ...loadings, save: true });
      await $axios.post("/products", data);

      // Show notification
      // showSnackbar("Category added!");
      openSnackbar("Product added!");

      closeDialog("addEdit");
      // Fetch products
      fetchProducts();
    } catch (e) {
      if (e.response) {
        const { status, data } = e.response;
        if (status === 409) {
          openSnackbar(data, "error");
        } else if (status === 400) {
          openSnackbar(data.error, "error");
        } else {
          openSnackbar("An error has occurred. Please try again!", "error");
        }
      } else {
        openSnackbar("An error has occurred. Please try again!", "error");
      }
    } finally {
      setLoadings({ ...loadings, save: false });
    }
  };

  // Update an existing product
  const editProduct = async (data) => {
    try {
      setLoadings({ ...loadings, save: true });
      await $axios.put(`/products/${data._id}`, data);

      // Show notification
      // showSnackbar("Category added!");
      openSnackbar("Product saved!");

      closeDialog("addEdit");
      // Fetch products
      fetchProducts();
    } catch (e) {
      if (e.response) {
        const { data } = e.response;
        openSnackbar(data, "error");
      } else {
        openSnackbar("An error has occurred. Please try again!", "error");
      }
    } finally {
      setLoadings({ ...loadings, save: false });
    }
  };

  const deleteProduct = async () => {
    try {
      setLoadings({ ...loadings, delete: true });
      await $axios.delete(`/products/${deleteId}`);
      openSnackbar("Deleted successfully.");

      // Refresh products list
      fetchProducts();
    } catch (error) {
      openSnackbar("Failed to delete!", "error");
    } finally {
      setLoadings({ ...loadings, delete: false });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <h1>Products</h1>
        <div>
          <Tooltip title="Add new product">
            <IconButton onClick={() => openDialog("addEdit")}>
              <AddOutlined />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh products list">
            <IconButton onClick={fetchProducts}>
              <RefreshOutlined />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {loadings.fetch ? (
        <LinearProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Published</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 20
                    }}
                  >
                    <img src={product.image} alt="" width="100" />
                    {product.name}
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.categoryId}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.published}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* Edit Button */}
                    <IconButton
                      onClick={() => {
                        setUpdateData(product);
                        setMode("EDIT");
                        openDialog("addEdit");
                      }}
                    >
                      <EditOutlined />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                      onClick={() => {
                        setDeleteId(product._id);
                        openDialog("delete");
                      }}
                    >
                      {loadings.delete && deleteId === product._id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteOutline />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Edit Dialog */}
      <Dialog
        open={dialogs.addEdit}
        onClose={() => closeDialog("addEdit")}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {mode === "ADD" ? "New product" : "Update product"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === "ADD"
              ? "To add the product, please enter the product name here. You cannot add duplicate products."
              : "To update the product, please enter the product name here."}
          </DialogContentText>

          {/* Form */}
          <Formik
            initialValues={
              mode === "ADD"
                ? {
                    name: "",
                    image: "",
                    description: "",
                    categoryId: "",
                    price: ""
                  }
                : updateData
            }
            onSubmit={mode === "ADD" ? addProduct : editProduct}
            validationSchema={validationSchema}
          >
            {({ errors, values, touched, handleBlur, handleChange }) => (
              <Form
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <Field
                  name="name"
                  label="Name"
                  as={TextField}
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <Field
                  name="image"
                  label="Image Url"
                  placeholder="Paste your image url here..."
                  as={TextField}
                  error={touched.image && !!errors.image}
                  helperText={touched.image && errors.image}
                />
                <Field
                  name="description"
                  label="Description"
                  placeholder="What is the product about?"
                  as={TextField}
                />

                <FormControl error={touched.categoryId && !!errors.categoryId}>
                  <InputLabel id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.categoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="categoryId"
                  >
                    {categories.map(({ _id, name }) => (
                      <MenuItem key={_id} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {touched.categoryId && errors.categoryId}
                  </FormHelperText>
                </FormControl>

                {/* Last resort -> last option */}
                {/* <div style={{ color: "red" }}>
                  <ErrorMessage name="categoryId" />
                </div> */}

                <Field
                  name="price"
                  label="Price"
                  type="number"
                  placeholder="What is the product about?"
                  as={TextField}
                  error={touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.published}
                      onChange={handleChange}
                      name="published"
                    />
                  }
                  label="Published"
                />

                {/* Actions - Submit / Cancel */}
                <DialogActions>
                  <Button
                    onClick={() => closeDialog("addEdit")}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    {loadings.save ? <CircularProgress size={20} /> : "Save"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogs.delete} onClose={() => closeDialog("delete")}>
        <DialogTitle>Delete Category.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. Do you want to delete the category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              deleteProduct();
              closeDialog("delete");
            }}
            color="primary"
          >
            Confirm
          </Button>
          <Button
            onClick={() => closeDialog("delete")}
            color="primary"
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
