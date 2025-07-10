

import init from "../basicAPI";
const BasePath = "/admin/bills/rechargeCoinOrder";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 订单号 */
  order_sn?: string;
  /** 发送地址 */
  send_address?: string;
  /** 接收地址 */
  rece_address?: string;
  /** 充值txID */
  tx_id?: string;
  /** tx时间区间-开始/结束时间 */
  tx_time?: [string, string];
  /** 是否首充 1.是 2.否 */
  is_first_charge?: 1 | 2;
  /** 充值类型 */
  recharge_type?: number;
  /** 状态 */
  status?: number;
  /** 申请时间区间-开始/结束时间 */
  datetime?: [string, string];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 订单号 */
  order_sn?: string;
  /** 充值金额 */
  recharge_amount?: string;
  /** 充值类型 1.TRC20-USDT 2.TRX 3.BEP10-USDT 4.BNB 5.BEP20-USDT */
  recharge_type?: number;
  /** 状态 1.充值入账 2.入队归集 3.购买能量 4.发起转账 5.归集成功 6.归集失败 */
  status?: number;
  /** 区块 txID */
  tx_id?: string;
  /** 区块时间 */
  tx_time?: string;
  /** 创建时间 */
  created_at?: string;
}
