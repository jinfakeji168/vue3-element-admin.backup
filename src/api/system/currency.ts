import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/coinChannel";

export default {
  ...init<Query, Form>(BasePath),
  updateRemark() {
    return request({
      url: `${BasePath}/remark`,
      method: "put",
    });
  },
};

export interface Query {
  name?: string;
  mark?: string;
  status?: string;
  display_name?: string;
  page: number;
  limit: number;
}

/** 部门类型 */
export interface Form {
  id?: number;
  icon?: string;
  show_name?: string;
  sort?: number;
  status?: StatusEnum;
  open_recharge?: StatusEnum;
  open_withdraw?: StatusEnum;
  min_withdraw?: number;
  max_withdraw?: number;
  min_withdraw_fee?: number;
  max_withdraw_fee?: number;
  withdraw_fee_ratio?: number;
  withdraw_type?: 1 | 2;
  withdraw_config?: string;
  exchange_rate?: string;
  exchange_rate_update_time?: string;
  merchant_num?: string;
  merchant_key?: string;
  recharge_address?: string;
  remark_original?: string;
  remark_translation?: RemarkTranslationItem[];
}
export interface RemarkTranslationItem {
  lang?: string;
  content?: string;
}
