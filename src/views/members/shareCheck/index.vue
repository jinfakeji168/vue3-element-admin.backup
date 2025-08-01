<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="checkHandler(1)" :loading="checkLoading" :disabled="!table.selectList.value.length" v-hasPerm="['shareCheck:check']">通过</el-button>
        <el-button type="danger" @click="checkHandler(2)" :loading="checkLoading" :disabled="!table.selectList.value.length" v-hasPerm="['shareCheck:check']">不通过</el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" :selectable="(row) => row.status == 0" />
        <el-table-column prop="uid" label="用户ID" min-width="80" />
        <el-table-column prop="ip" label="IP信息" min-width="120" />
        <el-table-column prop="screenshot" label="截图" min-width="100">
          <template #default="{ row }">
            <el-image v-if="row.screenshot" :src="row.screenshot" :preview-src-list="[row.screenshot]" class="icon" />
          </template>
        </el-table-column>
        <el-table-column prop="completed_notes" label="完成说明" min-width="120" />
        <el-table-column prop="bonus_type" label="奖励类型" min-width="120">
          <template #default="{ row }">
            <el-tag>{{ bonus_type_options.find((t) => t.value === row.bonus_type)?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bonus_detail" label="奖励详情" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="status_types[row.status]?.type">
              {{ status_types[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" label="审核人" min-width="100" />
        <el-table-column prop="review_time" label="审核时间" min-width="180" />
        <el-table-column prop="created_at" label="添加时间" min-width="180" />
        <el-table-column prop="updated_at" label="最后编辑时间" min-width="180" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="{ row }">
            <div>
              <el-button v-if="row.status === 0" type="primary" size="small" @click="checkHandler(1, row.id)" :loading="checkLoading" v-hasPerm="['shareCheck:check']">
                通过
              </el-button>
              <el-button v-if="row.status === 0" type="danger" size="small" @click="checkHandler(2, row.id)" :loading="checkLoading" v-hasPerm="['shareCheck:check']">
                不通过
              </el-button>
            </div>
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
import api, { type Form, Query } from "@/api/members/shareCheck";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

/** 奖励类型选项 */
const bonus_type_options = [
  { value: 1, label: "奖励佣金账户" },
  { value: 2, label: "奖励vip" },
  { value: 3, label: "奖励基础账户" },
];

/** 状态类型 */
const status_types = {
  0: { label: "待审核", type: "info" },
  1: { label: "通过", type: "success" },
  2: { label: "拒绝", type: "danger" },
};

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
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "bonus_type",
      label: "奖励类型",
      options: bonus_type_options,
      props: {
        placeholder: "请选择奖励类型",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: Object.entries(status_types).map(([value, item]) => ({
        value: Number(value),
        label: item.label,
      })),
      props: {
        placeholder: "请选择状态",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "review_time",
      label: "审核时间",
      props: { style: { width: "400px" } },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({
  uid: undefined,
  bonus_type: undefined,
  status: undefined,
  review_time: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

const checkLoading = ref(false);
/**
 * 审核处理
 */
function checkHandler(status: 1 | 2, id?: number) {
  const ids = id ? [id] : table.selectList.value;
  ElMessageBox.prompt(`将进行${ids.length}条数据审核，请输入备注内容并确认`, `确认审核${status == 1 ? "通过" : "不通过"}！`, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(({ value }) => {
    checkLoading.value = true;
    api
      .check({
        ids,
        status,
        remark: value,
      })
      .then(() => {
        table.queryHandler();
      })
      .finally(() => {
        checkLoading.value = false;
      });
  });
}

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
