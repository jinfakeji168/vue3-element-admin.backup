<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column label="ID" prop="id" width="80" />
        <el-table-column :label="$t('uidZhangHao')" min-width="120">
          <template #default="{ row }">
            <span>{{ row.has_member?.account }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="level" :label="$t('dengJi_0')" min-width="80">
          <template #default="{ row }">
            {{ store.vipList.find((item) => item.level == row.level)?.title }}
          </template>
        </el-table-column>
        <el-table-column prop="income" :label="$t('shouYi')" min-width="120">
          <template #default="{ row }">
            {{ row.income }}
          </template>
        </el-table-column>
        <el-table-column prop="fees" :label="$t('fuWuFei')" min-width="120">
          <template #default="{ row }">
            {{ row.fees }}
          </template>
        </el-table-column>
        <el-table-column prop="currency_id" :label="$t('biZhong')" min-width="100">
          <template #default="{ row }">
            {{ store.tradeList.find((item) => item.key == row.currency_id)?.val }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('jiaoYiJiaGe')" min-width="200">
          <template #default="{ row }">
            <div>{{ $t("maiRuRowbuyprice", [row.buy_price || "--"]) }}</div>
            <div>{{ $t("maiChuRowselprice", [row.sel_price || "--"]) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('jiaoYiPingTai')" min-width="200">
          <template #default="{ row }">
            <div>{{ row.buy_platform || "--" }}</div>
            <div>{{ row.sel_platform || "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" min-width="180" />
        <el-table-column prop="settlement_time" :label="$t('wanChengShiJian')" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/quantitativeRecord";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import { useStore } from "@/store/modules/common";
const store = useStore();

const memberList = ref<any>([]);
const loading = ref(false);

/** 获取状态类型 */
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "primary";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "info";
  }
};

/** 获取状态文本 */
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return $t("jinHangZhong_0");
    case 1:
      return $t("yiWanCheng");
    case 2:
      return $t("yiQuXiao");
    default:
      return $t("weiZhi");
  }
};

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "select",
      modelKey: "uid",
      label: $t("yongHu"),
      options: memberList,
      props: {
        placeholder: $t("qingShuRuYongHuJin"),
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
      modelKey: "level",
      label: $t("dengJi_0"),
      options: store.vipList.map((item) => ({
        label: item.title,
        value: item.level,
      })),
      props: {
        placeholder: $t("qingXuanZeDengJi"),
        style: { width: "200px" },
        min: 0,
      },
    },
    {
      type: "select",
      modelKey: "currency_id",
      label: $t("biZhong_0"),
      options: [], // 需要从后端获取币种列表
      props: {
        placeholder: $t("qingXuanZeBiZhong"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: [
        { label: $t("jinHangZhong_0"), value: 0 },
        { label: $t("yiWanCheng_0"), value: 1 },
        { label: $t("yiQuXiao_0"), value: 2 },
      ],
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "add_datetime",
      label: $t("tianJiaShiJian"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "com_datetime",
      label: $t("wanChengShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({
  uid: undefined,
  level: undefined,
  currency_id: undefined,
  status: undefined,
  add_datetime: [],
  com_datetime: [],
});

/** 表格实例 */
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
