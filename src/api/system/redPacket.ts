import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import { dayjs } from "element-plus";
import init from "../basicAPI";

const BasePath = "/admin/system/redConfig";

export default {
  ...init<Query, Form>(BasePath),
};

export interface Query extends PageQuery {
  /** 1.拼手气红包 2.普通红包  */
  type?: 1 | 2;
  /**1.未开始 2.进行中 3.已结束   */
  state?: 1 | 2 | 3;
  timeRange?: any[];
  start_time?: string[];
  end_time?: string[];
  created_at?: string[];
}

/** 部门类型 */
export interface Form {
  id?: number;
  type?: number;
  state?: number;
  unique_id?: string;
  red_link?: string;
  red_num?: number;
  red_amount?: number;
  max_win_amount?: string;
  receive_num?: string;
  receive_amount?: string;
  start_time?: number;
  end_time?: number;
  time?: dayjs.Dayjs[];
  created_at?: string;
  updated_at?: string;
}
