<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <el-button type="primary" @click="control_win_Handler()" v-hasPerm="['contractOrder:controll']">指定赢</el-button>
      <el-button type="danger" @click="control_lose_Handler()" v-hasPerm="['contractOrder:controll']">指定输</el-button>

      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" min-width="80" />
        <el-table-column prop="uid" label="uid/账号" min-width="120">
          <template #default="{ row }">
            <span>{{ row.uid }}/</span>
            <span>{{ row?.member?.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="投资金额(U)" min-width="100" />
        <el-table-column prop="fees" label="手续费(U)" min-width="100" />
        <el-table-column prop="profit_and_loss_ratio" label="盈亏比例" min-width="100" />
        <el-table-column prop="type" label="合约涨跌" min-width="100">
          <template #default="{ row }">
            <el-tag :type="CONTRACT_TYPES.find((t) => t.value === row.type)?.type">
              {{ CONTRACT_TYPES.find((t) => t.value === row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tran_pair" label="交易对" min-width="100">
          <template #default="{ row }">
            {{ store.tradeList.find((item) => item.key == row.tran_pair)?.val }}
          </template>
        </el-table-column>
        <el-table-column label="建仓/结算" min-width="200">
          <template #default="{ row }">
            <div>建仓: {{ row.jiancang_index }}</div>
            <div>结算: {{ row.settlement_index }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="profit_and_loss_amount" label="盈亏金额(U)" min-width="120">
          <template #default="{ row }">
            <span :class="row.profit_and_loss_status === 1 ? 'text-success' : 'text-danger'">
              {{ row.profit_and_loss_amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="seconds" label="秒数" min-width="80" />
        <el-table-column prop="profit_and_loss_status" label="盈亏状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="PROFIT_TYPES.find((t) => t.value === row.profit_and_loss_status)?.type">
              {{ PROFIT_TYPES.find((t) => t.value === row.profit_and_loss_status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="STATUS_TYPES.find((t) => t.value === row.status)?.type">
              {{ STATUS_TYPES.find((t) => t.value === row.status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_control" label="控制盈亏" min-width="100">
          <template #default="{ row }">
            <el-tag :type="CONTROL_TYPES.find((t) => t.value === row.is_control)?.type">
              {{ CONTROL_TYPES.find((t) => t.value === row.is_control)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="购买时间" min-width="180" />
        <el-table-column prop="settlement_time" label="结算时间" min-width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="settlement_Handler([row.id])" :disabled="row.status === 1" v-hasPerm="['contractOrder:settlement']">结算</el-button>
              <el-button
                :type="row.is_control === 1 ? 'success' : 'primary'"
                link
                @click="control_win_Handler([row.id])"
                :disabled="row.status === 1"
                v-hasPerm="['contractOrder:controll']"
              >
                指定赢
              </el-button>
              <el-button
                :type="row.is_control === 2 ? 'danger' : 'primary'"
                link
                @click="control_lose_Handler([row.id])"
                :disabled="row.status === 1"
                v-hasPerm="['contractOrder:controll']"
              >
                指定输
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
  { label: "买涨", value: 1, type: "success" },
  { label: "买跌", value: 2, type: "danger" },
];

/** 状态配置 */
const STATUS_TYPES = [
  { label: "已结算", value: 1, type: "success" },
  { label: "待结算", value: 2, type: "warning" },
];

/** 控制状态配置 */
const CONTROL_TYPES = [
  { label: "未指定", value: 0, type: "info" },
  { label: "指定赢", value: 1, type: "success" },
  { label: "指定输", value: 2, type: "danger" },
];

/** 盈亏状态配置 */
const PROFIT_TYPES = [
  { label: "盈", value: 1, type: "success" },
  { label: "亏", value: 2, type: "danger" },
];

/** 查询配置 */
const config: QueryConfig = {
  labelWidth: "100px",
  formItem: [
    {
      type: "select",
      modelKey: "uid",
      label: "用户",
      options: memberList,
      props: {
        placeholder: "请输入用户进行查询",
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
      label: "合约类型",
      options: CONTRACT_TYPES,
      props: { clearable: true },
    },
    {
      type: "select",
      modelKey: "status",
      label: "状态",
      options: STATUS_TYPES,
      props: { clearable: true },
    },
    {
      type: "select",
      modelKey: "is_control",
      label: "控制状态",
      options: CONTROL_TYPES,
      props: { clearable: true },
    },
    {
      type: "datetimerange",
      modelKey: "buy_datetime",
      label: "购买时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "set_datetime",
      label: "结算时间",
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
  ElMessageBox.confirm("确定要指定赢吗？", "提示", {
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
  ElMessageBox.confirm("确定要指定输吗？", "提示", {
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
  ElMessageBox.confirm("确定要结算？", "提示", {
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
