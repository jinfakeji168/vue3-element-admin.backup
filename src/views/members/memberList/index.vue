<template>
  <div class="app-container">
    <search-form v-model="queryParams" ref="queryFormRef" @search="table.queryHandler()" @reset="table.handleResetQuery()" />

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
          <el-button v-hasPerm="['currency:add']" type="primary" @click="table.editHandler()">
            <template #icon>
              <Plus />
            </template>
            新增
          </el-button>
          <el-button
            v-hasPerm="['currency:add']"
            type="success"
            @click="
              table.openHandler(1, table.selectList.value);
              tabIndex = 0;
            "
          >
            <template #icon>
              <Plus />
            </template>
            批量操作
          </el-button>
          <el-button v-hasPerm="['currency:add']" type="info" @click="table.editHandler()">
            <template #icon>
              <Plus />
            </template>
            导出会员
          </el-button>
          <el-button
            v-hasPerm="['currency:add']"
            type="danger"
            @click="
              table.openHandler(1, table.selectList.value);
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
            v-hasPerm="['currency:add']"
            type="warning"
            @click="
              table.openHandler(1, table.selectList.value);
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
              <el-button type="primary" size="small">查看下级</el-button>
            </div>
            <div>
              <span class="text-gray-500">账号:</span>
              <span class="text-gray-700">{{ row.account }}</span>
            </div>
            <div>
              <span class="text-gray-500">等级:</span>
              <span class="text-gray-700">{{ row.vip_level }}(离线) (trtc)</span>
            </div>
            <div>
              <span class="text-gray-500">语言:</span>
              <span class="text-gray-700">- |禁提</span>
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
                <span class="text-gray-500">量化账户:</span>
                <span class="text-gray-700">{{ row.quant_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">佣金账户:</span>
                <span class="text-gray-700">{{ row.brokerage_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">智能|合约:</span>
                <span class="text-gray-700">{{ row.smart_account || "0.00" }}|{{ row.second_contract_account || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">量化收益:</span>
                <span class="text-gray-700">{{ row.quant_final_earnings_discount || "0.00" }}</span>
              </div>
              <div>
                <span class="text-gray-500">投资未结算:</span>
                <span class="text-gray-700">{{ row.quant_buy_invest || "0.00" }}</span>
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
                <span class="text-gray-700">{{ row.quant_buy_invest || "0.00" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册/登录" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">注册:</span>
                <span class="text-gray-700">{{ row.created_at || "--" }}</span>
              </div>
              <div>
                <span class="text-gray-500">IP:</span>
                <span class="text-gray-700">{{ row.register_ip || "--" }}(后台)</span>
              </div>
              <div>
                <span class="text-gray-500">最后:</span>
                <span class="text-gray-700">{{ row.last_login_time || "--(未知)" }}</span>
              </div>
              <div>
                <span class="text-gray-500">IP:</span>
                <span class="text-gray-700">({{ row.last_login_ip || "" }})</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广员" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">所在层级:</span>
                <span class="text-gray-700">{{ row.group_id }}</span>
              </div>
              <div>
                <span class="text-gray-500">顶级:</span>
                <span class="text-gray-700">-/-</span>
              </div>
              <div>
                <span class="text-gray-500">一级:</span>
                <span class="text-gray-700">-/-</span>
              </div>
              <div>
                <span class="text-gray-500">二级:</span>
                <span class="text-gray-700">-/-</span>
              </div>
              <div>
                <span class="text-gray-500">三级:</span>
                <span class="text-gray-700">-/-</span>
              </div>
              <div>
                <span class="text-gray-500">邀请码:</span>
                <span class="text-gray-700">{{ row.invita_code || "" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="充提/VIP" min-width="200px">
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
                <span class="text-gray-700">{{ row.quant_buy_invest_effective_time || "2025-05-20 23:13:58" }}</span>
              </div>
              <div>
                <span class="text-gray-500">结束时间:</span>
                <span class="text-gray-700">{{ row.withdrawal_buy_invest_effective_time || "2026-05-20 23:13:58" }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="其他信息" min-width="200px">
          <template #default="{ row }">
            <div class="flex flex-col">
              <div>
                <span class="text-gray-500">直推下级:</span>
                <span class="text-gray-700">{{ row.withdrawal_invite_user_number }}</span>
              </div>
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
                <span class="text-gray-700">{{ row.whatsapp }}/{{ row.telegram }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200px">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small">详情</el-button>
              <el-button type="success" size="small">补单</el-button>
              <el-button type="warning" size="small">查钱</el-button>
              <el-button type="info" size="small" @click="table.openHandler(2, row)">改钱</el-button>
              <el-button type="success" size="small">下级充值</el-button>
              <el-button type="danger" size="small">下线</el-button>
              <el-button type="warning" size="small">模拟登录</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination background :total="table.pageTotal.value" :page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <addMember v-model="table.visible.value[0]" @finish="table.queryHandler()" />
    <batchOperation v-model="table.visible.value[1]" :account="table.currentData.value" :tabIndex="tabIndex" @finish="table.queryHandler()" />
    <changeBalance v-model="table.visible.value[2]" :member-id="table.currentData.value?.id" @finish="table.queryHandler()" />
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
import searchForm from "./components/searchForm.vue";

const queryFormRef = ref<FormInstance>();
onMounted(() => {});

const queryParams = reactive<MemberQuery>({});
const table = new TableInstance<Member>(api, queryParams, 20, queryFormRef);

const tabIndex = ref(0);
const currentVip = ref(0);
watch(
  currentVip,
  (val) => {
    queryParams.vip_level = val || undefined;
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
    res.unshift({ title: "全部", number, vip_level: 0 });
    vipList.value = res;
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
</script>

<style lang="scss" scoped>
.grid > .el-button + .el-button {
  margin: 0;
}
</style>
