<template>
  <el-dialog v-model="visible" :title="$t('xiuGaiYuE')" width="700px" :close-on-click-modal="false" append-to-body @closed="handleClosed">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item :label="$t('huiYuanId')" prop="member_id">
        <el-input v-model="form.member_id" disabled />
      </el-form-item>
      <el-form-item :label="$t('zhangHuLeiXing_0')" prop="op_type" class="mb-6" v-loading="loading[0]">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(type, index) in accountTypes" :key="index" class="account-card" :class="{ 'is-selected': form.op_type === type.value }" @click="form.op_type = type.value">
            <div class="card-header">
              <el-radio v-model="form.op_type" :value="type.value" :label="type.label" class="!m-0"></el-radio>
            </div>
            <div class="card-body">
              <div class="balance-amount">
                {{ (balanceData && balanceData[type.key]) || "0.00" }}
              </div>
              <div class="balance-label">{{ $t("dangQianYuE") }}</div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('bianDongLeiXing')" prop="change_type">
        <el-radio-group v-model="form.change_type">
          <el-radio-button :label="1">{{ $t("jianShao") }}</el-radio-button>
          <el-radio-button :label="2">{{ $t("zengJia") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('bianDongJinE')" prop="change_amount">
        <el-input-number v-model="form.change_amount" :precision="2" :min="0" class="w-full" />
      </el-form-item>
      <el-form-item :label="$t('beiZhu')" prop="change_remark">
        <el-input v-model="form.change_remark" type="textarea" :placeholder="$t('qingShuRuBeiZhu_0')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" :loading="loading[1]" @click="submitHandle">{{ $t("queRen") }}</el-button>
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
  op_type: [{ required: true, message: $t("qingXuanZeZhangHuLe") }],
  change_type: [{ required: true, message: $t("qingXuanZeBianDongL") }],
  change_amount: [{ required: true, message: $t("qingShuRuBianDongJi_0") }],
  change_remark: [{ required: true, message: $t("qingShuRuBeiZhu_0") }],
};

const accountTypes = [
  { label: $t("liangHuaZhangHuYuE"), value: 1, key: "quant_account" },
  { label: $t("chongZhiZhangHuYuE"), value: 2, key: "recharge_account" },
  { label: $t("yongJinZhangHuYuE"), value: 3, key: "brokerage_account" },
  { label: $t("zhiNengZhangHuYuE"), value: 4, key: "smart_account" },
  { label: $t("tiYanJinYuE"), value: 5, key: "experience_account" },
  { label: $t("miaoHeYueYuE"), value: 6, key: "second_contract_account" },
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
        const res = await ElMessageBox.prompt($t("shuRuGuGeYanZhengM"));
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
