<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="table.editHandler()" v-hasPerm="['proxyList:add']">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button type="danger" :disabled="!table.selectList.value.length" @click="table.deleteHandler()" v-hasPerm="['proxyList:delete']">
          <template #icon>
            <Delete />
          </template>
          批量删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="account" label="用户账号" min-width="120" />
        <el-table-column prop="agent_name" label="代理名称" min-width="120" />
        <el-table-column label="代理类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.agent_type === 1 ? 'success' : 'warning'">
              {{ row.agent_type === 1 ? "普通代理" : "总代理" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="register_count" label="注册人数" min-width="100" />
        <el-table-column prop="total_recharge_amount" label="总充值金额" min-width="120" />
        <el-table-column prop="total_withdrawal_amount" label="提现金额" min-width="120" />
        <el-table-column prop="recharge_withdrawal_diff" label="充提差" min-width="100" />
        <el-table-column prop="quant_balance" label="量化余额" min-width="120" />
        <el-table-column prop="brokerage_balance" label="佣金余额" min-width="120" />
        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
        <el-table-column label="操作" min-width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="table.editHandler(row, 1)" v-hasPerm="['proxyList:view']">
              <template #icon>
                <Edit />
              </template>
              查看
            </el-button>
            <el-button type="danger" link size="small" @click="table.deleteHandler(row.uid)" v-hasPerm="['proxyList:delete']">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <edit v-model="table.visible.value[0]" @finish="table.handleResetQuery()" />
    <lowerLevel v-model="table.visible.value[1]" :member-id="table.currentData.value?.uid" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/report/proxyList";
import { searchMember } from "@/utils";
import lowerLevel from "@/views/members/memberList/components/lowerLevel.vue";

import TableInstance from "@/utils/tableInstance";
import edit from "./components/edit.vue";
/** 抽奖状态选项 */
const state_options = [
  { value: 1, label: "未抽奖" },
  { value: 2, label: "已抽奖" },
];

/** 类型选项 */
const type_options = [
  { value: 1, label: "充值赠送" },
  { value: 2, label: "注册赠送" },
  { value: 3, label: "邀请赠送" },
];

const memberList = ref<any>([]);
const loading = ref(false);

/** 查询配置 */
/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "agent_name",
      label: "代理名称",
      props: {
        placeholder: "请输入代理名称",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "account",
      label: "用户账户",
      props: {
        placeholder: "请输入用户账户",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "agent_type",
      label: "代理类型",
      options: [
        { value: 1, label: "普通代理" },
        { value: 2, label: "总代理" },
      ],
      props: {
        placeholder: "请选择代理类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: "统计类型",
      options: [
        { value: "direct", label: "下一级" },
        { value: "all_line", label: "整条线" },
        { value: "three_levels", label: "到下三级" },
      ],
      props: {
        placeholder: "请选择统计类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { value: 1, label: "正常" },
        { value: 2, label: "禁用" },
      ],
      props: {
        placeholder: "请选择状态",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: "创建时间",
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
/** 查询参数 */
const queryParams = reactive<Query>({
  agent_name: undefined,
  account: undefined,
  agent_type: undefined,
  type: undefined,
  status: undefined,
  created_at: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>
