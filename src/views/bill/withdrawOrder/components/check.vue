<template>
  <el-dialog v-model="visible" width="70%" :title="$t('shenHe')" :close-on-click-modal="false">
    <el-descriptions :title="$t('tiXianDingDanXiangQ')" :column="2" border v-if="data">
      <el-descriptions-item :label="$t('tiXianLeiXing')">{{ data.channel }}</el-descriptions-item>
      <el-descriptions-item :label="$t('tiXianDiZhi')">{{ data.rece_address }}</el-descriptions-item>
      <el-descriptions-item :label="$t('tiXianJinE')">{{ data.withdraw_amount }}</el-descriptions-item>
      <el-descriptions-item :label="$t('shouXuFei')">{{ data.fees }}</el-descriptions-item>
      <el-descriptions-item :label="$t('shiJiDaoZhang')">{{ data.arrival_amount }}</el-descriptions-item>
      <el-descriptions-item :label="$t('chuangJianShiJian')">{{ data.created_at }}</el-descriptions-item>
    </el-descriptions>
    <el-form-item :label="$t('shenHe_0')" style="margin-top: 20px">
      <el-radio-group v-model="model.status">
        <el-radio :label="1">{{ $t("tongGuo") }}</el-radio>
        <el-radio :label="3">{{ $t("juJue") }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="$t('beiZhu')">
      <el-input v-model="model.remark" type="textarea" />
    </el-form-item>
    <template #footer>
      <el-button @click="visible = false">{{ $t("quXiao_0") }}</el-button>
      <el-button type="primary" @click="submitHandler" :loading="loading">{{ $t("queDing_0") }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import api, { type Form } from "@/api/bill/withdrawOrder";
import systemConfig from "@/api/system/systemConfig";
const visible = defineModel<boolean>();
const props = defineProps<{ data: Form; ids: number[] }>();
const model = ref({
  ids: [0],
  status: 1,
  remark: "",
});

import { useStore } from "@/store/modules/common";
const commonStore = useStore();

const emits = defineEmits<{
  finish: [];
}>();
const loading = ref(false);
async function submitHandler() {
  if (props.data) {
    model.value.ids = [props.data.id as number];
  } else if (props.ids) {
    model.value.ids = props.ids;
  }
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
    loading.value = true;
    await api.oneKeyAudit(model.value);
    visible.value = false;
    emits("finish");
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
