import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/vip";

export default {
  ...init<Query, Form>(BasePath),
  updateRemark(data: remarkForm) {
    return request({
      url: `${BasePath}/remark`,
      method: "put",
      data,
    });
  },
};
export type remarkForm = Pick<Form, "id" | "remark_original" | "remark_translation">;

export interface Query extends PageQuery {
  title?: string;
  level?: string;
  status?: StatusEnum;
  is_unlock_purchase: StatusEnum; // 是否解锁购买
}

/** 类型 */
export interface Form {
  id?: number;
  status?: StatusEnum;
  sort?: number;
  /**会员名称 */
  title?: string;
  /**图片 */
  icon?: string;
  /**会员等级 */
  level?: number;
  /** 量化次数 */
  quant_num?: number;
  /** 解锁最小金额 */
  min_unlock_amount?: number | string;
  /** 解锁邀请人数0代表无需邀请 */
  unlock_invitation_num?: number;
  /** 邀请计算层级 */
  invited_comp_level?: number;
  /** 邀请人数有效充值 */
  invited_num_effect_recharge?: number | string;
  /** 量化有效天数 */
  quant_effect_days?: number;
  /** 收益率范围%(最小) */
  min_rate_of_return?: number | string;
  /** 收益率范围%(最大) */
  max_rate_of_return?: number | string;
  /** 平台服务费比例% */
  service_fee_ratio?: number | string;
  /** 是否显示服务费 1.是 2.否 */
  show_service_fee?: number;
  /** 充值返利% */
  recharge_rebate_ratio?: string;
  /** 量化返利% */
  quant_rebate_ratio?: string;
  /** 复充收益率% */
  recharge_yield_ratio?: string;
  /** 复充封顶 0 不封顶 */
  recharge_cap?: number | string;
  /** 是否可解锁购买  1.是 2.否 */
  is_unlock_purchase?: number;
  /** 可提现星期 */
  cash_withdrawal_week?: any;
  /** 说明原文 */
  remark_original?: string;
  /** 内容译文(type=1时有效) */
  remark_translation?: TranslationItem[];
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
  cash_withdrawal_time?: any[];
}
