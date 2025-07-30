<template>
  <div class="app-container">
    <div class="search-bar">
      <QueryPart ref="queryFormRef" v-model="queryParams" :config="config" @search="table.queryHandler()" @reset="table.handleResetQuery()"></QueryPart>
    </div>

    <el-card shadow="never" class="table-wrapper" v-loading="table.loading.value">
      <template #header>
        <div class="flex gap-2">
          <el-button type="primary" @click="table.openHandler(2)" :disabled="!table.ischecked()">一键审核</el-button>
          <el-button type="success" @click="rePayHandler">失败订单重新出款</el-button>
          <el-button type="danger" @click="changePayStatusHandler(table.selectList.value)" :disabled="!table.ischecked()">一键手动出款</el-button>
          <el-button type="info" @click="returnHandler(table.selectList.value)" :disabled="!table.ischecked()">一键退回</el-button>
          <!-- <el-button type="default">导出订单</el-button> -->
          <el-button type="primary" @click="table.openHandler(4)">手动提现</el-button>
        </div>
      </template>
      <el-table :data="table.list.value" row-key="id" @selection-change="table.selectionChangeHandler($event)">
        <el-table-column type="selection" width="55" fixed="left" />
        <el-table-column label="用户信息" min-width="160">
          <template #default="{ row }">
            <div>
              <span>用户：</span>
              <span>{{ row.uid }}/</span>
              <span>{{ row.account }}</span>
            </div>
            <div>
              <span>国家：</span>
              <span>{{ row.user_country }}</span>
            </div>
            <div>
              <span>顶级上级：</span>
              <span>{{ row.top_parent_id }}/{{ row.top_parent_account }}</span>
            </div>
            <div>
              <span>一级上级：</span>
              <span>{{ row.first_parent_id }}/{{ row.first_parent_account }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单信息" min-width="240">
          <template #default="{ row }">
            <div>
              <span>订单号：</span>
              <span>{{ row.order_sn }}</span>
            </div>
            <div>
              <span>申请时间：</span>
              <span>{{ row.created_at }}</span>
            </div>
            <div>
              <span>最近充值：</span>
              <span>{{ row.last_recharge_amount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="withdraw_amount" label="提现金额" min-width="200">
          <template #default="{ row }">
            <div>
              <span>提现金额：</span>
              <span>{{ row.withdraw_amount }}</span>
            </div>
            <div>
              <span>手续费</span>
              <span>{{ row.fees }}</span>
            </div>
            <div>
              <span>实际到账：</span>
              <span>{{ row.arrival_amount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="提现信息" min-width="200">
          <template #default="{ row }">
            <div>
              <span>币种：</span>
              <span>{{ row.channel }}</span>
            </div>
            <div>
              <span>提现地址：</span>
              <span>{{ row.rece_address }}</span>
            </div>
            <div>
              <span>出款地址：</span>
              <span>{{ row.send_address }}</span>
            </div>
            <div>
              <span>提款IP：</span>
              <span>{{ row.withdraw_ip }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核信息" min-width="180">
          <template #default="{ row }">
            <div>
              <span>状态：</span>
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </div>
            <div>
              <span>备注：</span>
              <span>{{ row.audit_remark }}</span>
            </div>
            <div>
              <span>操作员：</span>
              <span>{{ row.audit_operator }}</span>
            </div>
            <div>
              <span>操作时间：</span>
              <span>{{ row.audit_time }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="出款信息" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div>
              <span>出款状态：</span>
              <el-tag :type="getOrderResultType(row.payment_status)">
                {{ getOrderResultText(row.payment_status) }}
              </el-tag>
            </div>
            <div>
              <span>出款金额：</span>
              <span>{{ row.payment_amount }}</span>
            </div>
            <div>
              <span>打款tx:</span>
              <span>{{ row.tx_id }}</span>
            </div>
            <div>
              <span>平台单号：</span>
              <span>{{ row.platform_order_no }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="transfer_result" label="转账结果" min-width="160" show-overflow-tooltip />

        <el-table-column prop="updated_at" label="操作" min-width="160" fixed="right">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-2">
              <el-button type="primary" size="small" @click="queryHandler(row.order_sn)" :disabled="row.payment_status != 2">查询</el-button>
              <el-button type="danger" size="small" @click="table.editHandler(row, 2)" :disabled="row.status != 0">审核</el-button>
              <el-button type="info" size="small" @click="ignoreHandler(row.id)" :disabled="row.status != 0">忽略</el-button>
              <el-button type="danger" size="small" @click="payHandler(row.id)" :disabled="row.status != 1">出款</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <pagination background :total="table.pageTotal.value" v-model:page-size="table.pageInfo.limit" v-model:current-page="table.pageInfo.page" />
      </template>
    </el-card>
    <check v-model="table.visible.value[2]" :data="table.currentData.value" :ids="table.selectList.value" @finish="table.queryHandler()" />
    <manuallyWithdraw v-model="table.visible.value[4]" @finish="table.queryHandler()" />
  </div>
</template>

<script setup lang="ts">
import api, { type Form, Query } from "@/api/bill/withdrawOrder";
import check from "./components/check.vue";
import { searchMember } from "@/utils";
import TableInstance from "@/utils/tableInstance";
import manuallyWithdraw from "./components/manuallyWithdraw.vue";
const memberList = ref<any>([]);
const loading = ref(false);
const props = defineProps<{ uid: number }>();

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
      type: "input",
      modelKey: "order_sn",
      label: "订单号",
      props: {
        placeholder: "请输入订单号",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "input",
      modelKey: "tx_id",
      label: "打款txID",
      props: {
        placeholder: "请输入打款txID",
        style: { width: "200px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "status",
      label: "订单状态",
      options: [
        { label: "待审核", value: 0 },
        { label: "打款中", value: 1 },
        { label: "已完成", value: 2 },
        { label: "失败", value: 3 },
      ],
      props: {
        placeholder: "请选择订单状态",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "select",
      modelKey: "order_result",
      label: "转账状态",
      options: [
        { label: "未转", value: 0 },
        { label: "成功", value: 1 },
        { label: "失败", value: 2 },
      ],
      props: {
        placeholder: "请选择转账状态",
        style: { width: "150px" },
        clearable: true,
      },
    },
    {
      type: "datetimerange",
      modelKey: "datetime",
      label: "申请时间",
      props: {
        style: { width: "400px" },
      },
    },
    {
      type: "datetimerange",
      modelKey: "operate_time",
      label: "操作时间",
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
  order_sn: undefined,
  tx_id: undefined,
  status: undefined,
  order_result: undefined,
  datetime: undefined,
  operate_time: undefined,
});

/** 表格实例 */
const table = new TableInstance<Form>(api, queryParams, 20, queryFormRef);

onMounted(() => {
  table.queryHandler();
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
//对失败的订单重新出款
async function rePayHandler() {
  await ElMessageBox.confirm("该操作将对转账失败状态的提现记录自动打款，需要一定执行时间，请勿短时间内重复操作，是否确认？", "提示", {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.oneKeyPay();
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function changePayStatusHandler(ids: any[]) {
  ElMessageBox.confirm("该操作将该订单改为成功出款，是否确认?", "提示", {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.batchPay(ids);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function payHandler(id: number) {
  ElMessageBox.confirm("是否确认打款？打款前请先查询确认该笔订单未成功打款！否则可能将造成资金损失！一旦打款无法退回！", "提示", {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.pay(id);
        } finally {
          done();
          table.queryHandler();
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function ignoreHandler(id: number) {
  ElMessageBox.confirm("是否确认忽略此订单？", "提示", {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.ignore(id);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}
async function queryHandler(order_sn: string) {
  const res = await api.query(order_sn);
}
async function returnHandler(ids: any[]) {
  ElMessageBox.confirm("该操作将对余额不足状态的退回到余额，需要一定执行时间，请勿短时间内重复操作，是否确认?", "提示", {
    beforeClose: async (action, instance, done) => {
      if (action == "confirm") {
        instance.confirmButtonLoading = true;
        try {
          await api.oneKeyReturn(ids);
          done();
          table.queryHandler();
        } finally {
          instance.confirmButtonLoading = false;
        }
      } else {
        done();
      }
    },
  });
}

// 订单状态处理函数
const getStatusType = (status: number) => {
  const statusMap: Record<number, string> = { 0: "warning", 1: "primary", 2: "success", 3: "danger" };
  return statusMap[status] || "info";
};

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = { 0: "待审核", 1: "处理中", 2: "已完成", 3: "不通过" };
  return statusMap[status] || "未知";
};

// 转账状态处理函数
const getOrderResultType = (result: number) => {
  const resultMap: Record<number, string> = { 0: "warning", 1: "success", 2: "danger" };
  return resultMap[result] || "info";
};

const getOrderResultText = (result: number) => {
  const resultMap: Record<number, string> = { 0: "待确认", 1: "成功", 2: "失败" };
  return resultMap[result] || "未知";
};
</script>

<style scoped lang="scss">
.icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.el-button {
  margin: 0;
}
</style>
