import request from "@/utils/request";

const AUTH_BASE_URL = "/api/v1/auth";

const AuthAPI = {
  /** 登录 接口*/
  login(data: LoginData) {
    return request<any, LoginResult>({
      url: `/admin/auth/login`,
      method: "post",
      data,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  },

  /** 注销 接口*/
  logout() {
    return request({
      url: `/admin/auth/logout`,
      method: "post",
    });
  },

  /**检查是否需要google验证 */
  checkGoogleAuth(account: string) {
    return request<any, { need_google2fa: boolean, admin_id: number }>({
      url: `/admin/auth/check-google2fa`,
      method: 'post',
      data: {
        username: account
      },
      headers: {
        resultMsg: false
      }
    })
  },


  /** 获取验证码 接口*/
  getCaptcha() {
    return request<any, CaptchaResult>({
      url: `${AUTH_BASE_URL}/captcha`,
      method: "get",
    });
  },
};

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** google验证 */
  google2fa_code?: string;
  /** 验证码缓存key */
  captchaKey?: string;
  /** 验证码 */
  captchaCode?: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  access_token?: string;
  /** 过期时间(单位：毫秒) */
  expires?: number;
  /** 刷新token */
  refreshToken?: string;
  /** token 类型 */
  tokenType?: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
