

import init from "../basicAPI";
const BasePath = "/admin/bills/lotteryRecord";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 提交时间 */
  datetime?: string;
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 中奖金额(U) */
  amount?: number;
  /** 状态 1已结算 2未结算 */
  status?: 1 | 2;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
