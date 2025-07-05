

import init from "../basicAPI";
import request from "@/utils/request";
const BasePath = "/admin/bills/depositOrder";

export default {
  ...init<Query, Form>(BasePath),


};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 订单号 */
  order_sn?: number;
  /** 发送地址 */
  send_address?: string;
  /** 接收地址 */
  rece_address?: string;
  /** 交易ID */
  tx_id?: string | number;
  /** 状态 0.处理中 1.完成 2失败 */
  status?: 0 | 1 | 2;
  /** 金额类型 1.TRC20-USTD 2.TRX 3.BEP10-USTD 4.BNB 5.BEP20-USTD */
  amount_type?: 1 | 2 | 3 | 4 | 5;
  /** 交易时间-开始/结束时间 */
  tx_time?: [string, string];
  /** 添加时间-开始/结束时间 */
  created_at?: [string, string];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 订单号 */
  order_sn?: string;
  /** 归集金额 */
  collected_amount?: string;
  /** 发送地址 */
  send_address?: string;
  /** 接收地址 */
  rece_address?: string;
  /** txID */
  tx_id?: string | number;
  /** tx手续费 */
  tx_fees?: string;
  /** tx时间 */
  tx_time?: string;
  /** 状态 0.处理中 1.完成 2失败 */
  status?: 0 | 1 | 2;
  /** 金额类型 1.TRC20-USTD 2.TRX 3.BEP10-USTD 4.BNB 5.BEP20-USTD */
  amount_type?: 1 | 2 | 3 | 4 | 5;
  /** 管理员ID */
  manage_id?: number;
  /** 管理员名称 */
  manage_name?: string;
  /** 更新时间 */
  updated_at?: string;
  /** 创建时间 */
  created_at?: string;
}
