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
  getMemberSelect(data: { account?: string; id?: string }) {
    return request<any, { account: string }[]>({
      url: "/admin/global/getAllMember",
      method: "get",
      params: {
        account: data.account,
        id: data.id
      },
    });
  },
  /**获取奖项 */
  getPrizeList() {
    return request<any, { key: number; val: string }[]>({
      url: "/admin/global/getBonusList",
      method: "get",
    });
  },
  /**获取交易对 */
  getTradeList() {
    return request<any, { key: number; val: string }[]>({
      url: "/admin/global/getTranPair",
      method: "get",
    });
  },
  /**获取时区 */
  getTimeZoneList() {
    return request<any, { key: number; val: string }[]>({
      url: "/admin/global/getTimeZone",
      method: "get",
    });
  },
  /**获取投资产品列表 */
  getInvestProductList(data: { name?: string; type?: number }) {
    return request<any, { key: number; val: string }[]>({
      url: "/admin/global/getInvestProduct",
      method: "get",
      params: data
    });
  }
};
