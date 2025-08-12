import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/shareTask";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  type?: string;
  status?: string;
  reward_type?: string;
}

/** 类型 */
export interface Form {
  id?: number;
  icon?: string;
  sort?: number;
  status?: StatusEnum;
  type?: number;
  reward_type?: number;
  share_amount?: number;
  reward_vip_level?: string;
  reward_vip_days?: number;
  title_original?: string;
  title_translation?: TranslationItem[];
  step_original?: string;
  step_translation?: TranslationItem[];
  content_original?: string;
  content_translation?: TranslationItem[];
  created_at?: string;
  updated_at?: string;
}
