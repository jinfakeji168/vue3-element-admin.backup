<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="primary" @click="api.update()">更新日报</el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="report_date" label="报表日期" min-width="120" />
        <el-table-column prop="register_count" label="注册人数" min-width="100" />
        <el-table-column prop="first_deposit_count" label="首充人数" min-width="100" />
        <el-table-column prop="login_count" label="登录人数" min-width="100" />
        <el-table-column prop="deposit_user_count" label="充值人数" min-width="100" />
        <el-table-column prop="withdrawal_user_count" label="提现人数" min-width="100" />
        <el-table-column prop="deposit_total_amount" label="充值总额" min-width="120" />
        <el-table-column prop="withdrawal_total_amount" label="提现总额" min-width="120" />
        <el-table-column prop="deposit_usdt_amount" label="充USDT" min-width="100" />
        <el-table-column prop="withdrawal_usdt_amount" label="提USDT" min-width="100" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/report/financialDate";

import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

const memberList = ref<any>([]);
const loading = ref(false);

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: "时间范围",
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
</style>
