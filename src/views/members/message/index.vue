<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['shareTask:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['shareTask:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" label="ID" width="80" />
        <el-table-column prop="member.account" label="用户信息" min-width="120" />
        <el-table-column prop="operator_name" label="发送人" min-width="100" />
        <el-table-column prop="title_original" label="标题信息" min-width="150" />
        <el-table-column prop="type" label="类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'info' : row.type === 2 ? 'success' : 'warning'">
              {{ message_types.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="send_time" label="发送时间" min-width="160" />
        <el-table-column prop="is_read" label="是否已读" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_read === 1 ? 'success' : 'info'">
              {{ row.is_read === 1 ? "已读" : "未读" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="read_time" label="已读时间" min-width="160" />
        <el-table-column prop="is_window" label="是否弹窗" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_window === 1 ? 'success' : 'info'">
              {{ row.is_window === 1 ? "是" : "否" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" align="left" width="180">
          <template #default="{ row }">
            <el-button v-hasPerm="['shareTask:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>

    <editPart v-model="table.visible.value[0]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import api, { type TableItem, Query } from "@/api/members/message";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

/** 消息类型选项 */
const message_types = [
  { value: 1, label: "自定义" },
  { value: 2, label: "充值到账" },
  { value: 3, label: "提现到账" },
];

/** 阅读状态选项 */
const read_status = [
  { value: 1, label: "已读" },
  { value: 2, label: "未读" },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "input",
      modelKey: "uid",
      label: "用户ID",
      props: {
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "operator_name",
      label: "发送人",
      props: {
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: "消息类型",
      options: message_types,
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "is_read",
      label: "阅读状态",
      options: read_status,
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "daterange",
      modelKey: "send_time",
      label: "发送时间",
      props: {
        type: "datetimerange",
        valueFormat: "YYYY-MM-DD HH:mm:ss",
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
      },
    },
  ],
};

const queryFormRef = ref();
const queryParams = reactive<Query>({});
const table = new TableInstance<TableItem>(api, queryParams, 20, queryFormRef);

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
