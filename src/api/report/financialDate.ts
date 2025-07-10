
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/report/financeDaily";

export default {
    ...init<Query, Form>(BasePath),
    update: () => request.put(`${BasePath}/update`)
};
/** 查询参数类型 */
export interface Query extends PageQuery {
    /** 报表日期 Y-m-d 或日期范围 Y-m-d/Y-m-d */
    report_date?: string;
}

/** 财务日报表表单类型 */
export interface Form {
    /** ID */
    id?: number;
    /** 报表日期 */
    report_date?: string;
    /** 注册人数 */
    register_count?: number;
    /** 首充人数 */
    first_deposit_count?: number;
    /** 登录人数 */
    login_count?: number;
    /** 充值人数 */
    deposit_user_count?: number;
    /** 提现人数 */
    withdrawal_user_count?: number;
    /** 充值总额 */
    deposit_total_amount?: string;
    /** 提现总额 */
    withdrawal_total_amount?: string;
    /** 充USDT */
    deposit_usdt_amount?: string;
    /** 提USDT */
    withdrawal_usdt_amount?: string;
    /** 充TRC20-U */
    deposit_trc20_usdt_amount?: string;
    /** 提TRC20-U */
    withdrawal_trc20_usdt_amount?: string;
    /** 充BEP20-U */
    deposit_bep20_usdt_amount?: string;
    /** 提BEP20-U */
    withdrawal_bep20_usdt_amount?: string;
    /** 充BNB */
    deposit_bnb_amount?: string;
    /** 提BNB */
    withdrawal_bnb_amount?: string;
    /** 充USDC */
    deposit_usdc_amount?: string;
    /** 提USDC */
    withdrawal_usdc_amount?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
}
