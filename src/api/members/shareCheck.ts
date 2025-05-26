import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/member/shareReview";

export default {
  ...init<Query, Form>(BasePath),
  check: function (data: { ids: number[]; status: 1 | 2; remark: string }) {
    return request({
      url: `${BasePath}/audit`,
      method: "put",
      data,
    });
  },
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 奖励类型 1.奖励佣金账户 2.奖励基础账户 3.奖励vip */
  bonus_type?: 1 | 2 | 3;
  /** 状态 0.待审核 1.通过 2.拒绝 */
  status?: 0 | 1 | 2;
  /** 审核时间范围 */
  review_time?: string[];
  /** 更新时间范围 */
  updated_at?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** IP */
  ip?: string;
  /** 用户ID */
  uid?: number;
  /** 用户备注 */
  user_notes?: string;
  /** 截图信息 */
  screenshot?: string;
  /** 完成说明 */
  completed_notes?: string;
  /** 奖励类型 1.奖励佣金账户 2.奖励基础账户 3.奖励vip */
  bonus_type?: 1 | 2 | 3;
  /** 奖励详情 */
  bonus_detail?: string;
  /** 状态 0.待审核 1.通过 2.拒绝 */
  status?: 0 | 1 | 2;
  /** 审核时间 */
  review_time?: string;
  /** 佣金金额 */
  commission_amount?: string;
  /** 奖励vip天数 */
  reward_vip_days?: number;
  /** 奖励vip等级 */
  reward_vip_level?: number;
  /** 分享ID */
  share_id?: number;
  /** 审核人ID */
  operator_id?: string;
  /** 审核人 */
  operator_name?: string;
  /** 添加时间 */
  created_at?: string;
  /** 最后编辑时间 */
  updated_at?: string;
  /** 备注 */
  remark?: string;
}
