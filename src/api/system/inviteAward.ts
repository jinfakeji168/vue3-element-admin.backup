import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";

const BasePath = "/admin/system/inviteConfig";

export default {
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
  ladder: init<any, LadderListForm>("/admin/system/inviteConfig/ladder"),
  charge: init<any, ChargeListForm>("/admin/system/inviteConfig/charge"),
};

export interface Form {
  /**邀请下级首存人数阶梯奖励 1.开启 2.关闭   */
  invite_first_recharge_user?: StatusEnum;
  /**邀请一级会员首存超过多少   */
  invite_first_recharge_money?: number;
  /**邀请一级会员首存赠送金额   */
  invite_first_give_money?: number;
  /**邀请下级首存金额阶梯奖励 1.开启 2.关闭   */
  invite_first_recharge_invite_money?: StatusEnum;
}

export interface LadderListForm {
  id?: number;
  gift_amount?: number;
  people_invited?: number;
  created_at?: string;
  updated_at?: string;
}
export interface ChargeListForm {
  id?: number;
  status?: StatusEnum;
  gift_amount?: number;
  deposit_amount?: number;
  created_at?: string;
  updated_at?: string;
}
