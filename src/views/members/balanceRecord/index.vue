<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart 
        ref="queryFormRef" 
        v-model="queryParams" 
        :config="config" 
        @search="table.queryHandler()" 
        @reset="table.handleResetQuery()"
      />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table 
        :data="table.list.value" 
        row-key="id" 
        @selection-change="table.selectionChangeHandler($event)"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="member.account" label="用户名" min-width="120" />
        <el-table-column prop="access_type" label="进出类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.access_type === ACCESS_TYPE[0].value ? 'success' : 'danger'">
              {{ ACCESS_TYPE.find(item => item.value === row.access_type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bill_title" label="账单标题" min-width="150" />
        <el-table-column prop="detail_type" label="明细种类" min-width="120">
          <template #default="{ row }">
            {{ DETAIL_TYPE.find(item => item.value === row.detail_type)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="detail_kind" label="明细类型" min-width="120">
          <template #default="{ row }">
            {{ DETAIL_KIND.find(item => item.value === row.detail_kind)?.label }}
          </template>
        </el-table-column>
        <el-table-column prop="before_amount" label="操作前余额" min-width="120" />
        <el-table-column prop="operation_amount" label="操作金额" min-width="120" />
        <el-table-column prop="after_amount" label="操作后余额" min-width="120" />
        <el-table-column prop="remark" label="备注" min-width="150" />
        <el-table-column prop="operator_name" label="操作人" min-width="100" />
        <el-table-column prop="created_at" label="创建时间" min-width="180" />
      </el-table>

      <template #footer>
        <pagination 
          background 
          :total="table.pageTotal.value" 
          v-model:page-size="table.pageInfo.limit" 
          v-model:current-page="table.pageInfo.page"
        />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Query,Form } from "@/api/members/balanceRecord";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import { ref, reactive, onMounted } from 'vue';
const memberList = ref<any>([]);
const loading = ref(false);
/** 选项类型定义 */
type Option = {
  value: number
  label: string
}

/** 进出类型选项 */
const ACCESS_TYPE: Option[] = [
  { value: 1, label: "获取" },
  { value: 2, label: "支出" }
]

/** 明细种类选项 */
const DETAIL_TYPE: Option[] = [
  { value: 1, label: "基础账号" },
  { value: 2, label: "佣金账户" }
]

/** 明细类型选项 */
const DETAIL_KIND: Option[] = [
  { value: 1, label: "系统增加" },
  { value: 2, label: "系统减少" }
]

// 查询配置
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
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember(res);
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "access_type",
      label: "进出类型",
      options: ACCESS_TYPE,
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
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "detail_type",
      label: "明细种类",
      options: DETAIL_TYPE,
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
      options: DETAIL_KIND,
      props: {
        placeholder: "请选择明细类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
  ],
};

// 查询表单引用
const queryFormRef = ref(ElForm);

// 查询参数
const queryParams = reactive<Query>({});

// 表格实例
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}
</style>
