<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="access_type" label="进出类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.access_type === 1 ? 'success' : 'danger'">
              {{ access_types.find((t) => t.value === row.access_type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bill_title" label="账单标题" min-width="120" />
        <el-table-column prop="account_type" label="账户类型" min-width="100">
          <template #default="{ row }">
            <el-tag>
              {{ account_typeList.find((t) => t.value === row.account_type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="business_type" label="业务类型" min-width="100">
          <template #default="{ row }">
            <el-tag>
              {{ business_typeList.find((t) => t.value === row.business_type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="before_amount" label="操作前余额" min-width="120" />
        <el-table-column prop="operation_amount" label="操作金额" min-width="120" />
        <el-table-column prop="after_amount" label="操作后余额" min-width="120" />
        <el-table-column prop="operator_name" label="操作人" min-width="100" />
        <el-table-column prop="updated_at" label="更新时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/memberFlow";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

/** 进出类型选项 */
const access_types = [
  { value: 1, label: "获取" },
  { value: 2, label: "支出" },
];

/** 明细种类选项 */
const account_typeList = [
  { value: 1, label: "量化账户" },
  { value: 2, label: "体验金账户" },
  { value: 3, label: "佣金账户" },
  { value: 4, label: "智能账户" },
  { value: 5, label: "秒合约账户" },
  { value: 6, label: "充值账户" },
];

/** 明细类型选项 */
const business_typeList = [
  { value: 1, label: "充值" },
  { value: 2, label: "提现" },
  { value: 3, label: "投资" },
  { value: 4, label: "收益" },
  { value: 5, label: "转账" },
  { value: 6, label: "佣金" },
  { value: 7, label: "系统调整" },
  { value: 8, label: "其他" },
  { value: 10, label: "抽奖" },
  { value: 11, label: "秒合约" },
];
const props = defineProps<{ uid: number }>();
const memberList = ref<any>([]);
const loading = ref(false);

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "select",
      modelKey: "uid",
      label: "用户",
      options: memberList,
      props: {
        placeholder: "请输入用户进行查询",
        style: { width: "200px" },
        filterable: true,
        remote: true,
        clearable: true,
        loading: loading,
        disabled: props.uid,
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "access_type",
      label: "进出类型",
      options: access_types,
      props: {
        placeholder: "请选择进出类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "bill_title",
      label: "账单标题",
      props: {
        placeholder: "请输入账单标题",
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "account_type",
      label: "账户类型",
      options: account_typeList,
      props: {
        placeholder: "请选择账户类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "business_type",
      label: "业务类型",
      options: business_typeList,
      props: {
        placeholder: "请选择业务类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
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
const queryParams = reactive<Query>({
  uid: undefined,
  access_type: undefined,
  bill_title: undefined,
  detail_type: undefined,
  detail_kind: undefined,
  datetime: [],
});

watch(
  () => props.uid,
  (val) => {
    if (val) queryParams.uid = val;
  },
  {
    immediate: true,
  }
);

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
