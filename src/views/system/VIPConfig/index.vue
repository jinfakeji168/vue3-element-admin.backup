<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['VIPConfig:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['VIPConfig:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" :label="$t('huiYuanMingCheng')" min-width="120" />
        <el-table-column prop="icon" :label="$t('tuPian')" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>
        <el-table-column prop="level" :label="$t('huiYuanDengJi')" min-width="80" />
        <el-table-column prop="min_rate_of_return" :label="$t('shouYiShuaiFanWei_1')" min-width="120">
          <template #default="{ row }">{{ $t("rowMinRateOfReturn", [row.min_rate_of_return, row.max_rate_of_return]) }}</template>
        </el-table-column>
        <el-table-column prop="quant_num" :label="$t('liangHuaCiShu')" min-width="80" />
        <el-table-column prop="min_unlock_amount" :label="$t('jieSuoJinE')" min-width="120" />
        <el-table-column prop="quant_effect_days" :label="$t('liangHuaTianShu')" min-width="100" />
        <el-table-column prop="service_fee_ratio" :label="$t('pingTaiFuWuFei')" min-width="120">
          <template #default="{ row }">{{ $t("rowServiceFeeRatio", [row.service_fee_ratio]) }}</template>
        </el-table-column>

        <el-table-column prop="recharge_rebate_ratio" :label="$t('chongZhiFanLi_0')" min-width="100" />
        <el-table-column prop="quant_rebate_ratio" :label="$t('liangHuaFanLi_0')" min-width="100" />
        <el-table-column prop="recharge_yield_ratio" :label="$t('fuChongShouYiShuaiF')" min-width="100">
          <template #default="{ row }">{{ row.recharge_yield_ratio }}% / {{ row.recharge_cap }}</template>
        </el-table-column>
        <el-table-column prop="is_unlock_purchase" :label="$t('shiFouKeJieSuoGouM')" min-width="120">
          <template #default="{ row }">
            <el-tag v-if="row.is_unlock_purchase == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">{{ $t("zhengChang_0") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong_0") }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['VIPConfig:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['VIPConfig:editExplain']" type="primary" link size="small" @click.stop="table.editHandler(row, 1)">
              <template #icon><EditPen /></template>
              {{ $t("chongZhiShuoMing") }}
            </el-button>
            <el-button v-hasPerm="['VIPConfig:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
            </el-button>
            <el-button v-hasPerm="['VIPConfig:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
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
import api, { type Form, Query } from "@/api/system/VipConfig";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import TableInstance from "@/utils/tableInstance";

/** 状态选项 */
const status_types = [
  { value: StatusEnum.False, label: $t("zhengChang_1") },
  { value: StatusEnum.True, label: $t("jinYong_1") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "input",
      modelKey: "title",
      label: $t("huiYuanMingCheng_0"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "input",
      modelKey: "level",
      label: $t("huiYuanDengJi_0"),
      props: {
        clearable: true,
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: status_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "is_unlock_purchase",
      label: $t("shiFouKeJieSuo"),
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
