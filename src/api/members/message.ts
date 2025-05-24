import type { StatusEnum } from "@/enums/MenuTypeEnum";

import init from "../basicAPI";
const BasePath = "/admin/member/siteMessage";

export default {
  ...init<Query, TableItem>(BasePath),
};

/** 查询参数 */
export interface Query extends PageQuery {
  /** 用户ID */
  uid?: number;
  /** 操作人名称 */
  operator_name?: string;
  /** 日志类型 1.登录 2.注册 */
  log_type?: 1 | 2;
  /** 标题 */
  title?: string;
  /** 日志IP */
  log_ip?: string;
  /** 开始/结束时间范围 */
  send_time?: string[];
  /** 是否已读 1.是, 2.否 */
  is_read?: 1 | 2;
  /** 消息类型 1.自定义 2.充值到账 3.提现到账 */
  type?: 1 | 2 | 3;
}

/** 类型 */
export interface TableItem {
  /** ID */
  id?: number;
  /** 用户ID */
  uid?: number;
  /** 消息类型 1.自定义 2.充值到账 3.提现到账 */
  type?: 1 | 2 | 3;
  /** 发送人ID */
  operator_id?: number;
  /** 发送名称 */
  operator_name?: string;
  /** 是否已读 1.是, 2.否 */
  is_read?: 1 | 2;
  /** 是否弹窗 1.是, 2.否 */
  is_window?: 1 | 2;
  /** 发送时间 */
  send_time?: string;
  /** 会员信息 */
  member?: {
    /** ID */
    id?: number;
    /** 账号 */
    account?: string;
  };
  /** 标题原文 */
  title_original?: string;
  /** 内容原文 */
  content_original?: string;
  /** 标题译文 */
  title_translation?: string;
  /** 语言标识 */
  lang?: string;
  /** 内容原文 */
  content?: string;
  /** 内容译文 */
  content_translation?: TranslationItem[];
  /** 添加时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

/** 发送新消息表单 */
export interface FormData {
  /** 发送方式 1.按等级 2.指定会员下级 3.按分组 */
  send_type: 1 | 2 | 3;
  /** vip等级列表 */
  vip_level?: number[];
  /** 会员账号列表 */
  account?: string[];
  /** 指定账号 */
  spe_account?: string;
  /** 会员分组id列表 */
  group_ids?: number[];
  /** 是否弹窗 1.是 2.否 */
  is_window: StatusEnum;
  /** 标题原文 */
  title_original: string;
  /** 标题译文 */
  title_translation: TranslationItem[];
  /** 语言标识 */
  lang: string;
  /** 内容 */
  content: string;
  /** 内容原文 */
  content_original: string;
  /** 内容译文列表 */
  content_translation: TranslationItem[];
}
