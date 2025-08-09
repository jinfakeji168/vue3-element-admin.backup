<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()" />
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button v-hasPerm="['redPacket:add']" type="success" @click="table.editHandler()">
          <template #icon>
            <Plus />
          </template>
          {{ $t("xinZeng") }}
        </el-button>
        <el-button v-hasPerm="['redPacket:delete']" type="danger" @click="table.deleteHandler()" :disabled="!table.ischecked()">
          <template #icon>
            <Delete />
          </template>
          {{ $t("shanChu_0") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event, 'id')">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="type" :label="$t('leiXing')" min-width="140">
          <template #default="{ row }">
            <el-tag v-if="row.type == 1" type="info">{{ $t("pinShouQiHongBao") }}</el-tag>
            <el-tag v-else-if="row.type == 2" type="info">{{ $t("puTongHongBao") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.state == 1" type="info">{{ $t("weiKaiShi") }}</el-tag>
            <el-tag v-else-if="row.state == 2" type="success">{{ $t("jinHangZhong") }}</el-tag>
            <el-tag v-else type="warning">{{ $t("yiJieShu") }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="red_link" :label="$t('hongBaoLianJie')" min-width="120" />

        <el-table-column prop="red_num" :label="$t('hongBaoGeShu')" min-width="120" />
        <el-table-column prop="red_amount" :label="$t('hongBaoJinE')" min-width="120" />
        <el-table-column prop="max_win_amount" :label="$t('zuiDaZhongJiangJinE')" min-width="120" />
        <el-table-column prop="receive_num" :label="$t('yiLingQuGeShu')" min-width="120" />
        <el-table-column prop="receive_amount" :label="$t('yiLingQuJinE')" min-width="120" />
        <el-table-column prop="start_time" :label="$t('kaiShiShiJian')" min-width="120">
          <template #default="{ row }">
            {{ parseTime(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" :label="$t('jieShuShiJian')" min-width="120">
          <template #default="{ row }">
            {{ parseTime(row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('chuangJianShiJian')" min-width="120" />
        <el-table-column prop="updated_at" :label="$t('gengXinShiJian')" min-width="120" />

        <el-table-column prop="sort" :label="$t('paiXu')" width="100" />

        <el-table-column :label="$t('caoZuo')" fixed="right" align="left" width="200">
          <template #default="{ row }">
            <el-button v-hasPerm="['redPacket:edit']" type="primary" link size="small" @click.stop="table.editHandler(row, 0)">
              <template #icon>
                <Edit />
              </template>
              {{ $t("bianJi") }}
            </el-button>
            <el-button v-hasPerm="['redPacket:delete']" type="danger" link size="small" @click.stop="table.deleteHandler(row.id)">
              <template #icon>
                <Delete />
              </template>
              {{ $t("shanChu_0") }}
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
import api, { type Form, Query } from "@/api/system/redPacket";
import { StatusEnum } from "@/enums/MenuTypeEnum";
import { dayjs } from "element-plus";
import TableInstance from "@/utils/tableInstance";

/** 红包类型选项 */
const packet_types = [
  { value: 1, label: $t("pinShouQiHongBao_0") },
  { value: 2, label: $t("puTongHongBao_0") },
];

/** 状态选项 */
const state_types = [
  { value: 1, label: $t("weiKaiShi_0") },
  { value: 2, label: $t("jinHangZhong_0") },
  { value: 3, label: $t("yiJieShu_0") },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "120px",
  formItem: [
    {
      type: "select",
      modelKey: "type",
      label: $t("leiXing_0"),
      options: packet_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "select",
      modelKey: "state",
      label: $t("zhuangTai"),
      options: state_types,
      props: {
        clearable: true,
        style: { width: "140px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "start_time",
      label: $t("kaiShiShiJianFanWei"),
      props: {
        style: { width: "380px" },
        startPlaceholder: $t("kaiShiShiJian_0"),
        endPlaceholder: $t("jieShuShiJian_0"),
      },
    },
    {
      type: "datetimerange",
      modelKey: "end_time",
      label: $t("jieShuShiJianFanWei"),
      props: {
        style: { width: "380px" },
        startPlaceholder: $t("kaiShiShiJian_1"),
        endPlaceholder: $t("jieShuShiJian_1"),
      },
    },
    {
      type: "datetimerange",
      modelKey: "created_at",
      label: $t("tianJiaShiJianFanWe"),
      props: {
        style: { width: "380px" },
        startPlaceholder: $t("kaiShiShiJian_2"),
        endPlaceholder: $t("jieShuShiJian_2"),
      },
    },
  ],
};

const queryFormRef = ref();
const queryParams = reactive<Query>({});
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

/**时间格式化处理器*/
function parseTime(timeStamp: number) {
  return dayjs.unix(timeStamp).format($t("yyyyMmDdHhMmSs"));
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
