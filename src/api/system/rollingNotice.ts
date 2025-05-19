import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/scroll";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {}

/** 部门类型 */
export interface Form {
  id?: number;
  sort?: number;
  status?: StatusEnum;
  title_original?: string;
  content_original?: string;
  title_translation?: TranslationItem[];
  content_translation?: TranslationItem[];
  created_at?: string;
  updated_at?: string;
}
