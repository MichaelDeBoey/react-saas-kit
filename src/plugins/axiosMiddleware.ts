import i18n from "@/locale/i18n";
import store from "@/store";
import { logout } from "@/store/modules/authReducer";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_SERVER_URL?.toString() + "api";
const config: AxiosRequestConfig = {
  baseURL: apiUrl,
};
const server: AxiosInstance = axios.create(config);

server.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

server.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.status === 401 || error?.toString().includes("status code 401")) {
      store.dispatch(logout());
      window.location.replace("/login");
      return;
    }
    if (error.response?.data) {
      return Promise.reject(i18n.t(error.response.data));
    } else if (error.message) {
      return Promise.reject(i18n.t(error.message));
    } else {
      return Promise.reject(i18n.t(error));
    }
  }
);

server.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      return config;
    }
    const { auth, tenant } = store.getState();
    if (tenant.current) {
      config.headers.common["X-Tenant-Key"] = tenant.current.uuid;
    }
    if (tenant.currentWorkspace) {
      config.headers.common["X-Workspace-Id"] = tenant.currentWorkspace.id;
    }
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default server;
