import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/config";

export default {
  // ...init<Query, Form>(BasePath),
  getConfig() {
    return request<any, Form[]>({
      url: `${BasePath}/getConfig`,
      method: "get",
      params: {
        group: 'system'
      },
    });
  },
  setConfig(data: Form[]) {
    return request({
      url: `${BasePath}/setConfig`,
      method: "post",
      data: { data },
    });
  },
  /**获取充值配置 >团队充值奖励区间 等级options */
  getOptions() {
    return request<any, { key: number, val: string }[]>({
      url: '/admin/global/getGrade',
      method: 'get'
    })
  },
  withdrawAutoTrigger: init<{ type: 1 | 2 | 3 | 4 | 5 | 6 }, WithdrawAutoTriggerForm>('/admin/system/autoWithdrawalTriggerSetting'),
  //团队充值奖励区间
  teamRechargeAward: init<any, TeamRechargeAward>('/admin/system/teamRechargePaymentRange'),
  /**获取用户注册自增id */
  getAutoIncrementId() {
    return request<any, { max_uid: number }>({
      url: '/admin/system/userUidIncrSetting/getMaxUserUid',
      method: 'get'
    })
  },
  /**设置用户注册自增id */
  setAutoIncrementId(max_uid: number) {
    return request({
      url: '/admin/system/userUidIncrSetting/setMaxUserUid',
      method: 'post',
      data: { max_uid }
    })
  },
  /**获取手机区号选项 */
  getPhoneCodeOptions() {
    return request<any, { key: string, val: string }[]>({
      url: '/admin/global/getAreaCode',
      method: 'get'
    })
  },
  //首充奖励区间
  rechargeAward: init<any, RechargeAward>('/admin/system/rechargePaymentRange'),
  /**获取google验证状态*/
  getGoogleAuthStatus() {
    return request<any, GoogleAuthStatus>({
      url: '/admin/auth/google2fa/status',
      method: 'get'
    })
  },
  /*获取google验证信息*/
  getGoogleAuth() {
    return request<any, GoogleAuthInfo>({
      url: '/admin/auth/google2fa/enable-info',
      method: "get"
    })
  },
  /**确认启用google验证 */
  confirmGoogleAuth(code: string) {
    return request({
      url: '/admin/auth/google2fa/enable',
      method: 'post',
      data: { code }
    })
  },
  /**验证google */
  verifyGoogleAuth(code: string) {
    return request({
      url: '/admin/auth/google2fa/verify',
      method: 'post',
      data: { code }
    })
  }
};

/** 是否启用类型 */
export interface GoogleAuthStatus {
  /** 是否启用 */
  enabled: boolean;
  /** 启用时间 */
  enabled_at?: string;
}
/** google验证信息类型 */
export interface GoogleAuthInfo {
  /** 密钥 */
  secret: string;
  /** 二维码URL */
  qr_code_url: string;
  /** 手动输入密钥 */
  manual_entry_key: string;
}


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
  withdrawal_ratio?: string;
  /** 触发用户类型 1.所有用户 2.部分用户 */
  trigger_user_type: 1 | 2;
  /** 邀请用户数量 type=4,6 时存在 */
  invite_user_number?: number
  /** 邀请用户充值满多少 type=4,6 时存在*/
  invite_users_recharge_amount?: number;
  /** 能提现几次 type=6 时存在的字段 */
  withdrawal_number?: number;
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


/** 首充奖励区间类型 */
export interface RechargeAward {
  /** ID */
  id?: number;
  /** 最小充值包含 */
  min_recharge: string;
  /** 最大充值不包含 */
  max_recharge: string;
  /** 首充送款百分比 */
  first_charge_ratio: string;
  /** 首充送款封顶 */
  first_charge_cap: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
