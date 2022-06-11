// @ts-nocheck
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../../index";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";
const sleep = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
axios.defaults.baseURL = " http://localhost:5078/api";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (res) => {
    await sleep();
    const pagination = res.headers["pagination"];
    if (pagination) {
      res.data = new PaginatedResponse(res.data, JSON.parse(pagination));
    }
    return res;
  },
  (error: AxiosError) => {
    if (!error.response?.data || !error.response?.status) {
      console.log(error);
      return;
    }
    const { data, status } = error.response!;

    switch (status) {
      case 400:
        if (data.errors) {
          const errors: string[] = [];
          for (const i in data.errors) {
            errors.push(data.errors[i]);
          }
          throw errors.flat();
        }
        toast.error(data.title, { toastId: "Login" });
        break;
      case 401:
        toast.error(data.title || "Unauthorized", { toastId: "Login" });
        break;
      case 500:
        history.push({
          pathname: "/server-error",
          state: { error: data },
        });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const responseBody = (res: AxiosResponse) => res.data;
const requests = {
  get: (url: string, params: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};
const Catalog = {
  list: (params?: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  filters: () => requests.get("products/filters"),
};

const Account = {
  login: (body: {}) => requests.post("Account/login", body),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
};

const Errors = {
  get400Error: () => requests.get("error/bad-request"),
  get401Error: () => requests.get("error/unauthorized"),
  get404Error: () => requests.get("error/not-found"),
  validationError: () => requests.get("error/validation-error"),
  get500Error: () => requests.get("error/server-error"),
};
const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`basket?productid=${productId}&quantity=${quantity}`, {}),
  deleteItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productid=${productId}&quantity=${quantity}`, {}),
};
const agent = {
  Catalog,
  Errors,
  Basket,
  Account,
};
export default agent;
