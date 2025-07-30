
import request from "@/utils/request";
import init from "../basicAPI";
const BasePath = "/admin/bills/withdrawalCoinOrder";

export default {
  ...init<Query, Form>(BasePath),
  /** 一键审核*/
  oneKeyAudit(data: { ids: any[]; status: number; remark: string; }) {
    return request({
      url: `${BasePath}/batchAudit`,
      method: "post",
      data
    })
  },
  /**打款 走链上流程*/
  pay(id: any) {
    return request({
      url: `${BasePath}/execute`,
      method: "post",
      data: { id },
    });
  },
  /**查询 */
  query(order_sn: string) {
    return request({
      url: `${BasePath}/transaction`,
      method: "get",
      params: { order_sn },
    })
  },
  /**忽略 */
  ignore(id: any) {
    return request({

    })
  },
  /**一键出款 对转账失败的订单重新打款 */
  oneKeyPay() {
    return request({
      url: `${BasePath}/oneClickPayment`,
      method: "post",
    })
  },
  /**批量手动出款 该操作将该订单改为成功出款*/
  batchPay(ids: any[]) {
    return request({
      url: `${BasePath}/manualPayment`,
      method: "post",
      data: { ids },
    })
  },
  /**手动提现 */
  manuallyWithdraw(data: ManualWithdrawParams) {
    return request({
      url: `${BasePath}/manualWithdraw`,
      method: "post",
      data,
    })
  },
  /**一键退回 */
  oneKeyReturn(ids: any[]) {
    return request({
      url: `${BasePath}/oneClickRefund`,
      method: "post",
      data: { ids },
    })
  }

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
  /** 用户国家 */
  user_country?: string;
  /** 用户城市 */
  user_city?: string;
  /** 顶级上级ID */
  top_parent_id?: number;
  /** 顶级上级账号 */
  top_parent_account?: string;
  /** 一级上级ID */
  first_parent_id?: number;
  /** 一级上级账号 */
  first_parent_account?: string;
  /** 订单号 */
  order_sn?: string;
  /** 申请时间 */
  created_at?: string;
  /** 最近充值时间 */
  last_recharge_time?: string;
  /** 最近充值金额 */
  last_recharge_amount?: string;
  /** 提现金额 */
  withdraw_amount?: string;
  /** 手续费 */
  fees?: string;
  /** 实际到账金额 */
  arrival_amount?: string;
  /** 审核状态 0待审核 1已审核 2已拒绝 */
  audit_status?: number;
  /** 审核状态文本 */
  audit_status_text?: string;
  /** 提现地址 */
  rece_address?: string;
  /** 出款地址 */
  send_address?: string;
  /** 提款IP */
  withdraw_ip?: string;
  /** 审核备注 */
  audit_remark?: string;
  /** 审核操作员 */
  audit_operator?: string;
  /** 审核时间 */
  audit_time?: string;
  /** 打款状态 0未打款 1已打款 2打款失败 */
  payment_status?: number;
  /** 打款状态文本 */
  payment_status_text?: string;
  /** 出款金额 */
  payment_amount?: string;
  /** 打款txID */
  tx_id?: string;
  /** 平台单号 */
  platform_order_no?: string;
  /** 转账结果 */
  transfer_result?: string;
  /** 订单状态 0待审核 1打款中 2已完成 3失败 */
  status?: number;
  /** 订单状态文本 */
  status_text?: string;
  /** 转账状态 0未转 1成功 2失败 */
  order_result?: number;
  /** 转账状态文本 */
  order_result_text?: string;
  /** 提现类型/通道 */
  channel?: string;
  /** 操作时间 */
  updated_at?: string;
}


/** 提现审核参数类型 */
export interface AuditParams {
  /** 订单ID */
  id: number | string;
  /** 审核状态 1=通过 3=拒绝 */
  status: number;
  /** 审核备注 */
  remark?: string;
}


/** 手动提现参数类型 */
export interface ManualWithdrawParams {
  /** 用户ID */
  uid: number | undefined;
  /** 提现金额 */
  amount: number | undefined;
  /** 提现通道 */
  channel?: string;
  /** 提现地址 */
  address?: string;
  /** 备注 */
  remark?: string;
}
