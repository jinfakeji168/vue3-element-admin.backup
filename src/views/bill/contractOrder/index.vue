<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-button type="primary" @click="control_win_Handler()" v-hasPerm="['contractOrder:controll']">{{ $t("zhiDingYing") }}</el-button>
      <el-button type="danger" @click="control_lose_Handler()" v-hasPerm="['contractOrder:controll']">{{ $t("zhiDingShu") }}</el-button>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="uid" :label="$t('uidZhangHao')" min-width="120">
          <template #default="{ row }">
            <span>{{ $t("rowUid", [row.uid]) }}</span>
            <span>{{ row?.member?.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" :label="$t('touZiJineu')" min-width="100" />
        <el-table-column prop="fees" :label="$t('shouXuFeiU')" min-width="100" />
        <el-table-column prop="profit_and_loss_ratio" :label="$t('yingKuiBiLi')" min-width="100" />
        <el-table-column prop="type" :label="$t('heYueZhangDie')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="CONTRACT_TYPES.find((t) => t.value === row.type)?.type">
              {{ CONTRACT_TYPES.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tran_pair" :label="$t('jiaoYiDui')" min-width="100">
          <template #default="{ row }">
            {{ store.tradeList.find((item) => item.key == row.tran_pair)?.val }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('jianCangJieSuan')" min-width="200">
          <template #default="{ row }">
            <div>{{ $t("jianCangRowjiancangind", [row.jiancang_index]) }}</div>
            <div>{{ $t("jieSuanRowsettlementin", [row.settlement_index]) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="profit_and_loss_amount" :label="$t('yingKuiJineu')" min-width="120">
          <template #default="{ row }">
            <span :class="row.profit_and_loss_status === 1 ? 'text-success' : 'text-danger'">
              {{ row.profit_and_loss_amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="seconds" :label="$t('miaoShu')" min-width="80" />
        <el-table-column prop="profit_and_loss_status" :label="$t('yingKuiZhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="PROFIT_TYPES.find((t) => t.value === row.profit_and_loss_status)?.type">
              {{ PROFIT_TYPES.find((t) => t.value === row.profit_and_loss_status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('zhuangTai')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="STATUS_TYPES.find((t) => t.value === row.status)?.type">
              {{ STATUS_TYPES.find((t) => t.value === row.status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_control" :label="$t('kongZhiYingKui')" min-width="100">
          <template #default="{ row }">
            <el-tag :type="CONTROL_TYPES.find((t) => t.value === row.is_control)?.type">
              {{ CONTROL_TYPES.find((t) => t.value === row.is_control)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" :label="$t('gouMaiShiJian')" min-width="180" />
        <el-table-column prop="settlement_time" :label="$t('jieSuanShiJian')" min-width="180" />
        <el-table-column :label="$t('caoZuo')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="settlement_Handler([row.id])" :disabled="row.status === 1" v-hasPerm="['contractOrder:settlement']">
                {{ $t("jieSuan") }}
              </el-button>
              <el-button
                :type="row.is_control === 1 ? 'success' : 'primary'"
                link
                @click="control_win_Handler([row.id])"
                :disabled="row.status === 1"
                v-hasPerm="['contractOrder:controll']"
              >
                {{ $t("zhiDingYing_0") }}
              </el-button>
              <el-button
                :type="row.is_control === 2 ? 'danger' : 'primary'"
                link
                @click="control_lose_Handler([row.id])"
                :disabled="row.status === 1"
                v-hasPerm="['contractOrder:controll']"
              >
                {{ $t("zhiDingShu_0") }}
              </el-button>
            </el-button-group>
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
import api, { type Form, Query } from "@/api/bill/contractOrder";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import { ElMessage } from "element-plus";
import { useStore } from "@/store/modules/common";
const store = useStore();

//这里没做完，暂且搁置
const memberList = ref<any>([]);
const loading = ref(false);

/** 合约类型配置 */
const CONTRACT_TYPES = [
  { label: $t("maiZhang"), value: 1, type: "success" },
  { label: $t("maiDie"), value: 2, type: "danger" },
];

/** 状态配置 */
const STATUS_TYPES = [
  { label: $t("yiJieSuan"), value: 1, type: "success" },
  { label: $t("daiJieSuan"), value: 2, type: "warning" },
];

/** 控制状态配置 */
const CONTROL_TYPES = [
  { label: $t("weiZhiDing"), value: 0, type: "info" },
  { label: $t("zhiDingYing_1"), value: 1, type: "success" },
  { label: $t("zhiDingShu_1"), value: 2, type: "danger" },
];

/** 盈亏状态配置 */
const PROFIT_TYPES = [
  { label: $t("ying"), value: 1, type: "success" },
  { label: $t("kui"), value: 2, type: "danger" },
];

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
        loading: unref(loading),
        remoteMethod: async (res: string) => {
          loading.value = true;
          memberList.value = await searchMember({ account: res });
          loading.value = false;
        },
      },
    },
    {
      type: "select",
      modelKey: "type",
      label: $t("heYueLeiXing"),
      options: CONTRACT_TYPES,
      props: { clearable: true },
    },
    {
      type: "select",
      modelKey: "status",
      label: $t("zhuangTai"),
      options: STATUS_TYPES,
      props: { clearable: true },
    },
    {
      type: "select",
      modelKey: "is_control",
      label: $t("kongZhiZhuangTai"),
      options: CONTROL_TYPES,
      props: { clearable: true },
    },
    {
      type: "datetimerange",
      modelKey: "buy_datetime",
      label: $t("gouMaiShiJian_0"),
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: $t("jieSuanShiJian_0"),
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
  type: undefined,
  status: undefined,
  is_control: undefined,
  buy_datetime: [],
  set_datetime: [],
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

/**
 * 指定赢处理函数
 */
function control_win_Handler(ids?: number[]) {
  ElMessageBox.confirm($t("queDingYaoZhiDingYi"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          await api.control({ ids: ids || unref(table.selectList), state: 1 });
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
        done();
      } else {
        done();
      }
    },
  });
}

/**
 * 指定输处理函数
 */
function control_lose_Handler(ids?: number[]) {
  ElMessageBox.confirm($t("queDingYaoZhiDingSh"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          await api.control({ ids: ids || unref(table.selectList), state: 2 });
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
        done();
      } else {
        done();
      }
    },
  });
}

/**
 * 结算处理函数
 */
function settlement_Handler(ids?: number[]) {
  ElMessageBox.confirm($t("queDingYaoJieSuan"), $t("tiShi"), {
    beforeClose: async (action, instance, done) => {
      if (action === "confirm") {
        try {
          instance.confirmButtonLoading = true;
          api.settlement(ids || unref(table.selectList));
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
        done();
      } else {
        done();
      }
    },
  });
}

onMounted(() => {
  table.queryHandler();
});
</script>

<style scoped lang="scss">
.text-success {
  color: #67c23a;
}
.text-danger {
  color: #f56c6c;
}
</style>
