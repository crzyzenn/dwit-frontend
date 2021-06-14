import axios from "axios";

export const $axios = axios.create({
  baseURL: "https://dwit-ecommerce.herokuapp.com/api",
  timeout: 10000
});
