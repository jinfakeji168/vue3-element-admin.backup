

import init from "../basicAPI";
import request from "@/utils/request";
const BasePath = "/admin/bills/contractOrder";

export default {
  ...init<Query, Form>(BasePath),
  /**控制盈亏 1指定赢 2指定输 */
  control: (data: { ids: number[]; state: 1 | 2 }) => {
    return request({
      url: `${BasePath}/control`,
      method: "put"
    })
  }
};

export interface Query extends PageQuery {
  /** 用户id */
  uid?: number;
  /** 合约涨跌类型 1.买涨 2.买跌 */
  type?: 1 | 2;
  /** 交易对 - 全局接口获取列表   */
  tran_pair?: number;
  /** 状态 1.已结算 2.待结算 */
  status?: 1 | 2;
  /** 控制盈亏 0.未指定 1.指定赢 2.指定输 */
  is_control?: 0 | 1 | 2;
  /** 购买时间-开始/结束时间 */
  buy_datetime?: string[];
  /** 结算时间-开始/结束时间 */
  set_datetime?: string[];
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 投入金额 */
  amount?: number;
  /** 手续费 */
  fees?: string;
  /** 盈亏比例 */
  profit_and_loss_ratio?: string;
  /** 合约涨跌类型 1.涨 2.跌 */
  type?: 1 | 2;
  /** 交易对 */
  tran_pair?: number;
  /** 建仓指数 */
  jiancang_index?: string;
  /** 结算指数 */
  settlement_index?: string;
  /** 盈亏金额 */
  profit_and_loss_amount?: string;
  /** 秒数 */
  seconds?: number;
  /** 盈亏状态 1.盈 2.亏 */
  profit_and_loss_status?: 1 | 2;
  /** 状态 1已结算 2未结算 */
  status?: 1 | 2;
  /** 控制盈亏 0.未指定 1.指定赢 2.指定输 */
  is_control?: 0 | 1 | 2;
  /** 结算时间 */
  settlement_time?: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
