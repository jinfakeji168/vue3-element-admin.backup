import type { StatusEnum } from "@/enums/MenuTypeEnum";
import request from "@/utils/request";
import init from "../basicAPI";

const BasePath = "/admin/member/member";

export default {
  ...init<MemberQuery, Member>("/admin/member/member"),
  /**会员分组数据 */
  groupList() {
    return request({
      url: `${BasePath}/vipLevelNumber`,
    });
  },
  /**批量操作 等级修改 */
  batchLevel(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchVipLevel`,
      method: "put",
      data,
    });
  },
  /**批量操作 升级量化 */
  batchQuant(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchUpgradeQuant`,
      method: "put",
      data,
    });
  },
  /**批量操作 量化开关 */
  batchQuantSwitch(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchQuantSwitch`,
      method: "put",
      data,
    });
  },
  /**批量操作 收益折扣 */
  batchDiscount(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchEarningsDiscountQuant`,
      method: "put",
      data,
    });
  },
  /**批量操作 佣金转量化 */
  batchCommission(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchBrokerageToQuant`,
      method: "put",
      data,
    });
  },
  /**批量操作 邀请量化 */
  batchInvitation(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchInviteUserQuant`,
      method: "put",
      data,
    });
  },
  /**批量操作 封禁 */
  batchBan(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchOperBanned`,
      method: "put",
      data,
    });
  },
  /**批量操作 余额修改 */
  batchBalance(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchUpgradeBalance`,
      method: "put",
      data,
    });
  },
  /**批量操作 赠送抽奖 */
  batchLottery(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchFreeLottery`,
      method: "put",
      data,
    });
  },
  /**批量操作 强制投资 */
  batchInvest(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchBuyInvest`,
      method: "put",
      data,
    });
  },
  /**批量操作 秒合约概率 */
  batchProbability(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchSecondContract`,
      method: "put",
      data,
    });
  },
  /**批量操作 升级提现 */
  batchWithdrawal(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchUpgradeWithdrawal`,
      method: "put",
      data,
    });
  },
  /**批量操作 邀请提现 */
  batchInvitationWithdrawal(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchInviteWithdrawal`,
      method: "put",
      data,
    });
  },
  /**批量操作 分组 */
  batchGroup(data: BatchOperationForm) {
    return request({
      url: `${BasePath}/batchInviteWithdrawal`,
      method: "put",
      data,
    });
  },

  /**通过会员账户获取会员下级 */
  getSubordinate(account: string) {
    return request<any, { number: number }>({
      url: `${BasePath}/getMemberSubordinate`,
      method: "get",
      params: { account },
    });
  },
  /**设置分组 */
  setGroup(data: { ids: number[]; group_id: number }) {
    return request({
      url: `${BasePath}/batchGroup`,
      method: "put",
      data,
    });
  },
  /**批量封禁 */
  _batchBan(data: { ids: number[]; status: StatusEnum }) {
    return request({
      url: `${BasePath}/batchBaned`,
      method: "put",
      data,
    });
  },
  /**获取余额数据 */
  getBalanceData(member_id: number) {
    return request<any, AccountBalanceData>({
      url: `${BasePath}/getChangeBalance`,
      method: "get",
      params: { member_id },
    });
  },
  /**修改余额数据 */
  changeBalance(data: AccountBalanceChangeForm) {
    return request({
      url: `${BasePath}/setChangeBalance`,
      method: "put",
      data,
    });
  },
  /**导出会员 */
  exportMember(data: MemberQuery) {
    return request({
      url: `${BasePath}/export`,
      method: "get",
      data,
    });
  },
  /**获取vip分组列表（带人数） */
  getVipGroupList() {
    return request<any, VipItem[]>({
      url: `${BasePath}/vipLevelNumber`,
    });
  },
  /**列表 修改状态 */
  changeStatus(data: { id: number; state: StatusEnum }) {
    return request({
      url: `${BasePath}/setChangeUserStatus`,
      method: "put",
      data,
    });
  },
  /**列表 修改提现状态 */
  changeWithdrawalStatus(data: { id: number; state: StatusEnum }) {
    return request({
      url: `${BasePath}/setChangeWithdrawalStatus`,
      method: "put",
      data,
    });
  },
  /**列表 修改量化状态 */
  changeQuantStatus(data: { id: number; state: StatusEnum }) {
    return request({
      url: `${BasePath}/setChangeIsQuant`,
      method: "put",
      data,
    });
  },
  /**列表 列表-修改升级提现状态*/
  changeUpgradeWithdrawalStatus(data: { id: number; state: StatusEnum }) {
    return request({
      url: `${BasePath}/setChangeUpgradeWithdrawal`,
      method: "put",
      data,
    });
  },
  /**列表 修改邀请码状态*/
  changeInvitationStatus(data: { id: number; state: StatusEnum }) {
    return request({
      url: `${BasePath}/setChangeInviteCode`,
      method: "put",
      data,
    });
  },
  /**获取会员详情 */
  getMemberDetail(id: number) {
    return request<any, MemberDetailData>({
      url: `${BasePath}/detail`,
      method: "get",
      params: { id },
    });
  },
  /**保存会员详情 */
  saveMemberDetail(data: MemberDetailData) {
    return request({
      url: `${BasePath}/edit`,
      method: "put",
      data: { id: data.id, data },
    });
  },
  /**会员下级列表 */
  getSubordinateList(params: PageQuery & { uid: number }) {
    return request<PageQuery, PageResult<MemberSubordinateListData>>({
      url: `${BasePath}/subordinate`,
      method: "get",
      params,
    })
  },
  /**修改用户钱包地址 */
  changeWallet(data: ChangeWalletForm) {
    return request({
      url: `${BasePath}/updateWallet`,
      method: "put",
      data,
    });
  },
  /**补单 */
  addOrder(uid: number) {
    return request({
      url: `${BasePath}/manualOrderPatch`,
      method: "get",
      params: { uid },
    })
  },
  /**查钱 */
  checkMoney(uid: number) {
    return request<any, any>({
      url: `${BasePath}/fixedBalanceQuery`,
      method: "get",
      params: { uid },
    })
  },
  /**模拟登录 */
  simulateLogin(uid: number) {
    return request<SimulateLoginResult>({
      url: `${BasePath}/simulateLoginByUid`,
      method: "get",
      params: { uid }
    })
  },
  /**强制下线 */
  forceOffline(uid: number) {
    return request({
      url: `${BasePath}/forceLogout`,
      method: 'post',
      data: { uid }
    })
  },
  /**下级充值统计 */
  getSubordinateRecharge(params: { uid: number; datetime?: [string, string] }) {
    return request<SubordinateRechargeStatistics>({
      url: `${BasePath}/subordinateRechargeStats`,
      method: "get",
      params,
    })
  }
};
/* 查询表单 */
export interface MemberQuery {
  /** id */
  id?: number;
  /** 账户 */
  account?: string;
  /** 邀请码 */
  invita_code?: string;
  /** 创建时间 */
  created_at?: [string, string];
  /** 注册IP */
  register_ip?: string;
  /** 最后登录时间 */
  last_login_time?: [string, string];
  /** 最后登录IP */
  last_login_ip?: string;
  /** 用户组ID */
  group_id?: number;
  /** 最后充值时间 */
  last_recharge_time?: [string, string];
  /** 最小总充值金额 */
  min_total_recharge_amount?: number;
  /** 最大总充值金额 */
  max_total_recharge_amount?: number;
  /** 最小总提现金额 */
  min_total_withdrawal_amount?: number;
  /** 最大总提现金额 */
  max_total_withdrawal_amount?: number;
  /** 最小经纪人账户 */
  min_brokerage_account?: number;
  /** 最大经纪人账户 */
  max_brokerage_account?: number;
  /** 最后提现金额 */
  last_withdrawal_amount?: number;
  /** 提现钱包 */
  withdrawal_wallet?: string;
  /** 充值钱包 */
  recharge_wallet?: string;
  /** 语言ID */
  lang_id?: number;
  /** 状态 */
  status?: StatusEnum;
  /**等级 */
  vip_level?: number;
}
/**会员 */
export interface Member {
  /** id */
  id: number;
  /** 账户 */
  account: string;
  /** vip等级 */
  vip_level: number;
  /** trc20提现钱包 */
  trc20_withdrawal_wallet?: string;
  /** bep20提现钱包 */
  bep20_withdrawal_wallet?: string;
  /** trc20充值钱包 */
  trc20_recharge_wallet?: string;
  /** bep20充值钱包 */
  bep20_recharge_wallet?: string;
  /** 注册IP */
  register_ip?: string;
  /** 注册区域 */
  register_area?: number;
  /** 最后登录IP */
  last_login_ip?: string;
  /** 最后登录区域 */
  last_login_area?: number;
  /** 最后登录时间 */
  last_login_time?: string | null;
  /** Telegram */
  telegram?: string;
  /** WhatsApp */
  whatsapp?: string;
  /** 邮箱 */
  email?: string;
  /** 电话 */
  telephone?: string;
  /** 量化购买投资 */
  quant_buy_invest?: number;
  /** 量化购买投资生效时间 */
  quant_buy_invest_effective_time?: string | null;
  /** 提现购买投资 */
  withdrawal_buy_invest?: number;
  /** 提现购买投资生效时间 */
  withdrawal_buy_invest_effective_time?: string | null;
  /** 最小提现金额（USDT） */
  min_withdrawal_amount_usdt?: number;
  /** 最大提现金额（USDT） */
  max_withdrawal_amount_usdt?: number;
  /** 最小提现金额（TRX） */
  min_withdrawal_amount_trx?: number;
  /** 最大提现金额（TRX） */
  max_withdrawal_amount_trx?: number;
  /** 最小提现金额（BNB） */
  min_withdrawal_amount_bnb?: number;
  /** 最大提现金额（BNB） */
  max_withdrawal_amount_bnb?: number;
  /** 备注 */
  remark?: string;
  /** 用户组ID */
  group_id: number;
  /** 量化最终收益折扣 */
  quant_final_earnings_discount?: number;
  /** 二级合约输赢比例 */
  second_contract_win_lose_ratio?: number;
  /** 状态 */
  status: StatusEnum;
  /** 提现状态 */
  withdrawal_status: StatusEnum;
  /** 是否量化用户 */
  is_quant: StatusEnum;
  /** 是否邀请用户量化 */
  is_invite_user_quant: StatusEnum;
  /** 量化邀请用户数量 */
  quant_invite_user_number?: number;
  /** 量化邀请用户充值金额 */
  quant_invite_user_recharge_amount?: number;
  /** 量化邀请用户生效时间 */
  quant_invite_user_effective_time?: string | null;
  /** 是否代理 */
  is_agent: StatusEnum;
  /** 是否总代理 */
  is_total_agent: StatusEnum;
  /** 是否升级量化 */
  is_upgrade_quant: StatusEnum;
  /** 是否升级提现 */
  is_upgrade_withdrawal: StatusEnum;
  /** 是否启用邀请码 */
  is_enabled_invite_code: StatusEnum;
  /** 是否邀请用户提现 */
  is_invite_user_withdrawal: StatusEnum;
  /** 提现邀请用户数量 */
  withdrawal_invite_user_number?: number;
  /** 提现邀请用户充值金额 */
  withdrawal_invite_user_recharge_amount?: number;
  /** 提现邀请用户生效时间 */
  withdrawal_invite_user_effective_time?: string | null;
  /** 充值剩余抽奖次数 */
  recharge_remain_lottery_num?: number;
  /** 注册剩余抽奖次数 */
  register_remain_lottery_num?: number;
  /** 邀请剩余抽奖次数 */
  invite_remain_lottery_num?: number;
  /** 谷歌验证码 */
  google_captcha?: string;
  /** 邀请码 */
  invita_code?: string;
  /** 邀请人ID */
  invite_id?: number;
  /** 语言ID */
  lang_id: number;
  /** 量化账户 */
  quant_account?: number;
  /** 经纪人账户 */
  brokerage_account?: number;
  /** 智能账户 */
  smart_account?: number;
  /** 体验账户 */
  experience_account?: number;
  /** 二级合约账户 */
  second_contract_account?: number;
  /** 充值账户 */
  recharge_account?: number;
  /** 最后充值时间 */
  last_recharge_time?: string | null;
  /** 最后充值金额 */
  last_recharge_amount?: number;
  /** 总充值金额 */
  total_recharge_amount?: number;
  /** 最后提现时间 */
  last_withdrawal_time?: string | null;
  /** 最后提现金额 */
  last_withdrawal_amount?: number;
  /** 总提现金额 */
  total_withdrawal_amount?: number;
  /** 提现次数 */
  withdrawal_number?: number;
  /** 是否在线 */
  is_online: StatusEnum;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}
/* 添加会员 */
export interface MemberAdd {
  /** 用户类型 1:邮箱 2:手机号 3:用户名 */
  type: number;
  /** 用户账户 */
  account?: string;
  /** 用户密码 */
  password?: string;
  /** 安全密码 */
  secure_password?: string;
  /** 用户邀请码 */
  invita_code?: string;
  /** 上级邀请码 */
  invite_id?: string;
  /** 语言类型 */
  lang_id?: number;
}

/**批量操作Form */
export interface BatchOperationForm {
  /** 封禁类型 1.指定会员 2.按等级 */
  batch_type: number;
  /** 会员账户 batch_type=1时必填 */
  account?: Array<string>;
  /** 旧的等级 batch_type=2时必填 */
  old_vip_level?: number;
  /** 注册时间 batch_type=2时必填 */
  register_time?: [string, string];
  /** 需要修改的新等级 */
  new_vip_level?: number;
  /**提充差 batch_type=3时必填  */
  charge_mention_diff?: string;
  /**	指定账号 batch_type=4时必填  */
  spec_account?: string;
  /**	会员分组ID batch_type=5时必填  */
  group_id?: number;
  /** 升级才能做量化 1.是 2.否  */
  is_upgrade_quant?: 1 | 2;
  /** 是否能量化 1.是 2.否  */
  is_quant?: 1 | 2;
  /**用户最终收益折扣 */
  quant_final_earnings_discount?: string;
  /** 邀请用户才能做量化 1.是 2.否 */
  is_invite_user_quant?: 1 | 2;
  /** 邀请用户才能做量化 - 邀请几个用户 */
  quant_invite_user_number?: number;
  /** 邀请用户才能做量化 - 邀请用户充值满多少 */
  quant_invite_user_recharge_amount?: number;
  /** 邀请用户才能做量化 - 邀请用户有效时间 */
  quant_invite_user_effective_time?: string;
  /** 封禁类型 1.登录 2.提款 */
  ban_type?: Array<number>;
  /** 操作 1.封禁 2.解封 */
  operation?: 1 | 2;
  /** 操作对象 1.量化账户余额 2.充值金额 3.佣金账户余额 4.智能账户余额 5.体验金余额 6.秒合约余额 */
  op_type?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 变动类型 1.减少 2.增加 */
  change_type?: 1 | 2;
  /** 变动金额 */
  change_amount?: number;
  /** 备注 */
  change_remark?: string;
  /** 赠送抽奖类型 1.注册赠送次数 2.邀请赠送次数 3.充值赠送次数 */
  lottery_type?: 1 | 2 | 3;
  /** 赠送次数 */
  gift_number?: number;
  /** 投资类型 1.提现买投资 2.量化买投资 */
  invest_type?: 1 | 2;
  /** 投资产品 */
  invest_product?: Array<string>;
  /** 有效购买时间 */
  effective_time?: string;
  /** 秒合约输赢概率 */
  second_contract_win_lose_ratio?: number;
  /** 升级才能提现 1.是 2.否  */
  is_upgrade_withdrawal: 1 | 2;
  /** 邀请用户才能提现 1.是 2.否 */
  is_invite_user_withdrawal?: 1 | 2;
  /** 邀请用户才能提现 - 提现几次 */
  withdrawal_number?: number;
  /** 邀请用户才能提现 - 邀请几个用户 */
  withdrawal_invite_user_number?: number;
  /** 邀请用户才能提现 - 邀请用户充值满多少 */
  withdrawal_invite_user_recharge_amount?: number;
  /** 邀请用户才能提现 - 邀请用户有效时间 */
  withdrawal_invite_user_effective_time?: string;
  /** 新分组ID */
  new_group_id?: number;
}

/**各类型账户余额 */
export interface AccountBalanceData {
  /** 量化账户余额 */
  quant_account: number;
  /** 佣金账户余额 */
  brokerage_account: number;
  /** 充值账户余额 */
  recharge_account: number;
  /** 智能账户余额 */
  smart_account: number;
  /** 秒合约余额 */
  second_contract_account: number;
  /** 体验金余额 */
  experience_account: number;
}
/**修改账户表单 */
export interface AccountBalanceChangeForm {
  /** 会员ID */
  member_id?: number;
  /** 操作对象 1.量化账户余额 2.充值金额 3.佣金账户余额 4.智能账户余额 5.体验金余额 6.秒合约余额 */
  op_type?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 变动类型 1.减少 2.增加 */
  change_type?: 1 | 2;
  /** 变动金额 */
  change_amount?: number;
  /** 备注 */
  change_remark?: string;
}

export interface VipItem {
  title: string;
  vip_level: number;
  number: number;
}



/**会员详情数据 */
export interface MemberDetailData {
  /** 主键id */
  id: number;
  /**密码 */
  password: string;
  /** 安全密码 */
  secure_password: string;

  /** 用户账号 */
  account: string;
  /** VIP等级 */
  vip_level: number;
  /** trc20提现钱包 */
  trc20_withdrawal_wallet?: string;
  /** bep20提现钱包 */
  bep20_withdrawal_wallet?: string;
  /** trc20充值钱包 */
  trc20_recharge_wallet?: string;
  /** bep20充值钱包 */
  bep20_recharge_wallet?: string;
  /** 注册ip */
  register_ip?: string;
  /** 注册地区 */
  register_area?: number;
  /** 最后登录ip */
  last_login_ip?: string;
  /** 最后登录地区 */
  last_login_area?: number;
  /** 登录时间 */
  last_login_at?: string;
  /** telegram */
  telegram?: string;
  /** whatsapp */
  whatsapp?: string;
  /** 用户邮箱 */
  email?: string;
  /** 联系方式 */
  telephone?: string;
  /** 量化买投资 */
  quant_buy_invest?: string;
  /** 量化买投资有效时间 */
  quant_buy_invest_effective_time?: string;
  /** 提现买投资 */
  withdrawal_buy_invest?: string;
  /** 提现买投资有效时间 */
  withdrawal_buy_invest_effective_time?: string;
  /** 最小提现金额USDT */
  min_withdrawal_amount_usdt?: number;
  /** 最大提现金额USDT */
  max_withdrawal_amount_usdt?: number;
  /** 最小提现金额TRX */
  min_withdrawal_amount_trx?: number;
  /** 最大提现金额TRX */
  max_withdrawal_amount_trx?: number;
  /** 最小提现金额BNB */
  min_withdrawal_amount_bnb?: number;
  /** 最大提现金额BNB */
  max_withdrawal_amount_bnb?: number;
  /** 用户备注 */
  remark?: string;
  /** 用户分组 */
  group_id: number;
  /** 量化最终收益折扣 */
  quant_final_earnings_discount?: number;
  /** 秒合约输赢概率 */
  second_contract_win_lose_ratio?: number;
  /** 状态 1正常 2禁用 */
  status: number;
  /** 提现状态 1正常 2禁用 */
  withdrawal_status: number;
  /** 是否能量化 1.是 2.否 */
  is_quant: number;
  /** 邀请用户才能做量化 1.是 2.否 */
  is_invite_user_quant: number;
  /** 邀请用户才能做量化-邀请几个用户 */
  quant_invite_user_number?: number;
  /** 邀请用户才能做量化-邀请用户充值满多少 */
  quant_invite_user_recharge_amount?: string;
  /** 邀请用户才能做量化-邀请用户有效时间 */
  quant_invite_user_effective_time?: string;
  /** 是否代理 1.是 2.否 */
  is_agent: number;
  /** 是否总代理 1.是 2.否 */
  is_total_agent: number;
  /** 升级才能做量化 1.是 2.否 */
  is_upgrade_quant: number;
  /** 升级才能提现 1.是 2.否 */
  is_upgrade_withdrawal: number;
  /** 邀请码是否启用 1.是 2.否 */
  is_enabled_invite_code: number;
  /** 邀请用户才能提现 1.是 2.否 */
  is_invite_user_withdrawal: number;
  /** 邀请用户才能提现-邀请几个用户 */
  withdrawal_invite_user_number?: number;
  /** 邀请用户才能提现-邀请用户充值满多少 */
  withdrawal_invite_user_recharge_amount?: string;
  /** 邀请用户才能提现-邀请用户有效时间 */
  withdrawal_invite_user_effective_time?: string;
  /** 充值剩余抽奖次数 */
  recharge_remain_lottery_num?: number;
  /** 注册剩余抽奖次数 */
  register_remain_lottery_num?: number;
  /** 邀请剩余抽奖次数 */
  invite_remain_lottery_num?: number;
  /** 谷歌验证码(二次验证) */
  google_captcha?: string;
  /** 用户邀请码 */
  invita_code?: string;
  /** 邀请人ID */
  invite_id?: number;
  /** 语言ID */
  lang_id: number;
  /** 量化账户余额 */
  quant_account?: string;
  /** 佣金账户余额 */
  brokerage_account?: string;
  /** 智能账户余额 */
  smart_account?: string;
  /** 体验金余额 */
  experience_account?: string;
  /** 秒合约余额 */
  second_contract_account?: string;
  /** 充值账户余额 */
  recharge_account?: string;
  /** 最后充值时间 */
  last_recharge_time?: string;
  /** 最后充值金额 */
  last_recharge_amount?: string;
  /** 充值总额 */
  total_recharge_amount?: string;
  /** 最后提现时间 */
  last_withdrawal_time?: string;
  /** 最后提现金额 */
  last_withdrawal_amount?: string;
  /** 提现总额 */
  total_withdrawal_amount?: string;
  /** 提现次数剩余 0不限制 */
  withdrawal_number?: number;
  /** 在线状态 1.在线 2.离线 */
  is_online: number;
  /** 是否删除 1.是 2.否 */
  is_delete: number;
  /** 删除时间 */
  deleted_at?: string;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 类型 1:手机 2:邮箱 3:用户名 4:telegram 5:telegram小程序自动注册 */
  type: number;
}





/**会员下级列表数据 */
export interface MemberSubordinateListData {
  /** 主键id */
  id: number;
  /** UID */
  UID: number;
  /** 账号 */
  account: string;
  /** VIP等级值 */
  vip_level: number;
  /** VIP名称 */
  vip_title: string;
  /** 在线状态 1在线 2离线 */
  is_online: number;
  /** 语言 */
  language: string;
  /** 量化余额 */
  quant_account: string;
  /** 佣金余额 */
  brokerage_account: string;
  /** 智能余额 */
  smart_account: string;
  /** 体验金余额 */
  experience_account: string;
  /** 秒合约余额 */
  second_contract_account: string;
  /** 充值账户余额 */
  recharge_account: string;
  /** 团队人数(直属) */
  team_total: number;
  /** 注册IP */
  register_ip: string;
  /** 注册时间 */
  register_at: string;
  /** 最后登录IP */
  last_login_ip: string;
  /** 最后登录时间 */
  last_login_at: string;
  /** 提现金额 */
  withdraw_amount: string;
  /** 累计充值总额 */
  total_recharge_amount: string;
  /** 累计提现总额 */
  total_withdrawal_amount: string;
  /** 注册地区 */
  register_area: string;
  /** 最后登录地区 */
  last_login_area: string;
  /** 一级上级ID */
  parent_id: number;
  /** 二级上级ID */
  grandpa_id: number;
  /** 三级上级ID */
  great_grandpa_id: number;
}


/**修改用户钱包地址参数 */
export interface ChangeWalletForm {
  /** 用户ID */
  id: number;
  /** 链类型 trc20 或 bep20 */
  type: "trc20" | "bep20";
  /** 谷歌验证码（当系统配置edit_address_is_google=1时必填） */
  google2fa_code?: string;
}


/**模拟登录返回 */
/**模拟登录返回类型 */
export interface SimulateLoginResult {
  /** 前端跳转链接 */
  url: string;
  /** 提示信息 */
  msg: string;
}


/**下级充值统计 */
export interface SubordinateRechargeStatistics {
  /**级别 */
  level: number;
  /**充值金额 */
  recharge_amount: string;
  /**充值笔数 */
  recharge_count: number;
  /**总人数 */
  total_members: number;
  /**有效人数 */
  valid_members: number;
}
