<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <!-- <el-button v-hasPerm="['currency:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['currency:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button> -->
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="show_name" :label="$t('mingCheng')" min-width="120" />
        <el-table-column prop="chain" :label="$t('lianLeiXing')" min-width="120" />
        <el-table-column prop="icon" label="" min-width="100">
          <template #default="{ row }">
            <el-image :src="row.icon" class="icon" fit="contain" :preview-src-list="[row.icon]" preview-teleported :z-index="9999" />
          </template>
        </el-table-column>

        <el-table-column prop="min_withdraw" :label="$t('zuiXiaoTiXianJinE')" min-width="120" />
        <el-table-column prop="max_withdraw" :label="$t('zuiDaTiXianJinE')" min-width="120" />
        <el-table-column prop="withdraw_fee_ratio" :label="$t('tiXianShouXuFei')" min-width="80" />
        <el-table-column prop="max_withdraw_fee" :label="$t('zuiDaShouXuFeiAnDa')" min-width="100" />
        <el-table-column prop="min_withdraw_fee" :label="$t('zuiXiaoShouXuFeiAn')" min-width="100" />
        <el-table-column prop="status" :label="$t('zhuangTai')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('chongZhi')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.open_recharge == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('tiXian')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.open_withdraw == StatusEnum.False" type="success">{{ $t("zhengChang") }}</el-tag>
            <el-tag v-else type="info">{{ $t("jinYong") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_type" :label="$t('tiKuanJineleiXing')" min-width="120">
          <template #default="{ row }">
            {{ row.withdraw_type == 1 ? $t("yongHuShuRu") : $t("guDingJinE") }}
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_config" :label="$t('tiKuanJinepeiZhi')" min-width="120" />
        <el-table-column prop="exchange_rate" :label="$t('huiShuai')" min-width="120" />
        <el-table-column prop="exchange_rate_update_time" :label="$t('huiShuaiGengXinShiJ')" min-width="120" />
        <el-table-column prop="merchant_num" :label="$t('shangHuHao')" min-width="120" />
        <el-table-column prop="merchant_key" :label="$t('shangHuKey')" min-width="120" />
        <!-- <el-table-column prop="remark_original" label="说明原文  " min-width="120" /> -->
        <el-table-column prop="sort" :label="$t('paiXu')" width="100" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['currency:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon><EditPen /></template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['currency:editExplain']" type="primary" link size="small" @click.stop="table.editHandler(row, 1)">
              <template #icon><EditPen /></template>
              {{ $t("chongZhiShuoMing") }}
            </el-button>
            <el-button v-hasPerm="['currency:status']" :type="row.status == StatusEnum.False ? 'danger' : 'success'" link size="small" @click.stop="table.changeStatus(row)">
              <template #icon><Switch /></template>
              {{ row.status == StatusEnum.False ? $t("jinYong") : $t("qiYong") }}
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
  { value: StatusEnum.False, label: $t("zhengChang") },
  { value: StatusEnum.True, label: $t("jinYong") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "input",
      modelKey: "name",
      label: $t("mingCheng"),
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
