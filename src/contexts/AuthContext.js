import { createContext, useState } from "react";
import { $axios } from "../lib/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    loggedIn: false,
    user: null,
  });

  // Eslint -----
  const login = async (formData) => {
    console.log(formData);
    try {
      const { data } = await $axios.post("/auth/login", formData);
      // We have data.accessToken
      // Use it globally by setting the header as axios common header...
      $axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      // Fetch user...
      // After fetch

      setAuth({
        loggedIn: true,
        user: {
          name: "Fake User",
          email: "fakeemail@x.com",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    setAuth({
      loggedIn: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
