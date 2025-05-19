import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/swiper";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {}

/** 部门类型 */
export interface Form {
  id?: number;
  sort?: number;
  status?: StatusEnum;
  title?: string;
  img_url?: string;
}
