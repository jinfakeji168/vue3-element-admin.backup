

import init from "../basicAPI";
import request from "@/utils/request";
const BasePath = "/admin/bills/paymentOrder";

export default {
  ...init<Query, Form>(BasePath),

};

export interface Query extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 渠道 */
  channel?: string;
  /** 状态 0.未支付 1.已支付 2.支付失败 */
  status?: 0 | 1 | 2;
  /** 申请时间-开始/结束时间 */
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
  /** 充值金额 */
  recharge_amount?: string;
  /** 申请时间 */
  created_at?: string;
  /** 状态 0.未支付 1.已支付 2.支付失败 */
  status?: 0 | 1 | 2;
  /** 通道 */
  channel?: string;
  /** 下单结果 */
  order_result?: number;
  /** 充值订单id */
  recharge_order_id?: number;
}
