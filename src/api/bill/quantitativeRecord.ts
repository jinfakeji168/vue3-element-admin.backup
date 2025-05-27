

import init from "../basicAPI";
const BasePath = "/admin/bills/quantRecord";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 等级 */
  level?: number;
  /** 币种 */
  currency_id?: number;
  /** 状态 0.进行中 1.已完成 2.已取消 */
  status?: 0 | 1 | 2;
  /** 添加时间-开始/结束时间 */
  add_datetime?: string[];
  /** 完成时间-开始/结束时间 */
  com_datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 等级 */
  level?: number;
  /** 收益 */
  income?: string;
  /** 服务费 */
  fees?: string;
  /** 币种 */
  currency_id?: string;
  /** 买价 */
  buy_price?: string;
  /** 卖价 */
  sel_price?: string;
  /** 买平台 */
  buy_platform?: string;
  /** 卖平台 */
  sel_platform?: string;
  /** 状态 0.进行中 1.已完成 2.已取消 */
  status?: 0 | 1 | 2;
  /** 添加时间 */
  created_at?: string;
  /** 完成时间 */
  settlement_time?: string;
}
