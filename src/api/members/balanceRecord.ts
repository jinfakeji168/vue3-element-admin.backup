

import init from "../basicAPI";
import request from "@/utils/request";

const BasePath = "/admin/member/balanceRecord";

export default {
  ...init<Query, Form>(BasePath),
  /**获取筛选选项 */
  getOptions: () => request.get<any, OptionList>(`${BasePath}/filterOptions`),
};

export interface Query extends PageQuery {
  /** 用户ID */
  uid: number;
  /** 进出类型 1.获取 2.支出 */
  access_type: 1 | 2;
  /** 账单标题 */
  bill_title: string;
  /** 明细种类 1.基础账号 2.佣金账户 */
  detail_type: 1 | 2;
  /** 明细类型 1.系统增加 2.系统减少 */
  detail_kind: 1 | 2;

}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** IP */
  ip?: string;
  /** 用户ID */
  uid?: number;
  /** 进出类型 1.获取 2.支出 */
  access_type?: number;
  /** 进出类型名称 */
  access_type_name?: string;
  /** 账单标题 */
  bill_title?: string;
  /** 账户类型 1.量化账户 2.体验金账户 3.佣金账户 4.智慧账户 5.秒合约账户 6.充值账户 */
  detail_type?: string;
  /** 账户类型名称 */
  detail_type_name?: string;
  /** 业务类型 1.充值 2.提现 3.投资 4.收益 5.转账 6.佣金 7.系统调整 8.其他 */
  detail_kind?: string;
  /** 业务类型名称 */
  detail_kind_name?: string;
  /** 操作前余额 */
  before_amount?: string;
  /** 操作金额 */
  operation_amount?: string;
  /** 操作后余额 */
  after_amount?: string;
  /** 备注 */
  remark?: string;
  /** 操作ID */
  operator_id?: string;
  /** 操作人 */
  operator_name?: string;
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
export interface OptionList {
  /** 进出类型选项 */
  access_types: OptionType[];
  /** 账户类型选项 */
  detail_types: OptionType[];
  /** 业务类型选项 */
  detail_kinds: OptionType[];

}

