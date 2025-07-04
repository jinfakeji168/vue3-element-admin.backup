<template>
  <el-dialog v-model="visible" title="投资记录详情" width="80%" :close-on-click-modal="false">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" style="height: 50vh">
        <el-table-column prop="record_id" label="记录ID" min-width="100" />
        <el-table-column prop="uid" label="用户ID" min-width="100" />
        <el-table-column prop="product_id" label="产品ID" min-width="100" />
        <el-table-column prop="refund_amount" label="退款金额(U)" min-width="120" />
        <el-table-column prop="issue" label="期数" min-width="100" />
        <el-table-column prop="last_issue" label="最后一期" min-width="100">
          <template #default="{ row }">
            <el-tag>{{ row.last_issue === 1 ? "是" : "否" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? "已兑换" : "未兑换" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expiration_time" label="到期时间" min-width="180" />
        <el-table-column prop="settlement_time" label="结算时间" min-width="180" />
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
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
      label: "期数",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "last_issue",
      label: "最后一期",
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 2 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: [
        { label: "已兑换", value: 1 },
        { label: "未兑换", value: 2 },
      ],
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "exp_datetime",
      label: "到期时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: "结算时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "cre_datetime",
      label: "创建时间",
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
