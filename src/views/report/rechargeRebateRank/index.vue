<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="100" />
        <el-table-column prop="account" :label="$t('zhangHao')" min-width="120" />
        <el-table-column prop="total_rebate" :label="$t('chongZhiFanLiZongeu')" min-width="150">
          <template #default="{ row }">
            {{ row.total_rebate }}
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/report/rechargeRebateRank";

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
const queryParams = reactive<Query>({
  datetime: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);
watch(queryParams, (val) => {
  console.log("🚀 ~ val:", val);
});

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
