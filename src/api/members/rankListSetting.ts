import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/member/rankingConfig";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 用户名 */
  user_name?: string;
  /** 类型 1.周 2.月 3.年 */
  type?: 1 | 2 | 3;
  /** 排名 */
  ranking?: number;
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户名 */
  user_name?: string;
  /** 头像 */
  avatar?: string;
  /** 收入 */
  income?: string;
  /** 类型 1.周 2.月 3.年 */
  type?: 1 | 2 | 3;
  /** 排名 */
  ranking?: number;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
