import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";

const BasePath = "/admin/system/signConfig";

const rechargeListPath = "/admin/system/signConfig/prize";
export default {
  /** @description: 获取抽奖配置*/
  getConfig() {
    return request<Form>({
      url: `${BasePath}/get`,
      method: "get",
    });
  },
  setConfig(data: Form) {
    return request<Form>({
      url: `${BasePath}/set`,
      method: "put",
      data,
    });
  },
  ...init<any, ListForm>(rechargeListPath),
};

export interface Form {
  sign_is_enable?: StatusEnum;
  sign_give_account: 1 | 2;
  sign_min_level?: number;
}

export interface ListForm {
  id?: number;
  sign_days?: number;
  /**奖励金额 */
  reward_amount?: number;
  created_at?: string;
  updated_at?: string;
}
