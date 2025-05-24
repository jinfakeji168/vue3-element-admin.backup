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
        <el-table-column prop="sort" label="排序" min-width="80" />
        <el-table-column prop="type" label="产品类型" min-width="100">
          <template #default="{ row }">
            {{ getProductTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" min-width="120" />
        <el-table-column prop="icon" label="图片" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="purchase_price" label="购买价格" min-width="100" />
        <el-table-column prop="invest_cycle" label="投资周期" min-width="80" />
        <el-table-column prop="daily_yield" label="每日收益率" min-width="100" />
        <el-table-column prop="yield_type" label="收益类型" min-width="150">
          <template #default="{ row }">
            {{ getYieldTypeLabel(row.yield_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="sales_quota" label="限购数量" min-width="80" />
        <el-table-column prop="residual_num" label="剩余数量" min-width="80" />
        <el-table-column prop="sales_status" label="销售状态" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.sales_status == StatusEnum.False" type="success">开启</el-tag>
            <el-tag v-else type="info">关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">开启</el-tag>
            <el-tag v-else type="info">关闭</el-tag>
          </template>
        </el-table-column>

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
import api, { type Form, Query, productTypeOptions, yieldTypeOptions, getProductTypeLabel, getYieldTypeLabel } from "@/api/system/investmentConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";
import { ref, reactive, onMounted, computed } from "vue";
import { ElForm } from "element-plus";

const sales_status_types = [
  { value: 1, label: "开启" },
  { value: 2, label: "关闭" },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: "产品类型",
      options: productTypeOptions,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "input",
      modelKey: "title",
      label: "名称",
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "yield_type",
      label: "收益类型",
      options: yieldTypeOptions,
      props: {
        clearable: true,
        style: { width: "150px" },
      },
    },
    {
      type: "select",
      modelKey: "sales_status",
      label: "销售状态",
      options: sales_status_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
  ],
};

const queryFormRef = ref<typeof ElForm | null>(null);

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
