import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/groupConfig";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 标题 */
  title?: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
