import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";

import init from "../basicAPI";
const BasePath = "/admin/system/invest";

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
export type remarkForm = Pick<Form, "id" | "remark_original" | "remark_translation" | "title_original" | "title_translation">;

export interface Query extends PageQuery {
  type?: string | number;
  title?: string | number;
  yield_type?: string | number;
  sales_status?: string | number;
  status?: string | number;
}

/** 类型 */
export interface Form {
  /** ID */
  id?: number;
  /** 排序 */
  sort?: number;
  /** 状态: 1.开启, 2.关闭 */
  status?: StatusEnum;
  /** 产品类型 1.普通投资 2.提现投资 */
  type?: 1 | 2;
  /** 名称 */
  title?: string;
  /** 图片 */
  icon?: string;
  /** 购买价格 */
  purchase_price?: number | string;
  /** 投资周期 */
  invest_cycle?: number;
  /** 每日收益率 */
  daily_yield?: number | string;
  /** 收益类型 1.按日返息,到期不还本 2.按日返息,到期还本 3.到期本息 */
  yield_type?: 1 | 2 | 3;
  /** 限购数量 */
  sales_quota?: number;
  /** 剩余数量 */
  residual_num?: number;
  /** 剩余数量是否显示 1.开启, 2.关闭 */
  show_residual_num?: StatusEnum;
  /** 销售状态 1.开启, 2.关闭 */
  sales_status?: StatusEnum;
  title_original?: string;
  title_translation?: TranslationItem[];
  /** 说明原文 */
  remark_original?: string;
  /** 内容译文(type=1时有效) */
  remark_translation?: TranslationItem[];
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}
export enum ProductTypeEnum {
  NORMAL = 1,
  WITHDRAW = 2,
}

export const productTypeOptions = [
  { value: ProductTypeEnum.NORMAL, label: "普通投资" },
  { value: ProductTypeEnum.WITHDRAW, label: "提现投资" },
];

export const getProductTypeLabel = (value: ProductTypeEnum) => {
  const option = productTypeOptions.find((item) => item.value === value);
  return option ? option.label : "";
};

export enum YieldTypeEnum {
  DAILY_NO_PRINCIPAL = 1,
  DAILY_WITH_PRINCIPAL = 2,
  DUE_PRINCIPAL_INTEREST = 3,
}

export const yieldTypeOptions = [
  { value: YieldTypeEnum.DAILY_NO_PRINCIPAL, label: "按日返息,到期不还本" },
  { value: YieldTypeEnum.DAILY_WITH_PRINCIPAL, label: "按日返息,到期还本" },
  { value: YieldTypeEnum.DUE_PRINCIPAL_INTEREST, label: "到期本息" },
];

export const getYieldTypeLabel = (value: YieldTypeEnum) => {
  const option = yieldTypeOptions.find((item) => item.value === value);
  return option ? option.label : "";
};
