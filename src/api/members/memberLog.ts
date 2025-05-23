import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/memberLog";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 日志类型 1.登录 2.注册 */
  log_type?: 1 | 2;
  /** 日志IP */
  log_ip?: string;
  /** 日志地区 */
  log_region?: string;
  /** 登录设备类型 1.PC 2.WEB 3.安卓 4.苹果 */
  device_type?: 1 | 2 | 3 | 4;
  /** 开始/结束时间范围 */
  datetime?: string[];
}

/** 类型 */
/** 会员日志表 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 用户账号 */
  account?: string;
  /** 日志类型 1.登录 2.注册 */
  log_type?: 1 | 2;
  /** 日志IP */
  log_ip?: string;
  /** 日志地区 */
  log_region?: string;
  /** 登录设备类型 1.PC 2.WEB 3.安卓 4.苹果 */
  device_type?: 1 | 2 | 3 | 4;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
