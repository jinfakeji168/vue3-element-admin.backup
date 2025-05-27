

import init from "../basicAPI";
const BasePath = "/admin/bills/transferOrder";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 订单ID */
  order_sn?: number;
  /** 添加时间-开始/结束时间 */
  datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 订单号 */
  order_sn?: number;
  /** 转账金额 */
  amount?: string;
  /** 手续费 */
  fees?: string;
  /** 状态 1已结算 2未结算 */
  status?: 1 | 2;
  /** 备注 */
  remark?: string;
  /** 添加时间 */
  created_at?: string;
  has_member?: {
    account: string;
    id: number
  }
}
