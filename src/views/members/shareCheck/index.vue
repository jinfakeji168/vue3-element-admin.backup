<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <el-button type="success" @click="checkHandler(1)" :loading="checkLoading" :disabled="!table.selectList.value.length" v-hasPerm="['shareCheck:check']">
          {{ $t("tongGuo") }}
        </el-button>
        <el-button type="danger" @click="checkHandler(2)" :loading="checkLoading" :disabled="!table.selectList.value.length" v-hasPerm="['shareCheck:check']">
          {{ $t("buTongGuo") }}
        </el-button>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" :selectable="(row) => row.status == 0" />
        <el-table-column prop="uid" :label="$t('yongHuId')" min-width="80" />
        <el-table-column prop="ip" :label="$t('ipXinXi')" min-width="120" />
        <el-table-column prop="screenshot" :label="$t('jieTu')" min-width="100">
          <template #default="{ row }">
            <el-image v-if="row.screenshot" :src="row.screenshot" :preview-src-list="[row.screenshot]" class="icon" />
          </template>
        </el-table-column>
        <el-table-column prop="completed_notes" :label="$t('wanChengShuoMing')" min-width="120" />
        <el-table-column prop="bonus_type" :label="$t('jiangLiLeiXing')" min-width="120">
          <template #default="{ row }">
            <el-tag>{{ bonus_type_options.find((t) => t.value === row.bonus_type)?.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bonus_detail" :label="$t('jiangLiXiangQing')" min-width="120" />
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="status_types[row.status]?.type">
              {{ status_types[row.status]?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" :label="$t('shenHeRen')" min-width="100" />
        <el-table-column prop="review_time" :label="$t('shenHeShiJian')" min-width="180" />
        <el-table-column prop="created_at" :label="$t('tianJiaShiJian')" min-width="180" />
        <el-table-column prop="updated_at" :label="$t('zuiHouBianJiShiJian')" min-width="180" />
        <el-table-column fixed="right" :label="$t('caoZuo')" width="150">
          <template #default="{ row }">
            <div>
              <el-button v-if="row.status === 0" type="primary" size="small" @click="checkHandler(1, row.id)" :loading="checkLoading" v-hasPerm="['shareCheck:check']">
                {{ $t("tongGuo") }}
              </el-button>
              <el-button v-if="row.status === 0" type="danger" size="small" @click="checkHandler(2, row.id)" :loading="checkLoading" v-hasPerm="['shareCheck:check']">
                {{ $t("buTongGuo_0") }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/members/shareCheck";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";

/** 奖励类型选项 */
const bonus_type_options = [
  { value: 1, label: $t("jiangLiYongJinZhang") },
  { value: 2, label: $t("jiangLiVip_0") },
  { value: 3, label: $t("jiangLiJiChuZhangHu") },
];

/** 状态类型 */
const status_types: Record<any, any> = {
  0: { label: $t("daiShenHe"), type: "info" },
  1: { label: $t("tongGuo"), type: "success" },
  2: { label: $t("juJue"), type: "danger" },
};

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
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "bonus_type",
      label: $t("jiangLiLeiXing"),
      options: bonus_type_options,
      props: {
        placeholder: $t("qingXuanZeJiangLiLe"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: Object.entries(status_types).map(([value, item]) => ({
        value: Number(value),
        label: item.label,
      })),
      props: {
        placeholder: $t("qingXuanZeZhuangTai"),
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "review_time",
      label: $t("shenHeShiJian_0"),
      props: { style: { width: "400px" } },
    },
  ],
};

/** 查询表单引用 */
const queryFormRef = ref(ElForm);

/** 查询参数 */
const queryParams = reactive<Query>({
  uid: undefined,
  bonus_type: undefined,
  status: undefined,
  review_time: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

const checkLoading = ref(false);
/**
 * 审核处理
 */
function checkHandler(status: 1 | 2, id?: number) {
  const ids = id ? [id] : table.selectList.value;
  ElMessageBox.prompt($t("jiangJinHangIdslength", [ids.length]), $t("queRenShenHe")`${status == 1 ? $t("tongGuo") : $t("buTongGuo")}`, {
    confirmButtonText: $t("queDing_0"),
    cancelButtonText: $t("quXiao_0"),
  }).then(({ value }) => {
    checkLoading.value = true;
    api
      .check({
        ids,
        status,
        remark: value,
      })
      .then(() => {
        table.queryHandler();
      })
      .finally(() => {
        checkLoading.value = false;
      });
  });
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
