import axios from "axios";

// Refresh token from backend
const refreshToken = async () => {
  try {
    const { data } = await $axios.post("/auth/refresh");
    return data.accessToken;
  } catch (error) {
    return null;
  }
};

// Custom instance...
export const $axios = axios.create({
  // baseURL: "https://dwit-ecommerce.herokuapp.com/api",
  baseURL: "http://localhost:5000/api", // Node Express Mongodb Backend
  timeout: 5000,
  withCredentials: true, // XSS / CSRF Attacks -> prevent
});

// Refresh token logic...
// Using Axios Interceptors...
// Add a response interceptor
$axios.interceptors.response.use(
  // Callback 1, when response is receieved from backend
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  // Callback 2, if there's any error in the response...
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // error.response -> status, data, headers....
    if (error.response) {
      const { status } = error.response;

      if (status === 403) {
        const token = await refreshToken();
        // Set default header
        $axios.defaults.headers["Authorization"] = `Bearer ${token}`;

        // Call back original request with the new token....
        return $axios({
          ...error.config,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      console.log(status, error.config);
    }

    // Check if 403 -> and refresh token....
    return Promise.reject(error);
  }
);
