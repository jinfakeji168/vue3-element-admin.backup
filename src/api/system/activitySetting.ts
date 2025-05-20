import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/activity";

export default {
  ...init<Query, Form>(BasePath),
  /**获取活动跳转列表 */
  getJumpPageList() {
    return request<any, Activity[]>({ url: `${BasePath}/jumpPage`, method: "get" });
  },
};

export interface Query extends PageQuery {}

/** 类型 */
export interface Form {
  id?: number;
  type?: number;
  jump_page?: number;
  bg_icon?: string;
  sort?: number;
  status?: StatusEnum;
  title_original?: string;
  title_translation?: TranslationItem[];
  subtitle_original?: string;
  subtitle_translation?: TranslationItem[];
  content_original?: string;
  content_translation?: TranslationItem[];
  created_at?: string;
  updated_at?: string;
}
export interface Activity {
  key: number;
  val: string;
}
