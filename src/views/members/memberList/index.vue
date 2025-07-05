<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-tabs v-model="currentVip">
          <el-tab-pane v-for="item of vipList" :label="item.title" :name="item.vip_level">
            <template #label>
              {{ `${item.title}(${item.number})` }}
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="flex">
          <el-button v-hasPerm="['memberList:add']" type="primary" @click="table.editHandler()">
            <template #icon>
              <Plus />
            </template>
            新增
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="success"
            @click="
              table.openHandler(1);
              tabIndex = 0;
            "
          >
            <template #icon>
              <Plus />
            </template>
            批量操作
          </el-button>
          <el-button v-hasPerm="['memberList:export']" type="info">
            <template #icon>
              <Plus />
            </template>
            导出会员
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="danger"
            @click="
              table.openHandler(1);
              tabIndex = 6;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            批量封禁
          </el-button>
          <el-button
            v-hasPerm="['memberList:batch']"
            type="warning"
            @click="
              table.openHandler(1);
              tabIndex = 13;
            "
            :disabled="table.selectList.value.length === 0"
          >
            <template #icon>
              <Plus />
            </template>
            设置分组
          </el-button>
        </div>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event, ['id', 'account'])">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="show_name" label="用户信息" min-width="200px">
          <template #default="{ row }">
            <div>
              <span class="text-gray-500">ID:</span>
              <span class="text-gray-700">{{ row.id }}</span>
              <el-button class="ml-4" type="primary" size="small" @click="table.editHandler(row, 4)">查看下级</el-button>
            </div>
            <div>
              <span class="text-gray-500">账号:</span>
              <span class="text-gray-700">{{ row.account }}</span>
            </div>
            <div>
              <span class="text-gray-500">等级:</span>
              <span class="text-gray-700">{{ row.vip_level }}({{ row.is_online == 1 ? "在线" : "离线" }})</span>
            </div>
            <div>
              <span class="text-gray-500">语言:</span>
              <span class="text-gray-700">{{ commonStore.langList.find((i) => i.id == row.lang_id)?.name }}</span>
            </div>
            <div>
              <span class="text-gray-500">体验金:</span>
              <span class="text-gray-700">{{ row.experience_account }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态设置" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <el-switch
                v-model="row.status"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="允许登录"
                inactive-text="禁止登录"
                @change="statusChangeHandler(row, 'status')"
              />
              <el-switch
                v-model="row.withdrawal_status"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="允许提现"
                inactive-text="禁止提现"
                @change="statusChangeHandler(row, 'withdrawal_status')"
              />

              <el-switch
                v-model="row.is_quant"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="开启量化"
                inactive-text="关闭量化"
                @change="statusChangeHandler(row, 'is_quant')"
              />
              <el-switch
                v-model="row.is_upgrade_withdrawal"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="允许升级提现"
                inactive-text="禁止升级提现"
                @change="statusChangeHandler(row, 'is_upgrade_withdrawal')"
              />

              <el-switch
                v-model="row.is_enabled_invite_code"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="启用邀请码"
                inactive-text="禁用邀请码"
                @change="statusChangeHandler(row, 'is_enabled_invite_code')"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="余额" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">佣金账户:</span>
                <span class="text-gray-700">{{ row.brokerage_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">智能账户:</span>
                <span class="text-gray-700">{{ row.smart_account || "0.00" }}</span>
              </div>

              <div>
                <span class="text-gray-500">合约账户:</span>
                <span class="text-gray-700">{{ row.second_contract_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">量化账户:</span>
                <span class="text-gray-700">{{ row.quant_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">体验金:</span>
                <span class="text-gray-700">{{ row.experience_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">量化收益:</span>
                <span class="text-gray-700">{{ row.quant_profit || "0.00" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="钱包信息" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">trx:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_trx || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">trc20-usdt:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_usdt || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bnb:</span>
                <span class="text-gray-700">{{ row.min_withdrawal_amount_bnb || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">bep20-usdt/usdc:</span>
                <span class="text-gray-700">{{ row.bep20_recharge_wallet || "--" }}/{{ row.bep20_withdrawal_wallet || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">投资总额:</span>
                <span class="text-gray-700">{{ row.invest_total || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">投资未结算:</span>
                <span class="text-gray-700">{{ row.invest_unsettled || "0.00" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册/登录" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">注册方式:</span>
                <span class="text-gray-700">{{ getRegisterType(row.type) || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">注册:</span>
                <span class="text-gray-700">{{ row.created_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">注册IP:</span>
                <span class="text-gray-700">{{ row.register_ip || "--" }}({{ row.register_area }})</span>
              </div>
              <div>
                <span class="text-gray-500">最后:</span>
                <span class="text-gray-700">{{ row.last_login_time || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">最后IP:</span>
                <span class="text-gray-700">{{ row.last_login_ip || "" }}({{ row.last_login_area }})</span>
              </div>
              <div>
                <span class="text-gray-500">所在层级:</span>
                <span class="text-gray-700">{{ row.group_id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广员" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">顶级:</span>
                <span class="text-gray-700">{{ row.top_id }}/{{ row.top_account }}</span>
              </div>
              <div>
                <span class="text-gray-500">一级:</span>
                <span class="text-gray-700">{{ row.parent_id }}/{{ row.parent_account }}</span>
              </div>
              <div>
                <span class="text-gray-500">二级:</span>
                <span class="text-gray-700">{{ row.grandpa_id }}/{{ row.grandpa_account }}</span>
              </div>
              <div>
                <span class="text-gray-500">三级:</span>
                <span class="text-gray-700">{{ row.great_grandpa_id }}/{{ row.great_grandpa_account }}</span>
              </div>
              <div>
                <span class="text-gray-500">邀请码:</span>
                <span class="text-gray-700">{{ row.invita_code || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="充提/VIP" min-width="250px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">充值:</span>
                <span class="text-gray-700">{{ row.total_recharge_amount || "0.000000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">提现:</span>
                <span class="text-gray-700">{{ row.total_withdrawal_amount || "0.000000" }}</span>
              </div>
              <div>
                <span class="text-gray-500">开始时间:</span>
                <span class="text-gray-700">{{ row.created_at || "2025-05-20 23:13:58" }}</span>
              </div>
              <div>
                <span class="text-gray-500">结束时间:</span>
                <span class="text-gray-700">{{ row.end_time || "2026-05-20 23:13:58" }}</span>
              </div>
              <div>
                <span class="text-gray-500">直推下级:</span>
                <span class="text-gray-700">{{ row.withdrawal_invite_user_number }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="其他信息" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">邮箱:</span>
                <span class="text-gray-700">{{ row.email || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">联系方式:</span>
                <span class="text-gray-700">{{ row.telephone || "" }}</span>
              </div>
              <div>
                <span class="text-gray-500">备注:</span>
                <span class="text-gray-700">{{ row.remark || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">量化概率:</span>
                <span class="text-gray-700">{{ row.quant_final_earnings_discount }}%</span>
              </div>
              <div>
                <span class="text-gray-500">ws/tg:</span>
                <span class="text-gray-700">{{ row.whatsapp || "--" }}/{{ row.telegram || "--" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200px">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small" @click="table.editHandler(row, 3)">详情</el-button>
              <el-button type="success" size="small">补单</el-button>
              <el-button type="warning" size="small">查钱</el-button>
              <el-button type="info" size="small" @click="table.editHandler(row, 2)">改钱</el-button>
              <el-button type="success" size="small">下级充值</el-button>
              <el-button type="danger" size="small">下线</el-button>
              <el-button type="warning" size="small">模拟登录</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <addMember v-model="table.visible.value[0]" @finish="table.queryHandler()" />
    <batchOperation v-model="table.visible.value[1]" :account="table.selectList.value" :tabIndex="tabIndex" @finish="table.queryHandler()" />
    <changeBalance v-model="table.visible.value[2]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
    <detail v-model="table.visible.value[3]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
    <lowerLevel v-model="table.visible.value[4]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import api, { type Member, MemberQuery, VipItem } from "@/api/members/memberList";
import { FormInstance } from "element-plus";
import addMember from "./components/addMember.vue";
import batchOperation from "./components/batchOperation.vue";
import changeBalance from "./components/changeBalance.vue";
import detail from "./components/detail.vue";
import lowerLevel from "./components/lowerLevel.vue";
import commonApi from "@/api/common";
import { useStore } from "@/store/modules/common";
const commonStore = useStore();
/** 查询表单引用 */
const queryFormRef = ref<FormInstance>();

/** 会员列表加载状态 */
const loading = ref(false);
/** 会员选项列表 */
const memberList = ref<any>([]);

/** 搜索会员处理函数 */
// async function searchMemberHandler(query: string) {
//   loading.value = true;
//   if (query !== "") {
//     const res = await commonApi.getMemberSelect(query);
//     memberList.value = res.map((val) => ({
//       value: val.id,
//       label: val.account,
//     }));
//   } else {
//     memberList.value = [];
//   }
//   loading.value = false;
// }

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "id",
      label: "ID",
      props: {
        placeholder: "请输入id",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "account",
      label: "账户",
      props: {
        placeholder: "请输入账户",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "invita_code",
      label: "邀请码",
      props: {
        placeholder: "请输入邀请码",
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: "注册时间",
      props: {
        style: { width: "400px" },
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
      },
    },
    {
      type: "input",
      modelKey: "register_ip",
      label: "注册IP",
      props: {
        placeholder: "请输入注册IP",
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "last_login_time",
      label: "最后登录时间",
      props: {
        style: { width: "400px" },
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
      },
    },
    {
      type: "input",
      modelKey: "last_login_ip",
      label: "最后登录IP",
      props: {
        placeholder: "请输入最后登录IP",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "group_id",
      label: "用户组ID",
      props: {
        placeholder: "请输入用户组ID",
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { value: StatusEnum.False, label: "正常" },
        { value: StatusEnum.True, label: "禁用" },
      ],
      props: {
        placeholder: "请选择状态",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "vip_level",
      label: "等级",
      props: {
        placeholder: "请输入等级",
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "last_recharge_time",
      label: "最后充值时间",
      props: {
        style: {},
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_total_recharge_amount", "max_total_recharge_amount"],
      label: "总充值金额",
      props: {
        placeholder: ["最小充值金额", "最大充值金额"],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_total_withdrawal_amount", "max_total_withdrawal_amount"],
      label: "总提现金额",
      props: {
        placeholder: ["最小提现金额", "最大提现金额"],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: ["min_brokerage_account", "max_brokerage_account"],
      label: "经纪人账户",
      props: {
        placeholder: ["最小金额", "最大金额"],
        style: { width: "200px" },
      },
    },
    {
      type: "inputnumber",
      modelKey: "last_withdrawal_amount",
      label: "最后提现金额",
      props: {
        placeholder: "请输入最后提现金额",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "withdrawal_wallet",
      label: "提现钱包",
      props: {
        placeholder: "请输入提现钱包",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "recharge_wallet",
      label: "充值钱包",
      props: {
        placeholder: "请输入充值钱包",
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "lang_id",
      label: "语言ID",
      props: {
        placeholder: "请输入语言ID",
        style: { width: "200px" },
      },
    },
  ],
};

/** 查询参数 */
const queryParams = reactive<MemberQuery>({
  id: undefined,
  account: undefined,
  invita_code: undefined,
  created_at: [],
  register_ip: undefined,
  last_login_time: [],
  last_login_ip: undefined,
  group_id: undefined,
  status: undefined,
  vip_level: undefined,
  last_recharge_time: [],
  min_total_recharge_amount: undefined,
  max_total_recharge_amount: undefined,
  min_total_withdrawal_amount: undefined,
  max_total_withdrawal_amount: undefined,
  min_brokerage_account: undefined,
  max_brokerage_account: undefined,
  last_withdrawal_amount: undefined,
  withdrawal_wallet: undefined,
  recharge_wallet: undefined,
  lang_id: undefined,
});

const table = new TableInstance<Member>(api, queryParams, 20, queryFormRef);

const tabIndex = ref(0);
const currentVip = ref(0);
watch(
  currentVip,
  (val) => {
    queryParams.vip_level = val >= 0 ? val : undefined;
    table.queryHandler();
  },
  {
    immediate: true,
  }
);
const vipList = ref<VipItem[]>([]);
async function getvipList() {
  const res = await api.getVipGroupList();
  if (res) {
    res.reverse();
    const number = res.map((val) => val.number).reduce((pre, cur) => pre + cur);
    res.unshift({ title: "全部", number, vip_level: -1 });
    vipList.value = res;
    console.log("🚀 ~ getvipList ~ vipList.value :", vipList.value);
    currentVip.value = res[0].vip_level as number;
  }
}
getvipList();

/**
 * 处理会员状态变更
 * @param row 会员数据
 * @param type 状态类型 'status' | 'withdrawal_status' | 'is_quant' | 'is_upgrade_withdrawal' | 'is_enabled_invite_code'
 */
function statusChangeHandler(row: Member, type: keyof Pick<Member, "status" | "withdrawal_status" | "is_quant" | "is_upgrade_withdrawal" | "is_enabled_invite_code">) {
  const apiMap = {
    status: api.changeStatus,
    withdrawal_status: api.changeWithdrawalStatus,
    is_quant: api.changeQuantStatus,
    is_upgrade_withdrawal: api.changeUpgradeWithdrawalStatus,
    is_enabled_invite_code: api.changeInvitationStatus,
  };

  apiMap[type]({
    id: row.id,
    state: row[type],
  });
}
function getRegisterType(type: number) {
  if (type == 1) return "手机号";
  else if (type == 2) return "邮箱";
  else if (type == 3) return "用户名";
  else if (type == 4) return "telegram";
  else if (type == 5) return "auto telegram";
  else return type;
}
</script>

<style lang="scss" scoped>
.grid > .el-button + .el-button {
  margin: 0;
}
</style>
