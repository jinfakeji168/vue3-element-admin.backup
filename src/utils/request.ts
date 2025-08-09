import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";

import { ResultEnum, ResultMsg } from "@/enums/ResultEnum";
import { getToken } from "@/utils/auth";
import router from "@/router";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => {
    return qs.stringify(params);
  },
});
let utc: any = -(new Date().getTimezoneOffset() / 60) // 获取当前时区
utc = utc < 0 ? String(utc) : String('+' + utc)
// 请求拦截器
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers.Authorization = accessToken;
      config.headers["X-UTC"] = utc
    }
    return config;

  },
  (error: any) => {
    return Promise.reject(error);
  }
);

/**方法对应的返回成功提示 */
const successMsg = {
  get: "获取成功",
  post: "操作成功",
  put: "更新成功",
  delete: "删除成功",
};
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data, code, message } = response.data;
    const method = response.config.method;
    const showMsg = response.config.headers['resultMsg'] ?? true;

    if (code === ResultEnum.SUCCESS) {
      if (method !== "get" && showMsg) {
        ElMessage.success(successMsg[method as keyof typeof successMsg]);
      }
      return data;
    } else {
      if (!showMsg) return;
      if (code === ResultEnum.TOKEN_INVALID) {
        //没有权限错误 跳去登录页
        ElMessage.error(ResultMsg[code as ResultEnum]);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        //500错误 打印错误并reject
        ElMessage.error(message);
        return Promise.reject(message);
      }
      ElMessage.error(ResultMsg[code as ResultEnum]);
      return Promise.reject(message);
    }
  },
  (error: any) => {
    console.log("🚀 ~ error:", error);
    ElMessage.error(error);
    return Promise.reject(error.message);
  }
);

export default service;
