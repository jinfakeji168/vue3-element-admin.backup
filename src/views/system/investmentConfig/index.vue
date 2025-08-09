<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['investmentConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['investmentConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="sort" :label="$t('paiXu')" min-width="80" />
        <el-table-column prop="type" :label="$t('chanPinLeiXing')" min-width="100">
          <template #default="{ row }">
            {{ getProductTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="title" :label="$t('mingCheng')" min-width="120" />
        <el-table-column prop="icon" :label="$t('tuPian')" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="purchase_price" :label="$t('gouMaiJiaGe')" min-width="100" />
        <el-table-column prop="invest_cycle" :label="$t('touZiZhouQi')" min-width="80" />
        <el-table-column prop="daily_yield" :label="$t('meiRiShouYiShuai')" min-width="100" />
        <el-table-column prop="yield_type" :label="$t('shouYiLeiXing')" min-width="150">
          <template #default="{ row }">
            {{ getYieldTypeLabel(row.yield_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="sales_quota" :label="$t('xianGouShuLiang')" min-width="80" />
        <el-table-column prop="residual_num" :label="$t('shengYuShuLiang')" min-width="80" />
        <el-table-column prop="sales_status" :label="$t('xiaoShouZhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.sales_status == StatusEnum.False" type="success">{{ $t("kaiQi") }}</el-tag>
            <el-tag v-else type="info">{{ $t("guanBi") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">{{ $t("kaiQi") }}</el-tag>
            <el-tag v-else type="info">{{ $t("guanBi") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['investmentConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['investmentConfig:editExplain']" type="primary" link size="small" @click.stop="table.editHandler(row, 1)">
              <template #icon><EditPen /></template>
              {{ $t("chongZhiShuoMing") }}
            </el-button>
            <el-button v-hasPerm="['investmentConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button
              v-hasPerm="['investmentConfig:status']"
              :type="row.status == StatusEnum.False ? 'danger' : 'success'"
              link
              size="small"
              @click.stop="table.changeStatus(row)"
            >
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
  { value: 1, label: $t("kaiQi") },
  { value: 2, label: $t("guanBi") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: $t("chanPinLeiXing_0"),
      options: productTypeOptions,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "input",
      modelKey: "title",
      label: $t("mingCheng"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "yield_type",
      label: $t("shouYiLeiXing_0"),
      options: yieldTypeOptions,
      props: {
        clearable: true,
        style: { width: "150px" },
      },
    },
    {
      type: "select",
      modelKey: "sales_status",
      label: $t("xiaoShouZhuangTai_0"),
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
