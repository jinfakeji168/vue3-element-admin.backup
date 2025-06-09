import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/config/getConfig";

export default {
  // ...init<Query, Form>(BasePath),
  getConfig() {
    return request<any, Form[]>({
      url: `${BasePath}`,
      method: "get",
      params: {
        group: 'system'
      },
    });
  },
  setConfig(data: Form) {
    return request({
      url: `${BasePath}`,
      method: "post",
      data,
    });
  },
  withdrawAutoTrigger: init<{ type: 1 | 2 | 3 | 4 | 5 | 6 }, WithdrawAutoTriggerForm>('/admin/system/autoWithdrawalTriggerSetting'),
  teamRechargeAward: init<any, TeamRechargeAward>('/admin/system/teamRechargePaymentRange')
};



/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 标题 */
  title?: string;
  /** 唯一标识KEY */
  name?: string;
  /** 配置值 */
  values?: any;
  /** 值类型 */
  type?: 'int' | 'json' | 'string';
  /** 配置分组 */
  group?: string;
  /** 配置说明描述 */
  remark?: string;
}


/** 提现自动触发 */
export interface WithdrawAutoTriggerForm {
  /** ID */
  id?: number;
  /** 触发类型 1.禁提 2.禁止量化 3.升级量化 4.邀请量化 5.升级提现 6.邀请提现 */
  type: 1 | 2 | 3 | 4 | 5 | 6;
  /** 提现比例-提现达到充值多少比例触发% */
  withdrawal_ratio: number;
  /** 触发用户类型 1.所有用户 2.部分用户 */
  trigger_user_type: '1' | '2';
  /** 用户ID数组 */
  user_id_array?: number[];
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

/** 团队充值奖励 */
export interface TeamRechargeAward {
  /** ID */
  id?: number;
  /** 充值金额达到多少 */
  recharge_amount: number;
  /** 赠送多少 */
  gift_amount: string;
  /** 等级ID */
  grade_id: string;
  /** 充值类型，1.每日充值，2.总充值 */
  recharge_type: string;
  /** 添加时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}

