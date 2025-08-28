<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="80" />
        <el-table-column prop="member.account" :label="$t('yongHu')" min-width="80" />

        <el-table-column prop="bill_title" :label="$t('zhangDanBiaoTi_0')" min-width="120" />
        <el-table-column prop="account_type" :label="$t('zhangHuLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag>
              {{ row.account_type_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="business_type" :label="$t('yeWuLeiXing')" min-width="100">
          <template #default="{ row }">
            <el-tag>
              {{ row.business_type_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="access_type" :label="$t('jinChuLeiXing_0')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.access_type === 1 ? 'success' : 'danger'">
              {{ row.access_type_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="before_amount" :label="$t('caoZuoQianYuE')" min-width="120" />
        <el-table-column prop="operation_amount" :label="$t('caoZuoJinE')" min-width="120">
          <template #default="{ row }">{{ row.access_type === access_types[0].value ? "+" : "-" }}{{ row.operation_amount }}</template>
        </el-table-column>
        <el-table-column prop="after_amount" :label="$t('caoZuoHouYuE')" min-width="120" />
        <el-table-column prop="operator_name" :label="$t('caoZuoRen')" min-width="100" />
        <el-table-column prop="updated_at" :label="$t('gengXinShiJian')" min-width="180" />
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/memberFlow";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

/** 进出类型选项 */
const access_types = ref();

/** 明细种类选项 */
const account_typeList = ref();

/** 明细类型选项 */
const business_typeList = ref();
async function getOptions() {
  const res = await api.getOptions();
  access_types.value = res.access_types;
  account_typeList.value = res.account_types;
  business_typeList.value = res.business_types;
}
getOptions();
const props = defineProps<{ uid: number }>();
const memberList = ref<any>([]);
const loading = ref(false);

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
        disabled: props.uid,
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "access_type",
      label: $t("jinChuLeiXing_0"),
      options: access_types,
      props: {
        placeholder: $t("qingXuanZeJinChuLei"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "bill_title",
      label: $t("zhangDanBiaoTi_0"),
      props: {
        placeholder: $t("qingShuRuZhangDanBi"),
        style: { width: "200px" },
      },
    },
    {
      type: "select",
      modelKey: "account_type",
      label: $t("zhangHuLeiXing_0"),
      options: account_typeList,
      props: {
        placeholder: $t("qingXuanZeZhangHuLe"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "business_type",
      label: $t("yeWuLeiXing_0"),
      options: business_typeList,
      props: {
        placeholder: $t("qingXuanZeYeWuLeiX"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: $t("shiJianFanWei"),
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
  access_type: undefined,
  bill_title: undefined,
  detail_type: undefined,
  detail_kind: undefined,
  datetime: [],
});

watch(
  () => props.uid,
  (val) => {
    if (val) queryParams.uid = val;
  },
  {
    immediate: true,
  }
);

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
