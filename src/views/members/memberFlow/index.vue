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
            {{ access_types.find((t) => t.value === row.access_type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="bill_title" label="账单标题" min-width="120" />
        <el-table-column prop="detail_type" label="明细种类" min-width="100">
          <template #default="{ row }">
            {{ detail_types.find((t) => t.value === row.detail_type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="detail_kind" label="明细类型" min-width="100">
          <template #default="{ row }">
            {{ detail_kinds.find((t) => t.value === row.detail_kind)?.label }}
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
import commonApi from "@/api/common";
import TableInstance from "@/utils/tableInstance";

/** 进出类型选项 */
const access_types = [
  { value: 1, label: "获取" },
  { value: 2, label: "支出" },
];

/** 明细种类选项 */
const detail_types = [
  { value: 1, label: "基础账号" },
  { value: 2, label: "佣金账户" },
];

/** 明细类型选项 */
const detail_kinds = [
  { value: 1, label: "系统增加" },
  { value: 2, label: "系统减少" },
];

const memberList = ref<any>([]);
const loading = ref(false);

/** 搜索会员处理函数 */
async function searchMemberHandler(query: string) {
  loading.value = true;
  if (query !== "") {
    const res = await commonApi.getMemberSelect(query);
    memberList.value = res.map((val) => ({
      value: val.id,
      label: val.account,
    }));
  } else {
    memberList.value = [];
  }
  loading.value = false;
}

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
        remoteMethod: searchMemberHandler,
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
      modelKey: "detail_type",
      label: "明细种类",
      options: detail_types,
      props: {
        placeholder: "请选择明细种类",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "detail_kind",
      label: "明细类型",
      options: detail_kinds,
      props: {
        placeholder: "请选择明细类型",
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
