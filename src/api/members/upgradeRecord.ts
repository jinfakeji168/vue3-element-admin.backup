import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/upgradeRecord";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 合约状态 1.已返还 2.未返还   */
  contract_status: 1 | 2;
  /** 开始/结束时间范围 */
  datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 原始等级 */
  old_level?: number;
  /** 升级后等级 */
  new_level?: string;
  /** 花费金额 */
  amount_spent?: string;
  /** 合约状态 1.已返还 2.未返还 */
  contract_status?: 1 | 2;
  /** 合约到期时间 */
  contract_expiration_time?: string;
  /** 会员到期时间 */
  member_expiration_time?: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
  /** 会员信息 */
  member?: {
    /** 会员ID */
    id: number;
    /** 会员账号 */
    account: string;
  };
}
