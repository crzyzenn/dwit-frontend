import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import { AddOutlined, DeleteOutline, EditOutlined } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { SnackbarContext } from "../contexts/Snackbar";
import { $axios } from "../lib/axios";

export default function Category() {
  const { openSnackbar } = useContext(SnackbarContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState(false); // true | false
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Update
  const [updateId, setUpdateId] = useState(null);

  // Dialog
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  // Dialog's mode.
  const [mode, setMode] = useState("ADD"); // ADD | UPDATE

  const openDeleteDialog = () => {
    setDeleteDialog(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => setOpen(true);

  const openAddDialog = () => {
    setCategoryName("");
    setMode("ADD");
    openDialog();
  };

  const openUpdateDialog = () => {
    setMode("UPDATE");
    openDialog();
  };

  // Delete category
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await $axios.delete(`/categories/${deleteId}`);
      openSnackbar("Category deleted!");

      fetchCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await $axios.get("/categories");
      setCategories(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Add a new category
  const addCategory = async () => {
    if (categoryName) {
      try {
        setSaveLoading(true);
        await $axios.post("/categories", {
          name: categoryName
        });

        // Show notification
        openSnackbar("Category added!");

        closeDialog();
        fetchCategories();
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
        setSaveLoading(false);
      }
    } else {
      setError("Category name cannot be empty.");
    }
  };

  const updateCategory = async () => {
    if (categoryName) {
      try {
        setSaveLoading(true);
        await $axios.put(`/categories/${updateId}`, {
          name: categoryName
        });

        // Show notification
        openSnackbar("Category updated!");

        closeDialog();
        fetchCategories();
      } catch (e) {
        if (e.response) {
          const { status, data } = e.response;
          if (status === 400) {
            openSnackbar(data.error, "error");
          } else {
            openSnackbar("An error has occurred. Please try again!", "error");
          }
        } else {
          openSnackbar("An error has occurred. Please try again!", "error");
        }
      } finally {
        setSaveLoading(false);
      }
    } else {
      setError("Category name cannot be empty.");
    }
  };

  // Call fetch categories on mount...
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center"
        }}
      >
        <h1>Category page</h1>
        <IconButton onClick={openAddDialog}>
          <AddOutlined />
        </IconButton>
      </div>

      {loading ? (
        <LinearProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell component="th" scope="row">
                    {category._id}
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    {/* Edit Button */}
                    <IconButton
                      onClick={() => {
                        setUpdateId(category._id);
                        setCategoryName(category.name);
                        openUpdateDialog();
                      }}
                    >
                      <EditOutlined />
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton
                      onClick={() => {
                        setDeleteId(category._id);
                        openDeleteDialog();
                      }}
                    >
                      {deleteLoading && deleteId === category._id ? (
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

      {/* Dialog popup */}
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {mode === "ADD" ? "New Category" : "Update Category"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {mode === "ADD"
              ? "To add the category, please enter the category name here. You cannot add duplicate categories."
              : "To update the category, please enter the category name here."}
          </DialogContentText>
          <TextField
            autoFocus
            label="Category name"
            value={categoryName}
            onChange={(e) => {
              setError("");
              setCategoryName(e.target.value);
            }}
            fullWidth
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              if (mode === "ADD") {
                addCategory();
              } else {
                updateCategory();
              }
            }}
          >
            {saveLoading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Category.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is irreversible. Do you want to delete the category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelete();
              closeDeleteDialog();
            }}
            color="primary"
          >
            Confirm
          </Button>
          <Button onClick={closeDeleteDialog} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
