// Context ??
// Create snackbar context
import { createContext, useState } from "react";

export const SnackbarContext = createContext();

export default function SnackbarProvider({ children }) {
  // Snackbar state.....
  // Handle from context

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success"
  });

  // openSnackbar('my message', 'type - error | success | info | warning')
  // closeSnackbar()

  const openSnackbar = (message, type = "success") => {
    setSnackbar({
      open: true, // true -> visible : false -> invisible
      message,
      type
    });
  };

  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        openSnackbar,
        closeSnackbar
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}
