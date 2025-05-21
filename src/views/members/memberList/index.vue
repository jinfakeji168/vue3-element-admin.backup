<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="uid" prop="id">
          <el-input v-model="queryParams.id" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable class="!w-[100px]">
            <el-option :value="StatusEnum.False" label="正常" />
            <el-option :value="StatusEnum.True" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="table.queryHandler()">
            <template #icon>
              <Search />
            </template>
            搜索
          </el-button>
          <el-button @click="table.handleResetQuery()">
            <template #icon>
              <Refresh />
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.openHandler(1, table.selectList.value)">
          <template #icon>
            <Plus />
          </template>
          批量操作
        </el-button>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          导出会员
        </el-button>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          批量封禁
        </el-button>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          设置分组
        </el-button>
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
              <el-switch v-model="row.status" inline-prompt :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" active-text="正常" inactive-text="禁用" />
              <el-switch
                v-model="row.withdrawal_status"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="允许提现"
                inactive-text="禁止提现"
              />

              <el-switch v-model="row.is_quant" inline-prompt :active-value="StatusEnum.False" :inactive-value="StatusEnum.True" active-text="开启量化" inactive-text="关闭量化" />
              <el-switch
                v-model="row.is_upgrade_withdrawal"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="允许升级提现"
                inactive-text="禁止升级提现"
              />

              <el-switch
                v-model="row.is_enabled_invite_code"
                inline-prompt
                :active-value="StatusEnum.False"
                :inactive-value="StatusEnum.True"
                active-text="启用邀请码"
                inactive-text="禁用邀请码"
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
              <el-button type="primary" size="small">补单</el-button>
              <el-button type="primary" size="small">查钱</el-button>
              <el-button type="primary" size="small">改钱</el-button>
              <el-button type="primary" size="small">下级充值</el-button>
              <el-button type="primary" size="small">下线</el-button>
              <el-button type="primary" size="small">模拟登录</el-button>
              <el-button type="primary" size="small">生成</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <addMember v-model="table.visible.value[0]" @finally="table.queryHandler()" />
    <batchOperation v-model="table.visible.value[1]" @finally="table.queryHandler()" :account="table.currentData.value" />
  </div>
</template>

<script setup lang="ts">
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import api, { type Member, MemberQuery } from "@/api/members/memberList";
import { FormInstance } from "element-plus";
import addMember from "./components/addMember.vue";
import batchOperation from "./components/batchOperation.vue";
const queryFormRef = ref<FormInstance>();
const queryParams = reactive<MemberQuery>({});
const table = new TableInstance<Member>(api, queryParams, 20, queryFormRef);
table.queryHandler();
</script>

<style lang="scss" scoped>
.grid > .el-button + .el-button {
  margin: 0;
}
</style>
