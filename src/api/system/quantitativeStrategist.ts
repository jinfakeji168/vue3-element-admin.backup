import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/quantify";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {}

/** 类型 */
export interface Form {
  id?: number;
  sort?: number;
  status?: StatusEnum;
  level?: number;
  title_original?: string;
  content_original?: string;
  subtitle_original?: string;
  title_translation?: TranslationItem[];
  content_translation?: TranslationItem[];
  subtitle_translation?: TranslationItem[];
  created_at?: string;
  updated_at?: string;
}
