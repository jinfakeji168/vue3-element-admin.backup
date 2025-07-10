import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "admin/report/rechargeRebateRanking";

export default {
    getList: (params: Query) => request({
        url: `${BasePath}`,
        method: "get",
        params: params
    }),
};

/** 查询参数类型 */
export interface Query extends PageQuery {
    datetime?: string[]
}

/** 充值返利排行表单类型 */
export interface Form {
    /** 用户ID */
    uid?: number;
    /** 账号 */
    account?: string;
    /** 充值返利总额 */
    total_rebate?: string;
}
