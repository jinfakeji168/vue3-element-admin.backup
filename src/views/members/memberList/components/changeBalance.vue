<template>
  <el-dialog v-model="visible" title="修改余额" width="700px" :close-on-click-modal="false" append-to-body @closed="handleClosed">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="会员ID" prop="member_id">
        <el-input v-model="form.member_id" disabled />
      </el-form-item>
      <el-form-item label="账户类型" prop="op_type" class="mb-6" v-loading="loading[0]">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(type, index) in accountTypes" :key="index" class="account-card" :class="{ 'is-selected': form.op_type === type.value }" @click="form.op_type = type.value">
            <div class="card-header">
              <el-radio v-model="form.op_type" :value="type.value" :label="type.label" class="!m-0"></el-radio>
            </div>
            <div class="card-body">
              <div class="balance-amount">
                {{ (balanceData && balanceData[type.key]) || "0.000000" }}
              </div>
              <div class="balance-label">当前余额</div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="变动类型" prop="change_type">
        <el-radio-group v-model="form.change_type">
          <el-radio-button :label="1">减少</el-radio-button>
          <el-radio-button :label="2">增加</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="变动金额" prop="change_amount">
        <el-input-number v-model="form.change_amount" :precision="6" :min="0" class="w-full" />
      </el-form-item>
      <el-form-item label="备注" prop="change_remark">
        <el-input v-model="form.change_remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading[1]" @click="submitHandle">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { AccountBalanceChangeForm, AccountBalanceData } from "@/api/members/memberList";
import api from "@/api/members/memberList";
import systemConfig, { type Form, GoogleAuthStatus } from "@/api/system/systemConfig";
const visible = defineModel<boolean>();

const props = withDefaults(
  defineProps<{
    memberId?: number;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "finish"): void;
}>();

const formRef = ref<FormInstance>();
const loading = reactive([false, false]);

const form = reactive<AccountBalanceChangeForm>({});
const balanceData = ref<AccountBalanceData>();

const rules = {
  op_type: [{ required: true, message: "请选择账户类型" }],
  change_type: [{ required: true, message: "请选择变动类型" }],
  change_amount: [{ required: true, message: "请输入变动金额" }],
  change_remark: [{ required: true, message: "请输入备注" }],
};

const accountTypes = [
  { label: "量化账户余额", value: 1, key: "quant_account" },
  { label: "充值账户余额", value: 2, key: "recharge_account" },
  { label: "佣金账户余额", value: 3, key: "brokerage_account" },
  { label: "智能账户余额", value: 4, key: "smart_account" },
  { label: "体验金余额", value: 5, key: "experience_account" },
  { label: "秒合约余额", value: 6, key: "second_contract_account" },
] as const;

// 获取余额数据
async function getBalance(id: number) {
  loading[0] = true;
  try {
    balanceData.value = await api.getBalanceData(id);
  } finally {
    loading[0] = false;
  }
}

// 监听会员ID变化
watch(visible, (val) => {
  if (val) {
    Object.assign(form, {
      member_id: props.memberId,
      change_type: 1,
    });
    getBalance(props.memberId as number);
  }
});

function handleClosed() {
  formRef.value?.resetFields();
  formRef.value?.clearValidate();
  visible.value = false;
} //edit_address_is_google
import { useStore } from "@/store/modules/common";
const commonStore = useStore();

async function submitHandle() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      const enableGoogleVerify = await commonStore.keyByConfigValue("update_money_google_secret");
      if (enableGoogleVerify == 1) {
        const res = await ElMessageBox.prompt("输入谷歌验证码进行修改");
        if (res.action == "confirm" && res.value) {
          await systemConfig.verifyGoogleAuth(res.value);
        } else {
          return;
        }
      }
      try {
        loading[1] = true;
        await api.changeBalance(form);
        handleClosed();
        emit("finish");
      } finally {
        loading[1] = false;
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.account-card {
  @apply relative border rounded-lg p-4 cursor-pointer transition-all duration-300;
  @apply hover:shadow-sm;
  @apply flex flex-col gap-3;
  background: #fff;
  &::before {
    content: "";
    @apply absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none;
    border: 1px solid transparent;
  }

  &:hover::before {
    border-color: var(--el-color-primary);
  }

  &.is-selected {
    background: rgba(var(--el-color-primary-rgb), 0.04);

    &::before {
      border: 2px solid var(--el-color-primary);
    }
  }

  .card-header {
    @apply flex-center;
  }

  .card-body {
    @apply flex flex-col gap-1;

    .balance-amount {
      @apply text-xl font-bold;
      color: var(--el-text-color-primary);
    }

    .balance-label {
      @apply text-sm;
      color: var(--el-text-color-secondary);
    }
  }
}

.sr-only {
  @apply absolute w-1 h-1 p-0 -m-1 overflow-hidden whitespace-nowrap border-0;
}
</style>
