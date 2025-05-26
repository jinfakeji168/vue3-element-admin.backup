import request from "@/utils/request";
export default {
  /**获取存在的vip列表 */
  getVipList<T>() {
    return request<any, T>({
      url: "/admin/global/getVipList",
      method: "get",
    });
  },
  /**获取分组 */
  getGroupList<T>() {
    return request<any, T>({
      url: "/admin/global/getGroupList",
      method: "get",
    });
  },

  /**获取会员 select用*/
  getMemberSelect(account: string) {
    return request<any, { id: number; account: string }[]>({
      url: "/admin/global/getAllMember",
      method: "get",
      params: {
        account,
      },
    });
  },
  /**获取奖项 */
  getPrizeList() {
    return request<any, { key: number; val: string }[]>({
      url: "/admin/global/getBonusList",
      method: "get",
    });
  }
};
