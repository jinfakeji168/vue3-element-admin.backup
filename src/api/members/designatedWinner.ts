import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/assignPrize";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: string | number;
  /** 抽奖状态 1.未抽奖, 2.已抽奖 */
  state?: string | number;
  /** 类型 1.充值赠送 2.注册赠送 3.邀请赠送 */
  type?: string | number;
  /** 开始/结束时间范围 */
  datetime?: string[];
}


/** 类型 */
export interface Form {
  /** ID */
  id: number;
  /** 用户ID */
  uid: number;
  /** 类型 1.充值赠送 2.注册赠送 3.邀请赠送 */
  type: 1 | 2 | 3;
  /** 奖项 */
  bonus: number;
  /** 1.未抽奖, 2.已抽奖 */
  state: 1 | 2;
  /** 添加时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 会员信息 */
  member: {
    /** ID */
    id: number;
    /** 账号 */
    account: string;
  };
}

/**
 * 批量操作请求参数接口
 */
export interface addForm {
  /** 批量方式 1.指定会员 2.按等级 */
  batch_type: 1 | 2;

  /** 分组名称 batch_type=1 时必填 (逗号分隔的字符串) */
  account?: string;

  /** VIP等级 batch_type=2 时必填 (全局接口获取) */
  vip_level?: string;

  /** 类型 1.充值赠送 2.注册赠送 3.邀请赠送 */
  type: "1" | "2" | "3";

  /** 奖项 (全局接口获取) */
  bonus?: number;
}

