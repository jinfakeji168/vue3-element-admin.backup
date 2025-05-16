import request from "@/utils/request";
export default {
  getUserPolicy() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/user",
      method: "get",
      params: { type: 1 },
    });
  },

  getPrivacyPolicy() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/privacy",
      method: "get",
      params: { type: 2 },
    });
  },
  /**代理介绍 */
  getProxyRecommend() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/privacy",
      method: "get",
      params: { type: 3 },
    });
  },
  /**量化教程 */
  getQuantitativeTutorial() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/quantizationTutorial",
      method: "get",
      params: { type: 4 },
    });
  },
  /**常见问题 */
  getCommonQuestion() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/faq",
      method: "get",
      params: { type: 5 },
    });
  },

  /**关于我们 */
  getAboutUs() {
    return request<any, policyForm>({
      url: "/admin/system/protocol/aboutUs",
      method: "get",
      params: { type: 6 },
    });
  },

  updatePolicy(data: policyForm) {
    return request({
      url: "/admin/system/protocol/edit",
      method: "put",
      data,
    });
  },
};

export interface policyForm {
  /** 协议类型 1.用户协议 2.隐私协议 3.代理介绍  4.量化教程 5.常见问题 6.关于我们  */
  type?: 1 | 2 | 3 | 4 | 5 | 6;
  original?: string;
  translation?: translation[];
}
export interface translation {
  lang?: string;
  name?: string;
  content?: string;
}
