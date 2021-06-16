import { CategoryOutlined } from "@material-ui/icons";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./components/Header";
import "./styles.css";
import Category from "./pages/category";
import Products from "./pages/products";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useContext, useEffect } from "react";
import { SnackbarContext } from "./contexts/Snackbar";
import Register from "./pages/register";
import Login from "./components/Login";
import { AuthContext } from "./contexts/AuthContext";
import { $axios } from "./lib/axios";

// 15Jun
// Login implement
// Refresh tokens in client side
// Persist user on app refresh...

// Exercise...
// Main goal: Use React Context API to store user data..

export default function App() {
  const {
    push,
    location: { pathname },
  } = useHistory();

  // Nested object destructuring
  const {
    auth: { loggedIn, user },
    setAuth,
  } = useContext(AuthContext);

  const persistUser = async () => {
    // Persist user....
    const { data } = await $axios.post("/auth/refresh");
    // Save the token in axios....
    $axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.accessToken}`;

    // Get the logged in user....
    const user = await $axios.get("/auth/user");

    // Set the user in context...
    setAuth({
      loggedIn: true,
      user: user.data,
    });
  };

  // When user reloads the page...
  useEffect(() => {
    persistUser();
    // // If not logged In
    // if (!loggedIn) {
    //   // Check if user is on other routes, if on others routes
    //   // except login and register, redirect user back to login
    //   if (pathname !== "/login" && pathname !== "/register") {
    //     push("/login");
    //   }
    // }
    // Nothing happens if user is logged In....
  }, []);

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

      {!loggedIn ? (
        <>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
          </Switch>
        </>
      ) : (
        <Switch>
          <Route path="/category">
            <Category />
          </Route>
          <Route path="/products">
            <Products />
          </Route>
          <Route path="/">
            <h1>Welcome {user.name}</h1>
          </Route>
        </Switch>
      )}
    </div>
  );
}
