import { createContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { $axios } from "../lib/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState({
    loggedIn: false,
    user: null,
  });

  const { push } = useHistory();

  // Eslint -----
  const login = async (formData) => {
    setLoading(true);
    try {
      const { data } = await $axios.post("/auth/login", formData);
      // We have data.accessToken
      // Use it globally by setting the header as axios common header...
      $axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.accessToken}`;

      // After fetch
      const user = await $axios.get("/auth/user");

      setAuth({
        loggedIn: true,
        user: user.data,
      });
    } catch (error) {
      alert("Email / Password combination is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await $axios.post("/auth/logout");
      await setAuth({
        loggedIn: false,
        user: null,
      });
      push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
