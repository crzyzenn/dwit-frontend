import { CategoryOutlined } from "@material-ui/icons";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import "./styles.css";
import Category from "./pages/category";
import Products from "./pages/products";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useContext } from "react";
import { SnackbarContext } from "./contexts/Snackbar";
import Register from "./pages/register";
import Login from "./components/Login";

// 15Jun
// Login implement
// Refresh tokens in client side
// Persist user on app refresh...

export default function App() {
  // how to get values from context????
  const { snackbar, closeSnackbar } = useContext(SnackbarContext);

  return (
    <div className="App">
      {/* Snackbar render */}
      <Snackbar
        open={snackbar.open} // true | false
        autoHideDuration={2000}
        onClose={closeSnackbar}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Header />

      <Login />
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/category">
          <Category />
        </Route>
        <Route path="/products">
          <Products />
        </Route>
        <Route path="/">
          <h1>Welcome to home page.</h1>
        </Route>
      </Switch>
    </div>
  );
}
