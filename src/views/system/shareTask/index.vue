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
        <el-table-column prop="icon" label="分享任务图片" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>

        <el-table-column prop="type" label="奖励类型" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="info">账户佣金</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">奖励VIP</el-tag>
            <el-tag v-else type="info">基础账户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reward_type" label="奖励次数(类型)" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.reward_type == 1" type="info">总共一次</el-tag>
            <el-tag v-else-if="row.reward_type == 2" type="info">每日一次</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="share_amount" label="佣金金额" min-width="120" />

        <el-table-column prop="reward_vip_level" label="奖励VIP等级" min-width="120" />
        <el-table-column prop="reward_vip_days" label="奖励VIP天数" min-width="120" />

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['shareTask:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['shareTask:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['shareTask:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? "禁用" : "启用" }}
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
import api, { type Form, Query } from "@/api/system/shareTask";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

/** 奖励类型选项 */
const reward_types = [
  { value: 1, label: "佣金账户" },
  { value: 2, label: "奖励VIP" },
  { value: 3, label: "基础账户" },
];

/** 奖励次数类型选项 */
const reward_count_types = [
  { value: 1, label: "总共一次" },
  { value: 2, label: "每日一次" },
];

/** 状态选项 */
const status_types = [
  { value: StatusEnum.False, label: "正常" },
  { value: StatusEnum.True, label: "禁用" },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: "奖励类型",
      options: reward_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "reward_type",
      label: "奖励次数(类型)",
      options: reward_count_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: status_types,
      props: {
        clearable: true,
        style: { width: "100px" },
      },
    },
  ],
};

const queryFormRef = ref();
const queryParams = reactive<Query>({});
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
