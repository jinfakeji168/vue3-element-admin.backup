
import request from "@/utils/request";

const BasePath = "/admin/report/statsDashboard";

export default {
    /**获取数据 */
    getData(params: Query) {
        return request<Query, Form>({
            url: `${BasePath}`,
            method: "get",
            params
        });
    }
}
export interface Query {
    datetime?: string[]
}

export interface Form {
    /** 注册国家分布 */
    register_country?: {
        /** 国家/地区名称 */
        name: string;
        /** 注册人数 */
        value: number;
    }[];
    /** 登录设备分布 */
    login_device?: {
        /** 设备类型 PC/WEB/Android/iOS */
        name: string;
        /** 登录次数 */
        value: number;
    }[];
    /** 充值排行 */
    recharge_ranking?: {
        /** 用户ID */
        uid: number;
        /** 用户账号 */
        account: string;
        /** 充值总额 */
        total: string;
    }[];
}
