

import init from "../basicAPI";
const BasePath = "/admin/bills/withdrawalCoinOrder";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 订单号 */
  order_sn?: string;
  /** 出款地址 */
  send_address?: string;
  /** 提现地址 */
  rece_address?: string;
  /** 打款txID */
  tx_id?: string;
  /** 提现类型/通道 */
  channel?: string;
  /** 订单状态 */
  status?: number;
  /** 转账状态 */
  order_result?: number;
  /** 操作时间区间-开始/结束时间 */
  operate_time?: [string, string];
  /** 申请时间区间-开始/结束时间 */
  datetime?: [string, string];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 用户账号 */
  account?: string;
  /** 订单号 */
  order_sn?: string;
  /** 提现金额 */
  withdraw_amount?: string;
  /** 手续费 */
  fees?: string;
  /** 出款地址 */
  send_address?: string;
  /** 提现地址 */
  rece_address?: string;
  /** 打款 txID */
  tx_id?: string;
  /** 提现类型/通道 */
  channel?: string;
  /** 订单状态 0待审核 1打款中 2已完成 3失败 */
  status?: number;
  /** 转账状态 0未转 1成功 2失败 */
  order_result?: number;
  /** 申请时间 */
  created_at?: string;
  /** 操作时间 */
  updated_at?: string;
}
