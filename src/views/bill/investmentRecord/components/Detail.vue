<template>
  <el-dialog v-model="visible" :title="$t('touZiJiLuXiangQing')" width="80%" :close-on-click-modal="false">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" style="height: 50vh">
        <el-table-column prop="record_id" :label="$t('jiLuId')" min-width="100" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="100" />
        <el-table-column prop="product_id" :label="$t('chanPinId')" min-width="100" />
        <el-table-column prop="refund_amount" :label="$t('tuiKuanJineu')" min-width="120" />
        <el-table-column prop="issue" :label="$t('qiShu')" min-width="100" />
        <el-table-column prop="last_issue" :label="$t('zuiHouYiQi')" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ row.last_issue === 1 ? $t("shi") : $t("fou") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? $t("yiDuiHuan") : $t("weiDuiHuan") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiration_time" :label="$t('daoQiShiJian')" min-width="180" />
        <el-table-column prop="settlement_time" :label="$t('jieSuanShiJian_0')" min-width="180" />
        <el-table-column prop="created_at" :label="$t('chuangJianShiJian')" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form as DetailForm, DetailQuery } from "@/api/bill/investmentRecord";
import TableInstance from "@/utils/tableInstance";

const visible = ref(false);
const detail = ref<DetailForm>({} as DetailForm);

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "input",
      modelKey: "issue",
      label: $t("qiShu_0"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "last_issue",
      label: $t("zuiHouYiQi_0"),
      options: [
        { label: $t("shi"), value: 1 },
        { label: $t("fou"), value: 2 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { label: $t("yiDuiHuan"), value: 1 },
        { label: $t("weiDuiHuan"), value: 2 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "exp_datetime",
      label: $t("daoQiShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: $t("jieSuanShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "cre_datetime",
      label: $t("chuangJianShiJian"),
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

const record_id = ref();
/** 查询参数 */
const queryParams = reactive<DetailQuery>({
  last_issue: undefined,
});

/** 表格实例 */
const table = new TableInstance<DetailForm>({ getList: () => api.detail(queryParams, record_id.value) }, queryParams, 20, queryFormRef);

/** 打开弹窗 */
const openDialog = async (id: number) => {
  record_id.value = id;
  visible.value = true;
  table.queryHandler();
};

defineExpose({
  openDialog,
});
</script>

<style scoped lang="scss">
.el-descriptions {
  margin: 20px 0;
}
</style>
