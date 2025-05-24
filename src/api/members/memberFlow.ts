import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/balanceFlow";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 进出类型 1.获取 2.支出 */
  access_type?: 1 | 2;
  /** 账单标题 */
  bill_title?: string;
  /** 明细种类 1.基础账号 2.佣金账户 */
  detail_type?: 1 | 2;
  /** 明细类型 1.系统增加 2.系统减少 */
  detail_kind?: 1 | 2;
  /** 开始/结束时间范围 */
  datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** IP地址 */
  ip?: string;
  /** 用户ID */
  uid?: number;
  /** 进出类型 1.获取 2.支出 */
  access_type?: 1 | 2;
  /** 账单标题 */
  bill_title?: string;
  /** 明细种类 1.基础账号 2.佣金账户 */
  detail_type?: 1 | 2;
  /** 明细类型 1.系统增加 2.系统减少 */
  detail_kind?: 1 | 2;
  /** 操作前余额 */
  before_amount?: string;
  /** 操作金额 */
  operation_amount?: string;
  /** 操作后余额 */
  after_amount?: string;
  /** 备注 */
  remark?: string;
  /** 操作ID */
  operator_id?: string;
  /** 操作人 */
  operator_name?: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
