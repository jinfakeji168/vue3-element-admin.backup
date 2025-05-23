import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useDictStoreHook } from "@/store/modules/dict";

import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/system/user";

import { setToken, clearToken } from "@/utils/auth";

export const useUserStore = defineStore("user", () => {
  const userInfo = useStorage<UserInfo>("userInfo", {} as UserInfo);

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data) => {
          const { access_token } = data;
          console.log(access_token);
          setToken("Bearer " + access_token); // Bearer eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 获取用户信息
   *
   * @returns {UserInfo} 用户信息
   */
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          Object.assign(userInfo.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  function setUserInfoPermission(permissions: string[]) {
    return new Promise<void>((resolve) => {
      userInfo.value.perms = permissions;
      resolve();
    });
  }
  /**
   * 登出
   */
  function logout() {
    return new Promise<void>((resolve) => {
      AuthAPI.logout()
        .then()
        .finally(() => {
          clearUserSession();
          resolve();
        });
    });
  }

  /**
   *  清理用户会话
   *
   * @returns
   */
  function clearUserSession() {
    return new Promise<void>((resolve) => {
      clearToken();
      usePermissionStoreHook().resetRouter();
      useDictStoreHook().clearDictionaryCache();
      resolve();
    });
  }

  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    clearUserSession,
    setUserInfoPermission,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
