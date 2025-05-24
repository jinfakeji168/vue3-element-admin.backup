<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          新增
        </el-button>
        <el-button v-hasPerm="['currency:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          删除
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="show_name" label="名称" min-width="120" />
        <el-table-column prop="icon" label="" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>

        <el-table-column prop="min_withdraw" label="最小提现金额" min-width="120" />
        <el-table-column prop="max_withdraw" label="最小提现金额" min-width="120" />
        <el-table-column prop="withdraw_fee_ratio" label="提现手续费(%)" min-width="120" />
        <el-table-column prop="max_withdraw_fee" label="最大手续费(按当前币种单位)" min-width="120" />
        <el-table-column prop="min_withdraw_fee" label="最小手续费(按当前币种单位)" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="充值" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.open_recharge == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="提现" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.open_withdraw == StatusEnum.False" type="success">正常</el-tag>
            <el-tag v-else type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_type" label="提款金额类型" min-width="120">
          <template #default="{ row }">
            {{ row.withdraw_type == 1 ? "用户输入" : "固定金额" }}
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_config" label="提款金额配置" min-width="120" />
        <el-table-column prop="exchange_rate" label="汇率  " min-width="120" />
        <el-table-column prop="exchange_rate_update_time" label="汇率更新时间" min-width="120" />
        <el-table-column prop="merchant_num" label="商户号" min-width="120" />
        <el-table-column prop="merchant_key" label="商户key " min-width="120" />
        <!-- <el-table-column prop="remark_original" label="说明原文  " min-width="120" /> -->
        <el-table-column prop="sort" label="排序" width="100" />

        <el-table-column label="操作" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['currency:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              编辑
            </el-button>
            <el-button v-hasPerm="['currency:editExplain']" type="primary" link size="small" @click.stop="table.editHandler(row, 1)">
              <template #icon><EditPen /></template>
              充值说明
            </el-button>
            <el-button v-hasPerm="['currency:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              删除
            </el-button>
            <el-button v-hasPerm="['currency:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
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
    <explain v-model="table.visible.value[1]" :data="table.currentData.value" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import editPart from "./components/edit.vue";
import explain from "./components/explain.vue";
import api, { type Form, Query } from "@/api/system/currency";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

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
      type: "input",
      modelKey: "name",
      label: "名称",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: status_types,
      props: {
        clearable: true,
        style: { width: "140px" },
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
  height: 40px;
  object-fit: contain;
}
</style>
