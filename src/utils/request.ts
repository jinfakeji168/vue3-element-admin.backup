import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user";
import { ResultEnum } from "@/enums/ResultEnum";
import { getToken } from "@/utils/auth";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: any) => {
    console.log(error);

    if (error.status === 401) {
      ElNotification({
        title: "提示",
        message: "您的会话已过期，请重新登录",
        type: "info",
      });
      useUserStoreHook()
        .clearUserSession()
        .then(() => {
          location.reload();
        });
    } else if (error.status === 422) {
      const { message } = error.response.data;
      ElMessage.error(message || "系统出错");
    } else {
      const { message } = error.response.data;
      ElMessage.error(message || "系统出错");
    }

    return Promise.reject(error.message);
  }
);

export default service;
