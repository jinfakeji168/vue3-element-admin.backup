import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user";
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

// 请求拦截器
service.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken();
    if (accessToken || config.url?.match(/(?<=\/)login/)) {
      config.headers.Authorization = accessToken;
      if (config.method == "delete") {
        //进行二次判断
        const res = await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
          type: "warning",
        });
      }
      return config;
    } else {
      return Promise.reject("未登录");
    }
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

    if (code === ResultEnum.SUCCESS) {
      if (method !== "get") {
        ElMessage.success(successMsg[method as keyof typeof successMsg]);
      }
      return data;
    } else {
      if (code === ResultEnum.TOKEN_INVALID) {
        //跳到登录页
        ElMessage.error(ResultMsg[code as ResultEnum]);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else if (code === ResultEnum.FAIL) {
        ElMessage.error(message);
        return;
      }
      ElMessage.error(ResultMsg[code as ResultEnum]);
      return Promise.reject(message);
    }
  },
  (error: any) => {
    console.log("🚀 ~ error:", error);
    return Promise.reject(error.message);
  }
);

export default service;
