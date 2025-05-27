

import init from "../basicAPI";
import request from "@/utils/request";
const BasePath = "/admin/bills/investRecord";

export default {
  ...init<Query, Form>(BasePath),

  detail: (id: number) => {
    return request<DetailQuery, DetailForm>({
      url: `${BasePath}/detail/${id}`,
      method: "get"
    })
  }
};
/** 详情页查询接口 */
export interface DetailQuery extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 期数 */
  issue?: number;
  /** 最后一期 1.是 2.否 */
  last_issue?: 1 | 2;
  /** 状态 1已兑换 2未兑换 */
  status?: 1 | 2;
  /** 到期时间-开始/结束时间 */
  exp_datetime?: string[];
  /** 结算时间-开始/结束时间 */
  set_datetime?: string[];
  /** 投资时间-开始/结束时间 */
  cre_datetime?: string[];
}
/** 详情interface */
export interface DetailForm {
  /** 主键ID */
  id?: number;
  /** 记录ID */
  record_id?: number;
  /** 用户ID */
  uid?: number;
  /** 产品ID */
  product_id?: number;
  /** 返息金额 */
  refund_amount?: number;
  /** 投资金额 */
  amount?: number;
  /** 期数 */
  issue?: string;
  /** 最后一期 1.是 2.否 */
  last_issue?: 1 | 2;
  /** 状态 1已兑换 2未兑换 */
  status?: 1 | 2;
  /** 到期时间 */
  expiration_time?: string;
  /** 结算时间 */
  settlement_time?: string;
  /** 更新时间 */
  updated_at?: number;
  /** 投资时间 */
  created_at?: string;
}

export interface Query extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 产品ID */
  product_id?: number;
  /** 订单号 */
  order_sn?: string;
  /** 收益类型 1.按日返息,到期不还本 2.按日返息,到期还本 3.到期本息 */
  yield_type?: 1 | 2 | 3;
  /** 状态 1已兑换 2未兑换 */
  status?: 1 | 2;
  /** 到期时间-开始/结束时间 */
  exp_datetime?: string[];
  /** 结算时间-开始/结束时间 */
  set_datetime?: string[];
  /** 投资时间-开始/结束时间 */
  cre_datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 投资金额 */
  amount?: number;
  /** 订单号 */
  order_sn?: string;
  /** 产品ID */
  product_id?: number;
  /** 投资天数 */
  invest_days?: number;
  /** 日收益率 */
  days_rate?: string;
  /** 收益类型 1.按日返息,到期不还本 2.按日返息,到期还本 3.到期本息 */
  yield_type?: 1 | 2 | 3;
  /** 状态 1已兑换 2未兑换 */
  status?: 1 | 2;
  /** 到期时间 */
  expiration_time?: string;
  /** 结算时间 */
  settlement_time?: string;
  /** 总利润 */
  total_profit?: string;
  /** 投资时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
  /** 用户数据 */
  has_member?: {
    /** 会员ID */
    id?: number;
    /** 会员账号 */
    account?: string;
  };
  /** 产品数据 */
  has_invest_setting?: {
    /** 产品ID */
    id?: number;
    /** 产品类型 1.普通投资 2.提现投资 */
    type?: 1 | 2;
    /** 产品名称 */
    title?: string;
    /** 投资周期 */
    invest_cycle?: number;
    /** 每日收益率 */
    daily_yield?: string;
    /** 收益类型 1.按日返息,到期不还本 2.按日返息,到期还本 3.到期本息 */
    yield_type?: 1 | 2 | 3;
  };
}
