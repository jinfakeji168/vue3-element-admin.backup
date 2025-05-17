import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/system/information";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {}

export interface Form {
  id?: number;
  sort?: number;
  status?: StatusEnum;
  video_url: string;
  title_original?: string;
  content_original?: string;
  title_translation?: TranslationItem[];
  content_translation?: TranslationItem[];
  updated_at?: string;
}
