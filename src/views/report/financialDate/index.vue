<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="primary" @click="api.update()">{{ $t("gengXinRiBao") }}</el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="report_date" :label="$t('baoBiaoRiQi')" min-width="120" />
        <el-table-column prop="register_count" :label="$t('zhuCeRenShu')" min-width="100" />
        <el-table-column prop="first_deposit_count" :label="$t('shouChongRenShu')" min-width="100" />
        <el-table-column prop="login_count" :label="$t('dengLuRenShu')" min-width="100" />
        <el-table-column prop="deposit_user_count" :label="$t('chongZhiRenShu')" min-width="100" />
        <el-table-column prop="withdrawal_user_count" :label="$t('tiXianRenShu')" min-width="100" />
        <el-table-column prop="deposit_total_amount" :label="$t('chongZhiZongE')" min-width="120" />
        <el-table-column prop="withdrawal_total_amount" :label="$t('tiXianZongE')" min-width="120" />
        <el-table-column prop="deposit_usdt_amount" :label="$t('chongUsdt')" min-width="100" />
        <el-table-column prop="withdrawal_usdt_amount" :label="$t('tiUsdt')" min-width="100" />
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
      label: $t("shiJianFanWei"),
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
