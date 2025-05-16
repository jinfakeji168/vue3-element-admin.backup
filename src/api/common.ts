import request from "@/utils/request";
export default {
  /**获取存在的vip列表 */
  getVipList<T>() {
    return request<any, T>({
      url: "/admin/global/getVipList",
      method: "get",
    });
  },
};
