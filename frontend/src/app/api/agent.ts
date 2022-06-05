// @ts-nocheck
import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../../index";
const sleep = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
axios.defaults.baseURL = " http://localhost:5078/api";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  async (res) => {
    await sleep();
    return res;
  },
  (error: AxiosError) => {
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
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
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
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url).then(responseBody),
  put: (url: string, body: {}) => axios.put(url).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};
const Catalog = {
  list: () => requests.get("products"),
  details: (id: number) => requests.get(`products/${id}`),
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
};
export default agent;
