<template>
  <el-dialog v-model="visible" :title="$t('xiaJiXinXi')" width="80%" :close-on-click-modal="false" append-to-body @closed="handleClosed">
    <div class="app-container">
      <div class="search-bar">
        <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
      </div>

      <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
        <template #header></template>

        <el-table :data="table.list.value" row-key="level" @selection-change="table.selectionChangeHandler($event)">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="level" :label="$t('jiBie')" min-width="80" />
          <el-table-column prop="recharge_amount" :label="$t('chongZhiJinE_0')" min-width="120">
            <template #default="{ row }">{{ $t("cnyRowRechargeAmount", [row.recharge_amount]) }}</template>
          </el-table-column>
          <el-table-column prop="recharge_count" :label="$t('chongZhiBiShu_0')" min-width="100" />
          <el-table-column prop="total_members" :label="$t('zongRenShu')" min-width="100" />
          <el-table-column prop="valid_members" :label="$t('youXiaoRenShu')" min-width="100" />
        </el-table>
        <template #footer>
          <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
        </template>
      </el-card>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type SubordinateRechargeStatistics } from "@/api/members/memberList";

import TableInstance from "@/utils/tableInstance";
const visible = defineModel<boolean>();
const props = defineProps<{ memberId: number }>();
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
const queryParams = reactive({
  uid: 0,
  datetime: [],
});
watch(visible, (val) => {
  if (val) {
    queryParams.uid = props.memberId || 0;
    table.queryHandler();
  }
});
/** 表格实例 */
const table = new TableInstance<SubordinateRechargeStatistics>({ getList: api.getSubordinateRecharge }, queryParams, 20, queryFormRef);

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
